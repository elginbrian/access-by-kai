import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase";
import { mapPembatalan, type PembatalanMapper } from "../mappers/pembatalan";
import { PembatalanSchema, type PembatalanParsed } from "../validators/pembatalan";

// Query Keys
const QUERY_KEYS = {
  pembatalanTiket: ["pembatalan_tiket"] as const,
  pembatalanById: (id: number) => ["pembatalan_tiket", id] as const,
  pembatalanByTiket: (tiketId: number) => ["pembatalan_tiket", "tiket", tiketId] as const,
  pembatalanByUser: (userId: number) => ["pembatalan_tiket", "user", userId] as const,
  pembatalanByStatus: (status: string) => ["pembatalan_tiket", "status", status] as const,
};

// List all pembatalan tiket
export function usePembatalanList() {
  return useQuery({
    queryKey: QUERY_KEYS.pembatalanTiket,
    queryFn: async (): Promise<PembatalanMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("pembatalan_tiket").select("*").order("waktu_pengajuan", { ascending: false });

      if (error) throw error;
      return data.map(mapPembatalan);
    },
  });
}

// Get pembatalan by ID
export function usePembatalan(pembatalanId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.pembatalanById(pembatalanId),
    queryFn: async (): Promise<PembatalanMapper | null> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("pembatalan_tiket").select("*").eq("pembatalan_id", pembatalanId).single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }
      return mapPembatalan(data);
    },
  });
}

// Get pembatalan by tiket ID
export function usePembatalanByTiket(tiketId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.pembatalanByTiket(tiketId),
    queryFn: async (): Promise<PembatalanMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("pembatalan_tiket").select("*").eq("tiket_id", tiketId).order("waktu_pengajuan", { ascending: false });

      if (error) throw error;
      return data.map(mapPembatalan);
    },
  });
}

// Get pembatalan by user (pemohon)
export function usePembatalanByUser(userId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.pembatalanByUser(userId),
    queryFn: async (): Promise<PembatalanMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("pembatalan_tiket").select("*").eq("pemohon_user_id", userId).order("waktu_pengajuan", { ascending: false });

      if (error) throw error;
      return data.map(mapPembatalan);
    },
  });
}

// Get pembatalan by status
export function usePembatalanByStatus(status: "MENUNGGU_PROSES" | "DIPROSES" | "SELESAI") {
  return useQuery({
    queryKey: QUERY_KEYS.pembatalanByStatus(status),
    queryFn: async (): Promise<PembatalanMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("pembatalan_tiket").select("*").eq("status_refund", status).order("waktu_pengajuan", { ascending: false });

      if (error) throw error;
      return data.map(mapPembatalan);
    },
  });
}

// Create pembatalan
export function useCreatePembatalan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PembatalanParsed): Promise<PembatalanMapper> => {
      const validatedData = PembatalanSchema.parse(data);
      const supabase = createClient();

      const { data: result, error } = await supabase.from("pembatalan_tiket").insert(validatedData).select().single();

      if (error) throw error;
      return mapPembatalan(result);
    },
    onSuccess: (newPembatalan) => {
      // Invalidate and refetch pembatalan lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pembatalanTiket });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.pembatalanByTiket(newPembatalan.tiket_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.pembatalanByUser(newPembatalan.pemohon_user_id),
      });
    },
  });
}

// Update pembatalan
export function useUpdatePembatalan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pembatalanId, data }: { pembatalanId: number; data: Partial<PembatalanParsed> }): Promise<PembatalanMapper> => {
      const validatedData = PembatalanSchema.partial().parse(data);
      const supabase = createClient();

      const { data: result, error } = await supabase.from("pembatalan_tiket").update(validatedData).eq("pembatalan_id", pembatalanId).select().single();

      if (error) throw error;
      return mapPembatalan(result);
    },
    onSuccess: (updatedPembatalan) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pembatalanTiket });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.pembatalanById(updatedPembatalan.pembatalan_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.pembatalanByTiket(updatedPembatalan.tiket_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.pembatalanByUser(updatedPembatalan.pemohon_user_id),
      });
    },
  });
}

// Delete pembatalan
export function useDeletePembatalan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pembatalanId: number): Promise<void> => {
      const supabase = createClient();

      const { error } = await supabase.from("pembatalan_tiket").delete().eq("pembatalan_id", pembatalanId);

      if (error) throw error;
    },
    onSuccess: (_, pembatalanId) => {
      // Invalidate and refetch pembatalan
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pembatalanTiket });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.pembatalanById(pembatalanId) });
    },
  });
}
