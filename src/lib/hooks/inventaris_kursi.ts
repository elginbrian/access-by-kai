import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase";
import { mapInventarisKursi, type InventarisKursiMapper } from "../mappers/inventaris_kursi";
import { InventarisKursiSchema, type InventarisKursiParsed } from "../validators/inventaris_kursi";

// Query Keys
const QUERY_KEYS = {
  templateKursi: ["template_kursi"] as const,
  templateKursiById: (id: number) => ["template_kursi", id] as const,
  templateKursiByGerbong: (gerbongId: number) => ["template_kursi", "gerbong", gerbongId] as const,
  templateKursiByPosition: (posisi: string) => ["template_kursi", "posisi", posisi] as const,
};

// List template kursi
export function useInventarisKursiList() {
  return useQuery({
    queryKey: QUERY_KEYS.templateKursi,
    queryFn: async (): Promise<InventarisKursiMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("template_kursi").select("*").order("kode_kursi", { ascending: true });

      if (error) throw error;
      return data.map(mapInventarisKursi);
    },
  });
}

export function useInventarisKursi(templateKursiId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.templateKursiById(templateKursiId),
    queryFn: async (): Promise<InventarisKursiMapper | null> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("template_kursi").select("*").eq("template_kursi_id", templateKursiId).single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return mapInventarisKursi(data);
    },
  });
}

export function useInventarisKursiByGerbong(masterGerbongId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.templateKursiByGerbong(masterGerbongId),
    queryFn: async (): Promise<InventarisKursiMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("template_kursi").select("*").eq("master_gerbong_id", masterGerbongId).order("kode_kursi", { ascending: true });

      if (error) throw error;
      return data.map(mapInventarisKursi);
    },
  });
}

export function useCreateInventarisKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InventarisKursiParsed): Promise<InventarisKursiMapper> => {
      const validatedData = InventarisKursiSchema.parse(data);
      const supabase = createClient();

      const { data: result, error } = await supabase.from("template_kursi").insert(validatedData).select().single();

      if (error) throw error;
      return mapInventarisKursi(result);
    },
    onSuccess: (newKursi) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.templateKursi });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.templateKursiByGerbong(newKursi.master_gerbong_id),
      });
    },
  });
}

// Update template kursi
export function useUpdateInventarisKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateKursiId, data }: { templateKursiId: number; data: Partial<InventarisKursiParsed> }): Promise<InventarisKursiMapper> => {
      const validatedData = InventarisKursiSchema.partial().parse(data);
      const supabase = createClient();

      const { data: result, error } = await supabase.from("template_kursi").update(validatedData).eq("template_kursi_id", templateKursiId).select().single();

      if (error) throw error;
      return mapInventarisKursi(result);
    },
    onSuccess: (updatedKursi) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.templateKursi });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.templateKursiById(updatedKursi.template_kursi_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.templateKursiByGerbong(updatedKursi.master_gerbong_id),
      });
    },
  });
}

// Delete template kursi
export function useDeleteInventarisKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateKursiId: number): Promise<void> => {
      const supabase = createClient();

      const { error } = await supabase.from("template_kursi").delete().eq("template_kursi_id", templateKursiId);

      if (error) throw error;
    },
    onSuccess: (_, templateKursiId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.templateKursi });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.templateKursiById(templateKursiId) });
    },
  });
}
