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

export function useJadwalKursiByGerbong(jadwalId: number, nomorGerbong: number) {
  return useQuery({
    queryKey: ["template_kursi", "jadwal", jadwalId, "gerbong", nomorGerbong],
    queryFn: async (): Promise<JadwalKursiUI[]> => {
      const { data: jadwalData, error: jadwalError } = await supabase.from("jadwal").select("master_kereta_id").eq("jadwal_id", jadwalId).single();

      if (jadwalError) throw jadwalError;

      const { data: gerbongData, error: gerbongError } = await supabase.from("master_gerbong").select("master_gerbong_id").eq("master_kereta_id", jadwalData.master_kereta_id).eq("nomor_gerbong", nomorGerbong).single();

      if (gerbongError) throw gerbongError;

      const { data, error } = await supabase.from("template_kursi").select("*").eq("master_gerbong_id", gerbongData.master_gerbong_id).order("kode_kursi", { ascending: true });

      if (error) throw error;

      return data.map(
        (kursi: any): JadwalKursiUI => ({
          jadwalKursiId: kursi.template_kursi_id,
          jadwalGerbongId: 0,
          templateKursiId: kursi.template_kursi_id,
          kodeKursi: kursi.kode_kursi,
          statusInventaris: "TERSEDIA",
          statusLabel: "Tersedia",
          hargaKursi: 0,
          multiplierKursi: kursi.is_premium ? 1.5 : 1.0,
          isBlocked: false,
          statusBlocked: "Aktif",
          keterangan: null,
          hargaFinal: 0,
          posisi: kursi.posisi,
          isPremium: kursi.is_premium || false,
          isDifabel: kursi.is_difabel || false,
          koordinatX: kursi.koordinat_x,
          koordinatY: kursi.koordinat_y,
          fasilitasKursi: kursi.fasilitas_kursi,
        })
      );
    },
    enabled: !!jadwalId && !!nomorGerbong,
  });
}

export function useAvailableJadwalKursiByGerbong(jadwalId: number, nomorGerbong: number) {
  return useQuery({
    queryKey: ["template_kursi", "available", "jadwal", jadwalId, "gerbong", nomorGerbong],
    queryFn: async (): Promise<JadwalKursiUI[]> => {
      const { data: jadwalData, error: jadwalError } = await supabase.from("jadwal").select("master_kereta_id").eq("jadwal_id", jadwalId).single();

      if (jadwalError) throw jadwalError;

      const { data: gerbongData, error: gerbongError } = await supabase.from("master_gerbong").select("master_gerbong_id").eq("master_kereta_id", jadwalData.master_kereta_id).eq("nomor_gerbong", nomorGerbong).single();

      if (gerbongError) throw gerbongError;

      const { data, error } = await supabase.from("template_kursi").select("*").eq("master_gerbong_id", gerbongData.master_gerbong_id).order("kode_kursi", { ascending: true });

      if (error) throw error;

      return data.map(
        (kursi: any): JadwalKursiUI => ({
          jadwalKursiId: kursi.template_kursi_id,
          jadwalGerbongId: 0,
          templateKursiId: kursi.template_kursi_id,
          kodeKursi: kursi.kode_kursi,
          statusInventaris: "TERSEDIA",
          statusLabel: "Tersedia",
          hargaKursi: 0,
          multiplierKursi: kursi.is_premium ? 1.5 : 1.0,
          isBlocked: false,
          statusBlocked: "Aktif",
          keterangan: null,
          hargaFinal: 0,
          posisi: kursi.posisi,
          isPremium: kursi.is_premium || false,
          isDifabel: kursi.is_difabel || false,
          koordinatX: kursi.koordinat_x,
          koordinatY: kursi.koordinat_y,
          fasilitasKursi: kursi.fasilitas_kursi,
        })
      );
    },
    enabled: !!jadwalId && !!nomorGerbong,
  });
}

export function useJadwalKursiById(jadwalKursiId: number) {
  return useQuery({
    queryKey: ["jadwal_kursi", jadwalKursiId],
    queryFn: async (): Promise<JadwalKursiUI | null> => {
      const { data, error } = await supabase.from("jadwal_kursi").select("*").eq("jadwal_kursi_id", jadwalKursiId).single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return mapJadwalKursi(data);
    },
    enabled: !!jadwalKursiId,
  });
}

export function useCreateJadwalKursi(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (jadwalKursi: JadwalKursiParsed): Promise<JadwalKursiUI> => {
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

export function useDeleteJadwalKursi(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (jadwalKursiId: number): Promise<void> => {
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

export function useToggleJadwalKursiBlocked(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (jadwalKursiId: number): Promise<JadwalKursiUI> => {
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const { data: currentData, error: fetchError } = await supabase.from("jadwal_kursi").select("is_blocked").eq("jadwal_kursi_id", jadwalKursiId).single();

      if (fetchError) throw fetchError;

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
