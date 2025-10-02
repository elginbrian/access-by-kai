import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapAkunRailpointsList, mapAkunRailpoints } from "@/lib/mappers/akun_railpoints";
import { AkunRailpointsSchema } from "@/lib/validators/akun_railpoints";
import { useUserRole } from "@/lib/auth/useRbac";
import type { AkunRailpoints } from "@/types/models";

const supabase = createClient();

export function useAkunRailpointsByUser(userId: number) {
  return useQuery({
    queryKey: ["akun_railpoints", "byUser", userId],
    queryFn: async () => {
      const res = await supabase.from("akun_railpoints").select("*").eq("user_id", userId);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => AkunRailpointsSchema.parse(r) as AkunRailpoints);
      return mapAkunRailpointsList(parsed as AkunRailpoints[]);
    },
    enabled: !!userId,
  });
}

export function useAkunRailpoints(id: number | null) {
  return useQuery({
    queryKey: ["akun_railpoints", id],
    queryFn: async () => {
      if (id === null) return null;
      const res = await supabase.from("akun_railpoints").select("*").eq("akun_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = AkunRailpointsSchema.parse(row) as AkunRailpoints;
      return mapAkunRailpoints(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateAkunRailpoints(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      // users may create their own railpoints accounts
      const parsed = AkunRailpointsSchema.parse(payload);
      const res = await supabase.from("akun_railpoints").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["akun_railpoints", "byUser", parsed.user_id] });
      return data as AkunRailpoints;
    },
  });
}

export function useUpdateAkunRailpoints(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = AkunRailpointsSchema.parse(payload);
      const res = await supabase.from("akun_railpoints").update(parsed).eq("akun_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["akun_railpoints", id] });
      qc.invalidateQueries({ queryKey: ["akun_railpoints", "byUser", parsed.user_id] });
      return data as AkunRailpoints;
    },
  });
}

export function useDeleteAkunRailpoints(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("akun_railpoints").delete().eq("akun_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["akun_railpoints"] });
      return true;
    },
  });
}

