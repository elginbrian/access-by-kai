import { MasterKereta } from "@/types/models";

export type KeretaUI = {
  id: number;
  nama: string;
  kode: string;
  jenisLayanan: string;
  jumlahGerbong: number;
  kapasitasTotal: number;
  kecepatanMaksimal: number | null;
  nomorSeriRangkaian: string | null;
  pabrikPembuat: string | null;
  tahunPembuatan: number | null;
  statusOperasional: boolean | null;
  fasilitasUmum: any;
  keterangan: string | null;
  waktuDibuat: Date | null;
  waktuDiperbarui: Date | null;
  // Computed fields
  jenisLayananLabel?: string;
  umurKereta?: number;
  kapasitasPerGerbong?: number;
  statusLabel?: string;
};

export function mapKereta(row: MasterKereta): KeretaUI {
  // Service type label mapping
  const jenisLayananLabels = {
    EKSEKUTIF: "Eksekutif",
    BISNIS: "Bisnis",
    EKONOMI: "Ekonomi",
    LUXURY: "Luxury",
    SLEEPER: "Sleeper",
  };

  // Calculate train age
  const currentYear = new Date().getFullYear();
  const umurKereta = row.tahun_pembuatan ? currentYear - row.tahun_pembuatan : undefined;

  // Calculate capacity per car
  const kapasitasPerGerbong = row.jumlah_gerbong > 0 ? Math.round(row.kapasitas_total / row.jumlah_gerbong) : 0;

  // Status label
  const statusLabel = row.status_operasional ? "Operasional" : "Non-Aktif";

  return {
    id: row.master_kereta_id,
    nama: row.nama_kereta,
    kode: row.kode_kereta,
    jenisLayanan: row.jenis_layanan,
    jumlahGerbong: row.jumlah_gerbong,
    kapasitasTotal: row.kapasitas_total,
    kecepatanMaksimal: row.kecepatan_maksimal_kmh,
    nomorSeriRangkaian: row.nomor_seri_rangkaian,
    pabrikPembuat: row.pabrik_pembuat,
    tahunPembuatan: row.tahun_pembuatan,
    statusOperasional: row.status_operasional,
    fasilitasUmum: row.fasilitas_umum,
    keterangan: row.keterangan,
    waktuDibuat: row.waktu_dibuat ? new Date(row.waktu_dibuat) : null,
    waktuDiperbarui: row.waktu_diperbarui ? new Date(row.waktu_diperbarui) : null,
    jenisLayananLabel: jenisLayananLabels[row.jenis_layanan as keyof typeof jenisLayananLabels] || row.jenis_layanan,
    umurKereta,
    kapasitasPerGerbong,
    statusLabel,
  };
}

export function mapKeretaList(rows: MasterKereta[]): KeretaUI[] {
  return rows.map(mapKereta);
}
