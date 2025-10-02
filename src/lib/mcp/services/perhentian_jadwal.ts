import { createClient } from "@/lib/supabase";
import { PerhentianJadwalSchema } from "@/lib/validators/perhentian_jadwal";
import { mapPerhentianJadwalList, mapPerhentianJadwal } from "@/lib/mappers/perhentian_jadwal";
import type { PerhentianJadwal } from "@/types/models";

const supabase = createClient();

export async function listPerhentianJadwal() {
  const res = await supabase.from("perhentian_jadwal").select("*");
  const { data: rows, error } = res as any;
  if (error) throw error;
  const parsed = rows.map((r: any) => PerhentianJadwalSchema.parse(r) as PerhentianJadwal);
  return mapPerhentianJadwalList(parsed as PerhentianJadwal[]);
}

export async function getPerhentianJadwal(id: number) {
  const res = await supabase.from("perhentian_jadwal").select("*").eq("perhentian_jadwal_id", id).single();
  const { data: row, error } = res as any;
  if (error) throw error;
  const parsed = PerhentianJadwalSchema.parse(row) as PerhentianJadwal;
  return mapPerhentianJadwal(parsed);
}
