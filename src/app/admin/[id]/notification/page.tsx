"use client";
import React, { useState, useEffect } from "react";

// Assuming 'colors' and 'Column' are defined elsewhere,
// for example in a design system and a table component respectively.
// We'll add placeholder types for this standalone file.
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

  useEffect(() => {
    const fetchAdminNotifications = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/notifications?page=${page}&limit=20`, { credentials: "include" });
        const json = await res.json();
        if (json?.success) {
          setNotifications(json.data || []);
          setTotalPages(json.pagination?.totalPages || 1);
        } else {
          console.error("Failed to fetch admin notifications", json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminNotifications();
  }, [page]);

  const handleSendNotification = async () => {
    setStatusMessage(null);
    // build payload
    const payload: any = {
      judul: selectedType + " - " + (message ? message.substring(0, 40) : "Notifikasi Baru"),
      pesan: message,
      tipe_notifikasi: selectedType.toUpperCase().replace(/ /g, "_"),
      priority_level: "NORMAL",
    };

    // broadcast when 'Semua' target is chosen
    if (selectedTarget === "Semua") {
      payload.broadcast = true;
    } else if (selectedTarget === "Pelanggan") {
      // leaving user_id empty means admin likely wants to broadcast to customers only;
      // for now, we treat as broadcast as well
      payload.broadcast = true;
    } else {
      // Admin-internal: send to admin user (current admin id not available here); fallback to broadcast
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
          <div className="space-y-4">{/* Commented out sections from original code */}</div>

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

          {/* Notifications Table */}
          <div className="bg-white rounded-xl shadow p-4">
            <TableKelola title="Daftar Notifikasi" description="Riwayat notifikasi yang dikirim ke pengguna" columns={notificationColumns} data={notifications} />

            {/* Simple pagination control */}
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
        </div>
      </div>
    </div>
  );
}
