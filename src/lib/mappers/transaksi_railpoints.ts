import { TransaksiRailpoints } from "@/types/models";

export type TransaksiRailpointsUI = {
  id: number;
  akunId: number;
  deskripsi: string | null;
  pemesananId: number | null;
  poinDebit: number | null;
  poinKredit: number | null;
  tipeTransaksi: string;
  waktuTransaksi: Date | null;
};

export function mapTransaksiRailpoints(row: TransaksiRailpoints): TransaksiRailpointsUI {
  return {
    id: row.transaksi_poin_id,
    akunId: row.akun_id,
    deskripsi: row.deskripsi ?? null,
    pemesananId: row.pemesanan_id ?? null,
    poinDebit: row.poin_debit ?? null,
    poinKredit: row.poin_kredit ?? null,
    tipeTransaksi: row.tipe_transaksi,
    waktuTransaksi: row.waktu_transaksi ? new Date(row.waktu_transaksi) : null,
  };
}

export function mapTransaksiRailpointsList(rows: TransaksiRailpoints[]): TransaksiRailpointsUI[] {
  return rows.map(mapTransaksiRailpoints);
}
