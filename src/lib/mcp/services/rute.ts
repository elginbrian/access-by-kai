import { createClient } from "@/lib/supabase";
import { RuteSchema } from "@/lib/validators/rute";
import { mapRute, mapRuteList } from "@/lib/mappers/rute";
import type { Rute } from "@/types/models";

const supabase = createClient();

export async function listRute() {
  const res = await supabase.from("rute").select("*");
  const { data: rows, error } = res as any;
  if (error) throw error;
  const parsed = rows.map((r: any) => RuteSchema.parse(r) as Rute);
  return mapRuteList(parsed as Rute[]);
}

export async function getRute(id: number) {
  const res = await supabase.from("rute").select("*").eq("rute_id", id).single();
  const { data: row, error } = res as any;
  if (error) throw error;
  const parsed = RuteSchema.parse(row) as Rute;
  return mapRute(parsed);
}
