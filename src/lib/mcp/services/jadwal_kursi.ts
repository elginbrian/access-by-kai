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

export async function listAvailableTemplateKursiByGerbong(jadwalId: number, nomorGerbong: number) {
  // Get master_kereta_id from jadwal
  const { data: jadwalData, error: jadwalError } = await supabase.from("jadwal").select("master_kereta_id").eq("jadwal_id", jadwalId).single();

  if (jadwalError) throw jadwalError;

  // Get master_gerbong_id from master_gerbong
  const { data: gerbongData, error: gerbongError } = await supabase.from("master_gerbong").select("master_gerbong_id").eq("master_kereta_id", jadwalData.master_kereta_id).eq("nomor_gerbong", nomorGerbong).single();

  if (gerbongError) throw gerbongError;

  // Get all template_kursi for this gerbong (available seats)
  const { data: rows, error } = await supabase.from("template_kursi").select("*").eq("master_gerbong_id", gerbongData.master_gerbong_id).order("kode_kursi");

  if (error) throw error;

  // Convert template_kursi to JadwalKursiUI format
  return rows.map((kursi: any) => ({
    jadwalKursiId: kursi.template_kursi_id,
    jadwalGerbongId: 0,
    templateKursiId: kursi.template_kursi_id,
    kodeKursi: kursi.kode_kursi,
    statusInventaris: "TERSEDIA",
    statusLabel: "Tersedia",
    hargaKursi: 0,
    multiplierKursi: kursi.is_premium ? 1.5 : 1.0,
    posisiKursi: kursi.posisi_kursi,
    nomorBaris: kursi.nomor_baris,
    isBlocked: false,
    isPremium: kursi.is_premium || false,
  }));
}
