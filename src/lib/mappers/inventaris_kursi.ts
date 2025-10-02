import type { Tables } from "../../types/supabase";

export interface InventarisKursiMapper {
  template_kursi_id: number;
  kode_kursi: string;
  master_gerbong_id: number;
  posisi: string;
  koordinat_x: number | null;
  koordinat_y: number | null;
  is_difabel: boolean | null;
  is_premium: boolean | null;
  fasilitas_kursi: any | null;

  // Computed fields
  posisi_label: string;
  koordinat_display: string;
  is_accessible: boolean;
  kursi_type: string;
  fasilitas_list: string[];
}

export function mapInventarisKursi(row: Tables<"template_kursi">): InventarisKursiMapper {
  const posisiLabel = row.posisi.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());

  const koordinatDisplay = row.koordinat_x !== null && row.koordinat_y !== null ? `X: ${row.koordinat_x}, Y: ${row.koordinat_y}` : "Tidak ditentukan";

  const fasilitasList: string[] = row.fasilitas_kursi ? (Array.isArray(row.fasilitas_kursi) ? row.fasilitas_kursi.filter((item): item is string => typeof item === "string") : []) : [];

  const kursiType = row.is_premium ? "Premium" : row.is_difabel ? "Aksesibel" : "Standar";

  return {
    template_kursi_id: row.template_kursi_id,
    kode_kursi: row.kode_kursi,
    master_gerbong_id: row.master_gerbong_id,
    posisi: row.posisi,
    koordinat_x: row.koordinat_x,
    koordinat_y: row.koordinat_y,
    is_difabel: row.is_difabel,
    is_premium: row.is_premium,
    fasilitas_kursi: row.fasilitas_kursi,

    // Computed fields
    posisi_label: posisiLabel,
    koordinat_display: koordinatDisplay,
    is_accessible: row.is_difabel === true,
    kursi_type: kursiType,
    fasilitas_list: fasilitasList,
  };
}
