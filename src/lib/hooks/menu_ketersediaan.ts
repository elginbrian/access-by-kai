import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { MenuKetersediaan, NewMenuKetersediaan, UpdateMenuKetersediaan } from "@/types/models";
import { MenuKetersediaanParsed, MenuKetersediaanSchema } from "@/lib/validators/menu_ketersediaan";
import { mapMenuKetersediaan, MenuKetersediaanUI } from "@/lib/mappers/menu_ketersediaan";
import { useUserRole } from "@/lib/auth/useRbac";

const supabase = createClient();

// Get all menu ketersediaan
export function useMenuKetersediaan() {
  return useQuery({
    queryKey: ["menu_ketersediaan"],
    queryFn: async (): Promise<MenuKetersediaanUI[]> => {
      const { data, error } = await supabase.from("menu_ketersediaan").select("*").order("menu_id", { ascending: true });

      if (error) throw error;
      return data.map(mapMenuKetersediaan);
    },
  });
}

// Get active menu ketersediaan only
export function useActiveMenuKetersediaan() {
  return useQuery({
    queryKey: ["menu_ketersediaan", "active"],
    queryFn: async (): Promise<MenuKetersediaanUI[]> => {
      const { data, error } = await supabase.from("menu_ketersediaan").select("*").eq("is_active", true).gt("stok_tersedia", 0).order("menu_id", { ascending: true });

      if (error) throw error;
      return data.map(mapMenuKetersediaan);
    },
  });
}

// Get menu ketersediaan by menu ID
export function useMenuKetersediaanByMenu(menuId: number) {
  return useQuery({
    queryKey: ["menu_ketersediaan", "menu", menuId],
    queryFn: async (): Promise<MenuKetersediaanUI[]> => {
      const { data, error } = await supabase.from("menu_ketersediaan").select("*").eq("menu_id", menuId).order("ketersediaan_id", { ascending: true });

      if (error) throw error;
      return data.map(mapMenuKetersediaan);
    },
    enabled: !!menuId,
  });
}

// Get menu ketersediaan by jadwal ID
export function useMenuKetersediaanByJadwal(jadwalId: number) {
  return useQuery({
    queryKey: ["menu_ketersediaan", "jadwal", jadwalId],
    queryFn: async (): Promise<MenuKetersediaanUI[]> => {
      const { data, error } = await supabase.from("menu_ketersediaan").select("*").or(`jadwal_id.eq.${jadwalId},jadwal_id.is.null`).eq("is_active", true).gt("stok_tersedia", 0).order("menu_id", { ascending: true });

      if (error) throw error;
      return data.map(mapMenuKetersediaan);
    },
    enabled: !!jadwalId,
  });
}

// Get menu ketersediaan by rute ID
export function useMenuKetersediaanByRute(ruteId: number) {
  return useQuery({
    queryKey: ["menu_ketersediaan", "rute", ruteId],
    queryFn: async (): Promise<MenuKetersediaanUI[]> => {
      const { data, error } = await supabase.from("menu_ketersediaan").select("*").or(`rute_id.eq.${ruteId},rute_id.is.null`).eq("is_active", true).gt("stok_tersedia", 0).order("menu_id", { ascending: true });

      if (error) throw error;
      return data.map(mapMenuKetersediaan);
    },
    enabled: !!ruteId,
  });
}

// Get menu ketersediaan by ID
export function useMenuKetersediaanById(ketersediaanId: number) {
  return useQuery({
    queryKey: ["menu_ketersediaan", ketersediaanId],
    queryFn: async (): Promise<MenuKetersediaanUI | null> => {
      const { data, error } = await supabase.from("menu_ketersediaan").select("*").eq("ketersediaan_id", ketersediaanId).single();

      if (error) {
        if (error.code === "PGRST116") return null; // No rows found
        throw error;
      }
      return mapMenuKetersediaan(data);
    },
    enabled: !!ketersediaanId,
  });
}

// Create menu ketersediaan
export function useCreateMenuKetersediaan(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (menuKetersediaan: MenuKetersediaanParsed): Promise<MenuKetersediaanUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const validatedMenuKetersediaan = MenuKetersediaanSchema.parse(menuKetersediaan);

      const { data, error } = await supabase.from("menu_ketersediaan").insert(validatedMenuKetersediaan).select().single();

      if (error) throw error;
      return mapMenuKetersediaan(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu_ketersediaan"] });
      queryClient.invalidateQueries({ queryKey: ["menu_railfood"] }); // Related table
    },
  });
}

// Update menu ketersediaan
export function useUpdateMenuKetersediaan(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async ({ ketersediaanId, updates }: { ketersediaanId: number; updates: Partial<MenuKetersediaanParsed> }): Promise<MenuKetersediaanUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const validatedUpdates = MenuKetersediaanSchema.partial().parse(updates);

      const { data, error } = await supabase.from("menu_ketersediaan").update(validatedUpdates).eq("ketersediaan_id", ketersediaanId).select().single();

      if (error) throw error;
      return mapMenuKetersediaan(data);
    },
    onSuccess: (_, { ketersediaanId }) => {
      queryClient.invalidateQueries({ queryKey: ["menu_ketersediaan"] });
      queryClient.invalidateQueries({ queryKey: ["menu_ketersediaan", ketersediaanId] });
    },
  });
}

// Update stock
export function useUpdateMenuStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ketersediaanId, newStock }: { ketersediaanId: number; newStock: number }): Promise<MenuKetersediaanUI> => {
      const { data, error } = await supabase.from("menu_ketersediaan").update({ stok_tersedia: newStock }).eq("ketersediaan_id", ketersediaanId).select().single();

      if (error) throw error;
      return mapMenuKetersediaan(data);
    },
    onSuccess: (_, { ketersediaanId }) => {
      queryClient.invalidateQueries({ queryKey: ["menu_ketersediaan"] });
      queryClient.invalidateQueries({ queryKey: ["menu_ketersediaan", ketersediaanId] });
    },
  });
}

// Delete menu ketersediaan
export function useDeleteMenuKetersediaan(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (ketersediaanId: number): Promise<void> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const { error } = await supabase.from("menu_ketersediaan").delete().eq("ketersediaan_id", ketersediaanId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu_ketersediaan"] });
    },
  });
}

// Toggle menu ketersediaan status
export function useToggleMenuKetersediaanStatus(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (ketersediaanId: number): Promise<MenuKetersediaanUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      // First get current status
      const { data: currentData, error: fetchError } = await supabase.from("menu_ketersediaan").select("is_active").eq("ketersediaan_id", ketersediaanId).single();

      if (fetchError) throw fetchError;

      // Toggle status
      const newStatus = !currentData.is_active;

      const { data, error } = await supabase.from("menu_ketersediaan").update({ is_active: newStatus }).eq("ketersediaan_id", ketersediaanId).select().single();

      if (error) throw error;
      return mapMenuKetersediaan(data);
    },
    onSuccess: (_, ketersediaanId) => {
      queryClient.invalidateQueries({ queryKey: ["menu_ketersediaan"] });
      queryClient.invalidateQueries({ queryKey: ["menu_ketersediaan", ketersediaanId] });
    },
  });
}
