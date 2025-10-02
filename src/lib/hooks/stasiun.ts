import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapStasiun, mapStasiunList } from "@/lib/mappers/stasiun";
import { StasiunSchema } from "@/lib/validators";
import type { Stasiun } from "@/types/models";
import { useUserRole } from "@/lib/auth/useRbac";

const supabase = createClient();

export function useStasiunList() {
  return useQuery({
    queryKey: ["stasiun", "list"],
    queryFn: async () => {
      const res = await supabase.from("stasiun").select("*");
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => StasiunSchema.parse(r) as Stasiun);
      return mapStasiunList(parsed as Stasiun[]);
    },
  });
}

export function useStasiun(id: number | null) {
  return useQuery({
    queryKey: ["stasiun", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("stasiun").select("*").eq("stasiun_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = StasiunSchema.parse(row) as Stasiun;
      return mapStasiun(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateStasiun(currentUserId?: number) {
  const qc = useQueryClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = StasiunSchema.parse(payload);
      const res = await supabase.from("stasiun").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["stasiun", "list"] });
      return data as Stasiun;
    },
  });
}

export function useUpdateStasiun(currentUserId?: number) {
  const qc = useQueryClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = StasiunSchema.parse(payload);
      const res = await supabase.from("stasiun").update(parsed).eq("stasiun_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["stasiun", id] });
      qc.invalidateQueries({ queryKey: ["stasiun", "list"] });
      return data as Stasiun;
    },
  });
}

export function useDeleteStasiun(currentUserId?: number) {
  const qc = useQueryClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("stasiun").delete().eq("stasiun_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["stasiun", "list"] });
      qc.invalidateQueries({ queryKey: ["stasiun", id] });
      return true;
    },
  });
}

