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

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);

    const ticketsAgg: any = await supabase.from("tiket").select(`tiket_id, segment_id, waktu_dibuat, pemesanan: pems(total_bayar)`);

    const segmentsRes: any = await supabase.from("pemesanan_segment").select("segment_id,rute_id");
    const routesRes: any = await supabase.from("rute").select("rute_id,nama_rute");

    const segmentsMap = (segmentsRes.data ?? []).reduce((m: any, s: any) => ((m[s.segment_id] = s.rute_id), m), {} as any);
    const routesMap = (routesRes.data ?? []).reduce((m: any, r: any) => ((m[r.rute_id] = r.nama_rute), m), {} as any);

    const now = new Date();
    const since = new Date(now);
    since.setDate(now.getDate() - 1);

    const counts: Record<string, number> = {};
    const revenues: Record<string, number> = {};

    for (const t of ticketsAgg.data ?? []) {
      const created = new Date(t.waktu_dibuat || 0);
      if (created < since) continue;
      const rId = segmentsMap[t.segment_id];
      if (!rId) continue;
      counts[rId] = (counts[rId] || 0) + 1;
      const paid = t.pemesanan?.total_bayar ? Number(t.pemesanan.total_bayar) : 0;
      revenues[rId] = (revenues[rId] || 0) + paid;
    }

    // For occupancy estimate, approximate capacity per route by summing kapasitas_kursi from master_gerbong for today's jadwal on those routes
    const routeIds = Object.keys(counts);
    const capacityMap: Record<string, number> = {};
    if (routeIds.length > 0) {
      // Fetch jadwal for the last day for those routes
      const jadwalRes: any = await supabase.from("jadwal").select("jadwal_id,rute_id").gte("tanggal_keberangkatan", since.toISOString()).lte("tanggal_keberangkatan", now.toISOString());
      const jadwalIds = (jadwalRes.data ?? []).filter((j: any) => routeIds.includes(String(j.rute_id))).map((j: any) => j.jadwal_id);

      if (jadwalIds.length > 0) {
        // get jadwal_gerbong -> master_gerbong kapasitas_kursi
        const jgRes: any = await supabase.from("jadwal_gerbong").select("jadwal_id,master_gerbong_id").in("jadwal_id", jadwalIds);
        const mgIds = [...new Set((jgRes.data ?? []).map((x: any) => Number(x.master_gerbong_id)))];
        const mgRes: any = await supabase
          .from("master_gerbong")
          .select("master_gerbong_id,kapasitas_kursi")
          .in("master_gerbong_id", mgIds as number[]);
        const mgMap = (mgRes.data ?? []).reduce((m: any, g: any) => ((m[g.master_gerbong_id] = g.kapasitas_kursi), m), {} as any);

        // sum capacity per jadwal -> then per route
        const jadwalToCapacity: Record<string, number> = {};
        for (const jg of jgRes.data ?? []) {
          const cap = mgMap[jg.master_gerbong_id] ?? 0;
          jadwalToCapacity[jg.jadwal_id] = (jadwalToCapacity[jg.jadwal_id] || 0) + cap;
        }

        // map jadwal -> route
        const jadwalRouteMap = (jadwalRes.data ?? []).reduce((m: any, j: any) => ((m[j.jadwal_id] = j.rute_id), m), {} as any);

        for (const jadwalId of Object.keys(jadwalToCapacity)) {
          const rId = String(jadwalRouteMap[jadwalId]);
          if (!rId) continue;
          capacityMap[rId] = (capacityMap[rId] || 0) + (jadwalToCapacity[jadwalId] || 0);
        }
      }
    }

    const arr = routeIds.map((k) => {
      const sold = counts[k] || 0;
      const revenue = revenues[k] || 0;
      const cap = Math.max(1, capacityMap[k] ?? 100); // avoid zero
      const occ = Math.min(100, Math.round((sold / cap) * 10000) / 100);
      return {
        id: String(k),
        title: routesMap[k] ?? "Rute",
        passengers: `${sold} Penumpang`,
        occupancyPercent: occ,
        revenue: `Rp ${revenue.toLocaleString("id-ID")}`,
      };
    });

    arr.sort((a, b) => (b.passengers ? Number(String(b.passengers).replace(/[^0-9]/g, "")) : 0) - (a.passengers ? Number(String(a.passengers).replace(/[^0-9]/g, "")) : 0));
    return NextResponse.json({ items: arr.slice(0, 5) });
  } catch (err) {
    console.error("/api/admin/dashboard/popular-routes error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
