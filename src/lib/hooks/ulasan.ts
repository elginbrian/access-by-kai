import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapUlasan, mapUlasanList, type UlasanRow } from "@/lib/mappers/ulasan";
import { UlasanSchema, CreateUlasanSchema, UpdateUlasanSchema } from "@/lib/validators/ulasan";
import { useUserRole } from "@/lib/auth/useRbac";

const supabase = createClient();

// Query Keys
const QUERY_KEYS = {
  ulasan: ["ulasan"],
  ulasanById: (id: number) => ["ulasan", id],
  ulasanByUser: (userId: number) => ["ulasan", "user", userId],
  ulasanByService: (service: string) => ["ulasan", "service", service],
};

// List ulasan with filters
export function useUlasanList(filters?: { jenis_layanan?: string; penilaian?: number; platform?: string; limit?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ulasan, filters],
    queryFn: async () => {
      let query = supabase.from("ulasan").select("*").order("dibuat_pada", { ascending: false });

      if (filters?.jenis_layanan) {
        query = query.eq("jenis_layanan", filters.jenis_layanan);
      }
      if (filters?.penilaian) {
        query = query.eq("penilaian", filters.penilaian);
      }
      if (filters?.platform) {
        query = query.eq("platform", filters.platform);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      return mapUlasanList(data as UlasanRow[]);
    },
  });
}

// Get single ulasan by ID
export function useUlasan(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.ulasanById(id!),
    queryFn: async () => {
      if (id === null) return null;

      const { data, error } = await supabase.from("ulasan").select("*").eq("ulasan_id", id).single();

      if (error) throw error;
      return mapUlasan(data as UlasanRow);
    },
    enabled: !!id,
  });
}

// Get ulasan by user
export function useUlasanByUser(userId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.ulasanByUser(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from("ulasan").select("*").eq("pengguna_id", userId).order("dibuat_pada", { ascending: false });

      if (error) throw error;
      return mapUlasanList(data as UlasanRow[]);
    },
    enabled: !!userId,
  });
}

// Get ulasan by service type
export function useUlasanByService(jenisLayanan: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ulasanByService(jenisLayanan),
    queryFn: async () => {
      const { data, error } = await supabase.from("ulasan").select("*").eq("jenis_layanan", jenisLayanan).order("dibuat_pada", { ascending: false });

      if (error) throw error;
      return mapUlasanList(data as UlasanRow[]);
    },
    enabled: !!jenisLayanan,
  });
}

// Create ulasan
export function useCreateUlasan(currentUserId?: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const parsed = CreateUlasanSchema.parse(payload);

      const { data, error } = await supabase
        .from("ulasan")
        .insert({
          ...parsed,
          dibuat_pada: new Date().toISOString(),
          diperbarui_pada: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return mapUlasan(data as UlasanRow);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ulasan });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ulasanByUser(data.penggunaId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ulasanByService(data.jenisLayanan) });
    },
  });
}

// Update ulasan
export function useUpdateUlasan(currentUserId?: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const parsed = UpdateUlasanSchema.parse({ ulasan_id: id, ...payload });

      const { data, error } = await supabase
        .from("ulasan")
        .update({
          ...parsed,
          diperbarui_pada: new Date().toISOString(),
        })
        .eq("ulasan_id", id)
        .select()
        .single();

      if (error) throw error;
      return mapUlasan(data as UlasanRow);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ulasan });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ulasanById(data.id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ulasanByUser(data.penggunaId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ulasanByService(data.jenisLayanan) });
    },
  });
}

// Delete ulasan
export function useDeleteUlasan(currentUserId?: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("ulasan").delete().eq("ulasan_id", id);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate all ulasan queries
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ulasan });
    },
  });
}
