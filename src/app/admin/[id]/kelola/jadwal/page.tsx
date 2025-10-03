"use client";

import React from "react";
import AiRecomendationCard from "@/components/admin/card/AiRecomendationCard";
import PopularTrainCard from "@/components/admin/card/PopularTrainCard";
import LiveLocation from "@/components/admin/realtime-track/LiveLocation";
import ChartPie from "@/components/admin/chart/ChartPie";
import ChartMultiBar from "@/components/admin/chart/ChartMultiBar";
import ChartMultiLine from "@/components/admin/chart/ChartMultiLine";
import TableKelola, { Column } from "@/components/admin/table/TableKelola";

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

  const columns: Column<JadwalRow>[] = [
    { key: "id", label: "ID Review" },
    { key: "namaKereta", label: "Nama Penumpang" },
    { key: "rute", label: "Rute" },
    { key: "jamBerangkat", label: "Jam Berangkat" },
    { key: "jamTiba", label: "Jam Tiba" },
    {
      key: "penumpangHariIni",
      label: "Review",
      render: (row) => <span className="text-sm text-gray-700">{row.penumpangHariIni}</span>,
    },
    {
      key: "okupansi",
      label: "Rating",
      render: (row) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-sm ${i < Math.floor(row.okupansiPercent / 20) ? "text-yellow-400" : "text-gray-300"}`}>
              ★
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "tanggal",
      label: "Tanggal",
      render: (row) => <span className="text-sm text-gray-500">29 Okt 2024</span>,
    },
    {
      key: "aksi",
      label: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="text-blue-600 hover:text-blue-800">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="text-blue-600 hover:text-blue-800">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      ),
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
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* AI Recommendation Card */}
            <AiRecomendationCard
              title="Peluang Pemasaran AI"
              subtitle="Okupansi KA Sancaka (Rabu): 35%"
              items={[
                { text: "Tawarkan diskon 20% untuk tiket hari Rabu-Kamis guna meningkatkan okupansi", tone: "info" },
                { text: "Buat paket wisata keluarga dengan hotel partner di destinasi", tone: "success" },
              ]}
              cta={{ label: "Terapkan ide Promo", variant: "primary" }}
              badge="AI GuideUp"
              accentColor="#f97316"
            />

            {/* Review Summary Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800">Ringkasan Review Pelanggan</h3>
              <p className="text-sm text-gray-500 mt-2">Total review minggu ini: 324 review (Rating rata-rata: 4.2/5)</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                  <div className="text-sm text-gray-700">Topik utama: AC gerbong terlalu dingin</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <div className="text-sm text-gray-700">Topik utama: keterlambatan jadwal di rute JKT-SBY</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div className="text-sm text-gray-700">Topik utama: komentar positif & staff ramah</div>
                </div>
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm">Lihat Detail Insight</button>
              </div>
            </div>

            {/* Service Request Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Antrian Permintaan Layanan</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="text-2xl font-bold text-blue-600">25</div>
                  <div className="text-sm text-gray-600">Permintaan Refund</div>
                  <div className="text-xs text-gray-500 mt-1">0 response • 6 hari lalu</div>
                  <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">Pantau</button>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="text-2xl font-bold text-orange-600">410</div>
                  <div className="text-sm text-gray-600">Reschedule</div>
                  <div className="text-xs text-gray-500 mt-1">Ess response • 3 menit</div>
                  <button className="mt-2 px-3 py-1 bg-orange-600 text-white text-xs rounded">Antrian</button>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                  <div className="text-2xl font-bold text-red-600">85</div>
                  <div className="text-sm text-gray-600">Keluhan Masuk</div>
                  <div className="text-xs text-gray-500 mt-1">Priority Tinggi • 37</div>
                  <button className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded">Priority</button>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <ChartMultiLine
                  xLabels={occupancyTrends?.xLabels ?? ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}
                  series={occupancyTrends?.series ?? [{ id: "sancaka", name: "KA Sancaka", color: "#6d28d9", values: [45, 52, 34, 38, 60, 82, 90] }]}
                  title="Okupansi Harian (%)"
                  width={420}
                  height={240}
                />
              </div>
              <div>
                <ChartMultiBar categories={weeklyBoardings?.categories ?? ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]} series={weeklyBoardings?.series ?? barSeries} height={240} width={420} />
              </div>
            </div>

            {/* Bottom Table Section */}
            <TableKelola
              title="Daftar Jadwal Kereta & Penumpang"
              description={rowsLoading ? "Memuat jadwal..." : `Menampilkan ${rows.length} jadwal`}
              data={rows}
              columns={columns}
              perPage={10}
              onEdit={(r) => console.log("edit", r)}
              onDelete={(r) => console.log("delete", r)}
              addButtonLabel="+ Tambah Jadwal Baru"
              onAdd={() => console.log("add")}
            />
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-6">
            <LiveLocation />

            <ChartPie data={ratingData ?? []} size={280} innerRadius={60} />

            <PopularTrainCard items={popular ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
