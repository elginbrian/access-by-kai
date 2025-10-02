import { z } from "zod";

export const StatusPembayaranEnum = z.enum(["MENUNGGU", "BERHASIL", "GAGAL", "REFUND"]);

export const PembayaranSchema = z.object({
  pembayaran_id: z.number().optional(),
  pemesanan_id: z.number(),
  jumlah: z.number().min(0),
  biaya_admin: z.number().nullable().optional(),
  metode_pembayaran: z.string(),
  provider_pembayaran: z.string().nullable().optional(),
  status_pembayaran: StatusPembayaranEnum.nullable().optional(),
  id_transaksi_eksternal: z.string().nullable().optional(),
  reference_number: z.string().nullable().optional(),
  virtual_account: z.string().nullable().optional(),
  qr_code_url: z.string().nullable().optional(),
  waktu_pembayaran: z.string().nullable().optional(), // TIMESTAMP
  waktu_expire: z.string().nullable().optional(), // TIMESTAMP
  respon_gateway: z.any().nullable().optional(), // JSONB
  keterangan: z.string().nullable().optional(),
});

export type PembayaranParsed = z.infer<typeof PembayaranSchema>;
