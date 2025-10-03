import { z } from "zod";

// Enum untuk validasi, diekspor agar bisa digunakan di tempat lain
export const JenisLayananEnum = z.enum(["BOOKING_TIKET", "EPORTER", "LOGISTIK", "LAPORAN_MANUAL"]);

// Skema utama dengan validasi yang lebih ketat dari kedua versi
export const UlasanSchema = z.object({
  ulasan_id: z.number().optional(),
  pengguna_id: z.number(),
  jenis_layanan: JenisLayananEnum,
  penilaian: z.number().int().min(1).max(5), // Menggunakan .int() untuk memastikan bilangan bulat
  komentar: z.string().min(1).max(1000), // Menambahkan batas maksimal karakter
  platform: z.string().max(20).default("UMUM").optional(), // Memberikan nilai default
  dibuat_pada: z.string().nullable().optional(),
  diperbarui_pada: z.string().nullable().optional(),
});

export type UlasanParsed = z.infer<typeof UlasanSchema>;

// Skema untuk membuat ulasan baru (tanpa id dan timestamp)
export const CreateUlasanSchema = UlasanSchema.omit({
  ulasan_id: true,
  dibuat_pada: true,
  diperbarui_pada: true,
});

export type CreateUlasanParsed = z.infer<typeof CreateUlasanSchema>;

// Skema untuk memperbarui ulasan (semua field opsional kecuali id)
export const UpdateUlasanSchema = UlasanSchema.partial().required({
  ulasan_id: true,
});

export type UpdateUlasanParsed = z.infer<typeof UpdateUlasanSchema>;
