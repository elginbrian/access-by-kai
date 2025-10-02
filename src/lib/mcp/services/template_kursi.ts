import { createClient } from "@/lib/supabase";
import { TemplateKursiSchema } from "@/lib/validators/template_kursi";
import { mapTemplateKursi } from "@/lib/mappers/template_kursi";
import type { TemplateKursi } from "@/types/models";

const supabase = createClient();

export async function listTemplateKursi() {
  const { data: rows, error } = await supabase.from("template_kursi").select("*").order("template_kursi_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => TemplateKursiSchema.parse(r) as TemplateKursi);
  return parsed.map(mapTemplateKursi);
}

export async function getTemplateKursi(id: number) {
  const { data: row, error } = await supabase.from("template_kursi").select("*").eq("template_kursi_id", id).single();
  if (error) throw error;
  const parsed = TemplateKursiSchema.parse(row) as TemplateKursi;
  return mapTemplateKursi(parsed);
}

export async function listTemplateKursiByGerbong(gerbongId: number) {
  const { data: rows, error } = await supabase.from("template_kursi").select("*").eq("master_gerbong_id", gerbongId).order("nomor_kursi");
  if (error) throw error;
  const parsed = rows.map((r: any) => TemplateKursiSchema.parse(r) as TemplateKursi);
  return parsed.map(mapTemplateKursi);
}
