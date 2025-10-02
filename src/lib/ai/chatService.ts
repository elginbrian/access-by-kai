import { z } from "zod";
import { callModel } from "@/lib/ai/modelClient";
import { dispatch, ActionSchema, getPayloadSchema } from "@/lib/mcp/dispatcher";
import { ConversationManager } from "@/lib/ai/conversationContext";
import { PromptEngineer } from "@/lib/ai/promptEngineer";
import { NaturalResponseGenerator } from "@/lib/ai/naturalResponseGenerator";

export const EnhancedChatRequestSchema = z.object({
  prompt: z.string(),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
  conversationStyle: z.enum(["formal", "casual", "technical"]).default("casual"),
});

function extractActionJson(content: string) {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    return null;
  }
}

function extractMultipleActions(content: string): any[] {
  const actions: any[] = [];

  const domainPattern = /"domain"\s*:\s*"[^"]*"/g;
  let match;

  while ((match = domainPattern.exec(content)) !== null) {
    const startPos = content.lastIndexOf("{", match.index);
    if (startPos === -1) continue;

    let braceCount = 0;
    let endPos = startPos;

    for (let i = startPos; i < content.length; i++) {
      if (content[i] === "{") braceCount++;
      else if (content[i] === "}") braceCount--;

      if (braceCount === 0) {
        endPos = i;
        break;
      }
    }

    if (braceCount === 0) {
      const jsonStr = content.substring(startPos, endPos + 1);
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.domain && parsed.action) {
          actions.push(parsed);
        }
      } catch (err) {
        try {
          const fixedJson = jsonStr.replace(/'/g, '"').replace(/([{,]\s*)(\w+):/g, '$1"$2":');
          const parsed = JSON.parse(fixedJson);
          if (parsed.domain && parsed.action) {
            actions.push(parsed);
          }
        } catch (err2) {}
      }
    }
  }

  return actions;
}

async function executeActionChain(actions: any[], sessionId: string): Promise<any[]> {
  const results: any[] = [];

  for (const action of actions) {
    const expectedDomain = "ollama.elginbrian.com";
    if (!action.domain || action.domain !== expectedDomain) {
      action.domain = expectedDomain;
    }

    const validated = ActionSchema.safeParse(action);
    if (validated.success) {
      try {
        const result = await dispatch(validated.data);
        results.push({
          action: action.action,
          success: true,
          data: result,
        });
      } catch (dispatchErr: any) {
        const errorResult = await handleDispatchError(dispatchErr, validated.data, sessionId);
        results.push({
          action: action.action,
          success: false,
          error: errorResult,
        });
      }
    } else {
      results.push({
        action: action.action,
        success: false,
        error: { message: "invalid action schema", details: validated.error.errors },
      });
    }
  }

  return results;
}

