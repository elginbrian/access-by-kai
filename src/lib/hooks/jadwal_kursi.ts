import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { JadwalKursi, NewJadwalKursi, UpdateJadwalKursi } from "@/types/models";
import { JadwalKursiParsed, JadwalKursiSchema } from "@/lib/validators/jadwal_kursi";
import { mapJadwalKursi, JadwalKursiUI } from "@/lib/mappers/jadwal_kursi";
import { useUserRole } from "@/lib/auth/useRbac";

const supabase = createClient();

export function useJadwalKursi() {
  return useQuery({
    queryKey: ["jadwal_kursi"],
    queryFn: async (): Promise<JadwalKursiUI[]> => {
      const { data, error } = await supabase.from("jadwal_kursi").select("*").order("jadwal_gerbong_id", { ascending: true });

      if (error) throw error;
      return data.map(mapJadwalKursi);
    },
  });
}

export function useJadwalKursiByGerbong(jadwalGerbongId: number) {
  return useQuery({
    queryKey: ["jadwal_kursi", "gerbong", jadwalGerbongId],
    queryFn: async (): Promise<JadwalKursiUI[]> => {
      const { data, error } = await supabase.from("jadwal_kursi").select("*").eq("jadwal_gerbong_id", jadwalGerbongId).order("kode_kursi", { ascending: true });

      if (error) throw error;
      return data.map(mapJadwalKursi);
    },
    enabled: !!jadwalGerbongId,
  });
}

export function useAvailableJadwalKursiByGerbong(jadwalGerbongId: number) {
  return useQuery({
    queryKey: ["jadwal_kursi", "available", "gerbong", jadwalGerbongId],
    queryFn: async (): Promise<JadwalKursiUI[]> => {
      const { data, error } = await supabase.from("jadwal_kursi").select("*").eq("jadwal_gerbong_id", jadwalGerbongId).eq("status_inventaris", "TERSEDIA").eq("is_blocked", false).order("kode_kursi", { ascending: true });

      if (error) throw error;
      return data.map(mapJadwalKursi);
    },
    enabled: !!jadwalGerbongId,
  });
}

// Get jadwal kursi by ID
export function useJadwalKursiById(jadwalKursiId: number) {
  return useQuery({
    queryKey: ["jadwal_kursi", jadwalKursiId],
    queryFn: async (): Promise<JadwalKursiUI | null> => {
      const { data, error } = await supabase.from("jadwal_kursi").select("*").eq("jadwal_kursi_id", jadwalKursiId).single();

      if (error) {
        if (error.code === "PGRST116") return null; // No rows found
        throw error;
      }
      return mapJadwalKursi(data);
    },
    enabled: !!jadwalKursiId,
  });
}

// Create jadwal kursi
export function useCreateJadwalKursi(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (jadwalKursi: JadwalKursiParsed): Promise<JadwalKursiUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const validatedJadwalKursi = JadwalKursiSchema.parse(jadwalKursi);

      const { data, error } = await supabase.from("jadwal_kursi").insert(validatedJadwalKursi).select().single();

      if (error) throw error;
      return mapJadwalKursi(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jadwal_kursi"] });
      queryClient.invalidateQueries({ queryKey: ["jadwal_gerbong"] }); // Related table
    },
  });
}

export function useUpdateJadwalKursi(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async ({ jadwalKursiId, updates }: { jadwalKursiId: number; updates: Partial<JadwalKursiParsed> }): Promise<JadwalKursiUI> => {
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const validatedUpdates = JadwalKursiSchema.partial().parse(updates);

      const { data, error } = await supabase.from("jadwal_kursi").update(validatedUpdates).eq("jadwal_kursi_id", jadwalKursiId).select().single();

      if (error) throw error;
      return mapJadwalKursi(data);
    },
    onSuccess: (_, { jadwalKursiId }) => {
      queryClient.invalidateQueries({ queryKey: ["jadwal_kursi"] });
      queryClient.invalidateQueries({ queryKey: ["jadwal_kursi", jadwalKursiId] });
    },
  });
}

// Update jadwal kursi status (for booking operations)
export function useUpdateJadwalKursiStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jadwalKursiId, status }: { jadwalKursiId: number; status: "TERSEDIA" | "DIKUNCI" | "DIPESAN" | "TERISI" }): Promise<JadwalKursiUI> => {
      const { data, error } = await supabase.from("jadwal_kursi").update({ status_inventaris: status }).eq("jadwal_kursi_id", jadwalKursiId).select().single();

      if (error) throw error;
      return mapJadwalKursi(data);
    },
    onSuccess: (_, { jadwalKursiId }) => {
      queryClient.invalidateQueries({ queryKey: ["jadwal_kursi"] });
      queryClient.invalidateQueries({ queryKey: ["jadwal_kursi", jadwalKursiId] });
    },
  });
}

// Delete jadwal kursi
export function useDeleteJadwalKursi(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (jadwalKursiId: number): Promise<void> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const { error } = await supabase.from("jadwal_kursi").delete().eq("jadwal_kursi_id", jadwalKursiId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jadwal_kursi"] });
      queryClient.invalidateQueries({ queryKey: ["tiket"] }); // Related table
    },
  });
}

// Toggle jadwal kursi blocked status
export function useToggleJadwalKursiBlocked(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (jadwalKursiId: number): Promise<JadwalKursiUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      // First get current blocked status
      const { data: currentData, error: fetchError } = await supabase.from("jadwal_kursi").select("is_blocked").eq("jadwal_kursi_id", jadwalKursiId).single();

      if (fetchError) throw fetchError;

      // Toggle blocked status
      const newBlockedStatus = !currentData.is_blocked;

      const { data, error } = await supabase.from("jadwal_kursi").update({ is_blocked: newBlockedStatus }).eq("jadwal_kursi_id", jadwalKursiId).select().single();

      if (error) throw error;
      return mapJadwalKursi(data);
    },
    onSuccess: (_, jadwalKursiId) => {
      queryClient.invalidateQueries({ queryKey: ["jadwal_kursi"] });
      queryClient.invalidateQueries({ queryKey: ["jadwal_kursi", jadwalKursiId] });
    },
  });
}
