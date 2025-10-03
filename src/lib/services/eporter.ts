import { EporterBooking, EporterAssignment, EporterPorter } from "@/types/models";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase";

export async function runAssignmentForBooking(booking: EporterBooking, supabase: SupabaseClient<Database>, opts?: { excludePorterId?: number }) {
  try {
    let q = supabase.from("e_porter_porter").select("*").eq("is_active", true).eq("is_available", true).order("rating", { ascending: false });
    if (opts?.excludePorterId) {
      q = (q as any).neq("porter_id", opts.excludePorterId);
    }
    const { data: porters, error: porterErr } = await q.limit(1);

    if (porterErr) {
      console.error("Error querying porters:", porterErr);
      return { ok: false, reason: "porter_query_error" };
    }

    const porter = (porters && porters[0]) || null;
    if (!porter) return { ok: false, reason: "no_porter_available" };

    const assignmentPayload = {
      e_porter_booking_id: (booking as any).e_porter_booking_id as number,
      porter_id: (porter as any).porter_id as number,
      action: "OFFERED" as const,
      action_metadata: { offered_at: new Date().toISOString() },
      sent_via: "wa",
    } as any;

    const { data: createdAssign, error: assignErr } = await supabase.from("e_porter_assignment").insert(assignmentPayload).select("*").single();

    if (assignErr) {
      console.error("Error inserting assignment:", assignErr);
      return { ok: false, reason: "assignment_insert_error" };
    }

    // update booking assigned porter and status
    const { error: updateBookingErr } = await supabase
      .from("e_porter_booking")
      .update({ assigned_porter_id: (porter as any).porter_id, status: "ASSIGNED" })
      .eq("e_porter_booking_id", (booking as any).e_porter_booking_id);

    if (updateBookingErr) {
      console.error("Error updating booking after assignment:", updateBookingErr);
    }

    return { ok: true, porter: porter, assignment: createdAssign };
  } catch (err) {
    console.error("runAssignmentForBooking error:", err);
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}
