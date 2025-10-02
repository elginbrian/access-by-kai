import { PesananRailfood } from "@/types/models";

export type PesananRailfoodUI = {
  id: number;
  status: string | null;
  tiketId: number;
  totalHarga: number;
  waktuPesan: Date | null;
};

export function mapPesananRailfood(row: PesananRailfood): PesananRailfoodUI {
  return {
    id: row.pesanan_railfood_id,
    status: row.status_pesanan ?? null,
    tiketId: row.tiket_id,
    totalHarga: row.total_harga,
    waktuPesan: row.waktu_pesanan ? new Date(row.waktu_pesanan) : null,
  };
}

export function mapPesananRailfoodList(rows: PesananRailfood[]): PesananRailfoodUI[] {
  return rows.map(mapPesananRailfood);
}
