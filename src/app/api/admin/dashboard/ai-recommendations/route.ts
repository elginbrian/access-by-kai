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

    const highOccRes: any = await supabase.from("jadwal").select("jadwal_id,nomor_ka,master_kereta").limit(5);

    const items = [
      { text: "Optimisasi Pendapatan: Tambah gerbong di beberapa KA dengan okupansi > 90% minggu ini", tone: "success" },
      { text: "Peringatan: Ada pola keterlambatan pada rute Gambir-Cirebon, periksa sinyal di area Cirebon", tone: "warning" },
      { text: "Proaktif: Aktifkan kampanye promo untuk rute weekday dengan okupansi < 50%", tone: "info" },
    ];

    return NextResponse.json({ items });
  } catch (err) {
    console.error("/api/admin/dashboard/ai-recommendations error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
