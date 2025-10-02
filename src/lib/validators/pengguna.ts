import { z } from "zod";

// Enums untuk validation
const TipeIdentitasEnum = z.enum(["KTP", "PASPOR", "SIM", "KITAS", "KITAP"]);
const JenisKelaminEnum = z.enum(["LAKI_LAKI", "PEREMPUAN"]);

export const PenggunaSchema = z.object({
  user_id: z.number().optional(),
  nik: z.string().max(20).nullable().optional(),
  tipe_identitas: TipeIdentitasEnum.default("KTP"),
  nomor_identitas: z.string().max(50),
  nama_lengkap: z.string().max(255),
  tanggal_lahir: z.string().nullable().optional(), // DATE
  jenis_kelamin: JenisKelaminEnum.nullable().optional(),
  email: z.string().email().max(255).nullable().optional(),
  nomor_telepon: z.string().max(20).nullable().optional(),
  password_hash: z.string().max(255).nullable().optional(),
  provinsi: z.string().max(100).nullable().optional(),
  kota_kabupaten: z.string().max(100).nullable().optional(),
  alamat_lengkap: z.string().nullable().optional(),
  hobi: z.array(z.string()).nullable().optional(), // TEXT[]
  pekerjaan: z.string().max(100).nullable().optional(),
  saldo_kaipay: z.number().default(0).optional(),
  poin_loyalitas: z.number().int().default(0).optional(),
  foto_profil_url: z.string().max(500).nullable().optional(),
  is_verified: z.boolean().default(false).optional(),
  waktu_registrasi: z.string().nullable().optional(),
  waktu_login_terakhir: z.string().nullable().optional(),
});

export type PenggunaParsed = z.infer<typeof PenggunaSchema>;
