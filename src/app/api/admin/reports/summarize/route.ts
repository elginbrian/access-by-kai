import { NextRequest, NextResponse } from "next/server";
import { callModel } from "@/lib/ai/modelClient";
import { PromptEngineer } from "@/lib/ai/promptEngineer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reports = Array.isArray(body.reports) ? body.reports : [];

    const system = PromptEngineer.createSystemPrompt("reports_summarizer", "casual");
    const lines = reports
      .slice(0, 5)
      .map((r: any, idx: number) => {
        return `Laporan ${idx + 1} - nama: ${r.name ?? "-"}, email: ${r.email ?? "-"}, jenis: ${r.issueType ?? r.issue_type ?? "-"}, judul: ${String(r.title ?? r.judul ?? "").replace(/\n/g, " ")}`;
      })
      .join("\n");

    const userPrompt = `Saya memberikan sampai N laporan pengguna (maks 5). Buat ringkasan singkat untuk admin yang mencakup satu baris sapaan pembuka, 3-6 poin ringkasan penting (gunakan **double asterisks** untuk menyorot angka/entitas penting), dan 2-4 rekomendasi tindakan prioritas. RESPON JSON (WAJIB):\n{\n  "title": "<judul singkat>",\n  "summary_lines": ["line1", "line2"],\n  "recommendations": ["rec1", "rec2"]\n}\n\nLaporan:\n${lines}`;

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
    console.error("/api/admin/reports/summarize error:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
