import { z } from "zod";

export const JadwalGerbongSchema = z.object({
  jadwal_gerbong_id: z.number().optional(),
  jadwal_id: z.number(),
  master_gerbong_id: z.number(),
  nomor_gerbong_aktual: z.number(),
  status_operasional: z.boolean().default(true),
  keterangan: z.string().nullable().optional(),
});

export type JadwalGerbongParsed = z.infer<typeof JadwalGerbongSchema>;
