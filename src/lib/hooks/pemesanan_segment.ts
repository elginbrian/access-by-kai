import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapPemesananSegment, type PemesananSegmentMapper } from "@/lib/mappers/pemesanan_segment";
import { PemesananSegmentSchema, type PemesananSegmentParsed } from "@/lib/validators/pemesanan_segment";

const supabase = createClient();

// Query Keys
const QUERY_KEYS = {
  pemesananSegments: ["pemesanan_segments"] as const,
  pemesananSegmentById: (id: number) => ["pemesanan_segments", id] as const,
  pemesananSegmentsByBooking: (pemesananId: number) => ["pemesanan_segments", "booking", pemesananId] as const,
  pemesananSegmentsByJadwal: (jadwalId: number) => ["pemesanan_segments", "jadwal", jadwalId] as const,
};

// List all pemesanan segments
export function usePemesananSegmentList() {
  return useQuery({
    queryKey: QUERY_KEYS.pemesananSegments,
    queryFn: async (): Promise<PemesananSegmentMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("pemesanan_segment").select("*").order("urutan_segment", { ascending: true });

      if (error) throw error;
      return data.map(mapPemesananSegment);
    },
  });
}

// Get pemesanan segment by ID
export function usePemesananSegment(segmentId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.pemesananSegmentById(segmentId),
    queryFn: async (): Promise<PemesananSegmentMapper | null> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("pemesanan_segment").select("*").eq("segment_id", segmentId).single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }
      return mapPemesananSegment(data);
    },
  });
}

// Get segments by pemesanan ID
export function usePemesananSegmentsByBooking(pemesananId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.pemesananSegmentsByBooking(pemesananId),
    queryFn: async (): Promise<PemesananSegmentMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("pemesanan_segment").select("*").eq("pemesanan_id", pemesananId).order("urutan_segment", { ascending: true });

      if (error) throw error;
      return data.map(mapPemesananSegment);
    },
  });
}

// Get segments by jadwal ID
export function usePemesananSegmentsByJadwal(jadwalId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.pemesananSegmentsByJadwal(jadwalId),
    queryFn: async (): Promise<PemesananSegmentMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("pemesanan_segment").select("*").eq("jadwal_id", jadwalId).order("urutan_segment", { ascending: true });

      if (error) throw error;
      return data.map(mapPemesananSegment);
    },
  });
}

// Create pemesanan segment
export function useCreatePemesananSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PemesananSegmentParsed): Promise<PemesananSegmentMapper> => {
      const validatedData = PemesananSegmentSchema.parse(data);
      const supabase = createClient();

      const { data: result, error } = await supabase.from("pemesanan_segment").insert(validatedData).select().single();

      if (error) throw error;
      return mapPemesananSegment(result);
    },
    onSuccess: (newSegment) => {
      // Invalidate and refetch segments list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pemesananSegments });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.pemesananSegmentsByBooking(newSegment.pemesanan_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.pemesananSegmentsByJadwal(newSegment.jadwal_id),
      });
    },
  });
}

// Update pemesanan segment
export function useUpdatePemesananSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ segmentId, data }: { segmentId: number; data: Partial<PemesananSegmentParsed> }): Promise<PemesananSegmentMapper> => {
      const validatedData = PemesananSegmentSchema.partial().parse(data);
      const supabase = createClient();

      const { data: result, error } = await supabase.from("pemesanan_segment").update(validatedData).eq("segment_id", segmentId).select().single();

      if (error) throw error;
      return mapPemesananSegment(result);
    },
    onSuccess: (updatedSegment) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pemesananSegments });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.pemesananSegmentById(updatedSegment.segment_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.pemesananSegmentsByBooking(updatedSegment.pemesanan_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.pemesananSegmentsByJadwal(updatedSegment.jadwal_id),
      });
    },
  });
}

// Delete pemesanan segment
export function useDeletePemesananSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (segmentId: number): Promise<void> => {
      const supabase = createClient();

      const { error } = await supabase.from("pemesanan_segment").delete().eq("segment_id", segmentId);

      if (error) throw error;
    },
    onSuccess: (_, segmentId) => {
      // Invalidate and refetch segments
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pemesananSegments });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.pemesananSegmentById(segmentId) });
    },
  });
}
