import { NextRequest, NextResponse } from "next/server";
import { callModel } from "@/lib/ai/modelClient";
import { PromptEngineer } from "@/lib/ai/promptEngineer";

export async function GET(req: NextRequest) {
  try {
    const q = Object.fromEntries(req.nextUrl.searchParams.entries());
    const contextParts: string[] = [];
    if (q.ticketsSold) contextParts.push(`Tiket terjual hari ini: ${q.ticketsSold}`);
    if (q.revenue) contextParts.push(`Pendapatan hari ini: Rp ${q.revenue}`);
    if (q.activeSchedules) contextParts.push(`Kereta aktif: ${q.activeSchedules}`);
    if (q.otpPercent) contextParts.push(`Ketepatan waktu (OTP): ${q.otpPercent}%`);

    const system = PromptEngineer.createSystemPrompt("route_inquiry", "casual");
    const userPrompt = `Buat ringkasan dashboard singkat untuk admin berdasarkan data berikut:\n${
      contextParts.join("\n") || "Tidak ada data singkat diberikan."
    }\n\nRESPON JSON YANG DIMINTA (WAJIB):\n{\n  "title": "<judul singkat>",\n  "summary_lines": ["line1", "line2"],\n  "recommendations": ["rec1", "rec2", "rec3"]\n}\n\nAturan tampilan:\n- Sertakan satu baris pembuka (sapaan) di posisi pertama di \`summary_lines\`, mis. \"Halo! Aku Kaia, asisten...\"\n- Tandai kata/angka penting dengan **double asterisks** (mis. **Tiket terjual hari ini: 10**) sehingga UI dapat menampilkan penekanan (bold).\n- Jawab hanya dengan JSON valid (tidak ada teks di luar JSON). Jika tidak memungkinkan, kembalikan field \"error\" dengan pesan singkat.`;

    const fullPrompt = `${system}\n\n${userPrompt}`;

    const model = await callModel(fullPrompt);
    const content = model.content;

    let parsed: any = null;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      parsed = null;
    }

    if (parsed && (parsed.summary_lines || parsed.recommendations || parsed.title)) {
      return NextResponse.json({ ok: true, structured: true, data: parsed, source: model.source });
    }

    const lines = content
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);

    return NextResponse.json({ ok: true, structured: false, summary: content, lines, source: model.source });
  } catch (err: any) {
    console.error("/api/admin/dashboard/summarize error:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
