import { NextResponse } from "next/server";
import { z } from "zod";
import { callGeminiMultimodal } from "@/lib/ai/geminiClient";

const RequestBodySchema = z.object({
  imageBase64: z.string().optional(),
  declaredWeightKg: z.number().positive().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

const GeminiOutputSchema = z.object({
  dimensionsCm: z.object({ length: z.number(), width: z.number(), height: z.number() }).optional(),
  volumetricWeightKg: z.number().optional(),
  estimatedWeightKg: z.number(),
  priceIdr: z.number(),
  breakdown: z
    .object({
      baseFare: z.number(),
      perKg: z.number(),
      distanceSurcharge: z.number().optional(),
      volumetricSurcharge: z.number().optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parse = RequestBodySchema.safeParse(body);
    if (!parse.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const { imageBase64, declaredWeightKg, from, to } = parse.data;

    const prompt = `You are a shipping estimator. Given the following inputs, return ONLY a JSON object with these fields (no extra text):\n- dimensionsCm: { length, width, height } in centimeters when possible (or omit if unknown)\n- volumetricWeightKg (number) if computed\n- estimatedWeightKg (number, final weight to charge in kg)\n- priceIdr (integer)\n- breakdown: { baseFare, perKg, distanceSurcharge, volumetricSurcharge } (numbers)\n\nInputs:\nfrom: ${
      from ?? "unknown"
    }\nto: ${to ?? "unknown"}\nclaimedWeightKg: ${declaredWeightKg ?? "unknown"}\n${
      imageBase64 ? "An image is provided. Analyze it for object size and shape to estimate dimensions and weight." : "No image provided."
    }\n\nIf you cannot determine dimensions from the image, estimate conservatively and set estimatedWeightKg accordingly. All numeric values should be numbers (not strings).`;

    const resp = await callGeminiMultimodal(prompt, imageBase64);

    let parsed: any;
    try {
      parsed = JSON.parse(resp.content);
    } catch (err) {
      const m = resp.content.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          parsed = JSON.parse(m[0]);
        } catch (e) {
          return NextResponse.json({ error: "Failed to parse Gemini response as JSON", raw: resp.content }, { status: 502 });
        }
      } else {
        return NextResponse.json({ error: "Gemini did not return JSON", raw: resp.content }, { status: 502 });
      }
    }

    const out = GeminiOutputSchema.safeParse(parsed);
    if (!out.success) {
      return NextResponse.json({ error: "Gemini output did not match schema", details: out.error.format(), raw: parsed }, { status: 502 });
    }

    const result = out.data;
    if (declaredWeightKg && result.estimatedWeightKg < declaredWeightKg) {
      result.estimatedWeightKg = declaredWeightKg;
    }

    return NextResponse.json({ estimate: result });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
