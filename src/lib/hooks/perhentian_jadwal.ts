import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapPerhentianJadwalList, mapPerhentianJadwal } from "@/lib/mappers/perhentian_jadwal";
import { PerhentianJadwalSchema } from "@/lib/validators/perhentian_jadwal";
import { useUserRole } from "@/lib/auth/useRbac";
import type { PerhentianJadwal } from "@/types/models";

const supabase = createClient();

export function usePerhentianByJadwal(jadwalId: number) {
  return useQuery({
    queryKey: ["perhentian_jadwal", "byJadwal", jadwalId],
    queryFn: async () => {
      const res = await supabase.from("perhentian_jadwal").select("*").eq("jadwal_id", jadwalId);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => PerhentianJadwalSchema.parse(r) as PerhentianJadwal);
      return mapPerhentianJadwalList(parsed as PerhentianJadwal[]);
    },
    enabled: !!jadwalId,
  });
}

export function useCreatePerhentianJadwal(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = PerhentianJadwalSchema.parse(payload);
      const res = await supabase.from("perhentian_jadwal").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["perhentian_jadwal", "byJadwal", parsed.jadwal_id] });
      return data as PerhentianJadwal;
    },
  });
}

export function useUpdatePerhentianJadwal(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = PerhentianJadwalSchema.parse(payload);
      const res = await supabase.from("perhentian_jadwal").update(parsed).eq("perhentian_jadwal_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["perhentian_jadwal", id] });
      qc.invalidateQueries({ queryKey: ["perhentian_jadwal", "byJadwal", parsed.jadwal_id] });
      return data as PerhentianJadwal;
    },
  });
}

export function useDeletePerhentianJadwal(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("perhentian_jadwal").delete().eq("perhentian_jadwal_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["perhentian_jadwal"] });
      return true;
    },
  });
}

export function usePerhentian(id: number | null) {
  return useQuery({
    queryKey: ["perhentian_jadwal", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("perhentian_jadwal").select("*").eq("perhentian_jadwal_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = PerhentianJadwalSchema.parse(row) as PerhentianJadwal;
      return mapPerhentianJadwal(parsed);
    },
    enabled: !!id,
  });
}

