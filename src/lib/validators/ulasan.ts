import { z } from "zod";

export const JenisLayananEnum = z.enum(["BOOKING_TIKET", "EPORTER", "LOGISTIK", "LAPORAN_MANUAL"]);

export const UlasanSchema = z.object({
  ulasan_id: z.number().optional(),
  pengguna_id: z.number(),
  jenis_layanan: JenisLayananEnum,
  penilaian: z.number().int().min(1).max(5),
  komentar: z.string().min(1).max(1000),
  platform: z.string().max(20).default("UMUM").optional(),
  dibuat_pada: z.string().nullable().optional(),
  diperbarui_pada: z.string().nullable().optional(),
});

export type UlasanParsed = z.infer<typeof UlasanSchema>;

export const CreateUlasanSchema = UlasanSchema.omit({
  ulasan_id: true,
  dibuat_pada: true,
  diperbarui_pada: true,
});

export type CreateUlasanParsed = z.infer<typeof CreateUlasanSchema>;

export const UpdateUlasanSchema = UlasanSchema.partial().required({
  ulasan_id: true,
});

export type UpdateUlasanParsed = z.infer<typeof UpdateUlasanSchema>;
