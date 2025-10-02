export async function POST(req: Request) {
  const { NextResponse } = await import("next/server");
  const { ChatRequestSchema, handleEnhancedChat } = await import("@/lib/ai/chatService");

  const secret = req.headers.get("x-mcp-secret");
  if (!process.env.MCP_SHARED_SECRET) {
    return NextResponse.json(
      {
        code: "server_misconfigured",
        message: "Server is misconfigured. Contact the maintainer.",
      },
      { status: 500 }
    );
  }

  if (!secret || secret !== process.env.MCP_SHARED_SECRET) {
    return NextResponse.json(
      {
        code: "unauthorized",
        message: "Unauthorized. Missing or invalid x-mcp-secret header.",
      },
      { status: 401 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch (err: any) {
    return NextResponse.json(
      {
        code: "invalid_json",
        message: "Request body must be valid JSON.",
      },
      { status: 400 }
    );
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        code: "invalid_payload",
        message: "Missing or invalid fields in request body.",
        details: parsed.error.errors,
      },
      { status: 400 }
    );
  }

  try {
    const { prompt, sessionId, userId, conversationStyle } = parsed.data;
    const result = await handleEnhancedChat(prompt, sessionId, userId, conversationStyle);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Unhandled error in /api/ai/chat:", err);
    const isProd = process.env.NODE_ENV === "production";
    let humanMessage = "Terjadi kesalahan pada server saat memproses permintaan Anda. Silakan coba lagi nanti.";
    try {
      const shortErr = String(err?.message ?? err);
      const noDataPatterns = ["result contains 0 rows", "cannot coerce the result", "Cannot coerce the result to a single JSON object", "PGRST116"];
      const lower = shortErr.toLowerCase();
      const isNoData = noDataPatterns.some((p) => lower.includes(p.toLowerCase()));
      if (isNoData) {
        humanMessage = "Maaf, saya tidak menemukan informasi yang Anda minta. Ingin saya tampilkan daftar yang tersedia atau coba kata kunci lain?";
      } else {
        const prompt = `Anda adalah asisten yang menulis pesan singkat untuk pengguna dalam bahasa Indonesia. Sistem backend mengalami error berikut: ${shortErr}. Buat satu atau dua kalimat yang menjelaskan bahwa permintaan tidak dapat diproses saat ini, beri saran langkah yang aman (mis. coba lagi nanti, atau hubungi dukungan), dan jangan tampilkan detail teknis atau stack trace. Gunakan nada ramah dan profesional.`;
        const { callModel } = await import("@/lib/ai/modelClient");
        const r = await callModel(prompt);
        if (r && r.content) humanMessage = r.content;
      }
    } catch (llmErr) {
      console.error("Error while generating human-friendly message from model:", llmErr);
    }

    const payload: any = { ok: false, model: humanMessage };
    if (!isProd) payload._debug = { message: String(err?.message ?? err) };

    return NextResponse.json(payload, { status: 200 });
  }
}
