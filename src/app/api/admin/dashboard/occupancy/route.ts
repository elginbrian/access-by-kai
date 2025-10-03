import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";

function lastNDaysLabels(n: number) {
  const labels: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }));
  }
  return labels;
}

export async function GET(req: NextRequest) {
  try {
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (e) {
      supabase = createLegacyServerClient();
    }

    const n = 14;
    const labels = lastNDaysLabels(n);

    const values: number[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      const ticketsRes: any = await supabase.from("tiket").select("tiket_id", { count: "exact", head: true }).gte("waktu_dibuat", start.toISOString()).lte("waktu_dibuat", end.toISOString());
      const tickets = ticketsRes?.count ?? 0;

      const jadwalRes: any = await supabase.from("jadwal").select("jadwal_id", { count: "exact", head: true }).gte("tanggal_keberangkatan", start.toISOString()).lte("tanggal_keberangkatan", end.toISOString());
      const jadwals = jadwalRes?.count ?? 0;

      const capacityPerTrain = 300;
      const cap = jadwals * capacityPerTrain || capacityPerTrain;
      const percent = Math.min(100, Math.round((tickets / cap) * 10000) / 100);
      values.push(percent);
    }

    return NextResponse.json({ xLabels: labels, series: [{ id: "okupansi", name: "Okupansi", color: "#059669", values }] });
  } catch (err) {
    console.error("/api/admin/dashboard/occupancy error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
