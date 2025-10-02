import { callOllama } from "./ollamaClient";
import { callGemini } from "./geminiClient";
import { AVAILABLE_ACTIONS } from "@/lib/mcp/dispatcher";

export type ModelResponse = { content: string; source: "ollama" | "gemini" };

export async function callModel(prompt: string): Promise<ModelResponse> {
  const systemInstruction = `You are an assistant that may call backend MCP actions. Only use the following actions if you need to interact with the system: ${AVAILABLE_ACTIONS.join(
    ", "
  )}.\n\nIf you decide to call an action, respond with a single valid JSON object matching this shape: { "domain": "ollama.elginbrian.com", "action": "<action-name>", "params": { ... } } and nothing else (no prose, no markdown). The action field must be exactly one of the allowed action names.\n\nIf you do not want to call an action, reply with a brief answer to the user in Indonesian. Do not invent or call actions not listed above. Always validate any required payload fields for the action before returning the JSON; if payload is incomplete, return the JSON with params omitted so the caller can ask for missing data.`;
  const wrappedPrompt = `${systemInstruction}\n\nUser: ${prompt}`;

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    let lastGeminiErr: any = null;
    const maxAttempts = 2;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt > 1) console.warn(`Retrying callGemini (attempt ${attempt}/${maxAttempts})`);
        const g = await callGemini(wrappedPrompt);
        return { content: g.content, source: "gemini" };
      } catch (err: any) {
        lastGeminiErr = err;
        console.error(`callGemini attempt ${attempt} failed:`, err?.message ?? err);

        if (attempt < maxAttempts) {
          await new Promise((res) => setTimeout(res, 250 * attempt));
        }
      }
    }

    const geminiErrMsg = lastGeminiErr?.message ?? String(lastGeminiErr);
    console.error("Primary model (Gemini) failed:", geminiErrMsg);

    try {
      console.warn("Falling back to Ollama model");
      const r = await callOllama(wrappedPrompt);
      return { content: r.content, source: "ollama" };
    } catch (ollamaErr: any) {
      const ollamaErrMsg = ollamaErr?.message ?? String(ollamaErr);
      const msg = `model fallback failed: gemini: ${geminiErrMsg} | ollama: ${ollamaErrMsg}`;
      const e = new Error(msg);
      e.name = "ModelFallbackFailed";
      throw e;
    }
  } else {
    console.warn("GEMINI_API_KEY not set, using Ollama as primary model");
    try {
      const r = await callOllama(wrappedPrompt);
      return { content: r.content, source: "ollama" };
    } catch (err: any) {
      const ollamaErrMsg = err?.message ?? String(err);
      const msg = `primary model (ollama) failed: ${ollamaErrMsg}; no fallback configured (GEMINI_API_KEY missing)`;
      const e = new Error(msg);
      e.name = "ModelUnavailable";
      throw e;
    }
  }
}
