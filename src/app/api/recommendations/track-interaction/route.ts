import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { z } from "zod";

const supabase = createClient();

const InteractionSchema = z.object({
  userId: z.number(),
  jadwalId: z.number(),
  interactionType: z.enum(["VIEW", "CLICK", "BOOK", "ABANDON"]),
  recommendationPosition: z.number().optional(),
  recommendationReason: z.string().optional(),
  sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const interaction = InteractionSchema.parse(body);

    // Get client info
    const userAgent = request.headers.get("user-agent");
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown";

    // Insert interaction record
    const { data, error } = await supabase
      .from("quick_booking_interactions")
      .insert({
        user_id: interaction.userId,
        jadwal_id: interaction.jadwalId,
        interaction_type: interaction.interactionType,
        recommendation_position: interaction.recommendationPosition,
        recommendation_reason: interaction.recommendationReason,
        session_id: interaction.sessionId,
        user_agent: userAgent,
        ip_address: ipAddress,
      })
      .select()
      .single();

    if (error) {
      console.error("Error tracking interaction:", error);
      return NextResponse.json({ error: "Failed to track interaction" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      interactionId: data.interaction_id,
      message: "Interaction tracked successfully" 
    });

  } catch (error) {
    console.error("Error in track-interaction API:", error);
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}