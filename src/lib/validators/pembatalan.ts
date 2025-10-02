import { z } from "zod";

// Status refund enum sesuai DDL gen2
const StatusRefundEnum = z.enum(["MENUNGGU_PROSES", "DIPROSES", "SELESAI"]);

export const PembatalanSchema = z.object({
  pembatalan_id: z.number().optional(),
  alasan_pembatalan: z.string(),
  biaya_pembatalan: z.number().min(0),
  jumlah_refund: z.number().min(0),
  status_refund: StatusRefundEnum.nullable().optional(),
  tiket_id: z.number(),
  pemohon_user_id: z.number(),
  diproses_oleh: z.number().nullable().optional(),
  kategori_pembatalan: z.string().nullable().optional(),
  keterangan_admin: z.string().nullable().optional(),
  waktu_pengajuan: z.string().nullable().optional(),
  waktu_diproses: z.string().nullable().optional(),
});

export type PembatalanParsed = z.infer<typeof PembatalanSchema>;
