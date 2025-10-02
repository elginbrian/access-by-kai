import { z } from "zod";

export const StasiunSchema = z.object({
  stasiun_id: z.number().optional(),
  kode_stasiun: z.string().max(10),
  nama_stasiun: z.string().max(150),
  kota: z.string().max(100),
  kabupaten: z.string().max(100).nullable().optional(),
  provinsi: z.string().max(100),
  koordinat_latitude: z.number().min(-90).max(90).nullable().optional(),
  koordinat_longitude: z.number().min(-180).max(180).nullable().optional(),
  elevasi_meter: z.number().int().nullable().optional(),
  zona_waktu: z.string().max(10).default("WIB").optional(),
  fasilitas: z.record(z.boolean()).nullable().optional(), // JSONB fasilitas
  status_aktif: z.boolean().default(true).optional(),
  waktu_dibuat: z.string().nullable().optional(),
  waktu_diperbarui: z.string().nullable().optional(),
});

export type StasiunParsed = z.infer<typeof StasiunSchema>;
