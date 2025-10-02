import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapPesananRailfoodItemsList, mapPesananRailfoodItems } from "@/lib/mappers/pesanan_railfood_items";
import { PesananRailfoodItemsSchema } from "@/lib/validators/pesanan_railfood_items";
import { useUserRole } from "@/lib/auth/useRbac";
import type { PesananRailfoodDetail } from "@/types/models";

const supabase = createClient();

export function usePesananRailfoodItemsByPesanan(pesananId: number) {
  return useQuery({
    queryKey: ["pesanan_railfood_items", "byPesanan", pesananId],
    queryFn: async () => {
      const res = await supabase.from("pesanan_railfood_detail").select("*").eq("pesanan_railfood_id", pesananId);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => PesananRailfoodItemsSchema.parse(r) as PesananRailfoodDetail);
      return mapPesananRailfoodItemsList(parsed as PesananRailfoodDetail[]);
    },
    enabled: !!pesananId,
  });
}

export function usePesananRailfoodItem(menuItemId: number | null, pesananId: number | null) {
  return useQuery({
    queryKey: ["pesanan_railfood_items", menuItemId, pesananId],
    queryFn: async () => {
      if (menuItemId === null || pesananId === null) return null;
      const res = await supabase.from("pesanan_railfood_detail").select("*").match({ menu_id: menuItemId, pesanan_railfood_id: pesananId }).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = PesananRailfoodItemsSchema.parse(row) as PesananRailfoodDetail;
      return mapPesananRailfoodItems(parsed);
    },
    enabled: !!menuItemId && !!pesananId,
  });
}

export function useCreatePesananRailfoodItem(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      const parsed = PesananRailfoodItemsSchema.parse(payload);
      const res = await supabase.from("pesanan_railfood_detail").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["pesanan_railfood_items", "byPesanan", parsed.pesanan_railfood_id] });
      return data as PesananRailfoodDetail;
    },
  });
}

export function useUpdatePesananRailfoodItem(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ menuItemId, pesananId, payload }: { menuItemId: number; pesananId: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = PesananRailfoodItemsSchema.parse(payload);
      const res = await supabase.from("pesanan_railfood_detail").update(parsed).match({ menu_id: menuItemId, pesanan_railfood_id: pesananId }).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["pesanan_railfood_items", "byPesanan", pesananId] });
      return data as PesananRailfoodDetail;
    },
  });
}

export function useDeletePesananRailfoodItem(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ menuItemId, pesananId }: { menuItemId: number; pesananId: number }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("pesanan_railfood_detail").delete().match({ menu_id: menuItemId, pesanan_railfood_id: pesananId });
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["pesanan_railfood_items", "byPesanan", pesananId] });
      return true;
    },
  });
}
