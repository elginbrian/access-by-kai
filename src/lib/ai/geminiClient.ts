import { GoogleGenAI } from "@google/genai";

export type GeminiResponse = {
  content: string;
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms));
  return Promise.race([promise, timeout]);
}

export async function callGemini(prompt: string): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    console.log(`Using Gemini model: ${modelName}`);

    const response = await withTimeout(
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      }),
      15000
    );

    if (!response || !response.text) {
      throw new Error("Failed to get a valid response from Gemini.");
    }

    console.log(`Successfully used Gemini model: ${modelName}`);
    return { content: response.text };
  } catch (error: any) {
    console.error("Error calling Gemini API:", error?.message ?? error);
    throw new Error(error?.message ? `Gemini error: ${error.message}` : "An unknown error occurred with the Gemini API.");
  }
}
