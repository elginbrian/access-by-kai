import { z } from "zod";

export const LogPerpindahanKursiSchema = z.object({
  log_id: z.number().optional(),
  perpindahan_id: z.number(),
  tiket_id: z.number(),
  kursi_lama_id: z.number(),
  kursi_baru_id: z.number(),
  waktu_perpindahan: z.string().nullable().optional(),
  lokasi_perpindahan: z.string().nullable().optional(),
  petugas_yang_membantu: z.string().nullable().optional(),
  keterangan: z.string().nullable().optional(),
});

export type LogPerpindahanKursiParsed = z.infer<typeof LogPerpindahanKursiSchema>;
