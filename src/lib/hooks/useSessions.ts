import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSessions() {
  return useQuery({
    queryKey: ["auth", "sessions"],
    queryFn: async () => {
      const res = await fetch(`/api/auth/sessions`, { method: "GET", credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
    },
    staleTime: 30 * 1000,
  });
}

export function useRevokeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await fetch(`/api/auth/sessions`, {
        method: "DELETE",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to revoke session");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Sesi berhasil dicabut");
      qc.invalidateQueries({ queryKey: ["auth", "sessions"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal mencabut sesi");
    },
  });
}
