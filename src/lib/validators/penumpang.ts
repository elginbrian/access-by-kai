import { z } from "zod";

const TipeIdentitasEnum = z.enum(["KTP", "PASPOR", "SIM", "KITAS", "KITAP"]);
const JenisKelaminEnum = z.enum(["LAKI_LAKI", "PEREMPUAN"]);

export const PenumpangSchema = z.object({
  penumpang_id: z.number().optional(),
  user_id: z.number().nullable().optional(), // nullable untuk guest booking
  nama_lengkap: z.string().max(255),
  tipe_identitas: TipeIdentitasEnum,
  nomor_identitas: z.string().max(50),
  tanggal_lahir: z.string().nullable().optional(), // DATE
  jenis_kelamin: JenisKelaminEnum.nullable().optional(),
  kewarganegaraan: z.string().max(50).default("Indonesia").optional(),
  is_difabel: z.boolean().default(false).optional(),
  kebutuhan_khusus: z.string().nullable().optional(),
});

export type PenumpangParsed = z.infer<typeof PenumpangSchema>;
