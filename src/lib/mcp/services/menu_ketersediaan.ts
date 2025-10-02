import { createClient } from "@/lib/supabase";
import { MenuKetersediaanSchema } from "@/lib/validators/menu_ketersediaan";
import { mapMenuKetersediaan } from "@/lib/mappers/menu_ketersediaan";
import type { MenuKetersediaan } from "@/types/models";

const supabase = createClient();

export async function listMenuKetersediaan() {
  const { data: rows, error } = await supabase.from("menu_ketersediaan").select("*").order("menu_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => MenuKetersediaanSchema.parse(r) as MenuKetersediaan);
  return parsed.map(mapMenuKetersediaan);
}

export async function getMenuKetersediaan(id: number) {
  const { data: row, error } = await supabase.from("menu_ketersediaan").select("*").eq("ketersediaan_id", id).single();
  if (error) throw error;
  const parsed = MenuKetersediaanSchema.parse(row) as MenuKetersediaan;
  return mapMenuKetersediaan(parsed);
}

export async function listActiveMenuKetersediaan() {
  const { data: rows, error } = await supabase.from("menu_ketersediaan").select("*").eq("is_active", true).gt("stok_tersedia", 0).order("menu_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => MenuKetersediaanSchema.parse(r) as MenuKetersediaan);
  return parsed.map(mapMenuKetersediaan);
}

export async function listMenuKetersediaanByJadwal(jadwalId: number) {
  const { data: rows, error } = await supabase.from("menu_ketersediaan").select("*").or(`jadwal_id.eq.${jadwalId},jadwal_id.is.null`).eq("is_active", true).gt("stok_tersedia", 0).order("menu_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => MenuKetersediaanSchema.parse(r) as MenuKetersediaan);
  return parsed.map(mapMenuKetersediaan);
}

export async function listMenuKetersediaanByRute(ruteId: number) {
  const { data: rows, error } = await supabase.from("menu_ketersediaan").select("*").or(`rute_id.eq.${ruteId},rute_id.is.null`).eq("is_active", true).gt("stok_tersedia", 0).order("menu_id");
  if (error) throw error;
  const parsed = rows.map((r: any) => MenuKetersediaanSchema.parse(r) as MenuKetersediaan);
  return parsed.map(mapMenuKetersediaan);
}
