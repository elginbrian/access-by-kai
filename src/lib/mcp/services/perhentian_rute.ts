import { createClient } from "@/lib/supabase";
import { PerhentianRuteSchema } from "@/lib/validators/perhentian_rute";
import { mapPerhentianRuteList, mapPerhentianRute } from "@/lib/mappers/perhentian_rute";
import type { PerhentianRute } from "@/types/models";

const supabase = createClient();

export async function listPerhentianRute() {
  const res = await supabase.from("perhentian_rute").select("*");
  const { data: rows, error } = res as any;
  if (error) throw error;
  const parsed = rows.map((r: any) => PerhentianRuteSchema.parse(r) as PerhentianRute);
  return mapPerhentianRuteList(parsed as PerhentianRute[]);
}

export async function getPerhentianRute(id: number) {
  const res = await supabase.from("perhentian_rute").select("*").eq("perhentian_rute_id", id).single();
  const { data: row, error } = res as any;
  if (error) throw error;
  const parsed = PerhentianRuteSchema.parse(row) as PerhentianRute;
  return mapPerhentianRute(parsed);
}
