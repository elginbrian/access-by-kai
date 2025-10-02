import { z } from "zod";

const StatusTiketEnum = z.enum(["AKTIF", "DIBATALKAN", "DIUBAH_JADWALNYA", "BOARDING", "COMPLETED"]);

export const TiketSchema = z.object({
  tiket_id: z.number().optional(),
  segment_id: z.number(),
  penumpang_id: z.number(),
  jadwal_kursi_id: z.number(),
  kode_tiket: z.string().max(20), // Boarding pass code (changed from kode_boarding_pass)
  harga_tiket: z.number().positive(), // Changed from harga to harga_tiket
  status_tiket: StatusTiketEnum.default("AKTIF").optional(),
  waktu_check_in: z.string().nullable().optional(),
  waktu_boarding: z.string().nullable().optional(),
  gate_boarding: z.string().max(10).nullable().optional(),
  keterangan: z.string().nullable().optional(),
});

export type TiketParsed = z.infer<typeof TiketSchema>;
