// Ulasan (Review) table representation
export interface UlasanRow {
  ulasan_id: number;
  pengguna_id: number;
  jenis_layanan: string;
  penilaian: number;
  komentar: string;
  platform: string | null;
  dibuat_pada: string;
  diperbarui_pada: string;
}

export type UlasanUI = {
  id: number;
  penggunaId: number;
  jenisLayanan: string;
  penilaian: number;
  komentar: string;
  platform: string;
  dibuatPada: string;
  diperbaruiPada: string;
  
  // Computed fields
  ratingText?: string;
  timeAgo?: string;
};

export function mapUlasan(row: UlasanRow): UlasanUI {
  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1: return "Sangat Buruk";
      case 2: return "Buruk"; 
      case 3: return "Cukup";
      case 4: return "Baik";
      case 5: return "Sangat Baik";
      default: return "Unknown";
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
    return `${Math.floor(diffDays / 365)} tahun lalu`;
  };

  return {
    id: row.ulasan_id,
    penggunaId: row.pengguna_id,
    jenisLayanan: row.jenis_layanan,
    penilaian: row.penilaian,
    komentar: row.komentar,
    platform: row.platform || 'UMUM',
    dibuatPada: row.dibuat_pada,
    diperbaruiPada: row.diperbarui_pada,
    ratingText: getRatingText(row.penilaian),
    timeAgo: getTimeAgo(row.dibuat_pada),
  };
}

export function mapUlasanList(rows: UlasanRow[]): UlasanUI[] {
  return rows.map(mapUlasan);
}