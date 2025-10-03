"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import AiRecomendationCard from "@/components/admin/card/AiRecomendationCard";
import ChartMultiBar from "@/components/admin/chart/ChartMultiBar";
import ChartPie from "@/components/admin/chart/ChartPie";
import LogisticService, { 
  LogisticShipment, 
  LogisticStats, 
  LogisticChartData, 
  AIRecommendation 
} from "@/lib/services/LogisticService";

export default function LogisticPage() {
  const [selectedCargo, setSelectedCargo] = useState("all");
  const [stats, setStats] = useState<LogisticStats | null>(null);
  const [shipments, setShipments] = useState<LogisticShipment[]>([]);
  const [chartData, setChartData] = useState<LogisticChartData | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, shipmentsData, chartDataResult, aiData] = await Promise.all([
          LogisticService.getStats(),
          LogisticService.getShipments(),
          LogisticService.getChartData(),
          LogisticService.getAIRecommendations(),
        ]);

        setStats(statsData);
        setShipments(shipmentsData);
        setChartData(chartDataResult);
        setAiRecommendations(aiData);
      } catch (error) {
        console.error("Error fetching logistics data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter shipments based on selected cargo type
  const filteredShipments = selectedCargo === "all" 
    ? shipments 
    : shipments.filter(shipment => 
        shipment.jenis_barang.toLowerCase() === selectedCargo.toLowerCase()
      );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats || !chartData) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading logistics data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Logistik KAI</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Tambah Pengiriman
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pengiriman</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalShipments.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                +{stats.weeklyGrowth.shipments}% dari minggu lalu
              </p>
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
              <p className="text-sm text-green-600 mt-1">
                +{stats.weeklyGrowth.onTime}% dari minggu lalu
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {LogisticService.formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{stats.weeklyGrowth.revenue}% dari minggu lalu
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Image src="/ic_price.svg" alt="" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiRecommendations.map((rec) => (
          <AiRecomendationCard
            key={rec.id}
            title={rec.title}
            subtitle={rec.description}
            items={[]}
            badge={rec.priority}
            accentColor={rec.type === 'warning' ? '#f59e0b' : rec.type === 'alert' ? '#ef4444' : '#3b82f6'}
            cta={{ 
              label: rec.actionRequired ? "Ambil Tindakan" : "Lihat Detail",
              variant: "primary"
            }}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipment Status Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengiriman per Hari</h3>
          <ChartMultiBar
            categories={chartData.shipmentsByDay.categories}
            series={chartData.shipmentsByDay.series}
            height={300}
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Harian (dalam Juta)</h3>
          <ChartPie
            data={chartData.revenueByDay}
            size={300}
            innerRadius={60}
          />
        </div>
      </div>

      {/* Cargo Type Filter */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Daftar Pengiriman</h3>
          <div className="flex gap-2">
            {["all", "terminal", "elektronik", "makanan", "tekstil", "farmasi"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedCargo(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCargo === type
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type === "all" ? "Semua" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Shipments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">No. Resi</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Kereta Logistik</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rute</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Jenis Barang</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Berat</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment) => (
                <tr key={shipment.pengiriman_id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{shipment.nomor_resi}</td>
                  <td className="py-3 px-4 text-gray-900">{shipment.logistik_name}</td>
                  <td className="py-3 px-4 text-gray-900">{shipment.rute}</td>
                  <td className="py-3 px-4 text-gray-900">{shipment.jenis_barang}</td>
                  <td className="py-3 px-4 text-gray-900">{shipment.berat}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        shipment.status_pengiriman === "On Time"
                          ? "bg-green-100 text-green-800"
                          : shipment.status_pengiriman === "Delay"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {shipment.status_pengiriman}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{shipment.revenue}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredShipments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada pengiriman ditemukan untuk kategori yang dipilih.
          </div>
        )}
      </div>
    </div>
  );
}
