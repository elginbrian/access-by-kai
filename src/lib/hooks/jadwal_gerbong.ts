import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { JadwalGerbong, NewJadwalGerbong, UpdateJadwalGerbong } from "@/types/models";
import { JadwalGerbongParsed, JadwalGerbongSchema } from "@/lib/validators/jadwal_gerbong";
import { mapJadwalGerbong, JadwalGerbongUI } from "@/lib/mappers/jadwal_gerbong";
import { useUserRole } from "@/lib/auth/useRbac";

const supabase = createClient();

export function useJadwalGerbong() {
  return useQuery({
    queryKey: ["jadwal_gerbong"],
    queryFn: async (): Promise<JadwalGerbongUI[]> => {
      const { data, error } = await supabase.from("jadwal_gerbong").select("*").order("jadwal_id", { ascending: true });

      if (error) throw error;
      return data.map(mapJadwalGerbong);
    },
  });
}

export function useJadwalGerbongByJadwal(jadwalId: number) {
  return useQuery({
    queryKey: ["jadwal_gerbong", "jadwal", jadwalId],
    queryFn: async (): Promise<JadwalGerbongUI[]> => {
      const { data, error } = await supabase.from("jadwal_gerbong").select("*").eq("jadwal_id", jadwalId).order("nomor_gerbong_aktual", { ascending: true });

      if (error) throw error;
      return data.map(mapJadwalGerbong);
    },
    enabled: !!jadwalId,
  });
}

export function useJadwalGerbongById(jadwalGerbongId: number) {
  return useQuery({
    queryKey: ["jadwal_gerbong", jadwalGerbongId],
    queryFn: async (): Promise<JadwalGerbongUI | null> => {
      const { data, error } = await supabase.from("jadwal_gerbong").select("*").eq("jadwal_gerbong_id", jadwalGerbongId).single();

      if (error) {
        if (error.code === "PGRST116") return null; // No rows found
        throw error;
      }
      return mapJadwalGerbong(data);
    },
    enabled: !!jadwalGerbongId,
  });
}

// Create jadwal gerbong
export function useCreateJadwalGerbong(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (jadwalGerbong: JadwalGerbongParsed): Promise<JadwalGerbongUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const validatedJadwalGerbong = JadwalGerbongSchema.parse(jadwalGerbong);

      const { data, error } = await supabase.from("jadwal_gerbong").insert(validatedJadwalGerbong).select().single();

      if (error) throw error;
      return mapJadwalGerbong(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jadwal_gerbong"] });
      queryClient.invalidateQueries({ queryKey: ["jadwal"] }); // Related table
    },
  });
}

// Update jadwal gerbong
export function useUpdateJadwalGerbong(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async ({ jadwalGerbongId, updates }: { jadwalGerbongId: number; updates: Partial<JadwalGerbongParsed> }): Promise<JadwalGerbongUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const validatedUpdates = JadwalGerbongSchema.partial().parse(updates);

      const { data, error } = await supabase.from("jadwal_gerbong").update(validatedUpdates).eq("jadwal_gerbong_id", jadwalGerbongId).select().single();

      if (error) throw error;
      return mapJadwalGerbong(data);
    },
    onSuccess: (_, { jadwalGerbongId }) => {
      queryClient.invalidateQueries({ queryKey: ["jadwal_gerbong"] });
      queryClient.invalidateQueries({ queryKey: ["jadwal_gerbong", jadwalGerbongId] });
      queryClient.invalidateQueries({ queryKey: ["jadwal"] }); // Related table
    },
  });
}

// Delete jadwal gerbong
export function useDeleteJadwalGerbong(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (jadwalGerbongId: number): Promise<void> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const { error } = await supabase.from("jadwal_gerbong").delete().eq("jadwal_gerbong_id", jadwalGerbongId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jadwal_gerbong"] });
      queryClient.invalidateQueries({ queryKey: ["jadwal_kursi"] }); // Related table
    },
  });
}

// Toggle jadwal gerbong operational status
export function useToggleJadwalGerbongStatus(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (jadwalGerbongId: number): Promise<JadwalGerbongUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      // First get current status
      const { data: currentData, error: fetchError } = await supabase.from("jadwal_gerbong").select("status_operasional").eq("jadwal_gerbong_id", jadwalGerbongId).single();

      if (fetchError) throw fetchError;

      // Toggle status
      const newStatus = !currentData.status_operasional;

      const { data, error } = await supabase.from("jadwal_gerbong").update({ status_operasional: newStatus }).eq("jadwal_gerbong_id", jadwalGerbongId).select().single();

      if (error) throw error;
      return mapJadwalGerbong(data);
    },
    onSuccess: (_, jadwalGerbongId) => {
      queryClient.invalidateQueries({ queryKey: ["jadwal_gerbong"] });
      queryClient.invalidateQueries({ queryKey: ["jadwal_gerbong", jadwalGerbongId] });
    },
  });
}