export async function handleEnhancedChat(prompt: string, sessionId: string = `session_${Date.now()}`, userId?: string, conversationStyle: string = "casual") {
  try {
    const conversationContext = ConversationManager.getContext(sessionId);
    const userIntent = ConversationManager.analyzeIntent(conversationContext.messages);

    const contextualPrompt = ConversationManager.buildContextualPrompt(sessionId, prompt);

    const systemPrompt = PromptEngineer.createSystemPrompt(userIntent, conversationStyle);
    const fullPrompt = `${systemPrompt}\n\n${contextualPrompt}`;

    ConversationManager.addMessage(sessionId, {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    });

    const model = await callModel(fullPrompt);
    let modelRaw: string = typeof model.content === "string" ? model.content : JSON.stringify(model.content);

    const actionJson = extractActionJson(modelRaw);
    if (actionJson) {
      const expectedDomain = "ollama.elginbrian.com";
      if (!actionJson.domain || actionJson.domain !== expectedDomain) {
        actionJson.domain = expectedDomain;
      }
    }

    let actionResults: any[] = [];
    let finalResponse: string = "";

    const multipleActions = extractMultipleActions(modelRaw);
    console.log("Debug - Extracted multiple actions:", multipleActions.length, multipleActions);

    if (multipleActions.length > 0) {
      actionResults = await executeActionChain(multipleActions, sessionId);

      const combinedResult = actionResults.reduce((acc, result) => {
        if (result.success && result.data) {
          if (Array.isArray(result.data)) {
            acc = acc.concat(result.data);
          } else {
            acc.push(result.data);
          }
        }
        return acc;
      }, []);

      ConversationManager.updateContext(sessionId, {
        contextualInfo: {
          ...conversationContext.contextualInfo,
          lastActionResult: combinedResult,
          currentTopic: inferTopicFromAction(multipleActions[0].action),
        },
      });

      const recentContext = ConversationManager.getRecentContext(sessionId, 3).map((msg) => `${msg.role}: ${msg.content}`);
      finalResponse = await NaturalResponseGenerator.generateContextualResponse(combinedResult, multipleActions[0], prompt, recentContext);
    } else if (actionJson) {
      const validated = ActionSchema.safeParse(actionJson);
      if (validated.success) {
        try {
          const actionResult = await dispatch(validated.data);
          actionResults = [{ action: actionJson.action, success: true, data: actionResult }];

          ConversationManager.updateContext(sessionId, {
            contextualInfo: {
              ...conversationContext.contextualInfo,
              lastActionResult: actionResult,
              currentTopic: inferTopicFromAction(validated.data.action),
            },
          });
        } catch (dispatchErr: any) {
          const errorResult = await handleDispatchError(dispatchErr, validated.data, sessionId);
          actionResults = [{ action: actionJson.action, success: false, error: errorResult }];
        }
      } else {
        actionResults = [{ action: actionJson.action, success: false, error: { message: "invalid action schema", details: validated.error.errors } }];
      }

      const recentContext = ConversationManager.getRecentContext(sessionId, 3).map((msg) => `${msg.role}: ${msg.content}`);
      finalResponse = await NaturalResponseGenerator.generateContextualResponse(actionResults[0].success ? actionResults[0].data : actionResults[0].error, actionJson, prompt, recentContext);
    } else {
      finalResponse = await enhanceDirectResponse(modelRaw, prompt, sessionId);
    }

    ConversationManager.addMessage(sessionId, {
      role: "assistant",
      content: finalResponse,
      timestamp: Date.now(),
      actionTaken: actionJson?.action,
      context: actionResults.length > 0 ? { actionResults } : undefined,
    });

    const followUps =
      actionJson || multipleActions.length > 0 ? await NaturalResponseGenerator.generateProactiveFollowUp(actionResults.length > 0 ? actionResults[0].data : null, actionJson?.action || multipleActions[0]?.action, prompt) : [];

    const isProd = process.env.NODE_ENV === "production";
    const payload: any = {
      ok: true,
      model: finalResponse,
      sessionId,
      conversationStyle,
      followUpSuggestions: followUps,
      contextualInfo: {
        userIntent,
        currentTopic: conversationContext.contextualInfo?.currentTopic,
        hasHistory: conversationContext.messages.length > 1,
      },
    };

    if (actionResults.length > 0) {
      payload.actionResult = actionResults.length === 1 ? actionResults[0].data : actionResults;
    }

    if (!isProd) {
      payload._debug = {
        action: actionJson ?? null,
        modelRaw,
        modelSource: model.source,
        systemPrompt: systemPrompt.substring(0, 200) + "...",
        contextUsed: contextualPrompt.length > 0,
      };
    }

    return payload;
  } catch (error: any) {
    console.error("Enhanced chat error:", error);
    return await handleChatError(error, sessionId, prompt);
  }
}

async function enhanceDirectResponse(modelRaw: string, prompt: string, sessionId: string): Promise<string> {
  const conversationContext = ConversationManager.getRecentContext(sessionId, 2);

  const enhancePrompt = `Context: ${conversationContext.map((m) => `${m.role}: ${m.content}`).join(". ")}

User baru bertanya: "${prompt}"
Model response: "${modelRaw}"

Enhance response ini jadi lebih natural, engaging, dan conversational. Pastikan:
1. Terasa seperti chat dengan teman yang expert
2. Reference context jika relevan  
3. Proactive dan helpful
4. Casual tapi tetap informatif
5. Gunakan emoji secukupnya

Jangan ubah core information, hanya buat lebih natural.`;

  try {
    const enhanced = await callModel(enhancePrompt);
    return enhanced.content;
  } catch (error) {
    return modelRaw;
  }
}

