import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapConnectingRoutesList, mapConnectingRoutes } from "@/lib/mappers/connecting_routes";
import { ConnectingRoutesSchema } from "@/lib/validators/connecting_routes";
import { useUserRole } from "@/lib/auth/useRbac";
import type { ConnectingRoutes } from "@/types/models";

const supabase = createClient();

export function useConnectingRoutesList() {
  return useQuery({
    queryKey: ["connecting_routes", "list"],
    queryFn: async () => {
      const res = await supabase.from("connecting_routes").select("*");
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => ConnectingRoutesSchema.parse(r) as ConnectingRoutes);
      return mapConnectingRoutesList(parsed as ConnectingRoutes[]);
    },
  });
}

export function useConnectingRoutesByRute(ruteId: number) {
  return useQuery({
    queryKey: ["connecting_routes", "byRute", ruteId],
    queryFn: async () => {
      const res = await supabase.from("connecting_routes").select("*").or(`rute_utama_id.eq.${ruteId},rute_lanjutan_id.eq.${ruteId}`);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => ConnectingRoutesSchema.parse(r) as ConnectingRoutes);
      return mapConnectingRoutesList(parsed as ConnectingRoutes[]);
    },
    enabled: !!ruteId,
  });
}

export function useConnectingRoutes(id: number) {
  return useQuery({
    queryKey: ["connecting_routes", id],
    queryFn: async () => {
      const res = await supabase.from("connecting_routes").select("*").eq("connecting_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = ConnectingRoutesSchema.parse(row) as ConnectingRoutes;
      return mapConnectingRoutes(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateConnectingRoutes(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = ConnectingRoutesSchema.parse(payload);
      const res = await supabase.from("connecting_routes").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["connecting_routes", "list"] });
      qc.invalidateQueries({ queryKey: ["connecting_routes", "byRute", parsed.rute_utama_id] });
      qc.invalidateQueries({ queryKey: ["connecting_routes", "byRute", parsed.rute_lanjutan_id] });
      return data as ConnectingRoutes;
    },
  });
}

export function useUpdateConnectingRoutes(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = ConnectingRoutesSchema.parse(payload);
      const res = await supabase.from("connecting_routes").update(parsed).eq("connecting_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["connecting_routes", id] });
      qc.invalidateQueries({ queryKey: ["connecting_routes", "list"] });
      qc.invalidateQueries({ queryKey: ["connecting_routes", "byRute", parsed.rute_utama_id] });
      qc.invalidateQueries({ queryKey: ["connecting_routes", "byRute", parsed.rute_lanjutan_id] });
      return data as ConnectingRoutes;
    },
  });
}

export function useDeleteConnectingRoutes(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("connecting_routes").delete().eq("connecting_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["connecting_routes"] });
    },
  });
}
