import { createClient } from "@/lib/supabase";
import { ProgramLoyalitasSchema } from "@/lib/validators/program_loyalitas";
import { mapProgramLoyalitas } from "@/lib/mappers/program_loyalitas";
import type { ProgramLoyalitas } from "@/types/models";

const supabase = createClient();

export async function listProgramLoyalitas() {
  const { data: rows, error } = await supabase.from("program_loyalitas").select("*").order("tier_level");
  if (error) throw error;
  const parsed = rows.map((r: any) => ProgramLoyalitasSchema.parse(r) as ProgramLoyalitas);
  return parsed.map(mapProgramLoyalitas);
}

export async function getProgramLoyalitas(id: number) {
  const { data: row, error } = await supabase.from("program_loyalitas").select("*").eq("program_id", id).single();
  if (error) throw error;
  const parsed = ProgramLoyalitasSchema.parse(row) as ProgramLoyalitas;
  return mapProgramLoyalitas(parsed);
}

export async function listActiveProgramLoyalitas() {
  const { data: rows, error } = await supabase.from("program_loyalitas").select("*").eq("is_active", true).order("min_poin_required");
  if (error) throw error;
  const parsed = rows.map((r: any) => ProgramLoyalitasSchema.parse(r) as ProgramLoyalitas);
  return parsed.map(mapProgramLoyalitas);
}

export async function getProgramLoyalitasByTier(tierLevel: string) {
  const { data: row, error } = await supabase.from("program_loyalitas").select("*").eq("tier_level", tierLevel).eq("is_active", true).single();
  if (error) throw error;
  const parsed = ProgramLoyalitasSchema.parse(row) as ProgramLoyalitas;
  return mapProgramLoyalitas(parsed);
}
