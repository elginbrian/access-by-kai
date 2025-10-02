import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapPengguna } from "@/lib/mappers/pengguna";
import { PenggunaSchema } from "@/lib/validators";
import type { Pengguna } from "@/types/models";
import { useUserRole } from "@/lib/auth/useRbac";

const supabase = createClient();

export function usePenggunaQuery(id: number | null) {
  return useQuery({
    queryKey: ["pengguna", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("pengguna").select("*").eq("user_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = PenggunaSchema.parse(row) as Pengguna;
      return mapPengguna(parsed);
    },
    enabled: !!id,
  });
}

// Users are normally created via auth; expose update/delete which the app may perform
export function useUpdatePengguna() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const parsed = PenggunaSchema.parse(payload);
      const res = await supabase.from("pengguna").update(parsed).eq("user_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      return data as Pengguna;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["pengguna", variables.id] });
      qc.invalidateQueries({ queryKey: ["pengguna"] });
    },
  });
}

export function useDeletePengguna(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      // allow user to delete own account, or admin to delete any
      if (role.data !== "admin" && currentUserId !== id) throw new Error("forbidden: not allowed to delete this user");
      const res = await supabase.from("pengguna").delete().eq("user_id", id);
      const { error } = res as any;
      if (error) throw error;
      return true;
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["pengguna", id] });
      qc.invalidateQueries({ queryKey: ["pengguna"] });
    },
  });
}

