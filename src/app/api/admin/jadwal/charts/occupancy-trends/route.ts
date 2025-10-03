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

    const days = 7;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const ticketsRes: any = await supabase.from("tiket").select("tiket_id,segment_id,waktu_dibuat").gte("waktu_dibuat", start.toISOString());
    const tickets = ticketsRes.data ?? [];
    const segRes: any = await supabase.from("pemesanan_segment").select("segment_id,jadwal_id");
    const segMap = (segRes.data ?? []).reduce((m: any, s: any) => ((m[s.segment_id] = s.jadwal_id), m), {} as any);

    const soldPerJadwal: Record<string, number> = {};
    for (const t of tickets) {
      const jid = segMap[t.segment_id];
      if (!jid) continue;
      soldPerJadwal[String(jid)] = (soldPerJadwal[String(jid)] || 0) + 1;
    }

    const topJadwalIds = Object.entries(soldPerJadwal)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map((x) => Number(x[0]));

    const jgRes: any = topJadwalIds.length ? await supabase.from("jadwal_gerbong").select("jadwal_id,master_gerbong_id").in("jadwal_id", topJadwalIds) : { data: [] };
    const mgIds = [...new Set((jgRes.data ?? []).map((x: any) => Number(x.master_gerbong_id)))] as number[];
    const mgRes: any = mgIds.length ? await supabase.from("master_gerbong").select("master_gerbong_id,kapasitas_kursi").in("master_gerbong_id", mgIds) : { data: [] };
    const mgMap = (mgRes.data ?? []).reduce((m: any, g: any) => ((m[g.master_gerbong_id] = g.kapasitas_kursi), m), {} as any);
    const jadwalToCap: Record<number, number> = {};
    for (const jg of jgRes.data ?? []) {
      jadwalToCap[jg.jadwal_id] = (jadwalToCap[jg.jadwal_id] || 0) + (mgMap[jg.master_gerbong_id] || 0);
    }

    const xLabels: string[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      xLabels.push(d.toLocaleDateString("id-ID", { month: "short", day: "numeric" }));
    }

    const series: any[] = [];
    for (const jid of topJadwalIds) {
      const values: number[] = [];
      for (let i = 0; i < days; i++) {
        const dayStart = new Date(start);
        dayStart.setDate(start.getDate() + i);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);
        const count = tickets.filter((t: any) => {
          const created = new Date(t.waktu_dibuat);
          const jidMap = segMap[t.segment_id];
          return jidMap === jid && created >= dayStart && created <= dayEnd;
        }).length;
        const cap = Math.max(1, jadwalToCap[jid] || 100);
        const occ = Math.min(100, Math.round((count / cap) * 10000) / 100);
        values.push(occ);
      }
      series.push({ id: `j${jid}`, name: `Jadwal ${jid}`, color: undefined, values });
    }

    return NextResponse.json({ xLabels, series });
  } catch (err) {
    console.error("occupancy-trends error", err);
    return NextResponse.json({ xLabels: [], series: [] }, { status: 500 });
  }
}
