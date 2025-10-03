import React from "react";
import Image from "next/image";
import AiRecomendationCard from "@/components/admin/card/AiRecomendationCard";
import ChartMultiBar from "@/components/admin/chart/ChartMultiBar";
import ChartPie from "@/components/admin/chart/ChartPie";
import LogisticService, { LogisticShipment, LogisticStats, LogisticChartData, AIRecommendation } from "@/lib/services/LogisticService";
import LogisticShipmentsClient from "@/components/admin/kelola/LogisticShipmentsClient";
import { createLegacyServerClient } from "@/lib/supabase";

async function fetchShipmentsFromDb(): Promise<LogisticShipment[]> {
  try {
    const supabase = createLegacyServerClient();
    const res = await (supabase as any).from("pemesanan").select("*");
    const { data: rows = [], error } = res as any;
    if (error) throw error;

    const mapped = (rows || []).map((order: any) => {
      const biaya = Number(order.total_bayar || 0);
      const keterangan = order.keterangan
        ? (() => {
            try {
              return JSON.parse(order.keterangan);
            } catch (e) {
              return null;
            }
          })()
        : null;

      return {
        pengiriman_id: order.pemesanan_id,
        nomor_resi: order.kode_pemesanan,
        logistik_name: `KA Logistik ${((order.pemesanan_id || 0) % 400) + 100}`,
        rute:
          keterangan && keterangan.stasiun_asal_id && keterangan.stasiun_tujuan_id
            ? `${keterangan.stasiun_asal_id} → ${keterangan.stasiun_tujuan_id}`
            : LogisticService["generateRoute"]
            ? (LogisticService as any).generateRoute(order)
            : "Jakarta → Surabaya",
        jenis_barang: LogisticService["getRandomCargoType"] ? (LogisticService as any).getRandomCargoType() : "Terminal",
        berat: `${(Math.random() * 4 + 0.5).toFixed(1)} ton`,
        status_pengiriman: LogisticService["getRandomStatus"] ? (LogisticService as any).getRandomStatus() : "On Time",
        revenue: `Rp ${biaya.toLocaleString()}`,
        biaya_pengiriman: biaya,
        pengirim_nama: order.contact_person_nama || null,
        pengirim_nomor_telepon: order.contact_person_phone || null,
        pengirim_email: order.contact_person_email || null,
        waktu_pembuatan: order.waktu_pembuatan || new Date().toISOString(),
      } as LogisticShipment;
    });

    return mapped;
  } catch (err) {
    console.error("fetchShipmentsFromDb error:", err);
    return LogisticService["getMockShipments"] ? (LogisticService as any).getMockShipments() : [];
  }
}

export default async function LogisticPage() {
  const [shipments, chartData, aiRecommendationsResult] = await Promise.all([fetchShipmentsFromDb(), LogisticService.getChartData(), LogisticService.getAIRecommendations()]);

  const totalShipments = shipments.length;
  const onTimeCount = shipments.filter((s) => s.status_pengiriman === "On Time").length;
  const totalRevenue = shipments.reduce((sum, s) => sum + (s.biaya_pengiriman || 0), 0);

  const stats: LogisticStats = {
    totalShipments: totalShipments || 0,
    onTimePercentage: totalShipments > 0 ? (onTimeCount / totalShipments) * 100 : 0,
    totalRevenue: totalRevenue || 0,
    weeklyGrowth: {
      shipments: 7.5,
      onTime: 2.1,
      revenue: 8.3,
    },
  };

  const aiRecommendations: AIRecommendation[] = aiRecommendationsResult || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Logistik KAI</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Tambah Pengiriman</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pengiriman</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalShipments.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+{stats.weeklyGrowth.shipments}% dari minggu lalu</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Image src="/ic_lugage.svg" alt="" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Time Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onTimePercentage.toFixed(1)}%</p>
              <p className="text-sm text-green-600 mt-1">+{stats.weeklyGrowth.onTime}% dari minggu lalu</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Image src="/ic_clock.svg" alt="" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{LogisticService.formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-green-600 mt-1">+{stats.weeklyGrowth.revenue}% dari minggu lalu</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Image src="/ic_price.svg" alt="" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(aiRecommendations || []).map((rec) => (
          <AiRecomendationCard
            key={rec.id}
            title={rec.title}
            subtitle={rec.description}
            items={[]}
            badge={rec.priority}
            accentColor={rec.type === "warning" ? "#f59e0b" : rec.type === "alert" ? "#ef4444" : "#3b82f6"}
            cta={{
              label: rec.actionRequired ? "Ambil Tindakan" : "Lihat Detail",
              variant: "primary",
            }}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipment Status Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengiriman per Hari</h3>
          <ChartMultiBar categories={chartData.shipmentsByDay.categories} series={chartData.shipmentsByDay.series} height={300} />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Harian (dalam Juta)</h3>
          <ChartPie data={chartData.revenueByDay} size={300} innerRadius={60} />
        </div>
      </div>

      {/* Shipments list (client) */}
      <LogisticShipmentsClient initialShipments={shipments} />
    </div>
  );
}
