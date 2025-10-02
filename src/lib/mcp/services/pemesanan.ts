import { createClient } from "@/lib/supabase";
import { PemesananSchema } from "@/lib/validators/pemesanan";
import { mapPemesananList, mapPemesanan } from "@/lib/mappers/pemesanan";
import type { Pemesanan } from "@/types/models";

const supabase = createClient();

export async function listPemesanan() {
  const res = await supabase.from("pemesanan").select("*").order("waktu_pembuatan", { ascending: false });
  const { data: rows, error } = res as any;
  if (error) throw error;
  const parsed = rows.map((r: any) => PemesananSchema.parse(r) as Pemesanan);
  return mapPemesananList(parsed as Pemesanan[]);
}

export async function getPemesanan(id: number) {
  const res = await supabase.from("pemesanan").select("*").eq("pemesanan_id", id).single();
  const { data: row, error } = res as any;
  if (error) throw error;
  const parsed = PemesananSchema.parse(row) as Pemesanan;
  return mapPemesanan(parsed);
}

export async function createPemesanan(payload: any) {
  const parsed = PemesananSchema.parse(payload);
  const res = await supabase.from("pemesanan").insert(parsed).select().single();
  const { data, error } = res as any;
  if (error) throw error;
  return data as Pemesanan;
}
