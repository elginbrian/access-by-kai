import { MenuKetersediaan } from "../../types/models";

export interface MenuKetersediaanUI {
  ketersediaanId: number;
  menuId: number;
  jadwalId: number | null;
  ruteId: number | null;
  stokTersedia: number;
  waktuTersediaMulai: string | null;
  waktuTersediaSelesai: string | null;
  isActive: boolean;
  statusLabel: string;
  stokStatus: string;
  waktuTersediaLabel: string;
}

export function mapMenuKetersediaan(row: MenuKetersediaan): MenuKetersediaanUI {
  const stokTersedia = Number(row.stok_tersedia) || 0;
  const isActive = row.is_active ?? true;

  // Generate stock status
  let stokStatus = "Tersedia";
  if (stokTersedia === 0) {
    stokStatus = "Habis";
  } else if (stokTersedia < 10) {
    stokStatus = "Stok Terbatas";
  }

  // Generate waktu tersedia label
  let waktuTersediaLabel = "Sepanjang Hari";
  if (row.waktu_tersedia_mulai && row.waktu_tersedia_selesai) {
    waktuTersediaLabel = `${row.waktu_tersedia_mulai} - ${row.waktu_tersedia_selesai}`;
  } else if (row.waktu_tersedia_mulai) {
    waktuTersediaLabel = `Mulai ${row.waktu_tersedia_mulai}`;
  } else if (row.waktu_tersedia_selesai) {
    waktuTersediaLabel = `Sampai ${row.waktu_tersedia_selesai}`;
  }

  return {
    ketersediaanId: Number(row.ketersediaan_id),
    menuId: Number(row.menu_id),
    jadwalId: row.jadwal_id ? Number(row.jadwal_id) : null,
    ruteId: row.rute_id ? Number(row.rute_id) : null,
    stokTersedia,
    waktuTersediaMulai: row.waktu_tersedia_mulai || null,
    waktuTersediaSelesai: row.waktu_tersedia_selesai || null,
    isActive,
    statusLabel: isActive ? "Aktif" : "Tidak Aktif",
    stokStatus,
    waktuTersediaLabel,
  };
}
