import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapKeretaList, mapKereta } from "@/lib/mappers/kereta";
import { KeretaSchema } from "@/lib/validators/kereta";
import type { MasterKereta } from "@/types/models";

const supabase = createClient();
import { useUserRole } from "@/lib/auth/useRbac";

export function useKeretaList() {
  return useQuery({
    queryKey: ["kereta", "list"],
    queryFn: async () => {
      const res = await supabase.from("master_kereta").select("*");
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => KeretaSchema.parse(r) as MasterKereta);
      return mapKeretaList(parsed as MasterKereta[]);
    },
  });
}

export function useKereta(id: number | null) {
  return useQuery({
    queryKey: ["kereta", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("master_kereta").select("*").eq("master_kereta_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = KeretaSchema.parse(row) as MasterKereta;
      return mapKereta(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateKereta(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = KeretaSchema.parse(payload);
      const res = await supabase.from("master_kereta").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["kereta", "list"] });
      return data as MasterKereta;
    },
  });
}

export function useUpdateKereta(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = KeretaSchema.parse(payload);
      const res = await supabase.from("master_kereta").update(parsed).eq("master_kereta_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["kereta", id] });
      qc.invalidateQueries({ queryKey: ["kereta", "list"] });
      return data as MasterKereta;
    },
  });
}

export function useDeleteKereta(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("master_kereta").delete().eq("master_kereta_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["kereta"] });
      return true;
    },
  });
}
