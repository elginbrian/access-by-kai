import { z } from "zod";

export const PerhentianJadwalSchema = z.object({
  perhentian_jadwal_id: z.number().optional(),
  jadwal_id: z.number(),
  stasiun_id: z.number(),
  urutan: z.number(), // Required field
  waktu_keberangkatan_aktual: z.string().nullable().optional(),
  waktu_keberangkatan_estimasi: z.string(), // Required field
  waktu_kedatangan_aktual: z.string().nullable().optional(),
  waktu_kedatangan_estimasi: z.string().nullable().optional(),
  delay_menit: z.number().nullable().optional(),
  platform: z.string().nullable().optional(),
  keterangan: z.string().nullable().optional(),
});

export type PerhentianJadwalParsed = z.infer<typeof PerhentianJadwalSchema>;
