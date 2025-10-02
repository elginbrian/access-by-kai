import { createClient } from "@/lib/supabase";
import { JadwalGerbongSchema } from "@/lib/validators/jadwal_gerbong";
import { mapJadwalGerbong } from "@/lib/mappers/jadwal_gerbong";
import type { JadwalGerbong } from "@/types/models";

const supabase = createClient();

export async function listJadwalGerbong() {
  const { data: rows, error } = await supabase.from("jadwal_gerbong").select("*").order("jadwal_id", { ascending: true });
  if (error) throw error;
  const parsed = rows.map((r: any) => JadwalGerbongSchema.parse(r) as JadwalGerbong);
  return parsed.map(mapJadwalGerbong);
}

export async function getJadwalGerbong(id: number) {
  const { data: row, error } = await supabase.from("jadwal_gerbong").select("*").eq("jadwal_gerbong_id", id).single();
  if (error) throw error;
  const parsed = JadwalGerbongSchema.parse(row) as JadwalGerbong;
  return mapJadwalGerbong(parsed);
}

export async function listJadwalGerbongByJadwal(jadwalId: number) {
  const { data: rows, error } = await supabase.from("jadwal_gerbong").select("*").eq("jadwal_id", jadwalId).order("nomor_gerbong_aktual");
  if (error) throw error;
  const parsed = rows.map((r: any) => JadwalGerbongSchema.parse(r) as JadwalGerbong);
  return parsed.map(mapJadwalGerbong);
}

export async function listOperationalJadwalGerbongByJadwal(jadwalId: number) {
  const { data: rows, error } = await supabase.from("jadwal_gerbong").select("*").eq("jadwal_id", jadwalId).eq("status_operasional", true).order("nomor_gerbong_aktual");
  if (error) throw error;
  const parsed = rows.map((r: any) => JadwalGerbongSchema.parse(r) as JadwalGerbong);
  return parsed.map(mapJadwalGerbong);
}
