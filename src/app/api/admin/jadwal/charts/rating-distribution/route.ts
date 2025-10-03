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

    const { data: tiketCols } = await supabase.rpc("pg_table_def", { relname: "tiket" }).catch(() => ({ data: null } as any));

    let counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    try {
      const res = await supabase
        .from("tiket")
        .select("rating, created_at")
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const rows = (res as any).data ?? [];
      for (const r of rows) {
        const v = Number(r.rating ?? 0);
        if (v >= 1 && v <= 5) counts[v] = (counts[v] || 0) + 1;
      }
    } catch (e) {
      // ignore and return zeros
    }

    const data = [1, 2, 3, 4, 5].map((s) => ({ label: `${s}★`, value: counts[s] || 0 }));

    return NextResponse.json({ data });
  } catch (err) {
    console.error("rating-distribution error", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
