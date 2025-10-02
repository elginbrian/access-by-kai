import { z } from "zod";

export const MenuItemRailfoodSchema = z.object({
  menu_id: z.number().optional(),
  nama_menu: z.string(),
  deskripsi: z.string().nullable().optional(),
  harga: z.number(),
  kategori: z.string().nullable().optional(),
  is_available: z.boolean().nullable().optional(),
  is_halal: z.boolean().nullable().optional(),
  is_vegetarian: z.boolean().nullable().optional(),
  kalori: z.number().nullable().optional(),
  estimasi_persiapan_menit: z.number().nullable().optional(),
  gambar_url: z.string().nullable().optional(),
  allergens: z.array(z.string()).nullable().optional(),
  ingredients: z.array(z.string()).nullable().optional(),
});

export type MenuItemRailfoodParsed = z.infer<typeof MenuItemRailfoodSchema>;
