import { z } from "zod";

export const PemesananSegmentSchema = z.object({
  segment_id: z.number().optional(),
  pemesanan_id: z.number(),
  jadwal_id: z.number(),
  stasiun_asal_id: z.number(),
  stasiun_tujuan_id: z.number(),
  urutan_segment: z.number().min(1),
  harga_segment: z.number().min(0),
  waktu_berangkat: z.string(), // TIMESTAMP
  waktu_tiba: z.string(), // TIMESTAMP
});

export type PemesananSegmentParsed = z.infer<typeof PemesananSegmentSchema>;
