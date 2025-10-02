import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase";
import { mapPermintaanPerpindahanKursi, type PermintaanPerpindahanKursiMapper } from "../mappers/permintaan_perpindahan_kursi";
import { PermintaanPerpindahanKursiSchema, type PermintaanPerpindahanKursiParsed } from "../validators/permintaan_perpindahan_kursi";

// Query Keys
const QUERY_KEYS = {
  permintaanPerpindahanKursi: ["permintaan_perpindahan_kursi"] as const,
  permintaanPerpindahanKursiById: (id: number) => ["permintaan_perpindahan_kursi", id] as const,
  permintaanPerpindahanKursiByUser: (userId: number) => ["permintaan_perpindahan_kursi", "user", userId] as const,
  permintaanPerpindahanKursiByStatus: (status: string) => ["permintaan_perpindahan_kursi", "status", status] as const,
  permintaanPerpindahanKursiByTiket: (tiketId: number) => ["permintaan_perpindahan_kursi", "tiket", tiketId] as const,
};

// List all permintaan perpindahan kursi
export function usePermintaanPerpindahanKursiList() {
  return useQuery({
    queryKey: QUERY_KEYS.permintaanPerpindahanKursi,
    queryFn: async (): Promise<PermintaanPerpindahanKursiMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("permintaan_perpindahan_kursi").select("*").order("waktu_permintaan", { ascending: false });

      if (error) throw error;
      return data.map(mapPermintaanPerpindahanKursi);
    },
  });
}

// Get permintaan perpindahan kursi by ID
export function usePermintaanPerpindahanKursi(perpindahanId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.permintaanPerpindahanKursiById(perpindahanId),
    queryFn: async (): Promise<PermintaanPerpindahanKursiMapper | null> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("permintaan_perpindahan_kursi").select("*").eq("perpindahan_id", perpindahanId).single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }
      return mapPermintaanPerpindahanKursi(data);
    },
  });
}

// Get permintaan perpindahan kursi by user
export function usePermintaanPerpindahanKursiByUser(userId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.permintaanPerpindahanKursiByUser(userId),
    queryFn: async (): Promise<PermintaanPerpindahanKursiMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("permintaan_perpindahan_kursi").select("*").eq("pemohon_user_id", userId).order("waktu_permintaan", { ascending: false });

      if (error) throw error;
      return data.map(mapPermintaanPerpindahanKursi);
    },
  });
}

// Get permintaan perpindahan kursi by status
export function usePermintaanPerpindahanKursiByStatus(status: "MENUNGGU_PERSETUJUAN" | "DISETUJUI" | "DITOLAK" | "DIBATALKAN") {
  return useQuery({
    queryKey: QUERY_KEYS.permintaanPerpindahanKursiByStatus(status),
    queryFn: async (): Promise<PermintaanPerpindahanKursiMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("permintaan_perpindahan_kursi").select("*").eq("status_perpindahan", status).order("waktu_permintaan", { ascending: false });

      if (error) throw error;
      return data.map(mapPermintaanPerpindahanKursi);
    },
  });
}

// Get permintaan perpindahan kursi by tiket
export function usePermintaanPerpindahanKursiByTiket(tiketId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.permintaanPerpindahanKursiByTiket(tiketId),
    queryFn: async (): Promise<PermintaanPerpindahanKursiMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("permintaan_perpindahan_kursi").select("*").or(`tiket_asal_id.eq.${tiketId},tiket_tujuan_id.eq.${tiketId}`).order("waktu_permintaan", { ascending: false });

      if (error) throw error;
      return data.map(mapPermintaanPerpindahanKursi);
    },
  });
}

// Create permintaan perpindahan kursi
export function useCreatePermintaanPerpindahanKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PermintaanPerpindahanKursiParsed): Promise<PermintaanPerpindahanKursiMapper> => {
      const validatedData = PermintaanPerpindahanKursiSchema.parse(data);
      const supabase = createClient();

      const { data: result, error } = await supabase.from("permintaan_perpindahan_kursi").insert(validatedData).select().single();

      if (error) throw error;
      return mapPermintaanPerpindahanKursi(result);
    },
    onSuccess: (newPermintaan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.permintaanPerpindahanKursi });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiByUser(newPermintaan.pemohon_user_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiByTiket(newPermintaan.tiket_asal_id),
      });
      if (newPermintaan.status_perpindahan) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.permintaanPerpindahanKursiByStatus(newPermintaan.status_perpindahan),
        });
      }
    },
  });
}

