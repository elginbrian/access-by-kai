import type { Database } from "@/types/supabase";
import type { Pengguna } from "@/types/models";

// Menggunakan tipe yang di-generate otomatis dari skema Supabase untuk UlasanRow.
// Ini adalah praktik terbaik untuk menjaga konsistensi dengan database.
export type UlasanRow = Database["public"]["Tables"]["ulasan"]["Row"];

// Tipe untuk data Ulasan yang akan digunakan di UI,
// termasuk properti tambahan yang dihitung (computed).
export type UlasanUI = {
  id: number;
  penggunaId: number;
  jenisLayanan: UlasanRow["jenis_layanan"];
  penilaian: number;
  komentar: string;
  platform: string | null;
  dibuatPada: string | null;
  diperbaruiPada: string | null;

  // Properti tambahan untuk UI
  ratingText?: string;
  timeAgo?: string;
};

/**
 * Memetakan satu baris data Ulasan dari database ke format objek UlasanUI.
 * @param row - Objek UlasanRow dari Supabase.
 * @returns Objek UlasanUI yang sudah diperkaya.
 */
export function mapUlasan(row: UlasanRow): UlasanUI {
  // Fungsi untuk mengubah nilai rating (angka) menjadi teks deskriptif.
  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1:
        return "Sangat Buruk";
      case 2:
        return "Buruk";
      case 3:
        return "Cukup";
      case 4:
        return "Baik";
      case 5:
        return "Sangat Baik";
      default:
        return "Tidak Diketahui";
    }
  };

  // Fungsi untuk menghitung waktu relatif dari string tanggal (misal: "2 hari lalu").
  const getTimeAgo = (dateString: string | null): string => {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;
    return `${Math.floor(diffDays / 365)} tahun yang lalu`;
  };

  return {
    id: row.ulasan_id,
    penggunaId: row.pengguna_id,
    jenisLayanan: row.jenis_layanan,
    penilaian: row.penilaian,
    komentar: row.komentar,
    platform: row.platform ?? "UMUM", // Memberikan nilai default jika null
    dibuatPada: row.dibuat_pada ?? null,
    diperbaruiPada: row.diperbarui_pada ?? null,

    // Menambahkan data yang sudah dihitung
    ratingText: getRatingText(row.penilaian),
    timeAgo: getTimeAgo(row.dibuat_pada),
  };
}

/**
 * Memetakan array data Ulasan dari database ke format array UlasanUI.
 * @param rows - Array UlasanRow dari Supabase.
 * @returns Array UlasanUI.
 */
export function mapUlasanList(rows: UlasanRow[]): UlasanUI[] {
  return rows.map(mapUlasan);
}
