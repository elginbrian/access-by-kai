import { MenuRailfood } from "@/types/models";

export type MenuItemRailfoodUI = {
  id: number;
  nama: string;
  deskripsi: string | null;
  harga: number;
  tersedia: boolean | null;
};

export function mapMenuItemRailfood(row: MenuRailfood): MenuItemRailfoodUI {
  return {
    id: row.menu_id,
    nama: row.nama_menu,
    deskripsi: row.deskripsi ?? null,
    harga: row.harga,
    tersedia: row.is_available ?? null,
  };
}

export function mapMenuItemRailfoodList(rows: MenuRailfood[]): MenuItemRailfoodUI[] {
  return rows.map(mapMenuItemRailfood);
}
