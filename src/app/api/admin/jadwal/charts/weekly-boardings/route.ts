import { NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch (e) {
      supabase = createLegacyServerClient();
    }
    const since = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

    const start = new Date(since.getFullYear(), since.getMonth(), since.getDate()).toISOString();

    const { data, error } = await supabase.from("tiket").select("count:count(*), tanggal:created_at").gte("created_at", start);

    const rows = (data as any) ?? [];

    const labels: string[] = [];
    const countsMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("id-ID", { weekday: "short" });
      labels.push(label);
      countsMap[label] = 0;
    }

    try {
      const res = await supabase.from("tiket").select("created_at").gte("created_at", start);
      const items = (res as any).data ?? [];
      for (const it of items) {
        const d = new Date(it.created_at);
        const label = d.toLocaleDateString("id-ID", { weekday: "short" });
        if (label in countsMap) countsMap[label] = (countsMap[label] || 0) + 1;
      }
    } catch (e) {
      // ignore
    }

    const series = [{ name: "Tiket Terjual", color: "#6d28d9", values: labels.map((l) => countsMap[l] || 0) }];

    return NextResponse.json({ categories: labels, series });
  } catch (err) {
    console.error("weekly-boardings error", err);
    return NextResponse.json({ categories: [], series: [] }, { status: 500 });
  }
}
