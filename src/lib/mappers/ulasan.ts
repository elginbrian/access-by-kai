import type { Database } from "@/types/supabase";
import type { Pengguna } from "@/types/models";

export type UlasanRow = Database["public"]["Tables"]["ulasan"]["Row"];

export type UlasanUI = {
  id: number;
  penggunaId: number;
  jenisLayanan: UlasanRow["jenis_layanan"];
  penilaian: number;
  komentar: string;
  platform: string | null;
  dibuatPada: string | null;
  diperbaruiPada: string | null;
};

export function mapUlasan(row: UlasanRow): UlasanUI {
  return {
    id: row.ulasan_id,
    penggunaId: row.pengguna_id,
    jenisLayanan: row.jenis_layanan,
    penilaian: row.penilaian,
    komentar: row.komentar,
    platform: row.platform ?? null,
    dibuatPada: row.dibuat_pada ?? null,
    diperbaruiPada: row.diperbarui_pada ?? null,
  };
}

export function mapUlasanList(rows: UlasanRow[]): UlasanUI[] {
  return rows.map(mapUlasan);
}
