export async function POST(req: Request) {
  const { NextResponse } = await import("next/server");
  const { callSeatAI } = await import("@/lib/ai/seatAIService");

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

  const { prompt, jadwalId, currentCar, totalPassengers, preference, sessionId } = body;

  if (!prompt || !jadwalId || !currentCar || !totalPassengers || !sessionId) {
    return NextResponse.json(
      {
        code: "invalid_payload",
        message: "Missing required fields: prompt, jadwalId, currentCar, totalPassengers, sessionId",
      },
      { status: 400 }
    );
  }

  try {
    const request = {
      prompt,
      jadwalId: Number(jadwalId),
      currentCar: Number(currentCar),
      totalPassengers: Number(totalPassengers),
      preference,
      sessionId,
    };

    const response = await callSeatAI(request);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Seat AI API error:", error);

    return NextResponse.json(
      {
        code: "seat_ai_error",
        message: error.message || "Failed to process seat AI request",
        retryable: error.retryable || false,
        fallbackRecommendation: error.fallbackRecommendation,
      },
      { status: 500 }
    );
  }
}
