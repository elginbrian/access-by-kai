"use client";

import React from "react";
import Icon from "@/components/ui/Icon";
import AiRecomendationCard from "@/components/admin/card/AiRecomendationCard";
import PopularTrainCard from "@/components/admin/card/PopularTrainCard";
import LiveLocation from "@/components/admin/realtime-track/LiveLocation";
import ChartPie from "@/components/admin/chart/ChartPie";
import ChartMultiBar from "@/components/admin/chart/ChartMultiBar";
import ChartMultiLine from "@/components/admin/chart/ChartMultiLine";
import TableKelola, { Column } from "@/components/admin/table/TableKelola";
import SummarizerLarge from "@/components/admin/SummarizerLarge";
import { useUlasanList, useDeleteUlasan } from "@/lib/hooks/ulasan";
import type { UlasanUI } from "@/lib/mappers/ulasan";

type JadwalRow = {
  id: string;
  namaKereta: string;
  rute: string;
  jamBerangkat: string;
  jamTiba: string;
  penumpangHariIni: string;
  okupansiPercent: number;
};

const initialRows: JadwalRow[] = [];

export default function Page() {
  const { data: ulasanRows = [] } = useUlasanList();
  const [mergedStructured, setMergedStructured] = React.useState<any | null>(null);
  const [mergeLoading, setMergeLoading] = React.useState(false);
  const [mergeError, setMergeError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<JadwalRow[]>(initialRows);
  const [rowsLoading, setRowsLoading] = React.useState(true);
  const [popular, setPopular] = React.useState<any[] | null>(null);
  const [serviceCounts, setServiceCounts] = React.useState<any | null>(null);
  const [ratingData, setRatingData] = React.useState<any[] | null>(null);
  const [weeklyBoardings, setWeeklyBoardings] = React.useState<any | null>(null);
  const [occupancyTrends, setOccupancyTrends] = React.useState<any | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function fetchOverview() {
      setRowsLoading(true);
      try {
        const res = await fetch("/api/admin/jadwal/overview");
        if (!res.ok) throw new Error("jadwal overview fetch failed");
        const j = await res.json();
        if (mounted) setRows(j.items ?? []);
      } catch (e) {
        console.error("fetch jadwal overview error", e);
        if (mounted) setRows([]);
      } finally {
        if (mounted) setRowsLoading(false);
      }
    }

    async function fetchExtras() {
      try {
        const [popRes, svcRes, ratingRes, weeklyRes, occRes] = await Promise.all([
          fetch("/api/admin/dashboard/popular-routes"),
          fetch("/api/admin/dashboard/service-queue"),
          fetch("/api/admin/jadwal/charts/rating-distribution"),
          fetch("/api/admin/jadwal/charts/weekly-boardings"),
          fetch("/api/admin/jadwal/charts/occupancy-trends"),
        ]);
        const pop = popRes.ok ? await popRes.json() : null;
        const svc = svcRes.ok ? await svcRes.json() : null;
        const rating = ratingRes.ok ? await ratingRes.json() : null;
        const weekly = weeklyRes.ok ? await weeklyRes.json() : null;
        const occ = occRes.ok ? await occRes.json() : null;
        if (mounted) {
          setPopular(pop?.items ?? []);
          setRatingData(rating?.data ?? []);
          setWeeklyBoardings(weekly ?? null);
          setOccupancyTrends(occ ?? null);
          // derive simple counts from service queue
          const items = svc?.items ?? [];
          const counts = items.reduce((acc: any, it: any) => {
            acc[it.type] = (acc[it.type] || 0) + (it.count || 1);
            return acc;
          }, {});
          setServiceCounts(counts);
        }
      } catch (e) {
        console.error("fetch extras error", e);
        if (mounted) {
          setPopular([]);
          setServiceCounts(null);
        }
      }
    }

    fetchOverview();
    fetchExtras();
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    async function fetchAndMerge() {
      setMergeLoading(true);
      setMergeError(null);
      try {
        const tickets = rows.reduce((acc, r) => acc + (Number((r as any).seatsSold) || 0), 0);
        const q: string[] = [];
        q.push(`ticketsSold=${tickets}`);
        q.push(`revenue=0`);
        q.push(`activeSchedules=${rows.length}`);
        if (rows.length) q.push(`otpPercent=${Math.round(rows.reduce((acc, r) => acc + (r.okupansiPercent || 0), 0) / rows.length)}`);

        const dashRes = await fetch(`/api/admin/dashboard/summarize?${q.join("&")}`);
        const dashJson = dashRes.ok ? await dashRes.json() : null;

        const two = (ulasanRows || []).slice(0, 2);
        let ulasanJson = null;
        if (two.length > 0) {
          const ulRes = await fetch(`/api/admin/ulasan/summarize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ulasan: two }),
          });
          ulasanJson = ulRes.ok ? await ulRes.json() : null;
        }

        const merged: any = { title: "Ringkasan Operasional & Ulasan", summary_lines: [], recommendations: [] };
        if (dashJson?.ok && dashJson.structured && dashJson.data) {
          merged.summary_lines.push(...(dashJson.data.summary_lines ?? []));
          merged.recommendations.push(...(dashJson.data.recommendations ?? []));
        } else if (dashJson?.ok && !dashJson.structured && dashJson.lines) {
          merged.summary_lines.push(...dashJson.lines.slice(0, 4));
        }

        if (ulasanJson?.ok && ulasanJson.structured && ulasanJson.data) {
          merged.summary_lines.push("Ringkasan Ulasan:");
          merged.summary_lines.push(...(ulasanJson.data.summary_lines ?? []));
          merged.recommendations.push(...(ulasanJson.data.recommendations ?? []));
        } else if (ulasanJson?.ok && !ulasanJson.structured && ulasanJson.lines) {
          merged.summary_lines.push("Ringkasan Ulasan:");
          merged.summary_lines.push(...ulasanJson.lines.slice(0, 4));
        }

        const normalize = (s: string) => String(s).replace(/\s+/g, " ").trim().toLowerCase();

        const dedupe = (arr: string[]) => {
          const seen = new Set<string>();
          const out: string[] = [];
          for (const item of arr) {
            const key = normalize(item);
            if (!seen.has(key)) {
              seen.add(key);
              out.push(item);
            }
          }
          return out;
        };

        merged.summary_lines = dedupe(merged.summary_lines || []);
        merged.recommendations = dedupe(merged.recommendations || []);

        if (mounted) setMergedStructured(merged);
      } catch (err: any) {
        if (mounted) setMergeError(err?.message ?? String(err));
      } finally {
        if (mounted) setMergeLoading(false);
      }
    }

    fetchAndMerge();
    return () => {
      mounted = false;
    };
  }, [rows, ulasanRows]);

  const columns: Column<JadwalRow>[] = [
    { key: "id", label: "ID" },
    { key: "namaKereta", label: "Nama Kereta" },
    { key: "rute", label: "Rute" },
    { key: "kelas", label: "Kelas", render: (row) => <span className="text-sm text-gray-700">{(row as any).kelas ?? "-"}</span> },
    {
      key: "jamBerangkat",
      label: "Jam Berangkat",
      render: (row) => {
        try {
          const d = new Date((row as any).jamBerangkat);
          return <div className="text-sm text-gray-700">{isNaN(d.getTime()) ? "-" : d.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>;
        } catch (e) {
          return <div className="text-sm text-gray-700">-</div>;
        }
      },
    },
    {
      key: "jamTiba",
      label: "Jam Tiba",
      render: (row) => {
        try {
          const d = new Date((row as any).jamTiba);
          return <div className="text-sm text-gray-700">{isNaN(d.getTime()) ? "-" : d.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>;
        } catch (e) {
          return <div className="text-sm text-gray-700">-</div>;
        }
      },
    },
    { key: "kapasitas", label: "Kapasitas", render: (row) => <span className="text-sm text-gray-700">{(row as any).kapasitas ?? "-"}</span> },
    { key: "seatsSold", label: "Terjual", render: (row) => <span className="text-sm text-gray-700">{(row as any).seatsSold ?? 0}</span> },
    { key: "okupansiPercent", label: "Okupansi (%)", render: (row) => <span className="text-sm text-gray-700">{row.okupansiPercent ?? "-"}</span> },
    {
      key: "tanggal",
      label: "Tanggal",
      render: (row) => {
        try {
          const d = new Date((row as any).tanggal);
          return <span className="text-sm text-gray-500">{isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>;
        } catch (e) {
          return <span className="text-sm text-gray-500">-</span>;
        }
      },
    },
  ];

  const pieData = [
    { label: "1★", value: 2, color: "#ef4444" },
    { label: "2★", value: 5, color: "#f59e0b" },
    { label: "3★", value: 20, color: "#f97316" },
    { label: "4★", value: 40, color: "#7c3aed" },
    { label: "5★", value: 120, color: "#6d28d9" },
  ];

  const barSeries = [
    { name: "KA Sancaka", color: "#6d28d9", values: [120, 150, 180, 220, 260, 300, 360] },
    { name: "KA Argo Lawu", color: "#059669", values: [80, 90, 100, 120, 130, 150, 180] },
    { name: "KA Taksaka", color: "#f59e0b", values: [60, 70, 80, 90, 110, 140, 170] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Kelola Jadwal & Penumpang</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola jadwal kereta dan data penumpang dengan wawasan AI</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="px-3 py-1 bg-white rounded-md shadow-sm">
              Mode: <span className="font-medium">Admin</span>
            </div>
            <div className="px-3 py-1 bg-white rounded-md shadow-sm">
              Env: <span className="font-medium">Local</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <SummarizerLarge
              metrics={{
                ticketsSold: rows.reduce((acc, r) => acc + (Number((r as any).seatsSold) || 0), 0),
                revenue: 0,
                activeSchedules: rows.length,
                otpPercent: rows.length ? Math.round(rows.reduce((acc, r) => acc + (r.okupansiPercent || 0), 0) / rows.length) : undefined,
              }}
              overrideStructured={mergedStructured}
              skipFetch={true}
            />

            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Antrian Permintaan Layanan</h3>
                <div className="text-sm text-gray-500">Terakhir diperbarui: sekarang</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {serviceCounts ? (
                  Object.entries(serviceCounts).map(([k, v]) => (
                    <div key={k} className="bg-white rounded-lg p-4 border shadow-sm">
                      <div className="text-2xl font-bold text-gray-800">{String(v)}</div>
                      <div className="text-sm text-gray-600 capitalize">{k.replace(/_/g, " ")}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="text-2xl font-bold text-blue-600">25</div>
                      <div className="text-sm text-gray-600">Permintaan Refund</div>
                      <div className="text-xs text-gray-500 mt-1">0 response • 6 hari lalu</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                      <div className="text-2xl font-bold text-orange-600">410</div>
                      <div className="text-sm text-gray-600">Reschedule</div>
                      <div className="text-xs text-gray-500 mt-1">Ess response • 3 menit</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                      <div className="text-2xl font-bold text-red-600">85</div>
                      <div className="text-sm text-gray-600">Keluhan Masuk</div>
                      <div className="text-xs text-gray-500 mt-1">Priority Tinggi • 37</div>
                    </div>
                  </>
                )}
              </div>
            </div> */}

            {/* <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Okupansi Harian (%)</h4>
                <ChartMultiLine
                  xLabels={occupancyTrends?.xLabels ?? ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}
                  series={occupancyTrends?.series ?? [{ id: "sancaka", name: "KA Sancaka", color: "#6d28d9", values: [45, 52, 34, 38, 60, 82, 90] }]}
                  title=""
                  width={420}
                  height={240}
                />
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Jumlah Penumpang per Hari</h4>
                <ChartMultiBar categories={weeklyBoardings?.categories ?? ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]} series={weeklyBoardings?.series ?? barSeries} height={240} width={420} />
              </div>
            </div> */}
          </div>

          <div className="col-span-4 space-y-6">
            <LiveLocation />
            {/* 
            <ChartPie data={ratingData ?? []} size={280} innerRadius={60} /> */}
            {/* 
            <PopularTrainCard items={popular ?? []} /> */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6">
          <TableKelola
            title="Jadwal Kereta"
            description={rowsLoading ? "Memuat jadwal kereta..." : `Menampilkan ${rows.length} jadwal kereta`}
            data={rows}
            columns={columns}
            perPage={10}
            onEdit={(r) => console.log("edit", r)}
            onDelete={(r) => console.log("delete", r)}
            addButtonLabel="+ Tambah Jadwal"
            onAdd={() => console.log("add")}
          />
        </div>
        <div className="max-w-7xl mx-auto mt-6">
          <UlasanTable />
        </div>
      </div>
    </div>
  );
}

type ReviewRow = UlasanUI;

function UlasanTable() {
  const { data: rows = [], isLoading } = useUlasanList();
  const del = useDeleteUlasan();

  const columns: Column<ReviewRow>[] = [
    { key: "id", label: "ID" },
    { key: "penggunaId", label: "Pengguna", render: (r) => String(r.penggunaId) },
    { key: "jenisLayanan", label: "Layanan" },
    {
      key: "penilaian",
      label: "Rating",
      render: (r) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-sm ${i < r.penilaian ? "text-yellow-400" : "text-gray-300"}`}>
              ★
            </span>
          ))}
        </div>
      ),
    },
    { key: "komentar", label: "Komentar", render: (r) => <div className="text-sm text-gray-700">{r.komentar}</div> },
    { key: "platform", label: "Platform" },
    {
      key: "dibuatPada",
      label: "Dibuat Pada",
      render: (r) => {
        try {
          return r.dibuatPada ? new Date(r.dibuatPada).toLocaleString("id-ID") : "-";
        } catch {
          return "-";
        }
      },
    },
  ];

  return (
    <TableKelola
      title="Ulasan Pengguna"
      description={isLoading ? "Memuat ulasan..." : `Menampilkan ${rows.length} ulasan`}
      data={rows.map((r) => ({ ...r, id: String(r.id) }))}
      columns={columns as any}
      perPage={10}
      onEdit={(r) => console.log("edit ulasan", r)}
      onDelete={(r) => del.mutate(Number((r as any).id))}
      addButtonLabel=""
      onAdd={undefined}
    />
  );
}
