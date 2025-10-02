import type { Tables } from "../../types/supabase";

export interface PembatalanMapper {
  pembatalan_id: number;
  alasan_pembatalan: string;
  biaya_pembatalan: number;
  jumlah_refund: number;
  status_refund: string | null;
  tiket_id: number;
  pemohon_user_id: number;
  diproses_oleh: number | null;
  kategori_pembatalan: string | null;
  keterangan_admin: string | null;
  waktu_pengajuan: string | null;
  waktu_diproses: string | null;

  biaya_formatted: string;
  refund_formatted: string;
  status_label: string;
  waktu_pengajuan_formatted: string | null;
  waktu_diproses_formatted: string | null;
  is_approved: boolean;
  is_processed: boolean;
  net_refund: number;
}

export function mapPembatalan(row: Tables<"pembatalan_tiket">): PembatalanMapper {
  const statusLabel = row.status_refund
    ? row.status_refund
        .replace("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : "Belum Diproses";

  return {
    pembatalan_id: row.pembatalan_id,
    alasan_pembatalan: row.alasan_pembatalan,
    biaya_pembatalan: row.biaya_pembatalan,
    jumlah_refund: row.jumlah_refund,
    status_refund: row.status_refund,
    tiket_id: row.tiket_id,
    pemohon_user_id: row.pemohon_user_id,
    diproses_oleh: row.diproses_oleh,
    kategori_pembatalan: row.kategori_pembatalan,
    keterangan_admin: row.keterangan_admin,
    waktu_pengajuan: row.waktu_pengajuan,
    waktu_diproses: row.waktu_diproses,

    biaya_formatted: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(row.biaya_pembatalan),
    refund_formatted: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(row.jumlah_refund),
    status_label: statusLabel,
    waktu_pengajuan_formatted: row.waktu_pengajuan
      ? new Date(row.waktu_pengajuan).toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null,
    waktu_diproses_formatted: row.waktu_diproses
      ? new Date(row.waktu_diproses).toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null,
    is_approved: row.status_refund === "SELESAI",
    is_processed: row.status_refund !== null && row.status_refund !== "MENUNGGU_PROSES",
    net_refund: row.jumlah_refund - row.biaya_pembatalan,
  };
}
