import { z } from "zod";

export const PesananRailfoodItemsSchema = z.object({
  detail_id: z.number().optional(),
  pesanan_railfood_id: z.number(),
  menu_id: z.number(),
  jumlah: z.number().default(1),
  harga_satuan: z.number(),
  subtotal: z.number(),
  catatan_item: z.string().nullable().optional(),
});

export type PesananRailfoodItemsParsed = z.infer<typeof PesananRailfoodItemsSchema>;
