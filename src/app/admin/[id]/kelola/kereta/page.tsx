import React from "react";
import Icon from "@/components/ui/Icon";
import LiveLocation from "../../../../../components/admin/realtime-track/LiveLocation";
import PopularTrainCard from "../../../../../components/admin/card/PopularTrainCard";
import AiProactiveCard from "../../../../../components/admin/card/AiProactiveCard";
import AiRecomendationCard from "../../../../../components/admin/card/AiRecomendationCard";
import ChartMultiBar from "../../../../../components/admin/chart/ChartMultiBar";
import ChartPie from "../../../../../components/admin/chart/ChartPie";
import StatCard from "../../../../../components/admin/card/StatCard";
import type { MasterKereta } from "@/types/models";
import KeretaTableClient from "@/components/admin/kelola/KeretaTableClient";
import { createLegacyServerClient } from "@/lib/supabase";
import { listKereta } from "@/lib/mcp/services/kereta";

export default async function Page() {
  const categories = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const multiSeries = [
    { name: "KA Taksaka", color: "#f59e0b", values: [300, 320, 310, 330, 350, 380, 400] },
    { name: "KA Argo Lawu", color: "#10b981", values: [200, 210, 205, 220, 230, 240, 250] },
    { name: "KA Sancaka", color: "#7c3aed", values: [150, 140, 160, 150, 180, 200, 210] },
  ];

  const pieData = [
    { label: "1⭐", value: 10, color: "#7c3aed" },
    { label: "2⭐", value: 30, color: "#2bb673" },
    { label: "3⭐", value: 45, color: "#f6b352" },
    { label: "4⭐", value: 90, color: "#60a5fa" },
    { label: "5⭐", value: 150, color: "#8b5cf6" },
  ];

  const recommendationItems = [
    { text: "Optimalkan KA Argo Bromo (Gambir-Surabaya): Tambah 1 gerbong Eksekutif. Prediksi okupansi 98% & potensi pendapatan +Rp 85 Juta.", tone: "success" },
    { text: "Peringatan: Potensi keterlambatan KA Taksaka (Gambir-Yogya) — siapkan notifikasi kompensasi otomatis.", tone: "warning" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Kereta (Master Data)</h1>
          <p className="text-sm text-gray-500">Manajemen data sarana kereta api</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">Real-time Analysis</div>
          <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">🔔</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard icon={<Icon name="grid" className="w-6 h-6 text-blue-600" />} value="1,247" label="Total Perjalanan Kereta" change="+7.5%" changeType="increase" />
        <StatCard icon={<Icon name="box" className="w-6 h-6 text-purple-600" />} value="89" label="Pengiriman Aktif" change="+5%" changeType="increase" />
        <StatCard icon={<Icon name="check" className="w-6 h-6 text-green-600" />} value="94.2%" label="Tepat Waktu" change="x" changeType="neutral" />
        <StatCard icon={<Icon name="calendar" className="w-6 h-6 text-yellow-600" />} value="Rp 847M" label="Est. Revenue" change="+18%" changeType="increase" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="space-y-6">
            {/* Live Location */}
            <LiveLocation />

            {/* Popular Trains */}
            <PopularTrainCard />

            {/* AI Insight & Rekomendasi */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">AI Insight & Rekomendasi</h3>
                  <p className="text-sm text-gray-500">Rekomendasi strategis untuk optimasi operasional</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Real-time Analysis</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 text-sm">💡</span>
                        </div>
                        <div className="text-sm font-semibold text-green-700">Optimisasi Pendapatan</div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">Optimalkan KA Argo Bromo (Gambir-Surabaya): Tambah 1 gerbong Eksekutif. Prediksi okupansi 98% & potensi pendapatan +Rp 85 Juta.</div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Terapkan Rekomendasi</button>
                    </div>
                    <div className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">HIGH IMPACT</div>
                  </div>
                  <div className="mt-3 text-xs text-green-600">Lihat Data →</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-600 text-sm">⚠️</span>
                        </div>
                        <div className="text-sm font-semibold text-orange-700">Peringatan Operasional</div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">Potensi keterlambatan KA Taksaka (Gambir-Yogya): Sinyal terganggu di Cirebon. ETA mundur 25 menit. Siapkan notifikasi kompensasi otomatis.</div>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">Kirim Notifikasi</button>
                    </div>
                    <div className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium">URGENT</div>
                  </div>
                  <div className="mt-3 text-xs text-orange-600">Ataukan →</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 text-sm">💜</span>
                    </div>
                    <div className="text-sm font-semibold text-purple-700">Dynamic Pricing</div>
                  </div>
                  <div className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs font-medium">OPPORTUNITY</div>
                </div>
                <div className="text-sm text-gray-700 mb-3">
                  <strong>Peluang Dynamic Pricing:</strong> Okupansi KA Sancaka (Yogya-Surabaya) untuk Jasa Baru 45%. Rekomendasi: Turunkan <strong>diskon 15%</strong> untuk 50 penumpang berikutnya.
                </div>
                <div className="flex gap-2">
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm">Terapkan Diskon</button>
                  <button className="border border-purple-600 text-purple-600 px-3 py-1 rounded text-sm">Analisis Suite</button>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 text-sm">💜</span>
                    </div>
                    <div className="text-sm font-semibold text-purple-700">Dynamic Pricing</div>
                  </div>
                  <div className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs font-medium">OPPORTUNITY</div>
                </div>
                <div className="text-sm text-gray-700 mb-3">
                  <strong>Peluang Dynamic Pricing:</strong> Okupansi KA Sancaka (Yogya-Surabaya) untuk Jasa Baru 45%. Rekomendasi: Turunkan <strong>diskon 15%</strong> untuk 50 penumpang berikutnya.
                </div>
                <div className="flex gap-2">
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm">Terapkan Diskon</button>
                  <button className="border border-purple-600 text-purple-600 px-3 py-1 rounded text-sm">Analisis Suite</button>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <ChartMultiBar categories={categories} series={multiSeries as any} width={760} height={300} />
              </div>
              <div className="col-span-1">
                <ChartPie data={pieData as any} size={300} innerRadius={70} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-teal-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-teal-600 text-sm">🤖</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">AI Monitoring Fasilitas</h3>
                </div>
                <button className="bg-teal-600 text-white px-3 py-1 rounded text-sm">Atur Fasilitas</button>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                  <div className="text-sm text-gray-700">Locker Gambir sudah 95% penuh.</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div className="text-sm text-gray-700">
                    <strong>Rekomendasi:</strong> Arahkan pengguna baru ke Locker Pasar Senen.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div className="text-sm text-gray-700">Shower Room Bandung hanya tersedia 2 slot sore ini.</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div className="text-sm text-gray-700">Kirim notifikasi ke pengguna yang belum check-out locker.</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👨‍💼</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Ringkasan Layanan Porter</h3>
                </div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">AI Insight</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-700 mb-3">Total 28 porter aktif terdaftar di sistem.</div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="text-sm text-gray-700">Hari ini ada 45 pemesanan porter di seluruh stasiun.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="text-sm text-gray-700">Stasiun Gambir memiliki jumlah booking tertinggi (20 pemesanan).</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="text-sm text-gray-700">Rata-rata 15 menit waktu respon porter.</div>
                  </div>
                </div>
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-full">Lihat Detail Statistik</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <KeretaTableServer />
      </div>
    </div>
  );
}

async function KeretaTableServer() {
  const mapped = await listKereta();

  return <KeretaTableClient initialData={mapped as any} />;
}
