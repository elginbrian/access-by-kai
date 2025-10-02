import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapKursiList, mapKursi } from "@/lib/mappers/kursi";
import { KursiSchema } from "@/lib/validators/kursi";
import { useUserRole } from "@/lib/auth/useRbac";
import type { JadwalKursi } from "@/types/models";

const supabase = createClient();

export function useKursiListByGerbong(gerbongId: number) {
  return useQuery({
    queryKey: ["kursi", "byGerbong", gerbongId],
    queryFn: async () => {
      const res = await supabase.from("jadwal_kursi").select("*").eq("jadwal_gerbong_id", gerbongId);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => KursiSchema.parse(r) as JadwalKursi);
      return mapKursiList(parsed as JadwalKursi[]);
    },
    enabled: !!gerbongId,
  });
}

export function useKursi(id: number | null) {
  return useQuery({
    queryKey: ["kursi", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("jadwal_kursi").select("*").eq("jadwal_kursi_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = KursiSchema.parse(row) as JadwalKursi;
      return mapKursi(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateKursi(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = KursiSchema.parse(payload);
      const res = await supabase.from("jadwal_kursi").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["kursi", "byGerbong", parsed.jadwal_gerbong_id] });
      return data as JadwalKursi;
    },
  });
}

export function useUpdateKursi(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = KursiSchema.parse(payload);
      const res = await supabase.from("jadwal_kursi").update(parsed).eq("jadwal_kursi_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["kursi", id] });
      qc.invalidateQueries({ queryKey: ["kursi", "byGerbong", parsed.jadwal_gerbong_id] });
      return data as JadwalKursi;
    },
  });
}

export function useDeleteKursi(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("jadwal_kursi").delete().eq("jadwal_kursi_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["kursi"] });
      return true;
    },
  });
}
