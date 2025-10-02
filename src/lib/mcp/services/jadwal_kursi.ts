import { createClient } from "@/lib/supabase";
import { JadwalKursiSchema } from "@/lib/validators/jadwal_kursi";
import { mapJadwalKursi } from "@/lib/mappers/jadwal_kursi";
import type { JadwalKursi } from "@/types/models";

const supabase = createClient();

export async function listJadwalKursi() {
  const { data: rows, error } = await supabase.from("jadwal_kursi").select("*").order("jadwal_kursi_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => JadwalKursiSchema.parse(r) as JadwalKursi);
  return parsed.map(mapJadwalKursi);
}

export async function getJadwalKursi(id: number) {
  const { data: row, error } = await supabase.from("jadwal_kursi").select("*").eq("jadwal_kursi_id", id).single();
  if (error) throw error;
  const parsed = JadwalKursiSchema.parse(row) as JadwalKursi;
  return mapJadwalKursi(parsed);
}

export async function listJadwalKursiByGerbong(jadwalGerbongId: number) {
  const { data: rows, error } = await supabase.from("jadwal_kursi").select("*").eq("jadwal_gerbong_id", jadwalGerbongId).order("kode_kursi");
  if (error) throw error;
  const parsed = rows.map((r: any) => JadwalKursiSchema.parse(r) as JadwalKursi);
  return parsed.map(mapJadwalKursi);
}

export async function listAvailableJadwalKursiByGerbong(jadwalGerbongId: number) {
  const { data: rows, error } = await supabase.from("jadwal_kursi").select("*").eq("jadwal_gerbong_id", jadwalGerbongId).eq("status_inventaris", "TERSEDIA").eq("is_blocked", false).order("kode_kursi");
  if (error) throw error;
  const parsed = rows.map((r: any) => JadwalKursiSchema.parse(r) as JadwalKursi);
  return parsed.map(mapJadwalKursi);
}
