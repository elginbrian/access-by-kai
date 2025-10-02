import { createClient } from "@/lib/supabase";
import { GerbongKeretaSchema } from "@/lib/validators/gerbong_kereta";
import { mapGerbongKereta } from "@/lib/mappers/gerbong_kereta";
import type { MasterGerbong } from "@/types/models";

const supabase = createClient();

export async function listMasterGerbong() {
  const { data: rows, error } = await supabase.from("master_gerbong").select("*").order("master_gerbong_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => GerbongKeretaSchema.parse(r) as MasterGerbong);
  return parsed.map(mapGerbongKereta);
}

export async function getMasterGerbong(id: number) {
  const { data: row, error } = await supabase.from("master_gerbong").select("*").eq("master_gerbong_id", id).single();
  if (error) throw error;
  const parsed = GerbongKeretaSchema.parse(row) as MasterGerbong;
  return mapGerbongKereta(parsed);
}

export async function listMasterGerbongByKereta(keretaId: number) {
  const { data: rows, error } = await supabase.from("master_gerbong").select("*").eq("master_kereta_id", keretaId).order("nomor_gerbong");
  if (error) throw error;
  const parsed = rows.map((r: any) => GerbongKeretaSchema.parse(r) as MasterGerbong);
  return parsed.map(mapGerbongKereta);
}

export async function listMasterGerbongByTipeLayanan(tipeLayanan: string) {
  const { data: rows, error } = await supabase.from("master_gerbong").select("*").eq("jenis_layanan", tipeLayanan).order("master_gerbong_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => GerbongKeretaSchema.parse(r) as MasterGerbong);
  return parsed.map(mapGerbongKereta);
}
