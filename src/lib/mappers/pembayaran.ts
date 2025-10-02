import { Pembayaran } from "@/types/models";

export type PembayaranUI = {
  id: number;
  pemesananId: number;
  jumlah: number;
  biayaAdmin: number | null;
  metodePembayaran: string;
  paymentProvider: string | null;
  statusPembayaran: string | null;
  eksternalId: string | null;
  referenceNumber: string | null;
  virtualAccount: string | null;
  qrCodeUrl: string | null;
  waktuPembayaran: Date | null;
  waktuExpire: Date | null;
  responGateway: any;
  keterangan: string | null;
  isExpired?: boolean;
  timeRemaining?: number;
  statusLabel?: string;
};

export function mapPembayaran(row: Pembayaran): PembayaranUI {
  const now = new Date();
  const waktuExpire = row.waktu_expire ? new Date(row.waktu_expire) : null;
  const isExpired = waktuExpire ? now > waktuExpire : false;
  const timeRemaining = waktuExpire ? Math.max(0, Math.floor((waktuExpire.getTime() - now.getTime()) / 1000)) : 0;

  const statusLabels = {
    PENDING: "Menunggu Pembayaran",
    PAID: "Pembayaran Berhasil",
    FAILED: "Pembayaran Gagal",
    CANCELLED: "Dibatalkan",
    EXPIRED: "Kadaluarsa",
    REFUNDED: "Dikembalikan",
  };

  return {
    id: row.pembayaran_id,
    pemesananId: row.pemesanan_id,
    jumlah: row.jumlah,
    biayaAdmin: row.biaya_admin,
    metodePembayaran: row.metode_pembayaran,
    paymentProvider: row.provider_pembayaran,
    statusPembayaran: row.status_pembayaran,
    eksternalId: row.id_transaksi_eksternal,
    referenceNumber: row.reference_number,
    virtualAccount: row.virtual_account,
    qrCodeUrl: row.qr_code_url,
    waktuPembayaran: row.waktu_pembayaran ? new Date(row.waktu_pembayaran) : null,
    waktuExpire: waktuExpire,
    responGateway: row.respon_gateway,
    keterangan: row.keterangan,
    isExpired,
    timeRemaining,
    statusLabel: row.status_pembayaran ? statusLabels[row.status_pembayaran as keyof typeof statusLabels] || row.status_pembayaran : "Unknown",
  };
}

export function mapPembayaranList(rows: Pembayaran[]): PembayaranUI[] {
  return rows.map(mapPembayaran);
}
