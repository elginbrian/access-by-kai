"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useSessions, useRevokeSession } from "@/lib/hooks/useSessions";

export default function AccountSessionsPage() {
  const { user, loading } = useAuth();
  const { data, isLoading, error } = useSessions();
  const revoke = useRevokeSession();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6">Silakan login untuk melihat sesi aktif.</div>;
  }

  const sessions = data?.sessions || [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sesi Aktif</h1>
      <p className="text-sm text-muted-foreground mb-6">Berikut perangkat yang sedang login ke akun Anda. Anda dapat mencabut sesi yang tidak dikenal.</p>

      {sessions.length === 0 ? (
        <div className="text-center text-sm text-gray-600">Tidak ada sesi aktif.</div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">{s.user_agent || "Unknown device"}</div>
                <div className="text-sm text-gray-600">IP: {s.ip || "-"}</div>
                <div className="text-sm text-gray-600">Dibuat: {s.created_at ? new Date(s.created_at).toLocaleString() : "-"}</div>
                <div className="text-sm text-gray-600">Expires: {s.expires_at ? new Date(s.expires_at).toLocaleString() : "-"}</div>
              </div>
              <div>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  onClick={() => {
                    setRevokingId(String(s.id));
                    revoke.mutate(String(s.id), {
                      onSettled: () => setRevokingId(null),
                    });
                  }}
                  disabled={revokingId === String(s.id)}
                >
                  Cabut
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
