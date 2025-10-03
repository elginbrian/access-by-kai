import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { UlasanSchema } from "@/lib/validators/ulasan";
import { mapUlasan, mapUlasanList } from "@/lib/mappers/ulasan";
import type { UlasanRow } from "@/lib/mappers/ulasan";

const supabase = createClient();

export function useUlasanList() {
  return useQuery({
    queryKey: ["ulasan"],
    queryFn: async () => {
      const res = await supabase.from("ulasan").select("*").order("dibuat_pada", { ascending: false });
      const { data, error } = res as any;
      if (error) throw error;
      if (!Array.isArray(data)) return [];
      return mapUlasanList(data as UlasanRow[]);
    },
  });
}

export function useUlasanQuery(id: number | null) {
  return useQuery({
    queryKey: ["ulasan", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("ulasan").select("*").eq("ulasan_id", id).single();
      const { data, error } = res as any;
      if (error) throw error;
      return mapUlasan(data as UlasanRow);
    },
    enabled: !!id,
  });
}

export function useCreateUlasan() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const parsed = UlasanSchema.parse(payload);
      const res = await supabase.from("ulasan").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      return mapUlasan(data as UlasanRow);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ulasan"] });
    },
  });
}

export function useUpdateUlasan() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const parsed = UlasanSchema.parse(payload);
      const res = await supabase.from("ulasan").update(parsed).eq("ulasan_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      return mapUlasan(data as UlasanRow);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["ulasan", variables.id] });
      qc.invalidateQueries({ queryKey: ["ulasan"] });
    },
  });
}

export function useDeleteUlasan() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await supabase.from("ulasan").delete().eq("ulasan_id", id);
      const { error } = res as any;
      if (error) throw error;
      return true;
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["ulasan", id] });
      qc.invalidateQueries({ queryKey: ["ulasan"] });
    },
  });
}
