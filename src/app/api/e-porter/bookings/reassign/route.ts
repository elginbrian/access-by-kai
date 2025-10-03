import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";
import { runAssignmentForBooking } from "@/lib/services/eporter";

export async function POST(req: NextRequest) {
  try {
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (err) {
      supabase = createLegacyServerClient();
    }

    const body = await req.json();
    const bookingId = Number(body?.e_porter_booking_id || body?.bookingId);
    const excludePorterId = body?.exclude_porter_id ? Number(body.exclude_porter_id) : null;

    if (!bookingId || Number.isNaN(bookingId)) return NextResponse.json({ error: "invalid_booking_id" }, { status: 400 });

    const { data: booking, error: bErr } = await supabase.from("e_porter_booking").select("*").eq("e_porter_booking_id", bookingId).single();
    if (bErr || !booking) return NextResponse.json({ error: "booking_not_found" }, { status: 404 });

    const assignment = await runAssignmentForBooking(booking as any, supabase, { excludePorterId: excludePorterId ?? undefined });

    if (!assignment?.ok) {
      return NextResponse.json({ ok: false, reason: assignment?.reason || "no_porter_available" }, { status: 200 });
    }

    if (!assignment.porter) {
      return NextResponse.json({ ok: false, reason: "no_porter_returned" }, { status: 200 });
    }

    const { data: updated, error: uErr } = await supabase.from("e_porter_booking").update({ assigned_porter_id: assignment.porter.porter_id, status: "ASSIGNED" }).eq("e_porter_booking_id", bookingId).select("*").single();

    if (uErr) {
      return NextResponse.json({ error: "failed_update_booking", details: uErr }, { status: 500 });
    }

    return NextResponse.json({ ok: true, booking: updated, assignment, porter: assignment.porter });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
