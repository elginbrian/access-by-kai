import { z } from "zod";

// Enum untuk jenis layanan kereta
const JenisLayananKeretaEnum = z.enum(["EKSEKUTIF", "EKONOMI", "CAMPURAN", "LUXURY", "PRIORITY", "IMPERIAL"]);

export const KeretaSchema = z.object({
  master_kereta_id: z.number().optional(),
  nama_kereta: z.string().max(255),
  kode_kereta: z.string().max(50),
  jenis_layanan: JenisLayananKeretaEnum,
  jumlah_gerbong: z.number().min(1),
  kapasitas_total: z.number().min(1),
  kecepatan_maksimal_kmh: z.number().nullable().optional(),
  nomor_seri_rangkaian: z.string().max(100).nullable().optional(),
  pabrik_pembuat: z.string().max(100).nullable().optional(),
  tahun_pembuatan: z.number().min(1900).max(new Date().getFullYear()).nullable().optional(),
  status_operasional: z.boolean().default(true).optional(),
  fasilitas_umum: z.any().nullable().optional(), // JSONB
  keterangan: z.string().nullable().optional(),
  waktu_dibuat: z.string().nullable().optional(), // TIMESTAMP
  waktu_diperbarui: z.string().nullable().optional(), // TIMESTAMP
});

export type KeretaParsed = z.infer<typeof KeretaSchema>;
