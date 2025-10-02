import { Rute, TipeKoneksiEnum } from "@/types/models";

export type RuteUI = {
  id: number;
  kode: string;
  nama: string;
  tipeKoneksi: TipeKoneksiEnum | null;
  jarakTotalKm: number | null;
  estimasiWaktuTempuh: string | null; // INTERVAL
  tarifDasar: number | null;
  isAktif: boolean | null;
  keterangan: string | null;
  waktuDibuat: string | null;
};

export function mapRute(row: Rute): RuteUI {
  return {
    id: row.rute_id,
    kode: row.kode_rute,
    nama: row.nama_rute,
    tipeKoneksi: row.tipe_koneksi ?? null,
    jarakTotalKm: row.jarak_total_km ?? null,
    estimasiWaktuTempuh: row.estimasi_waktu_tempuh ? String(row.estimasi_waktu_tempuh) : null,
    tarifDasar: row.tarif_dasar ?? null,
    isAktif: row.is_aktif ?? null,
    keterangan: row.keterangan ?? null,
    waktuDibuat: row.waktu_dibuat ?? null,
  };
}

export function mapRuteList(rows: Rute[]): RuteUI[] {
  return rows.map(mapRute);
}
