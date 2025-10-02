import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapTiketList, mapTiket } from "@/lib/mappers/tiket";
import { TiketSchema } from "@/lib/validators/tiket";
import { useUserRole } from "@/lib/auth/useRbac";
import type { Tiket } from "@/types/models";

const supabase = createClient();

export function useTiketsBySegment(segmentId: number) {
  return useQuery({
    queryKey: ["tiket", "bySegment", segmentId],
    queryFn: async () => {
      const res = await supabase.from("tiket").select("*").eq("segment_id", segmentId);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => TiketSchema.parse(r) as Tiket);
      return mapTiketList(parsed as Tiket[]);
    },
    enabled: !!segmentId,
  });
}

export function useTiketQuery(id: number | null) {
  return useQuery({
    queryKey: ["tiket", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("tiket").select("*").eq("tiket_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = TiketSchema.parse(row) as Tiket;
      return mapTiket(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateTiket(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = TiketSchema.parse(payload);
      const res = await supabase.from("tiket").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["tiket", "bySegment", parsed.segment_id] });
      return data as Tiket;
    },
  });
}

export function useUpdateTiket(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = TiketSchema.parse(payload);
      const res = await supabase.from("tiket").update(parsed).eq("tiket_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["tiket", id] });
      qc.invalidateQueries({ queryKey: ["tiket", "bySegment", parsed.segment_id] });
      return data as Tiket;
    },
  });
}

export function useDeleteTiket(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("tiket").delete().eq("tiket_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["tiket"] });
      return true;
    },
  });
}
