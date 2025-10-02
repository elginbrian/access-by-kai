import { z } from "zod";

export const JadwalKursiSchema = z.object({
  jadwal_kursi_id: z.number().optional(),
  jadwal_gerbong_id: z.number(),
  template_kursi_id: z.number(),
  kode_kursi: z.string().max(10),
  status_inventaris: z.enum(["TERSEDIA", "DIKUNCI", "DIPESAN", "TERISI"]).default("TERSEDIA"),
  harga_kursi: z.number(),
  multiplier_kursi: z.number().default(1.0),
  is_blocked: z.boolean().default(false),
  keterangan: z.string().nullable().optional(),
});

export type JadwalKursiParsed = z.infer<typeof JadwalKursiSchema>;