async function handleDispatchError(dispatchErr: any, validatedData: any, sessionId: string) {
  const msg = dispatchErr?.message ?? String(dispatchErr);
  const code = dispatchErr?.code ?? null;

  if (code === "PGRST116" || msg.toLowerCase().includes("result contains 0 rows")) {
    const context = ConversationManager.getContext(sessionId);
    const suggestions = await generateNoDataSuggestions(validatedData.action, context);

    return {
      clarify: true,
      followUp: `Hmm, tidak ketemu data yang kamu cari nih 🤔 ${suggestions}`,
      note: "no_data_found",
    };
  }
  if (msg.toLowerCase().includes("missing param")) {
    const missingFieldMatch = msg.match(/missing param (\w+)/i);
    const missingField = missingFieldMatch ? missingFieldMatch[1] : "parameter";

    return {
      clarify: true,
      followUp: await generateFriendlyParamRequest(missingField, validatedData.action),
      missing: [missingField],
    };
  }
  throw dispatchErr;
}

async function generateNoDataSuggestions(actionName: string, context: any): Promise<string> {
  const suggestions = {
    "rute.get": "Mau aku tampilkan semua rute yang tersedia? Atau coba dengan nama stasiun yang berbeda?",
    "jadwal.get": "Gimana kalau aku cariin jadwal untuk rute lain? Atau mau lihat semua jadwal hari ini?",
    "stasiun.get": "Coba dengan nama stasiun yang lebih spesifik? Atau mau aku list stasiun yang tersedia?",
  };

  return suggestions[actionName as keyof typeof suggestions] || "Mau coba dengan keyword yang berbeda? Atau aku bisa bantuin dengan yang lain? 🚂";
}

async function generateFriendlyParamRequest(missingField: string, actionName: string): Promise<string> {
  const fieldExplanations = {
    id: "ID atau kode",
    userId: "nomor user atau akun",
    payload: "data detail yang dibutuhkan",
    route_id: "kode rute",
  };

  const explanation = fieldExplanations[missingField as keyof typeof fieldExplanations] || missingField;

  return `Aku butuh info ${explanation} untuk memproses permintaan kamu. Bisa kasih detail lebih lengkap? 😊`;
}

function inferTopicFromAction(actionName: string): string {
  if (actionName.includes("rute")) return "route_information";
  if (actionName.includes("jadwal")) return "schedule_information";
  if (actionName.includes("pemesanan")) return "booking_process";
  if (actionName.includes("pengiriman")) return "logistics_service";
  return "general_inquiry";
}

async function handleChatError(error: any, sessionId: string, prompt: string) {
  const friendlyErrorPrompt = `User bertanya: "${prompt}"
Terjadi error: ${error.message}

Buat response yang ramah dan helpful yang:
1. Acknowledge ada masalah teknis
2. Tidak bikin user khawatir
3. Tawarkan alternatif atau solusi
4. Tetap optimis dan siap membantu
5. Casual dan friendly tone

Jangan tampilkan detail teknis error.`;

  try {
    const friendlyResponse = await callModel(friendlyErrorPrompt);
    return {
      ok: false,
      model: friendlyResponse.content,
      sessionId,
      error: "system_error",
    };
  } catch (fallbackError) {
    return {
      ok: false,
      model: "Aduh, sepertinya ada sedikit gangguan teknis nih 😅 Tapi tenang, biasanya sebentar kok! Coba lagi dalam beberapa saat ya, atau ada yang lain yang bisa aku bantuin?",
      sessionId,
      error: "system_error",
    };
  }
}

export async function handleChat(prompt: string) {
  return handleEnhancedChat(prompt);
}

export const ChatRequestSchema = EnhancedChatRequestSchema;
