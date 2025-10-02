import { z } from "zod";

// Enums untuk validation
const StatusPemesananEnum = z.enum(["MENUNGGU_PEMBAYARAN", "TERKONFIRMASI", "DIBATALKAN", "KADALUARSA", "CHECK_IN"]);

export const PemesananSchema = z.object({
  pemesanan_id: z.number().optional(),
  kode_pemesanan: z.string().max(12), // PNR style: ABC123DEF
  user_id: z.number(),
  is_connecting_journey: z.boolean().default(false).optional(),
  total_segment: z.number().int().default(1).optional(),
  status_pemesanan: StatusPemesananEnum.default("MENUNGGU_PEMBAYARAN").optional(),
  total_bayar: z.number().positive(),
  biaya_admin: z.number().default(0).optional(),
  biaya_asuransi: z.number().default(0).optional(),
  contact_person_nama: z.string().max(255).nullable().optional(),
  contact_person_phone: z.string().max(20).nullable().optional(),
  contact_person_email: z.string().email().max(255).nullable().optional(),
  waktu_pembuatan: z.string().nullable().optional(),
  batas_waktu_pembayaran: z.string().nullable().optional(),
  waktu_check_in: z.string().nullable().optional(),
  keterangan: z.string().nullable().optional(),
});

export type PemesananParsed = z.infer<typeof PemesananSchema>;
