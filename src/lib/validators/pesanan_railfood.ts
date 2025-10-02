import { z } from "zod";

export const PesananRailfoodSchema = z.object({
  pesanan_id: z.number().optional(),
  status_pesanan: z.enum(["DIPESAN", "DISAJIKAN", "DIBATALKAN"]).nullable().optional(),
  tiket_id: z.number(),
  total_harga: z.number(),
  waktu_pesanan: z.string().nullable().optional(),
});

export type PesananRailfoodParsed = z.infer<typeof PesananRailfoodSchema>;
