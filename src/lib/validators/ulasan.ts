import { z } from "zod";

export const JenisLayananEnum = z.enum(["BOOKING_TIKET", "EPORTER", "LOGISTIK", "LAPORAN_MANUAL"]);

export const UlasanSchema = z.object({
  ulasan_id: z.number().optional(),
  pengguna_id: z.number(),
  jenis_layanan: JenisLayananEnum,
  penilaian: z.number().int().min(1).max(5),
  komentar: z.string().min(1),
  platform: z.string().max(20).nullable().optional(),
  dibuat_pada: z.string().nullable().optional(),
  diperbarui_pada: z.string().nullable().optional(),
});

export type UlasanParsed = z.infer<typeof UlasanSchema>;
