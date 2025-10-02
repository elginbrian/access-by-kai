import { createClient } from "@/lib/supabase";
import { ConnectingRoutesSchema } from "@/lib/validators/connecting_routes";
import { mapConnectingRoutes } from "@/lib/mappers/connecting_routes";
import type { ConnectingRoutes } from "@/types/models";

const supabase = createClient();

export async function listConnectingRoutes() {
  const { data: rows, error } = await supabase.from("connecting_routes").select("*").order("from_rute_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => ConnectingRoutesSchema.parse(r) as ConnectingRoutes);
  return parsed.map(mapConnectingRoutes);
}

export async function getConnectingRoutes(id: number) {
  const { data: row, error } = await supabase.from("connecting_routes").select("*").eq("connecting_route_id", id).single();
  if (error) throw error;
  const parsed = ConnectingRoutesSchema.parse(row) as ConnectingRoutes;
  return mapConnectingRoutes(parsed);
}

export async function listConnectingRoutesByFromRute(fromRuteId: number) {
  const { data: rows, error } = await supabase.from("connecting_routes").select("*").eq("from_rute_id", fromRuteId).eq("is_active", true).order("to_rute_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => ConnectingRoutesSchema.parse(r) as ConnectingRoutes);
  return parsed.map(mapConnectingRoutes);
}

export async function listConnectingRoutesByToRute(toRuteId: number) {
  const { data: rows, error } = await supabase.from("connecting_routes").select("*").eq("to_rute_id", toRuteId).eq("is_active", true).order("from_rute_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => ConnectingRoutesSchema.parse(r) as ConnectingRoutes);
  return parsed.map(mapConnectingRoutes);
}
