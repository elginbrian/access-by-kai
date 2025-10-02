import { Stasiun } from "@/types/models";

export type StasiunUI = {
  id: number;
  kode: string;
  nama: string;
  kota: string;
  kabupaten: string | null;
  provinsi: string;
  koordinatLatitude: number | null;
  koordinatLongitude: number | null;
  elevasiMeter: number | null;
  zonaWaktu: string | null;
  fasilitas: Record<string, boolean> | null;
  statusAktif: boolean | null;
  waktuDibuat: string | null;
  waktuDiperbarui: string | null;
};

export function mapStasiun(row: Stasiun): StasiunUI {
  return {
    id: row.stasiun_id,
    kode: row.kode_stasiun,
    nama: row.nama_stasiun,
    kota: row.kota,
    kabupaten: row.kabupaten ?? null,
    provinsi: row.provinsi,
    koordinatLatitude: row.koordinat_latitude ?? null,
    koordinatLongitude: row.koordinat_longitude ?? null,
    elevasiMeter: row.elevasi_meter ?? null,
    zonaWaktu: row.zona_waktu ?? null,
    fasilitas: row.fasilitas as Record<string, boolean> | null,
    statusAktif: row.status_aktif ?? null,
    waktuDibuat: row.waktu_dibuat ?? null,
    waktuDiperbarui: row.waktu_diperbarui ?? null,
  };
}

export function mapStasiunList(rows: Stasiun[]): StasiunUI[] {
  return rows.map(mapStasiun);
}
