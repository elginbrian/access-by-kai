import { createClient } from "@/lib/supabase";
import { JadwalSchema } from "@/lib/validators";
import { mapJadwal, mapJadwalList } from "@/lib/mappers/jadwal";
import type { Jadwal } from "@/types/models";

const supabase = createClient();

export async function listJadwal() {
  const res = await supabase.from("jadwal").select("*").order("tanggal_keberangkatan", { ascending: false });
  const { data: rows, error } = res as any;
  if (error) throw error;
  const parsed = rows.map((r: any) => JadwalSchema.parse(r) as Jadwal);
  return mapJadwalList(parsed as Jadwal[]);
}

export async function getJadwal(id: number) {
  const res = await supabase.from("jadwal").select("*").eq("jadwal_id", id).single();
  const { data: row, error } = res as any;
  if (error) throw error;
  const parsed = JadwalSchema.parse(row) as Jadwal;
  return mapJadwal(parsed);
}
