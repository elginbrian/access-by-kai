import type { TemplateKursi } from "@/types/models";

export type TemplateKursiUI = {
  id: number;
  masterGerbongId: number;
  kodeKursi: string;
  posisi: string;
  isPremium: boolean;
  isDifabel: boolean;
  koordinatX: number | null;
  koordinatY: number | null;
  fasilitasKursi: any;

  kategoriKelas?: string;
  posisiLabel?: string;
  tipeFasilitas?: string[];
};

export function mapTemplateKursi(row: TemplateKursi): TemplateKursiUI {
  const kategoriKelas = row.is_premium ? "Premium" : "Regular";

  const posisiLabels = {
    jendela: "Jendela",
    lorong: "Lorong",
    tengah: "Tengah",
  };

  const fasilitasArray = row.fasilitas_kursi ? (Array.isArray(row.fasilitas_kursi) ? row.fasilitas_kursi : []) : [];

  const tipeFasilitas = fasilitasArray.length > 0 ? fasilitasArray.map(String) : ["Standar"];

  return {
    id: row.template_kursi_id,
    masterGerbongId: row.master_gerbong_id,
    kodeKursi: row.kode_kursi,
    posisi: row.posisi,
    isPremium: row.is_premium ?? false,
    isDifabel: row.is_difabel ?? false,
    koordinatX: row.koordinat_x,
    koordinatY: row.koordinat_y,
    fasilitasKursi: row.fasilitas_kursi,
    kategoriKelas,
    posisiLabel: posisiLabels[row.posisi as keyof typeof posisiLabels] || row.posisi,
    tipeFasilitas,
  };
}

export function mapTemplateKursiList(rows: TemplateKursi[]): TemplateKursiUI[] {
  return rows.map(mapTemplateKursi);
}
