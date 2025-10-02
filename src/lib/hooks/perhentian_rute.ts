import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapPerhentianRuteList, mapPerhentianRute } from "@/lib/mappers/perhentian_rute";
import { PerhentianRuteSchema } from "@/lib/validators/perhentian_rute";
import { useUserRole } from "@/lib/auth/useRbac";
import type { PerhentianRute } from "@/types/models";

const supabase = createClient();

export function usePerhentianRuteListByRute(ruteId: number) {
  return useQuery({
    queryKey: ["perhentian_rute", "byRute", ruteId],
    queryFn: async () => {
      const res = await supabase.from("perhentian_rute").select("*").eq("rute_id", ruteId).order("urutan");
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => PerhentianRuteSchema.parse(r) as PerhentianRute);
      return mapPerhentianRuteList(parsed as PerhentianRute[]);
    },
    enabled: !!ruteId,
  });
}

export function useCreatePerhentianRute(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = PerhentianRuteSchema.parse(payload);
      const res = await supabase.from("perhentian_rute").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["perhentian_rute", "byRute", parsed.rute_id] });
      return data as PerhentianRute;
    },
  });
}

export function useUpdatePerhentianRute(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = PerhentianRuteSchema.parse(payload);
      const res = await supabase.from("perhentian_rute").update(parsed).eq("perhentian_rute_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["perhentian_rute", id] });
      qc.invalidateQueries({ queryKey: ["perhentian_rute", "byRute", parsed.rute_id] });
      return data as PerhentianRute;
    },
  });
}

export function useDeletePerhentianRute(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("perhentian_rute").delete().eq("perhentian_rute_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["perhentian_rute"] });
      return true;
    },
  });
}

export function usePerhentianRute(id: number | null) {
  return useQuery({
    queryKey: ["perhentian_rute", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("perhentian_rute").select("*").eq("perhentian_rute_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = PerhentianRuteSchema.parse(row) as PerhentianRute;
      return mapPerhentianRute(parsed);
    },
    enabled: !!id,
  });
}

