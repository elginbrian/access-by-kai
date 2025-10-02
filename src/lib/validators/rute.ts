import { z } from "zod";

// Enums untuk validation
const TipeKoneksiEnum = z.enum(["LANGSUNG", "TRANSIT", "CONNECTING"]);

export const RuteSchema = z.object({
  rute_id: z.number().optional(),
  kode_rute: z.string().max(30),
  nama_rute: z.string().max(300),
  tipe_koneksi: TipeKoneksiEnum.default("LANGSUNG").optional(),
  jarak_total_km: z.number().positive().nullable().optional(),
  estimasi_waktu_tempuh: z.string().nullable().optional(), // INTERVAL
  tarif_dasar: z.number().positive().nullable().optional(),
  is_aktif: z.boolean().default(true).optional(),
  keterangan: z.string().nullable().optional(),
  waktu_dibuat: z.string().nullable().optional(),
});

export type RuteParsed = z.infer<typeof RuteSchema>;
