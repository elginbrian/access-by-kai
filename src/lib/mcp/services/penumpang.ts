import { createClient } from "@/lib/supabase";
import { PenumpangSchema } from "@/lib/validators/penumpang";
import { mapPenumpangList, mapPenumpang } from "@/lib/mappers/penumpang";
import type { Penumpang } from "@/types/models";

const supabase = createClient();

export async function listPenumpang() {
  const res = await supabase.from("penumpang").select("*");
  const { data: rows, error } = res as any;
  if (error) throw error;
  const parsed = rows.map((r: any) => PenumpangSchema.parse(r) as Penumpang);
  return mapPenumpangList(parsed as Penumpang[]);
}

export async function getPenumpang(id: number) {
  const res = await supabase.from("penumpang").select("*").eq("penumpang_id", id).single();
  const { data: row, error } = res as any;
  if (error) throw error;
  const parsed = PenumpangSchema.parse(row) as Penumpang;
  return mapPenumpang(parsed);
}

export async function createPenumpang(payload: any) {
  const parsed = PenumpangSchema.parse(payload);
  const res = await supabase.from("penumpang").insert(parsed).select().single();
  const { data, error } = res as any;
  if (error) throw error;
  return data as Penumpang;
}
