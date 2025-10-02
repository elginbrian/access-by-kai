import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapGerbongKeretaList, mapGerbongKereta } from "@/lib/mappers/gerbong_kereta";
import { GerbongKeretaSchema } from "@/lib/validators/gerbong_kereta";
import { useUserRole } from "@/lib/auth/useRbac";
import type { MasterGerbong } from "@/types/models";

const supabase = createClient();

export function useGerbongListByKereta(keretaId: number) {
  return useQuery({
    queryKey: ["gerbong", "byKereta", keretaId],
    queryFn: async () => {
      const res = await supabase.from("master_gerbong").select("*").eq("master_kereta_id", keretaId);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => GerbongKeretaSchema.parse(r) as MasterGerbong);
      return mapGerbongKeretaList(parsed as MasterGerbong[]);
    },
    enabled: !!keretaId,
  });
}

export function useGerbong(id: number | null) {
  return useQuery({
    queryKey: ["gerbong", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("master_gerbong").select("*").eq("master_gerbong_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = GerbongKeretaSchema.parse(row) as MasterGerbong;
      return mapGerbongKereta(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateGerbong(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = GerbongKeretaSchema.parse(payload);
      const res = await supabase.from("master_gerbong").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["gerbong", "byKereta", parsed.master_kereta_id] });
      return data as MasterGerbong;
    },
  });
}

export function useUpdateGerbong(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = GerbongKeretaSchema.parse(payload);
      const res = await supabase.from("master_gerbong").update(parsed).eq("master_gerbong_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["gerbong", id] });
      qc.invalidateQueries({ queryKey: ["gerbong", "byKereta", parsed.master_kereta_id] });
      return data as MasterGerbong;
    },
  });
}

export function useDeleteGerbong(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("master_gerbong").delete().eq("master_gerbong_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["gerbong"] });
      return true;
    },
  });
}
