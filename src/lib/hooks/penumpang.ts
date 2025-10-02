import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapPenumpangList, mapPenumpang } from "@/lib/mappers/penumpang";
import { PenumpangSchema } from "@/lib/validators/penumpang";
import { useUserRole } from "@/lib/auth/useRbac";
import type { Penumpang } from "@/types/models";

const supabase = createClient();

export function usePenumpangList() {
  return useQuery({
    queryKey: ["penumpang", "list"],
    queryFn: async () => {
      const res = await supabase.from("penumpang").select("*");
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => PenumpangSchema.parse(r) as Penumpang);
      return mapPenumpangList(parsed as Penumpang[]);
    },
  });
}

export function usePenumpang(id: number | null) {
  return useQuery({
    queryKey: ["penumpang", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("penumpang").select("*").eq("penumpang_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = PenumpangSchema.parse(row) as Penumpang;
      return mapPenumpang(parsed);
    },
    enabled: !!id,
  });
}

export function useCreatePenumpang(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      // creating a passenger record is generally a user action
      const parsed = PenumpangSchema.parse(payload);
      const res = await supabase.from("penumpang").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      return data as Penumpang;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["penumpang"] }),
  });
}

export function useUpdatePenumpang(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = PenumpangSchema.parse(payload);
      const res = await supabase.from("penumpang").update(parsed).eq("penumpang_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      return data as Penumpang;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["penumpang"] }),
  });
}

export function useDeletePenumpang(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("penumpang").delete().eq("penumpang_id", id);
      const { error } = res as any;
      if (error) throw error;
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["penumpang"] }),
  });
}

