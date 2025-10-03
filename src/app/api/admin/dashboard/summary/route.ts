import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (err) {
      supabase = createLegacyServerClient();
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const from = todayStart.toISOString();
    const to = todayEnd.toISOString();

    const ticketsRes: any = await supabase.from("tiket").select("tiket_id", { count: "exact", head: true }).gte("waktu_dibuat", from).lte("waktu_dibuat", to);
    const revenueRes: any = await supabase.from("pemesanan").select("total_bayar", { head: false }).gte("waktu_pembuatan", from).lte("waktu_pembuatan", to);

    const schedulesRes: any = await supabase.from("jadwal").select("jadwal_id", { count: "exact", head: true }).neq("status_jadwal", "DIBATALKAN");
    const otpTotalRes: any = await supabase.from("jadwal").select("jadwal_id", { count: "exact", head: true });
    const otpDelayedRes: any = await supabase.from("jadwal").select("jadwal_id", { count: "exact", head: true }).eq("status_jadwal", "TERLAMBAT");

    const ticketsSold = ticketsRes && ticketsRes.count ? Number(ticketsRes.count) : 0;

    const revenueArr = (revenueRes && revenueRes.data) || [];
    const revenue = revenueArr.reduce((s: number, r: any) => s + (Number(r.total_bayar) || 0), 0);

    const activeSchedules = schedulesRes && schedulesRes.count ? Number(schedulesRes.count) : 0;

    const otpTotal = otpTotalRes && otpTotalRes.count ? Number(otpTotalRes.count) : 0;
    const otpDelayed = otpDelayedRes && otpDelayedRes.count ? Number(otpDelayedRes.count) : 0;
    const otpPercent = otpTotal === 0 ? 100 : Math.round(((otpTotal - otpDelayed) / otpTotal) * 10000) / 100;

    return NextResponse.json({ ticketsSold, revenue, activeSchedules, otpPercent });
  } catch (err) {
    console.error("/api/admin/dashboard/summary error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
