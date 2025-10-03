import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";
import { validateEporterBooking } from "@/lib/validators/eporter";
import { runAssignmentForBooking } from "@/lib/services/eporter";

export async function POST(req: NextRequest) {
  try {
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (err) {
      console.warn("createAdminClient failed, falling back to legacy server client", err);
      supabase = createLegacyServerClient();
    }
    const body = await req.json();
    const { value, error: validationError } = validateEporterBooking(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const v = value!;

    const insertPayload = {
      pemesanan_id: v.pemesanan_id ?? null,
      tiket_id: v.tiket_id ?? null,
      user_id: v.user_id,
      jumlah_penumpang: v.jumlah_penumpang ?? 1,
      passenger_ids: v.passenger_ids ?? null,
      meeting_point: v.meeting_point,
      meeting_lat: v.meeting_lat ?? null,
      meeting_lon: v.meeting_lon ?? null,
      notes: v.notes ?? null,
      status: "REQUESTED",
      preferred_time: v.preferred_time ?? null,
    } as any;

    const { data: created, error: insertError } = await supabase.from("e_porter_booking").insert(insertPayload).select("*").single();

    if (insertError) {
      console.error("e-porter booking insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // fire assignment stub (synchronous for now) and return assigned porter info
    const assignmentResult = await runAssignmentForBooking(created as any, supabase);

    // if assignment succeeded and returned a porter, fetch the porter row to include in response
    let porterRow = null;
    if (assignmentResult?.ok && assignmentResult.porter) {
      porterRow = assignmentResult.porter;
    }

    return NextResponse.json({ booking: created, assignmentResult, porter: porterRow });
  } catch (err) {
    console.error("/api/e-porter/bookings error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
