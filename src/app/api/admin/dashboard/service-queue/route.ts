import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (e) {
      supabase = createLegacyServerClient();
    }

    const seatRes: any = await supabase.from("permintaan_perpindahan_kursi").select("perpindahan_id, pemohon_user_id, tiket_asal_id, waktu_permintaan, status_perpindahan, alasan").order("waktu_permintaan", { ascending: false }).limit(20);

    const porterRes: any = await supabase.from("e_porter_booking").select("id, user_id, meeting_point, status, preferred_time, waktu_pembuatan").order("waktu_pembuatan", { ascending: false }).limit(20);

    const seatItems = (seatRes.data ?? []).map((s: any) => ({
      id: `seat-${s.perpindahan_id}`,
      type: "Perpindahan Kursi",
      count: 1,
      priority: s.status_perpindahan === "URGENT" ? "urgent" : s.status_perpindahan === "PROSES" ? "high" : "normal",
      status: s.status_perpindahan ?? "Tunggu",
      meta: { alasan: s.alasan, waktu: s.waktu_permintaan },
    }));

    const porterItems = (porterRes.data ?? []).map((p: any) => ({
      id: `porter-${p.id}`,
      type: "E-Porter Request",
      count: 1,
      priority: p.status === "REQUESTED" ? "high" : "normal",
      status: p.status ?? "REQUESTED",
      meta: { meeting_point: p.meeting_point, preferred_time: p.preferred_time },
    }));

    const items = [...seatItems, ...porterItems].slice(0, 20);

    return NextResponse.json({ items });
  } catch (err) {
    console.error("/api/admin/dashboard/service-queue error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
