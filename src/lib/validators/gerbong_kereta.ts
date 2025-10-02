import { z } from "zod";

// Enum untuk tipe gerbong
const TipeGerbongEnum = z.enum([
  "EKSEKUTIF_MILD_STEEL_SATWA",
  "EKSEKUTIF_MILD_STEEL_NEW_IMAGE_K1_16",
  "EKSEKUTIF_STAINLESS_STEEL_K1_18",
  "EKSEKUTIF_NEW_GENERATION_2024",
  "EKONOMI_PSO_160TD",
  "EKONOMI_KEMENHUB",
  "EKONOMI_REHAB",
  "EKONOMI_MILD_STEEL_NEW_IMAGE_2016",
  "EKONOMI_PREMIUM_MILDSTEEL_2017",
  "EKONOMI_PREMIUM_STAINLESS_STEEL_2018",
  "EKONOMI_MODIFIKASI_NEW_GENERATION_BY_MRI",
  "EKONOMI_NEW_GENERATION_2024",
]);

export const GerbongKeretaSchema = z.object({
  master_gerbong_id: z.number().optional(),
  master_kereta_id: z.number(),
  nomor_gerbong: z.number().min(1),
  tipe_gerbong: TipeGerbongEnum,
  kapasitas_kursi: z.number().min(1),
  layout_kursi: z.string().nullable().optional(),
  panjang_meter: z.number().min(0).nullable().optional(),
  lebar_meter: z.number().min(0).nullable().optional(),
  berat_ton: z.number().min(0).nullable().optional(),
  fasilitas_gerbong: z.any().nullable().optional(), // JSONB
  status_aktif: z.boolean().default(true).optional(),
});

export type GerbongKeretaParsed = z.infer<typeof GerbongKeretaSchema>;
