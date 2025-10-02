import { z } from "zod";

// Posisi kursi enum sesuai DDL gen2
const PosisiKursiEnum = z.enum(["jendela", "lorong", "tengah"]);

export const InventarisKursiSchema = z.object({
  template_kursi_id: z.number().optional(),
  kode_kursi: z.string().min(1),
  master_gerbong_id: z.number(),
  posisi: PosisiKursiEnum,
  koordinat_x: z.number().nullable().optional(),
  koordinat_y: z.number().nullable().optional(),
  is_difabel: z.boolean().nullable().optional(),
  is_premium: z.boolean().nullable().optional(),
  fasilitas_kursi: z.any().nullable().optional(), // JSONB
});

export type InventarisKursiParsed = z.infer<typeof InventarisKursiSchema>;
