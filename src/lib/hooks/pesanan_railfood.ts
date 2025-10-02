import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapPesananRailfood, mapPesananRailfoodList } from "@/lib/mappers/pesanan_railfood";
import { PesananRailfoodSchema } from "@/lib/validators/pesanan_railfood";
import type { PesananRailfood } from "@/types/models";

const supabase = createClient();
import { useUserRole } from "@/lib/auth/useRbac";

export function usePesananRailfoodByTiket(tiketId: number) {
  return useQuery({
    queryKey: ["pesanan_railfood", "byTiket", tiketId],
    queryFn: async () => {
      const res = await supabase.from("pesanan_railfood").select("*").eq("tiket_id", tiketId);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => PesananRailfoodSchema.parse(r) as PesananRailfood);
      return mapPesananRailfoodList(parsed as PesananRailfood[]);
    },
    enabled: !!tiketId,
  });
}

export function usePesananRailfood(id: number | null) {
  return useQuery({
    queryKey: ["pesanan_railfood", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("pesanan_railfood").select("*").eq("pesanan_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = PesananRailfoodSchema.parse(row) as PesananRailfood;
      return mapPesananRailfood(parsed);
    },
    enabled: !!id,
  });
}

export function useCreatePesananRailfood(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      const parsed = PesananRailfoodSchema.parse(payload);
      const res = await supabase.from("pesanan_railfood").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      return data as PesananRailfood;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pesanan_railfood"] }),
  });
}

export function useUpdatePesananRailfood(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = PesananRailfoodSchema.parse(payload);
      const res = await supabase.from("pesanan_railfood").update(parsed).eq("pesanan_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      return data as PesananRailfood;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pesanan_railfood"] }),
  });
}

export function useDeletePesananRailfood(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("pesanan_railfood").delete().eq("pesanan_id", id);
      const { error } = res as any;
      if (error) throw error;
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pesanan_railfood"] }),
  });
}

