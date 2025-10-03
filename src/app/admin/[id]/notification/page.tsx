"use client";
import React, { useState, useEffect } from "react";
import { useNotifications, useAdminReports } from "@/lib/hooks/useNotifications";
import SummarizerLarge from "@/components/admin/SummarizerLarge";

namespace colors {
  export const violet = {
    light: "#f5f3ff",
  };
}

export interface Column<T> {
  key: keyof T | (string & {});
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

// Mock hook for demonstration purposes
const useCreateNotification = () => {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (payload: any) => {
    setIsPending(true);
    console.log("Creating notification with payload:", payload);
    return new Promise((resolve) =>
      setTimeout(() => {
        setIsPending(false);
        resolve({ success: true });
      }, 1000)
    );
  };
  return { mutateAsync, isPending };
};

// Mock Table component
const TableKelola = ({ title, description, columns, data }: { title: string; description: string; columns: Column<any>[]; data: any[] }) => (
  <div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{description}</p>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={String(col.key)} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${col.className || ""}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function Page() {
  const [selectedTarget, setSelectedTarget] = useState("Admin-Internal");
  const [selectedType, setSelectedType] = useState("Delay");
  const [message, setMessage] = useState("");
  const [sendToInternal, setSendToInternal] = useState(false);
  const [sendToPelanggan, setSendToPelanggan] = useState(false);
  const createNotificationMutation = useCreateNotification();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const notificationColumns: Column<any>[] = [
    { key: "notification_id", label: "ID" },
    { key: "judul", label: "Judul" },
    { key: "pesan", label: "Pesan", className: "max-w-[600px]" },
    { key: "tipe_notifikasi", label: "Tipe" },
    { key: "priority_level", label: "Prioritas" },
    { key: "is_read", label: "Dibaca", render: (r) => (r.is_read ? "Ya" : "Belum") },
    { key: "created_at", label: "Dibuat" },
  ];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: notifData, isLoading: notifLoading, refetch: refetchNotifs } = useNotifications({ page, limit: 20 });
  const [reports, setReports] = useState<any[]>([]);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotalPages, setReportsTotalPages] = useState(1);
  const [reportsSummary, setReportsSummary] = useState<any | null>(null);

  useEffect(() => {
    if (notifData) {
      setNotifications(notifData.data || []);
      setTotalPages(Math.ceil((notifData.total || 0) / 20));
    }
  }, [notifData]);

  const { data: reportsData, isLoading: reportsLoading, refetch: refetchReports } = useAdminReports(reportsPage, 20);

  useEffect(() => {
    if (reportsData) {
      setReports(reportsData.data || []);
      setReportsTotalPages(reportsData.pagination?.totalPages || 1);
    }
  }, [reportsData]);

  useEffect(() => {
    let mounted = true;
    async function fetchReportsSummary() {
      if (!reports || reports.length === 0) {
        setReportsSummary(null);
        return;
      }

      try {
        const toSummarize = reports.slice(0, 5);
        const res = await fetch(`/api/admin/reports/summarize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reports: toSummarize }),
        });
        const json = await res.json();
        if (!mounted) return;
        if (json?.ok) {
          if (json.structured) setReportsSummary(json.data ?? null);
          else setReportsSummary({ summary_lines: json.lines ?? [json.summary ?? "Ringkasan tidak tersedia"], recommendations: [] });
        } else {
          setReportsSummary(null);
        }
      } catch (e) {
        console.error("Failed to summarize reports", e);
        setReportsSummary(null);
      }
    }

    fetchReportsSummary();
    return () => {
      mounted = false;
    };
  }, [reports]);

  const handleSendNotification = async () => {
    setStatusMessage(null);

    const payload: any = {
      judul: selectedType + " - " + (message ? message.substring(0, 40) : "Notifikasi Baru"),
      pesan: message,
      tipe_notifikasi: selectedType.toUpperCase().replace(/ /g, "_"),
      priority_level: "NORMAL",
    };

    if (selectedTarget === "Semua") {
      payload.broadcast = true;
    } else if (selectedTarget === "Pelanggan") {
      payload.broadcast = true;
    } else {
      payload.broadcast = true;
    }

    try {
      await createNotificationMutation.mutateAsync(payload as any);
      setStatusMessage("Notifikasi berhasil dikirim.");
    } catch (e) {
      console.error(e);
      setStatusMessage("Gagal mengirim notifikasi.");
    }
  };

  return (
    <div style={{ backgroundColor: colors.violet.light }} className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Notifikasi Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor dan kelola notifikasi sistem dengan bantuan AI</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Recommendations Section */}
          <div className="space-y-4">
            <SummarizerLarge overrideStructured={reportsSummary} skipFetch={true} />
          </div>

          {/* Create Notification Form */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Buat Notifikasi Baru</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Pilih Target</label>
                <select
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-800 placeholder-gray-500 bg-white"
                >
                  <option value="Admin-Internal">Admin-Internal</option>
                  <option value="Pelanggan">Pelanggan</option>
                  <option value="Semua">Semua</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Jenis Notifikasi</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-800 placeholder-gray-500 bg-white"
                >
                  <option value="Delay">Delay</option>
                  <option value="Pembatalan">Pembatalan</option>
                  <option value="Informasi">Informasi</option>
                  <option value="Promo">Promo</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">Isi Pesan</label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis pesan notifikasi..."
                  className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent h-24 resize-none text-gray-800 placeholder-gray-400 bg-white"
                />
                <button className="absolute right-3 bottom-3 text-violet-600 hover:text-violet-800 text-sm font-semibold">🪄 Generate with AI</button>
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={sendToInternal} onChange={(e) => setSendToInternal(e.target.checked)} className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500" />
                <span className="text-sm text-gray-700">Kirim ke Internal saja</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={sendToPelanggan} onChange={(e) => setSendToPelanggan(e.target.checked)} className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500" />
                <span className="text-sm text-gray-700">Kirim juga ke Pelanggan</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSendNotification}
                disabled={createNotificationMutation.isPending}
                className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-full text-sm hover:bg-violet-700 disabled:opacity-50 shadow transition-colors"
              >
                {createNotificationMutation.isPending ? "Mengirim..." : "Kirim Notifikasi"}
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-full text-sm hover:bg-gray-50 transition-colors">Simpan Draft</button>
            </div>
            {statusMessage && <p className="mt-3 text-sm text-gray-700">{statusMessage}</p>}
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <TableKelola title="Daftar Notifikasi" description="Riwayat notifikasi yang dikirim ke pengguna" columns={notificationColumns} data={notifications} />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-50">
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Halaman {page} dari {totalPages}
                </span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4 mt-6">
            <TableKelola
              title="Laporan Pengguna"
              description="Daftar laporan/keluhan yang dikirim pengguna melalui landing page"
              columns={[
                { key: "id", label: "ID" },
                { key: "title", label: "Judul" },
                { key: "name", label: "Nama" },
                { key: "email", label: "Email" },
                { key: "issueType", label: "Jenis" },
                { key: "description", label: "Deskripsi", className: "max-w-[600px]" },
                { key: "created_at", label: "Dibuat" },
              ]}
              data={reports}
            />

            {reportsTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={() => setReportsPage((p) => Math.max(1, p - 1))} className="px-3 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-50">
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Halaman {reportsPage} dari {reportsTotalPages}
                </span>
                <button onClick={() => setReportsPage((p) => Math.min(reportsTotalPages, p + 1))} className="px-3 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
