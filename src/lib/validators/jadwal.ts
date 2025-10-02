import { z } from "zod";

// Enums untuk validation
const StatusJadwalEnum = z.enum(["SESUAI_JADWAL", "TERLAMBAT", "DIBATALKAN", "MENUNGGU_BOARDING"]);

export const JadwalSchema = z.object({
  jadwal_id: z.number().optional(),
  kode_jadwal: z.string().max(20),
  master_kereta_id: z.number(), // Changed from kereta_id to master_kereta_id
  rute_id: z.number(),
  nomor_ka: z.string().max(20), // New field: KA 7016, KA 205, etc
  tanggal_keberangkatan: z.string(), // DATE
  waktu_berangkat_origin: z.string(), // TIMESTAMPTZ
  waktu_tiba_destination: z.string(), // TIMESTAMPTZ
  status_jadwal: StatusJadwalEnum.default("SESUAI_JADWAL").optional(),
  harga_base: z.number().positive(), // New required field
  multiplier_harga: z.number().positive().default(1.0).optional(), // For peak season, weekend, etc
  keterangan: z.string().nullable().optional(),
  created_by: z.number().nullable().optional(), // Reference to pengguna
  waktu_dibuat: z.string().nullable().optional(),
  waktu_diperbarui: z.string().nullable().optional(),
});

export type JadwalParsed = z.infer<typeof JadwalSchema>;
