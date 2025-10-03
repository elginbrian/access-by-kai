import { NextRequest, NextResponse } from "next/server";
import { callModel } from "@/lib/ai/modelClient";
import { PromptEngineer } from "@/lib/ai/promptEngineer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ulasan = Array.isArray(body.ulasan) ? body.ulasan : [];

    const system = PromptEngineer.createSystemPrompt("review_summarizer", "casual");
    const lines = ulasan
      .slice(0, 5)
      .map((u: any, idx: number) => {
        return `Ulasan ${idx + 1} - pengguna_id: ${u.penggunaId ?? u.pengguna_id}, layanan: ${u.jenisLayanan ?? u.jenis_layanan}, rating: ${u.penilaian ?? u.penilaian}, komentar: ${String(u.komentar ?? u.komentar ?? "").replace(
          /\n/g,
          " "
        )}`;
      })
      .join("\n");

    const userPrompt = `Saya memberikan N ubasan pengguna (maks 5). Buat ringkasan singkat untuk admin yang mencakup satu baris sapaan pembuka, 3-6 poin ringkasan penting dari ulasan (gunakan **double asterisks** untuk menyorot angka/entitas penting), dan 2-4 rekomendasi tindakan prioritas. RESPON JSON (WAJIB):\n{\n  "title": "<judul singkat>",\n  "summary_lines": ["line1", "line2"],\n  "recommendations": ["rec1", "rec2"]\n}\n\nUlasan:\n${lines}`;

    const fullPrompt = `${system}\n\n${userPrompt}`;
    const model = await callModel(fullPrompt);
    const content = model.content;

    let parsed: any = null;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      parsed = null;
    }

    if (parsed && (parsed.summary_lines || parsed.recommendations || parsed.title)) {
      return NextResponse.json({ ok: true, structured: true, data: parsed, source: model.source });
    }

    const linesOut = content
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);

    return NextResponse.json({ ok: true, structured: false, summary: content, lines: linesOut, source: model.source });
  } catch (err: any) {
    console.error("/api/admin/ulasan/summarize error:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