// Update permintaan perpindahan kursi (for approval workflow)
export function useUpdatePermintaanPerpindahanKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ perpindahanId, data }: { perpindahanId: number; data: Partial<PermintaanPerpindahanKursiParsed> }): Promise<PermintaanPerpindahanKursiMapper> => {
      const validatedData = PermintaanPerpindahanKursiSchema.partial().parse(data);
      const supabase = createClient();

      const { data: result, error } = await supabase.from("permintaan_perpindahan_kursi").update(validatedData).eq("perpindahan_id", perpindahanId).select().single();

      if (error) throw error;
      return mapPermintaanPerpindahanKursi(result);
    },
    onSuccess: (updatedPermintaan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.permintaanPerpindahanKursi });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiById(updatedPermintaan.perpindahan_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiByUser(updatedPermintaan.pemohon_user_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiByTiket(updatedPermintaan.tiket_asal_id),
      });
      if (updatedPermintaan.status_perpindahan) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.permintaanPerpindahanKursiByStatus(updatedPermintaan.status_perpindahan),
        });
      }
    },
  });
}

// Approve permintaan perpindahan kursi
export function useApprovePermintaanPerpindahanKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ perpindahanId, diprosesOleh, keteranganAdmin, biayaPerpindahan }: { perpindahanId: number; diprosesOleh: number; keteranganAdmin?: string; biayaPerpindahan?: number }): Promise<PermintaanPerpindahanKursiMapper> => {
      const supabase = createClient();

      const { data: result, error } = await supabase
        .from("permintaan_perpindahan_kursi")
        .update({
          status_perpindahan: "DISETUJUI",
          diproses_oleh: diprosesOleh,
          keterangan_admin: keteranganAdmin || null,
          biaya_perpindahan: biayaPerpindahan || null,
          waktu_diproses: new Date().toISOString(),
        })
        .eq("perpindahan_id", perpindahanId)
        .select()
        .single();

      if (error) throw error;
      return mapPermintaanPerpindahanKursi(result);
    },
    onSuccess: (approvedPermintaan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.permintaanPerpindahanKursi });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiById(approvedPermintaan.perpindahan_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiByStatus("MENUNGGU_PERSETUJUAN"),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiByStatus("DISETUJUI"),
      });
    },
  });
}

// Reject permintaan perpindahan kursi
export function useRejectPermintaanPerpindahanKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ perpindahanId, diprosesOleh, keteranganAdmin }: { perpindahanId: number; diprosesOleh: number; keteranganAdmin: string }): Promise<PermintaanPerpindahanKursiMapper> => {
      const supabase = createClient();

      const { data: result, error } = await supabase
        .from("permintaan_perpindahan_kursi")
        .update({
          status_perpindahan: "DITOLAK",
          diproses_oleh: diprosesOleh,
          keterangan_admin: keteranganAdmin,
          waktu_diproses: new Date().toISOString(),
        })
        .eq("perpindahan_id", perpindahanId)
        .select()
        .single();

      if (error) throw error;
      return mapPermintaanPerpindahanKursi(result);
    },
    onSuccess: (rejectedPermintaan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.permintaanPerpindahanKursi });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiById(rejectedPermintaan.perpindahan_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiByStatus("MENUNGGU_PERSETUJUAN"),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permintaanPerpindahanKursiByStatus("DITOLAK"),
      });
    },
  });
}

// Delete permintaan perpindahan kursi
export function useDeletePermintaanPerpindahanKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (perpindahanId: number): Promise<void> => {
      const supabase = createClient();

      const { error } = await supabase.from("permintaan_perpindahan_kursi").delete().eq("perpindahan_id", perpindahanId);

      if (error) throw error;
    },
    onSuccess: (_, perpindahanId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.permintaanPerpindahanKursi });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.permintaanPerpindahanKursiById(perpindahanId) });
    },
  });
}
