import { MasterGerbong } from "@/types/models";

export type GerbongKeretaUI = {
  id: number;
  masterKeretaId: number;
  nomorGerbong: number;
  tipeGerbong: string;
  kapasitasKursi: number;
  layoutKursi: string | null;
  panjangMeter: number | null;
  lebarMeter: number | null;
  beratTon: number | null;
  fasilitasGerbong: any;
  statusAktif: boolean | null;

  tipeGerbongLabel?: string;
  kategoriGerbong?: string;
  kapasitasPerMeter?: number;
  densitasKursi?: string;
};

export function mapGerbongKereta(row: MasterGerbong): GerbongKeretaUI {
  const tipeLabels = {
    EKSEKUTIF_MILD_STEEL_SATWA: "Eksekutif - Mild Steel SATWA",
    EKSEKUTIF_MILD_STEEL_NEW_IMAGE_K1_16: "Eksekutif - Mild Steel K1-16",
    EKSEKUTIF_STAINLESS_STEEL_K1_18: "Eksekutif - Stainless Steel K1-18",
    EKSEKUTIF_NEW_GENERATION_2024: "Eksekutif - New Generation 2024",
    EKONOMI_PSO_160TD: "Ekonomi - PSO 160TD",
    EKONOMI_KEMENHUB: "Ekonomi - Kemenhub",
    EKONOMI_REHAB: "Ekonomi - Rehab",
    EKONOMI_MILD_STEEL_NEW_IMAGE_2016: "Ekonomi - Mild Steel 2016",
    EKONOMI_PREMIUM_MILDSTEEL_2017: "Ekonomi Premium - Mild Steel 2017",
    EKONOMI_PREMIUM_STAINLESS_STEEL_2018: "Ekonomi Premium - Stainless Steel 2018",
    EKONOMI_MODIFIKASI_NEW_GENERATION_BY_MRI: "Ekonomi - Modified New Gen by MRI",
    EKONOMI_NEW_GENERATION_2024: "Ekonomi - New Generation 2024",
  };

  // Determine category
  const kategoriGerbong = row.tipe_gerbong.includes("EKSEKUTIF") ? "Eksekutif" : "Ekonomi";

  // Calculate capacity per meter if dimensions available
  const kapasitasPerMeter = row.panjang_meter ? Math.round((row.kapasitas_kursi / row.panjang_meter) * 100) / 100 : undefined;

  // Determine seat density
  let densitasKursi = "Unknown";
  if (kapasitasPerMeter) {
    if (kapasitasPerMeter > 20) densitasKursi = "High Density";
    else if (kapasitasPerMeter > 15) densitasKursi = "Medium Density";
    else densitasKursi = "Low Density";
  }

  return {
    id: row.master_gerbong_id,
    masterKeretaId: row.master_kereta_id,
    nomorGerbong: row.nomor_gerbong,
    tipeGerbong: row.tipe_gerbong,
    kapasitasKursi: row.kapasitas_kursi,
    layoutKursi: row.layout_kursi,
    panjangMeter: row.panjang_meter,
    lebarMeter: row.lebar_meter,
    beratTon: row.berat_ton,
    fasilitasGerbong: row.fasilitas_gerbong,
    statusAktif: row.status_aktif,
    tipeGerbongLabel: tipeLabels[row.tipe_gerbong as keyof typeof tipeLabels] || row.tipe_gerbong,
    kategoriGerbong,
    kapasitasPerMeter,
    densitasKursi,
  };
}

export function mapGerbongKeretaList(rows: MasterGerbong[]): GerbongKeretaUI[] {
  return rows.map(mapGerbongKereta);
}
