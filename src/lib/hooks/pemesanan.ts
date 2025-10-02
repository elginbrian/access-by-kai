import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapPemesananList, mapPemesanan } from "@/lib/mappers/pemesanan";
import { PemesananSchema } from "@/lib/validators/pemesanan";
import type { Pemesanan } from "@/types/models";

const supabase = createClient();
import { useUserRole } from "@/lib/auth/useRbac";

export function usePemesananListQuery() {
  return useQuery({
    queryKey: ["pemesanan", "list"],
    queryFn: async () => {
      const res = await supabase.from("pemesanan").select("*").order("waktu_pembuatan", { ascending: false });
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => PemesananSchema.parse(r) as Pemesanan);
      return mapPemesananList(parsed as Pemesanan[]);
    },
  });
}

export function usePemesananQuery(id: number | null) {
  return useQuery({
    queryKey: ["pemesanan", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("pemesanan").select("*").eq("pemesanan_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = PemesananSchema.parse(row) as Pemesanan;
      return mapPemesanan(parsed);
    },
    enabled: !!id,
  });
}

export function useCreatePemesanan(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      const parsed = PemesananSchema.parse(payload);
      const res = await supabase.from("pemesanan").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      return data as Pemesanan;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pemesanan"] });
      qc.invalidateQueries({ queryKey: ["pemesanan", "list"] });
    },
  });
}

export function useUpdatePemesanan(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      // allow only admin to update bookings generally; ownership checks could be added
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = PemesananSchema.parse(payload);
      const res = await supabase.from("pemesanan").update(parsed).eq("pemesanan_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      return data as Pemesanan;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pemesanan"] });
      qc.invalidateQueries({ queryKey: ["pemesanan", "list"] });
    },
  });
}

export function useDeletePemesanan(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("pemesanan").delete().eq("pemesanan_id", id);
      const { error } = res as any;
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pemesanan"] });
      qc.invalidateQueries({ queryKey: ["pemesanan", "list"] });
    },
  });
}

