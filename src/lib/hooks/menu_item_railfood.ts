import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapMenuItemRailfoodList, mapMenuItemRailfood } from "@/lib/mappers/menu_item_railfood";
import { MenuItemRailfoodSchema } from "@/lib/validators/menu_item_railfood";
import { useUserRole } from "@/lib/auth/useRbac";
import type { MenuRailfood } from "@/types/models";

const supabase = createClient();

export function useMenuItemRailfoodList() {
  return useQuery({
    queryKey: ["menu_item_railfood", "list"],
    queryFn: async () => {
      const res = await supabase.from("menu_railfood").select("*");
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => MenuItemRailfoodSchema.parse(r) as MenuRailfood);
      return mapMenuItemRailfoodList(parsed as MenuRailfood[]);
    },
  });
}

export function useMenuItemRailfood(id: number | null) {
  return useQuery({
    queryKey: ["menu_item_railfood", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("menu_railfood").select("*").eq("menu_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = MenuItemRailfoodSchema.parse(row) as MenuRailfood;
      return mapMenuItemRailfood(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateMenuItemRailfood(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = MenuItemRailfoodSchema.parse(payload);
      const res = await supabase.from("menu_railfood").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["menu_item_railfood", "list"] });
      return data as MenuRailfood;
    },
  });
}

export function useUpdateMenuItemRailfood(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = MenuItemRailfoodSchema.parse(payload);
      const res = await supabase.from("menu_railfood").update(parsed).eq("menu_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["menu_item_railfood", id] });
      qc.invalidateQueries({ queryKey: ["menu_item_railfood", "list"] });
      return data as MenuRailfood;
    },
  });
}

export function useDeleteMenuItemRailfood(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("menu_railfood").delete().eq("menu_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["menu_item_railfood"] });
      return true;
    },
  });
}
