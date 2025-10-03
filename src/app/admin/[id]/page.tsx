"use client";

import React from "react";
import TableKelola, { Column } from "@/components/admin/table/TableKelola";
import PopularTrainCard from "@/components/admin/card/PopularTrainCard";
import ChartMultiLine from "@/components/admin/chart/ChartMultiLine";
import AiRecomendationCard from "@/components/admin/card/AiRecomendationCard";
import LiveLocation from "@/components/admin/realtime-track/LiveLocation";
import { useEffect, useState } from "react";

const aiPlaceholder = [{ text: "AI recommendations are disabled for now.", tone: "info" }];

const columns: Column<any>[] = [
  { key: "route", label: "Rute", render: (r) => <div className="font-semibold text-gray-800">{r.route}</div> },
  { key: "passengers", label: "Penumpang", render: (r) => <div className="text-sm text-gray-600">{r.passengers}</div> },
  { key: "occupancy", label: "Okupansi", render: (r) => <div className="text-sm font-semibold text-green-600">{r.occupancy}%</div> },
  { key: "revenue", label: "Pendapatan", render: (r) => <div className="text-sm text-gray-600">{r.revenue}</div> },
];

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<{ ticketsSold?: number; revenue?: number; activeSchedules?: number; otpPercent?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchSummary() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/dashboard/summary");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setSummary(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchSummary();
    return () => {
      mounted = false;
    };
  }, []);

  const [occupancyChart, setOccupancyChart] = useState<any | null>(null);
  const [revenueChart, setRevenueChart] = useState<any | null>(null);
  useEffect(() => {
    let mounted = true;
    async function fetchCharts() {
      try {
        const [occRes, revRes] = await Promise.all([fetch("/api/admin/dashboard/occupancy"), fetch("/api/admin/dashboard/revenue")]);
        if (!occRes.ok) throw new Error("occupancy fetch failed");
        if (!revRes.ok) throw new Error("revenue fetch failed");
        const occ = await occRes.json();
        const rev = await revRes.json();
        if (mounted) {
          setOccupancyChart(occ);
          setRevenueChart(rev);
        }
      } catch (e) {
        console.error("chart fetch error", e);
      }
    }
    fetchCharts();
    return () => {
      mounted = false;
    };
  }, []);

  const [popularRoutes, setPopularRoutes] = useState<any[] | null>(null);
  const [aiItems, setAiItems] = useState<any[] | null>(null);
  useEffect(() => {
    let mounted = true;
    async function fetchCards() {
      try {
        const [popRes, aiRes] = await Promise.all([fetch("/api/admin/dashboard/popular-routes"), fetch("/api/admin/dashboard/ai-recommendations")]);
        const pop = popRes.ok ? await popRes.json() : null;
        const ai = aiRes.ok ? await aiRes.json() : null;
        if (mounted) {
          setPopularRoutes(pop?.items ?? null);
          setAiItems(ai?.items ?? null);
        }
      } catch (e) {
        console.error("card fetch error", e);
      }
    }
    fetchCards();
    return () => {
      mounted = false;
    };
  }, []);

  const [serviceQueue, setServiceQueue] = useState<any[] | null>(null);
  const [queueLoading, setQueueLoading] = useState(false);
  useEffect(() => {
    let mounted = true;
    async function fetchQueue() {
      setQueueLoading(true);
      try {
        const res = await fetch("/api/admin/dashboard/service-queue");
        if (!res.ok) throw new Error("service queue fetch failed");
        const data = await res.json();
        if (mounted) setServiceQueue(data.items ?? []);
      } catch (e) {
        console.error("service queue fetch error", e);
      }
      if (mounted) setQueueLoading(false);
    }
    fetchQueue();
    const iv = setInterval(() => fetchQueue(), 15_000);
    return () => {
      clearInterval(iv);
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kelola Kereta (Master Data)</h1>
            <p className="text-sm text-gray-500">Manajemen data sarana kereta api</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Real-time Analysis</div>
            <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">A</div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 grid grid-cols-1 gap-4">
            <AiRecomendationCard
              title="AI Co-Pilot Insights"
              subtitle="Rekomendasi proaktif untuk optimasi operasional"
              badge="Real-time Analysis"
              accentColor="#10b981"
              items={aiItems ?? [{ text: "Memuat rekomendasi...", tone: "info" }]}
              cta={{ label: "Terapkan Rekomendasi", variant: "primary" }}
            />

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-800">{loading ? "..." : summary?.ticketsSold ?? "—"}</div>
                <div className="text-sm text-gray-500">Tiket Terjual Hari Ini</div>
                <div className="flex items-center justify-center mt-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-800">{loading ? "..." : `${summary?.activeSchedules ?? "—"}`}</div>
                <div className="text-sm text-gray-500">Kereta Aktif Beroperasi</div>
                <div className="flex items-center justify-center mt-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-800">{loading ? "..." : `${summary?.otpPercent ?? "—"}%`}</div>
                <div className="text-sm text-gray-500">Ketepatan Waktu (OTP)</div>
                <div className="flex items-center justify-center mt-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-800">{loading ? "..." : `Rp ${(summary?.revenue ?? 0).toLocaleString("id-ID")}`}</div>
                <div className="text-sm text-gray-500">Pendapatan Hari Ini</div>
                <div className="flex items-center justify-center mt-2">
                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <LiveLocation />

            <PopularTrainCard
              title="Rute Populer Hari Ini"
              items={
                popularRoutes === null ? [] : popularRoutes // assume endpoint returns properly shaped items
              }
              onViewAll={() => {
                /* optional navigation handler */
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            {occupancyChart ? (
              <div>
                <ChartMultiLine width={760} height={260} xLabels={occupancyChart.xLabels} series={occupancyChart.series} title="Okupansi Harian (%)" />
                {revenueChart ? (
                  <div className="mt-6">
                    <ChartMultiLine width={760} height={220} xLabels={revenueChart.xLabels} series={revenueChart.series} title="Pendapatan Harian (Rp)" />
                  </div>
                ) : (
                  <div className="mt-6 text-sm text-gray-500">Memuat pendapatan...</div>
                )}
              </div>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-gray-500">Loading chart...</div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">Antrian Permintaan Layanan</h4>
              <div className="flex items-center gap-2">
                <button
                  className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                  onClick={async () => {
                    try {
                      setQueueLoading(true);
                      const res = await fetch("/api/admin/dashboard/service-queue");
                      if (!res.ok) throw new Error("fetch failed");
                      const d = await res.json();
                      setServiceQueue(d.items ?? []);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setQueueLoading(false);
                    }
                  }}
                >
                  Refresh
                </button>
                {queueLoading && <div className="text-sm text-gray-500">Memuat...</div>}
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {Array.isArray(serviceQueue) && serviceQueue.length === 0 && <div className="text-sm text-gray-500">Tidak ada permintaan layanan baru.</div>}
              {Array.isArray(serviceQueue) &&
                serviceQueue.map((service: any) => (
                  <div key={service.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{service.type}</div>
                        <div className="text-xs text-gray-500 mt-1">{service.priority === "urgent" ? "Prioritas Tinggi" : service.priority === "high" ? "Prioritas Sedang" : "Respons 5 menit"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{service.count}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${service.status === "Proses" ? "bg-blue-100 text-blue-700" : service.status === "Tunggu" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {service.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
