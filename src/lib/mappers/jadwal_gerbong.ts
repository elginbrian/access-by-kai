import { JadwalGerbong } from "../../types/models";

export interface JadwalGerbongUI {
  jadwalGerbongId: number;
  jadwalId: number;
  masterGerbongId: number;
  nomorGerbongAktual: number;
  statusOperasional: boolean;
  statusLabel: string;
  keterangan: string | null;
  tipeGerbong?: string;
  layoutKursi?: string;
  kapasitasKursi?: number;
}

export function mapJadwalGerbong(row: any): JadwalGerbongUI {
  return {
    jadwalGerbongId: Number(row.jadwal_gerbong_id),
    jadwalId: Number(row.jadwal_id),
    masterGerbongId: Number(row.master_gerbong_id),
    nomorGerbongAktual: Number(row.nomor_gerbong_aktual),
    statusOperasional: row.status_operasional ?? true,
    statusLabel: row.status_operasional ?? true ? "Beroperasi" : "Tidak Beroperasi",
    tipeGerbong: row.master_gerbong?.tipe_gerbong,
    layoutKursi: row.master_gerbong?.layout_kursi,
    kapasitasKursi: row.master_gerbong?.kapasitas_kursi,
    keterangan: row.keterangan || null,
  };
}
