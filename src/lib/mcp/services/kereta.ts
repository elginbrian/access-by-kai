import { createClient } from "@/lib/supabase";
import { KeretaSchema } from "@/lib/validators/kereta";
import { mapKeretaList, mapKereta } from "@/lib/mappers/kereta";
import type { MasterKereta } from "@/types/models";

const supabase = createClient();

export async function listKereta() {
  const { data: rows, error } = await supabase.from("master_kereta").select("*").order("nama_kereta");
  if (error) throw error;
  const parsed = rows.map((r: any) => KeretaSchema.parse(r) as MasterKereta);
  return mapKeretaList(parsed as MasterKereta[]);
}

export async function getKereta(id: number) {
  const { data: row, error } = await supabase.from("master_kereta").select("*").eq("master_kereta_id", id).single();
  if (error) throw error;
  const parsed = KeretaSchema.parse(row) as MasterKereta;
  return mapKereta(parsed);
}
