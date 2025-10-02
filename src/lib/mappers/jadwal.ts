import { Jadwal, StatusJadwalEnum } from "@/types/models";

export type JadwalUI = {
  id: number;
  kodeJadwal: string;
  masterKeretaId: number; // Changed from keretaId to masterKeretaId
  ruteId: number;
  nomorKa: string; // New field
  tanggalKeberangkatan: string;
  waktuBerangkatOrigin: string;
  waktuTibaDestination: string;
  status: StatusJadwalEnum | null;
  hargaBase: number; // New field
  multiplierHarga: number | null; // New field
  keterangan: string | null;
  createdBy: number | null;
  waktuDibuat: string | null;
  waktuDiperbarui: string | null;
};

export function mapJadwal(row: Jadwal): JadwalUI {
  return {
    id: row.jadwal_id,
    kodeJadwal: row.kode_jadwal,
    masterKeretaId: row.master_kereta_id, // Updated field name
    ruteId: row.rute_id,
    nomorKa: row.nomor_ka, // New field
    tanggalKeberangkatan: row.tanggal_keberangkatan,
    waktuBerangkatOrigin: row.waktu_berangkat_origin,
    waktuTibaDestination: row.waktu_tiba_destination,
    status: row.status_jadwal ?? null,
    hargaBase: row.harga_base, // New field
    multiplierHarga: row.multiplier_harga ?? null, // New field
    keterangan: row.keterangan ?? null,
    createdBy: row.created_by ?? null,
    waktuDibuat: row.waktu_dibuat ?? null,
    waktuDiperbarui: row.waktu_diperbarui ?? null,
  };
}

export function mapJadwalList(rows: Jadwal[]): JadwalUI[] {
  return rows.map(mapJadwal);
}
