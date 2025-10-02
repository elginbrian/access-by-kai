import type { Tables } from "../../types/supabase";

export interface PemesananSegmentMapper {
  segment_id: number;
  pemesanan_id: number;
  jadwal_id: number;
  stasiun_asal_id: number;
  stasiun_tujuan_id: number;
  urutan_segment: number;
  harga_segment: number;
  waktu_berangkat: string;
  waktu_tiba: string;

  durasi_perjalanan: number;
  harga_formatted: string;
  waktu_berangkat_formatted: string;
  waktu_tiba_formatted: string;
  is_valid_sequence: boolean;
}

export function mapPemesananSegment(row: Tables<"pemesanan_segment">): PemesananSegmentMapper {
  const waktuBerangkat = new Date(row.waktu_berangkat);
  const waktuTiba = new Date(row.waktu_tiba);
  const durasiMenit = Math.floor((waktuTiba.getTime() - waktuBerangkat.getTime()) / (1000 * 60));

  return {
    segment_id: row.segment_id,
    pemesanan_id: row.pemesanan_id,
    jadwal_id: row.jadwal_id,
    stasiun_asal_id: row.stasiun_asal_id,
    stasiun_tujuan_id: row.stasiun_tujuan_id,
    urutan_segment: row.urutan_segment,
    harga_segment: row.harga_segment,
    waktu_berangkat: row.waktu_berangkat,
    waktu_tiba: row.waktu_tiba,

    durasi_perjalanan: durasiMenit,
    harga_formatted: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(row.harga_segment),
    waktu_berangkat_formatted: waktuBerangkat.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    waktu_tiba_formatted: waktuTiba.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    is_valid_sequence: durasiMenit > 0 && row.urutan_segment > 0,
  };
}
