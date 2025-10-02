import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapTransaksiRailpointsList, mapTransaksiRailpoints } from "@/lib/mappers/transaksi_railpoints";
import { TransaksiRailpointsSchema } from "@/lib/validators/transaksi_railpoints";
import { useUserRole } from "@/lib/auth/useRbac";
import type { TransaksiRailpoints } from "@/types/models";

const supabase = createClient();

export function useTransaksiByAkun(akunId: number) {
  return useQuery({
    queryKey: ["transaksi_railpoints", "byAkun", akunId],
    queryFn: async () => {
      const res = await supabase.from("transaksi_railpoints").select("*").eq("akun_id", akunId);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => TransaksiRailpointsSchema.parse(r) as TransaksiRailpoints);
      return mapTransaksiRailpointsList(parsed as TransaksiRailpoints[]);
    },
    enabled: !!akunId,
  });
}

export function useTransaksi(id: number | null) {
  return useQuery({
    queryKey: ["transaksi_railpoints", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("transaksi_railpoints").select("*").eq("transaksi_poin_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = TransaksiRailpointsSchema.parse(row) as TransaksiRailpoints;
      return mapTransaksiRailpoints(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateTransaksiRailpoints(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      const parsed = TransaksiRailpointsSchema.parse(payload);
      const res = await supabase.from("transaksi_railpoints").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["transaksi_railpoints", "byAkun", parsed.akun_id] });
      qc.invalidateQueries({ queryKey: ["akun_railpoints", "byUser", parsed.akun_id] });
      return data as TransaksiRailpoints;
    },
  });
}

export function useUpdateTransaksiRailpoints(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = TransaksiRailpointsSchema.parse(payload);
      const res = await supabase.from("transaksi_railpoints").update(parsed).eq("transaksi_poin_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["transaksi_railpoints", id] });
      return data as TransaksiRailpoints;
    },
  });
}

export function useDeleteTransaksiRailpoints(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("transaksi_railpoints").delete().eq("transaksi_poin_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["transaksi_railpoints"] });
      return true;
    },
  });
}
