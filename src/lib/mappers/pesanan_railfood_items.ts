import { PesananRailfoodDetail } from "@/types/models";

export type PesananRailfoodItemsUI = {
  menuItemId: number;
  pesananId: number;
  jumlah: number;
  hargaSaatPesan: number;
};

export function mapPesananRailfoodItems(row: PesananRailfoodDetail): PesananRailfoodItemsUI {
  return {
    menuItemId: row.menu_id,
    pesananId: row.pesanan_railfood_id,
    jumlah: row.jumlah,
    hargaSaatPesan: row.harga_satuan,
  };
}

export function mapPesananRailfoodItemsList(rows: PesananRailfoodDetail[]): PesananRailfoodItemsUI[] {
  return rows.map(mapPesananRailfoodItems);
}
