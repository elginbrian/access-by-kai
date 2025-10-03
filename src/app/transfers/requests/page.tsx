"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useTransferRequests } from "@/lib/hooks/useTransferRequests";
import toast from "react-hot-toast";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";

export default function TransferRequestsPage() {
  const { user } = useAuth();
  const rawUserId = user?.profile?.user_id;
  const parsedUserId = rawUserId == null ? NaN : typeof rawUserId === "string" ? parseInt(rawUserId, 10) : (rawUserId as number);
  const { data, loading, reload, accept, finalize } = useTransferRequests(parsedUserId);

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainNavigation />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">Permintaan Transfer Tiket</h1>
        {loading && <div>Memuat...</div>}
        {!loading && (!data || data.length === 0) && <div className="text-gray-500">Tidak ada permintaan transfer</div>}
        <div className="space-y-4">
          {(data || []).map((r: any) => (
            <div key={r.id} className="p-4 bg-white rounded shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Tiket</div>
                  <div className="font-medium">
                    {r.tiket_id} — status: {r.status}
                  </div>
                  <div className="text-sm text-gray-500">
                    From: {r.from_user_id} — To: {r.to_user_id}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!r.to_accepted && r.to_user_id === parsedUserId && (
                    <button
                      onClick={async () => {
                        const res = await accept(r.id, parsedUserId);
                        if (res?.ok) toast.success("Berhasil menerima");
                        else toast.error(res?.error || "Gagal");
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Terima
                    </button>
                  )}
                  {r.from_accepted && r.to_accepted && r.to_user_id === parsedUserId && (
                    <button
                      onClick={async () => {
                        const res = await finalize(r.id, parsedUserId);
                        if (res?.ok) toast.success("Finalized");
                        else toast.error(res?.error || "Gagal finalisasi");
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Finalize
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
