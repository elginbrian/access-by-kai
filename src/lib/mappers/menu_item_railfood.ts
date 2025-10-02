import { MenuRailfood } from "@/types/models";

export type MenuItemRailfoodUI = {
  id: number;
  nama: string;
  deskripsi: string | null;
  harga: number;
  tersedia: boolean | null;
  kategori: string | null;
  gambar_url: string | null;
  is_halal: boolean | null;
  is_vegetarian: boolean | null;
  estimasi_persiapan_menit: number | null;
};

export function mapMenuItemRailfood(row: MenuRailfood): MenuItemRailfoodUI {
  return {
    id: row.menu_id,
    nama: row.nama_menu,
    deskripsi: row.deskripsi ?? null,
    harga: row.harga,
    tersedia: row.is_available ?? null,
    kategori: row.kategori ?? null,
    gambar_url: row.gambar_url ?? null,
    is_halal: row.is_halal ?? null,
    is_vegetarian: row.is_vegetarian ?? null,
    estimasi_persiapan_menit: row.estimasi_persiapan_menit ?? null,
  };
}

export function mapMenuItemRailfoodList(rows: MenuRailfood[]): MenuItemRailfoodUI[] {
  return rows.map(mapMenuItemRailfood);
}
