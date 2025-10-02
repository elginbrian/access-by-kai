import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase";
import { mapLogPerpindahanKursi, type LogPerpindahanKursiMapper } from "../mappers/log_perpindahan_kursi";
import { LogPerpindahanKursiSchema, type LogPerpindahanKursiParsed } from "../validators/log_perpindahan_kursi";

const QUERY_KEYS = {
  logPerpindahanKursi: ["log_perpindahan_kursi"] as const,
  logPerpindahanKursiById: (id: number) => ["log_perpindahan_kursi", id] as const,
  logPerpindahanKursiByTiket: (tiketId: number) => ["log_perpindahan_kursi", "tiket", tiketId] as const,
  logPerpindahanKursiByPerpindahan: (perpindahanId: number) => ["log_perpindahan_kursi", "perpindahan", perpindahanId] as const,
};

export function useLogPerpindahanKursiList() {
  return useQuery({
    queryKey: QUERY_KEYS.logPerpindahanKursi,
    queryFn: async (): Promise<LogPerpindahanKursiMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("log_perpindahan_kursi").select("*").order("waktu_perpindahan", { ascending: false });

      if (error) throw error;
      return data.map(mapLogPerpindahanKursi);
    },
  });
}

export function useLogPerpindahanKursi(logId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.logPerpindahanKursiById(logId),
    queryFn: async (): Promise<LogPerpindahanKursiMapper | null> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("log_perpindahan_kursi").select("*").eq("log_id", logId).single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }
      return mapLogPerpindahanKursi(data);
    },
  });
}

export function useLogPerpindahanKursiByTiket(tiketId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.logPerpindahanKursiByTiket(tiketId),
    queryFn: async (): Promise<LogPerpindahanKursiMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("log_perpindahan_kursi").select("*").eq("tiket_id", tiketId).order("waktu_perpindahan", { ascending: false });

      if (error) throw error;
      return data.map(mapLogPerpindahanKursi);
    },
  });
}

export function useLogPerpindahanKursiByPerpindahan(perpindahanId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.logPerpindahanKursiByPerpindahan(perpindahanId),
    queryFn: async (): Promise<LogPerpindahanKursiMapper[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.from("log_perpindahan_kursi").select("*").eq("perpindahan_id", perpindahanId).order("waktu_perpindahan", { ascending: false });

      if (error) throw error;
      return data.map(mapLogPerpindahanKursi);
    },
  });
}

export function useCreateLogPerpindahanKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LogPerpindahanKursiParsed): Promise<LogPerpindahanKursiMapper> => {
      const validatedData = LogPerpindahanKursiSchema.parse(data);
      const supabase = createClient();

      const { data: result, error } = await supabase.from("log_perpindahan_kursi").insert(validatedData).select().single();

      if (error) throw error;
      return mapLogPerpindahanKursi(result);
    },
    onSuccess: (newLog) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logPerpindahanKursi });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.logPerpindahanKursiByTiket(newLog.tiket_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.logPerpindahanKursiByPerpindahan(newLog.perpindahan_id),
      });
    },
  });
}

export function useUpdateLogPerpindahanKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ logId, data }: { logId: number; data: Partial<LogPerpindahanKursiParsed> }): Promise<LogPerpindahanKursiMapper> => {
      const validatedData = LogPerpindahanKursiSchema.partial().parse(data);
      const supabase = createClient();

      const { data: result, error } = await supabase.from("log_perpindahan_kursi").update(validatedData).eq("log_id", logId).select().single();

      if (error) throw error;
      return mapLogPerpindahanKursi(result);
    },
    onSuccess: (updatedLog) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logPerpindahanKursi });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.logPerpindahanKursiById(updatedLog.log_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.logPerpindahanKursiByTiket(updatedLog.tiket_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.logPerpindahanKursiByPerpindahan(updatedLog.perpindahan_id),
      });
    },
  });
}

export function useDeleteLogPerpindahanKursi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logId: number): Promise<void> => {
      const supabase = createClient();

      const { error } = await supabase.from("log_perpindahan_kursi").delete().eq("log_id", logId);

      if (error) throw error;
    },
    onSuccess: (_, logId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logPerpindahanKursi });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.logPerpindahanKursiById(logId) });
    },
  });
}
