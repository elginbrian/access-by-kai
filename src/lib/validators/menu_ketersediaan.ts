import { z } from "zod";

export const MenuKetersediaanSchema = z.object({
  ketersediaan_id: z.number().optional(),
  menu_id: z.number(),
  jadwal_id: z.number().nullable().optional(),
  rute_id: z.number().nullable().optional(),
  stok_tersedia: z.number().default(999),
  waktu_tersedia_mulai: z.string().nullable().optional(), // TIME format
  waktu_tersedia_selesai: z.string().nullable().optional(), // TIME format
  is_active: z.boolean().default(true),
});

export type MenuKetersediaanParsed = z.infer<typeof MenuKetersediaanSchema>;
