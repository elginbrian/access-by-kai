import type { Tables } from "../../types/supabase";

export interface PermintaanPerpindahanKursiMapper {
  perpindahan_id: number;
  pemohon_user_id: number;
  target_user_id: number | null;
  tiket_asal_id: number;
  tiket_tujuan_id: number | null;
  jadwal_kursi_tujuan_id: number;
  tipe_perpindahan: string;
  alasan: string | null;
  status_perpindahan: string | null;
  biaya_perpindahan: number | null;
  diproses_oleh: number | null;
  keterangan_admin: string | null;
  waktu_permintaan: string | null;
  waktu_diproses: string | null;

  status_label: string;
  waktu_permintaan_formatted: string | null;
  waktu_diproses_formatted: string | null;
  biaya_formatted: string | null;
  is_pending: boolean;
  is_approved: boolean;
  is_rejected: boolean;
  is_processed: boolean;
  tipe_perpindahan_label: string;
  processing_duration: string | null;
}

export function mapPermintaanPerpindahanKursi(row: Tables<"permintaan_perpindahan_kursi">): PermintaanPerpindahanKursiMapper {
  const statusLabel = row.status_perpindahan
    ? row.status_perpindahan
        .replace("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : "Belum Diproses";

  const waktuPermintaanFormatted = row.waktu_permintaan
    ? new Date(row.waktu_permintaan).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const waktuDiprosesFormatted = row.waktu_diproses
    ? new Date(row.waktu_diproses).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const biayaFormatted = row.biaya_perpindahan
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(row.biaya_perpindahan)
    : null;

  const tipePerpindahanLabel = row.tipe_perpindahan
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Calculate processing duration
  let processingDuration = null;
  if (row.waktu_permintaan && row.waktu_diproses) {
    const requested = new Date(row.waktu_permintaan);
    const processed = new Date(row.waktu_diproses);
    const diffMs = processed.getTime() - requested.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    processingDuration = `${diffHours}j ${diffMinutes}m`;
  }

  return {
    perpindahan_id: row.perpindahan_id,
    pemohon_user_id: row.pemohon_user_id,
    target_user_id: row.target_user_id,
    tiket_asal_id: row.tiket_asal_id,
    tiket_tujuan_id: row.tiket_tujuan_id,
    jadwal_kursi_tujuan_id: row.jadwal_kursi_tujuan_id,
    tipe_perpindahan: row.tipe_perpindahan,
    alasan: row.alasan,
    status_perpindahan: row.status_perpindahan,
    biaya_perpindahan: row.biaya_perpindahan,
    diproses_oleh: row.diproses_oleh,
    keterangan_admin: row.keterangan_admin,
    waktu_permintaan: row.waktu_permintaan,
    waktu_diproses: row.waktu_diproses,

    // Computed fields
    status_label: statusLabel,
    waktu_permintaan_formatted: waktuPermintaanFormatted,
    waktu_diproses_formatted: waktuDiprosesFormatted,
    biaya_formatted: biayaFormatted,
    is_pending: row.status_perpindahan === "MENUNGGU_PERSETUJUAN",
    is_approved: row.status_perpindahan === "DISETUJUI",
    is_rejected: row.status_perpindahan === "DITOLAK",
    is_processed: row.status_perpindahan !== null && row.status_perpindahan !== "MENUNGGU_PERSETUJUAN",
    tipe_perpindahan_label: tipePerpindahanLabel,
    processing_duration: processingDuration,
  };
}
