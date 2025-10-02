import { z } from "zod";

// Status perpindahan kursi enum sesuai DDL gen2
const StatusPerpindahanKursiEnum = z.enum(["MENUNGGU_PERSETUJUAN", "DISETUJUI", "DITOLAK", "DIBATALKAN"]);

export const PermintaanPerpindahanKursiSchema = z.object({
  perpindahan_id: z.number().optional(),
  pemohon_user_id: z.number(),
  target_user_id: z.number().nullable().optional(),
  tiket_asal_id: z.number(),
  tiket_tujuan_id: z.number().nullable().optional(),
  jadwal_kursi_tujuan_id: z.number(),
  tipe_perpindahan: z.string().min(1),
  alasan: z.string().nullable().optional(),
  status_perpindahan: StatusPerpindahanKursiEnum.nullable().optional(),
  biaya_perpindahan: z.number().min(0).nullable().optional(),
  diproses_oleh: z.number().nullable().optional(),
  keterangan_admin: z.string().nullable().optional(),
  waktu_permintaan: z.string().nullable().optional(),
  waktu_diproses: z.string().nullable().optional(),
});

export type PermintaanPerpindahanKursiParsed = z.infer<typeof PermintaanPerpindahanKursiSchema>;
