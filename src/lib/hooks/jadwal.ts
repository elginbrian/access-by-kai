import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapJadwal, mapJadwalList } from "@/lib/mappers/jadwal";
import { JadwalSchema } from "@/lib/validators";
import type { Jadwal } from "@/types/models";
import { useUserRole } from "@/lib/auth/useRbac";

const supabase = createClient();

export function useJadwalList() {
  return useQuery({
    queryKey: ["jadwal", "list"],
    queryFn: async () => {
      const res = await supabase.from("jadwal").select("*").order("tanggal_keberangkatan", { ascending: false });
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => JadwalSchema.parse(r) as Jadwal);
      return mapJadwalList(parsed as Jadwal[]);
    },
  });
}

export function useJadwal(id: number | null) {
  return useQuery({
    queryKey: ["jadwal", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("jadwal").select("*").eq("jadwal_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = JadwalSchema.parse(row) as Jadwal;
      return mapJadwal(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateJadwal(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = JadwalSchema.parse(payload);
      const res = await supabase.from("jadwal").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["jadwal", "list"] });
      return data as Jadwal;
    },
  });
}

export function useUpdateJadwal(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = JadwalSchema.parse(payload);
      const res = await supabase.from("jadwal").update(parsed).eq("jadwal_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["jadwal", id] });
      qc.invalidateQueries({ queryKey: ["jadwal", "list"] });
      return data as Jadwal;
    },
  });
}

export function useDeleteJadwal(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("jadwal").delete().eq("jadwal_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["jadwal"] });
      return true;
    },
  });
}

