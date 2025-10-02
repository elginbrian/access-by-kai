import { z } from "zod";

export const TransaksiRailpointsSchema = z.object({
  transaksi_poin_id: z.number().optional(),
  akun_id: z.number(),
  deskripsi: z.string(), // Required field in database
  pemesanan_id: z.number().nullable().optional(),
  poin_debit: z.number().nullable().optional(),
  poin_kredit: z.number().nullable().optional(),
  tipe_transaksi: z.enum(["PEROLEHAN", "PENUKARAN", "PEMBATALAN", "KADALUARSA"]),
  referensi: z.string().nullable().optional(),
  tanggal_kadaluwarsa: z.string().nullable().optional(),
  is_expired: z.boolean().nullable().optional(),
  waktu_transaksi: z.string().nullable().optional(),
});

export type TransaksiRailpointsParsed = z.infer<typeof TransaksiRailpointsSchema>;
