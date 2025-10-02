import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapMenuItemRailfoodList } from "@/lib/mappers/menu_item_railfood";
import { MenuItemRailfoodSchema } from "@/lib/validators/menu_item_railfood";
import type { MenuRailfood } from "@/types/models";

const supabase = createClient();

export function useMenuByCategory(kategori?: string) {
  return useQuery({
    queryKey: ["menu_railfood", "category", kategori],
    queryFn: async () => {
      let query = supabase.from("menu_railfood").select("*").eq("is_available", true);

      if (kategori) {
        query = query.eq("kategori", kategori);
      }

      const res = await query;
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => MenuItemRailfoodSchema.parse(r) as MenuRailfood);
      return mapMenuItemRailfoodList(parsed as MenuRailfood[]);
    },
  });
}

export function useMenuCategories() {
  return useQuery({
    queryKey: ["menu_railfood", "categories"],
    queryFn: async () => {
      const res = await supabase.from("menu_railfood").select("kategori").eq("is_available", true);

      const { data: rows, error } = res as any;
      if (error) throw error;

      // Get unique categories
      const categories = [...new Set(rows.map((r: any) => r.kategori))].filter(Boolean);
      return categories as string[];
    },
  });
}
