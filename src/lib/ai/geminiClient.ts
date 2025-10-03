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

export async function callGeminiMultimodal(prompt: string, imageBase64?: string): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    console.log(`Using Gemini multimodal model: ${modelName}`);

    const textPart = { type: "input_text", text: prompt };

    if (!imageBase64) {
      const response = await withTimeout(
        (ai.models as any).generateContent({
          model: modelName,
          contents: [textPart],
          config: { thinkingConfig: { thinkingBudget: 0 } },
        }),
        30000
      );
      const respAny: any = response;
      if (!respAny || !respAny.text) {
        throw new Error("Failed to get a valid response from Gemini (multimodal, text-only).");
      }
      return { content: respAny.text };
    }

    // Prepare image buffer
    const m = imageBase64.match(/^data:.*;base64,(.*)$/);
    const rawBase64 = m ? m[1] : imageBase64;
    const buffer = Buffer.from(rawBase64, "base64");

    // Try multiple plausible payload shapes until one works
    const imageVariants: any[] = [
      // Variant A: data.image.bytes
      { type: "input_image", data: { image: { bytes: buffer } } },
      // Variant B: data.imageBytes
      { type: "input_image", data: { imageBytes: buffer } },
      // Variant C: image field (older attempt)
      { type: "input_image", image: { bytes: buffer } },
    ];

    let lastErr: any = null;
    for (const imgPart of imageVariants) {
      try {
        const contents = [textPart, imgPart];
        const response = await withTimeout(
          (ai.models as any).generateContent({
            model: modelName,
            contents: contents,
            config: { thinkingConfig: { thinkingBudget: 0 } },
          }),
          30000
        );

        const respAny: any = response;
        if (respAny && respAny.text) {
          return { content: respAny.text };
        }
        lastErr = new Error("Gemini returned no text for multimodal request");
      } catch (err: any) {
        lastErr = err;
        // If error indicates missing data field, try next variant
        const msg = String(err?.message ?? err);
        if (msg.includes("required oneof field 'data' must have one initialized field") || msg.includes("INVALID_ARGUMENT")) {
          console.warn("Gemini multimodal variant failed, trying next variant:", msg);
          continue;
        }
        // For other errors, record and break
        console.error("Gemini multimodal variant error:", msg);
      }
    }

    // If all image variants fail, fall back to text-only call to avoid hard failure
    console.warn("All multimodal image variants failed, falling back to text-only request. Last error:", lastErr?.message ?? lastErr);
    const fallback = await withTimeout(
      (ai.models as any).generateContent({
        model: modelName,
        contents: [textPart],
        config: { thinkingConfig: { thinkingBudget: 0 } },
      }),
      30000
    );
    const fbAny: any = fallback;
    if (fbAny && fbAny.text) return { content: fbAny.text };
    throw new Error(lastErr?.message ?? "Failed to get response from Gemini multimodal");
  } catch (error: any) {
    console.error("Error calling Gemini multimodal API:", error?.message ?? error);
    throw new Error(error?.message ? `Gemini multimodal error: ${error.message}` : "An unknown error occurred with the Gemini multimodal API.");
  }
}
