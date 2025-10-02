import { PerhentianJadwal } from "@/types/models";

export type PerhentianJadwalUI = {
  id: number;
  jadwalId: number;
  stasiunId: number;
  waktuKeberangkatanAktual: Date | null;
  waktuKeberangkatanEstimasi: Date | null;
  waktuKedatanganAktual: Date | null;
  waktuKedatanganEstimasi: Date | null;
};

export function mapPerhentianJadwal(row: PerhentianJadwal): PerhentianJadwalUI {
  return {
    id: row.perhentian_jadwal_id,
    jadwalId: row.jadwal_id,
    stasiunId: row.stasiun_id,
    waktuKeberangkatanAktual: row.waktu_keberangkatan_aktual ? new Date(row.waktu_keberangkatan_aktual) : null,
    waktuKeberangkatanEstimasi: row.waktu_keberangkatan_estimasi ? new Date(row.waktu_keberangkatan_estimasi) : null,
    waktuKedatanganAktual: row.waktu_kedatangan_aktual ? new Date(row.waktu_kedatangan_aktual) : null,
    waktuKedatanganEstimasi: row.waktu_kedatangan_estimasi ? new Date(row.waktu_kedatangan_estimasi) : null,
  };
}

export function mapPerhentianJadwalList(rows: PerhentianJadwal[]): PerhentianJadwalUI[] {
  return rows.map(mapPerhentianJadwal);
}
