import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapPembayaranList, mapPembayaran } from "@/lib/mappers/pembayaran";
import { PembayaranSchema } from "@/lib/validators/pembayaran";
import { useUserRole } from "@/lib/auth/useRbac";
import type { Pembayaran } from "@/types/models";

const supabase = createClient();

export function usePembayaranListByPemesanan(pemesananId: number) {
  return useQuery({
    queryKey: ["pembayaran", "byPemesanan", pemesananId],
    queryFn: async () => {
      const res = await supabase.from("pembayaran").select("*").eq("pemesanan_id", pemesananId);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => PembayaranSchema.parse(r) as Pembayaran);
      return mapPembayaranList(parsed as Pembayaran[]);
    },
    enabled: !!pemesananId,
  });
}

export function useCreatePembayaran(currentUserId?: number) {
  const qc = useQueryClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      const parsed = PembayaranSchema.parse(payload);
      const res = await supabase.from("pembayaran").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["pembayaran", "byPemesanan", parsed.pemesanan_id] });
      return data as Pembayaran;
    },
  });
}

export function useUpdatePembayaran(currentUserId?: number) {
  const qc = useQueryClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = PembayaranSchema.parse(payload);
      const res = await supabase.from("pembayaran").update(parsed).eq("pembayaran_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["pembayaran", id] });
      qc.invalidateQueries({ queryKey: ["pembayaran", "byPemesanan", parsed.pemesanan_id] });
      return data as Pembayaran;
    },
  });
}

export function useDeletePembayaran(currentUserId?: number) {
  const qc = useQueryClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("pembayaran").delete().eq("pembayaran_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["pembayaran"] });
      return true;
    },
  });
}

export function usePembayaran(id: number | null) {
  return useQuery({
    queryKey: ["pembayaran", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("pembayaran").select("*").eq("pembayaran_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = PembayaranSchema.parse(row) as Pembayaran;
      return mapPembayaran(parsed);
    },
    enabled: !!id,
  });
}

