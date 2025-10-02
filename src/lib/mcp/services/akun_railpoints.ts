import { createClient } from "@/lib/supabase";
import { AkunRailpointsSchema } from "@/lib/validators/akun_railpoints";
import { mapAkunRailpointsList, mapAkunRailpoints } from "@/lib/mappers/akun_railpoints";
import type { AkunRailpoints } from "@/types/models";

const supabase = createClient();

export async function listAkunByUser(userId: number) {
  const res = await supabase.from("akun_railpoints").select("*").eq("user_id", userId);
  const { data: rows, error } = res as any;
  if (error) throw error;
  const parsed = rows.map((r: any) => AkunRailpointsSchema.parse(r) as AkunRailpoints);
  return mapAkunRailpointsList(parsed as AkunRailpoints[]);
}

export async function getAkun(id: number) {
  const res = await supabase.from("akun_railpoints").select("*").eq("akun_id", id).single();
  const { data: row, error } = res as any;
  if (error) throw error;
  const parsed = AkunRailpointsSchema.parse(row) as AkunRailpoints;
  return mapAkunRailpoints(parsed);
}

export async function createAkun(payload: any) {
  const parsed = AkunRailpointsSchema.parse(payload);
  const res = await supabase.from("akun_railpoints").insert(parsed).select().single();
  const { data, error } = res as any;
  if (error) throw error;
  return data as AkunRailpoints;
}
