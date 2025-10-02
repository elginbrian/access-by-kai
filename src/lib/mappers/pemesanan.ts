import { Pemesanan, StatusPemesananEnum } from "@/types/models";

export type PemesananUI = {
  id: number;
  kode: string;
  userId: number;
  isConnectingJourney: boolean | null;
  totalSegment: number | null;
  status: StatusPemesananEnum | null;
  totalBayar: number;
  biayaAdmin: number | null;
  biayaAsuransi: number | null;
  contactPersonNama: string | null;
  contactPersonPhone: string | null;
  contactPersonEmail: string | null;
  waktuPembuatan: string | null;
  batasWaktuPembayaran: string | null;
  waktuCheckIn: string | null;
  keterangan: string | null;
};

export function mapPemesanan(row: Pemesanan): PemesananUI {
  return {
    id: row.pemesanan_id,
    kode: row.kode_pemesanan,
    userId: row.user_id,
    isConnectingJourney: row.is_connecting_journey ?? null,
    totalSegment: row.total_segment ?? null,
    status: row.status_pemesanan ?? null,
    totalBayar: row.total_bayar,
    biayaAdmin: row.biaya_admin ?? null,
    biayaAsuransi: row.biaya_asuransi ?? null,
    contactPersonNama: row.contact_person_nama ?? null,
    contactPersonPhone: row.contact_person_phone ?? null,
    contactPersonEmail: row.contact_person_email ?? null,
    waktuPembuatan: row.waktu_pembuatan ?? null,
    batasWaktuPembayaran: row.batas_waktu_pembayaran ?? null,
    waktuCheckIn: row.waktu_check_in ?? null,
    keterangan: row.keterangan ?? null,
  };
}

export function mapPemesananList(rows: Pemesanan[]): PemesananUI[] {
  return rows.map(mapPemesanan);
}
