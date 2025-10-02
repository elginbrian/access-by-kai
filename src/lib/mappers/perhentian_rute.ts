import { PerhentianRute } from "@/types/models";

export type PerhentianRuteUI = {
  id: number;
  ruteId: number;
  stasiunId: number;
  urutan: number;
  estimasiWaktu: unknown | null;
};

export function mapPerhentianRute(row: PerhentianRute): PerhentianRuteUI {
  return {
    id: row.perhentian_rute_id,
    ruteId: row.rute_id,
    stasiunId: row.stasiun_id,
    urutan: row.urutan,
    estimasiWaktu: row.estimasi_waktu_tempuh ?? null,
  };
}

export function mapPerhentianRuteList(rows: PerhentianRute[]): PerhentianRuteUI[] {
  return rows.map(mapPerhentianRute);
}
