import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch (e) {
      supabase = createLegacyServerClient();
    }

    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const jadwalRes: any = await supabase
      .from("jadwal")
      .select("jadwal_id,nomor_ka,master_kereta_id,rute_id,waktu_berangkat_origin,waktu_tiba_destination,tanggal_keberangkatan")
      .order("tanggal_keberangkatan", { ascending: false })
      .limit(50);
    const jadwals = jadwalRes.data ?? [];

    const ticketsRes: any = await supabase.from("tiket").select("tiket_id,segment_id,waktu_dibuat");
    const tickets = ticketsRes.data ?? [];

    const segRes: any = await supabase.from("pemesanan_segment").select("segment_id,jadwal_id");
    const segMap = (segRes.data ?? []).reduce((m: any, s: any) => ((m[s.segment_id] = s.jadwal_id), m), {} as any);

    const soldPer: Record<string, number> = {};
    for (const t of tickets) {
      const created = new Date(t.waktu_dibuat || 0);
      if (created < start || created > end) continue;
      const jId = segMap[t.segment_id];
      if (!jId) continue;
      soldPer[String(jId)] = (soldPer[String(jId)] || 0) + 1;
    }

    // fetch jadwal_gerbong for capacity
    const jadwalIds = jadwals.map((j: any) => j.jadwal_id);
    let capacityMap: Record<string, number> = {};
    if (jadwalIds.length) {
      const jgRes: any = await supabase.from("jadwal_gerbong").select("jadwal_id,master_gerbong_id").in("jadwal_id", jadwalIds);
      const mgIds = [...new Set((jgRes.data ?? []).map((x: any) => Number(x.master_gerbong_id)))] as number[];
      const mgRes: any = await supabase.from("master_gerbong").select("master_gerbong_id,kapasitas_kursi").in("master_gerbong_id", mgIds);
      const mgMap = (mgRes.data ?? []).reduce((m: any, g: any) => ((m[g.master_gerbong_id] = g.kapasitas_kursi), m), {} as any);
      const jadwalToCap: Record<number, number> = {};
      for (const jg of jgRes.data ?? []) {
        jadwalToCap[jg.jadwal_id] = (jadwalToCap[jg.jadwal_id] || 0) + (mgMap[jg.master_gerbong_id] || 0);
      }
      for (const k of Object.keys(jadwalToCap)) {
        capacityMap[String(k)] = jadwalToCap[Number(k)];
      }
    }

    // fetch names for master_kereta and rute
    const mkIds = [...new Set(jadwals.map((j: any) => j.master_kereta_id))];
    const mkRes: any = mkIds.length ? await supabase.from("master_kereta").select("master_kereta_id,nama_kereta").in("master_kereta_id", mkIds) : { data: [] };
    const mkMap = (mkRes.data ?? []).reduce((m: any, k: any) => ((m[k.master_kereta_id] = k.nama_kereta), m), {} as any);
    const rIds = [...new Set(jadwals.map((j: any) => j.rute_id))];
    const rRes: any = rIds.length ? await supabase.from("rute").select("rute_id,nama_rute").in("rute_id", rIds) : { data: [] };
    const rMap = (rRes.data ?? []).reduce((m: any, r: any) => ((m[r.rute_id] = r.nama_rute), m), {} as any);

    const items = (jadwals ?? []).map((j: any) => {
      const sold = soldPer[String(j.jadwal_id)] || 0;
      const cap = Math.max(1, capacityMap[String(j.jadwal_id)] || 100);
      const occ = Math.min(100, Math.round((sold / cap) * 10000) / 100);
      return {
        id: String(j.jadwal_id),
        namaKereta: mkMap[j.master_kereta_id] ?? j.nomor_ka,
        rute: rMap[j.rute_id] ?? String(j.rute_id),
        jamBerangkat: j.waktu_berangkat_origin,
        jamTiba: j.waktu_tiba_destination,
        penumpangHariIni: sold > 0 ? `${sold} Penumpang` : "-",
        okupansiPercent: occ,
      };
    });

    return NextResponse.json({ items });
  } catch (err) {
    console.error("/api/admin/jadwal/overview error", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
