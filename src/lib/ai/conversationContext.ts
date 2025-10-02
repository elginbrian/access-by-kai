import { z } from "zod";

export const ConversationMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.number(),
  actionTaken: z.string().optional(),
  context: z.record(z.any()).optional(),
});

export const ConversationContextSchema = z.object({
  sessionId: z.string(),
  messages: z.array(ConversationMessageSchema),
  userProfile: z
    .object({
      preferences: z.record(z.any()).optional(),
      recentQueries: z.array(z.string()).optional(),
      conversationStyle: z.enum(["formal", "casual", "technical"]).default("casual"),
    })
    .optional(),
  contextualInfo: z
    .object({
      currentTopic: z.string().optional(),
      lastActionResult: z.any().optional(),
      pendingClarifications: z.array(z.string()).optional(),
      userIntent: z.string().optional(),
    })
    .optional(),
});

export type ConversationMessage = z.infer<typeof ConversationMessageSchema>;
export type ConversationContext = z.infer<typeof ConversationContextSchema>;

const conversationStore: Map<string, ConversationContext> = new Map();

export class ConversationManager {
  static getContext(sessionId: string): ConversationContext {
    const existing = conversationStore.get(sessionId);
    if (existing) return existing;

    const newContext: ConversationContext = {
      sessionId,
      messages: [],
      userProfile: { conversationStyle: "casual" },
      contextualInfo: {},
    };

    conversationStore.set(sessionId, newContext);
    return newContext;
  }

  static addMessage(sessionId: string, message: ConversationMessage): void {
    const context = this.getContext(sessionId);
    context.messages.push(message);

    if (context.messages.length > 20) {
      context.messages = context.messages.slice(-20);
    }

    conversationStore.set(sessionId, context);
  }

  static updateContext(sessionId: string, updates: Partial<ConversationContext>): void {
    const context = this.getContext(sessionId);
    Object.assign(context, updates);
    conversationStore.set(sessionId, context);
  }

  static getRecentContext(sessionId: string, messageCount: number = 5): ConversationMessage[] {
    const context = this.getContext(sessionId);
    return context.messages.slice(-messageCount);
  }

  static analyzeIntent(messages: ConversationMessage[]): string {
    const recentMessages = messages
      .slice(-3)
      .map((m) => m.content)
      .join(" ");

    if (recentMessages.includes("rute") || recentMessages.includes("jakarta") || recentMessages.includes("bandung")) {
      return "route_inquiry";
    }
    if (recentMessages.includes("pesan") || recentMessages.includes("tiket") || recentMessages.includes("booking")) {
      return "booking_inquiry";
    }
    if (recentMessages.includes("jadwal") || recentMessages.includes("waktu") || recentMessages.includes("jam")) {
      return "schedule_inquiry";
    }

    return "general_inquiry";
  }

  static buildContextualPrompt(sessionId: string, currentPrompt: string): string {
    const context = this.getContext(sessionId);
    const recentMessages = this.getRecentContext(sessionId, 3);
    const userIntent = this.analyzeIntent(context.messages);

    let contextualPrompt = "";

    if (recentMessages.length > 0) {
      contextualPrompt += "Konteks percakapan sebelumnya:\n";
      recentMessages.forEach((msg) => {
        contextualPrompt += `${msg.role}: ${msg.content}\n`;
      });
      contextualPrompt += "\n";
    }

    if (context.contextualInfo?.currentTopic) {
      contextualPrompt += `Topik saat ini: ${context.contextualInfo.currentTopic}\n`;
    }

    if (context.contextualInfo?.pendingClarifications?.length) {
      contextualPrompt += `Menunggu klarifikasi: ${context.contextualInfo.pendingClarifications.join(", ")}\n`;
    }

    contextualPrompt += `Intent pengguna: ${userIntent}\n\n`;
    contextualPrompt += `Pertanyaan saat ini: ${currentPrompt}`;

    return contextualPrompt;
  }
}
