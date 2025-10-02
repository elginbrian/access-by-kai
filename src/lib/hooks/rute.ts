import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapRute, mapRuteList } from "@/lib/mappers/rute";
import { RuteSchema } from "@/lib/validators/rute";
import { useUserRole } from "@/lib/auth/useRbac";
import type { Rute } from "@/types/models";

const supabase = createClient();

export function useRuteList() {
  return useQuery({
    queryKey: ["rute", "list"],
    queryFn: async () => {
      const res = await supabase.from("rute").select("*");
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => RuteSchema.parse(r) as Rute);
      return mapRuteList(parsed as Rute[]);
    },
  });
}

export function useRute(id: number | null) {
  return useQuery({
    queryKey: ["rute", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("rute").select("*").eq("rute_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = RuteSchema.parse(row) as Rute;
      return mapRute(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateRute(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = RuteSchema.parse(payload);
      const res = await supabase.from("rute").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["rute", "list"] });
      return data as Rute;
    },
  });
}

export function useUpdateRute(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = RuteSchema.parse(payload);
      const res = await supabase.from("rute").update(parsed).eq("rute_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["rute", id] });
      qc.invalidateQueries({ queryKey: ["rute", "list"] });
      return data as Rute;
    },
  });
}

export function useDeleteRute(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("rute").delete().eq("rute_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["rute"] });
      return true;
    },
  });
}

