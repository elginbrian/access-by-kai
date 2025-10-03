import type { createClient } from "@/lib/supabase";

export type EvalOptions = {
  supabase: ReturnType<typeof createClient> | any;
  userId?: number | null;
  ip?: string | null;
  passengerCount?: number;
  totalAmount?: number;
};

export type EvalResult = {
  action: "allow" | "flag" | "block";
  reason?: string;
  score?: number;
};

const MAX_TICKETS_PER_BOOKING = 6;
const WINDOW_MS = 60 * 1000;
const MAX_BOOKINGS_PER_MINUTE_PER_USER = 3;
const MAX_TICKETS_PER_MINUTE_PER_IP = 10;

export async function evaluateFraud(opts: EvalOptions): Promise<EvalResult> {
  const { supabase, userId, ip, passengerCount = 0, totalAmount = 0 } = opts;

  if (passengerCount > MAX_TICKETS_PER_BOOKING) {
    return { action: "block", reason: `too_many_tickets_in_single_booking:${passengerCount}`, score: 0.99 };
  }

  const sinceIso = new Date(Date.now() - WINDOW_MS).toISOString();

  try {
    if (userId) {
      const userRes: any = await supabase.from("pemesanan").select("pemesanan_id", { count: "exact" }).eq("user_id", userId).gte("waktu_pembuatan", sinceIso);

      const userCount = (userRes?.count as number) || 0;
      if (userCount >= MAX_BOOKINGS_PER_MINUTE_PER_USER) {
        return { action: "block", reason: `rapid_bookings_by_user:${userCount}_in_${WINDOW_MS}ms`, score: 0.95 };
      }
      if (userCount > 0) {
        return { action: "flag", reason: `multiple_bookings_by_user_recently:${userCount}`, score: 0.6 };
      }
    }

    if (ip) {
      try {
        const ipRes: any = await supabase.from("pemesanan").select("pemesanan_id", { count: "exact" }).eq("user_ip", ip).gte("waktu_pembuatan", sinceIso);
        const ipCount = (ipRes?.count as number) || 0;
        if (ipCount >= 5) {
          return { action: "flag", reason: `many_bookings_from_ip:${ipCount}`, score: 0.7 };
        }
      } catch (e) {}
    }
  } catch (e) {
    console.warn("Anti-fraud check error:", e);
    return { action: "flag", reason: "antifraud_error", score: 0.5 };
  }

  return { action: "allow", reason: undefined, score: 0.0 };
}

export default { evaluateFraud };
