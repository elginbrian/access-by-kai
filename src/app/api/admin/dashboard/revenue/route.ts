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

      const res: any = await supabase.from("pemesanan").select("total_bayar").gte("waktu_pembuatan", start.toISOString()).lte("waktu_pembuatan", end.toISOString());
      const data = res?.data ?? [];
      const sum = (data || []).reduce((s: number, r: any) => s + (Number(r.total_bayar) || 0), 0);
      values.push(sum);
    }

    return NextResponse.json({ xLabels: labels, series: [{ id: "revenue", name: "Pendapatan", color: "#7c3aed", values }] });
  } catch (err) {
    console.error("/api/admin/dashboard/revenue error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
