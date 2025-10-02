import { z } from "zod";

export const PengirimanLogistikSchema = z.object({
  biaya_pengiriman: z.number(),
  nomor_resi: z.string(),
  pengiriman_id: z.number().optional(),
  stasiun_asal_id: z.number(),
  stasiun_tujuan_id: z.number(),
  status_pengiriman: z.string().nullable().optional(),
  user_id: z.number(),
  waktu_pembuatan: z.string().nullable().optional(),
});

export type PengirimanLogistikParsed = z.infer<typeof PengirimanLogistikSchema>;
