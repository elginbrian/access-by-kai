import { createClient } from "@/lib/supabase";
import { StasiunSchema } from "@/lib/validators/stasiun";
import { mapStasiunList, mapStasiun } from "@/lib/mappers/stasiun";
import type { Stasiun } from "@/types/models";

const supabase = createClient();

export async function listStasiun() {
  const res = await supabase.from("stasiun").select("*");
  const { data: rows, error } = res as any;
  if (error) throw error;
  const parsed = rows.map((r: any) => StasiunSchema.parse(r) as Stasiun);
  return mapStasiunList(parsed as Stasiun[]);
}

export async function getStasiun(id: number) {
  const res = await supabase.from("stasiun").select("*").eq("stasiun_id", id).single();
  const { data: row, error } = res as any;
  if (error) throw error;
  const parsed = StasiunSchema.parse(row) as Stasiun;
  return mapStasiun(parsed);
}
