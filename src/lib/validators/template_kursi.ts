import { z } from "zod";

export const TemplateKursiSchema = z.object({
  template_kursi_id: z.number().optional(),
  master_gerbong_id: z.number(),
  kode_kursi: z.string().max(10), // A1, A2, B1, etc
  posisi: z.enum(["jendela", "lorong", "tengah"]),
  is_premium: z.boolean().default(false),
  is_difabel: z.boolean().default(false),
  koordinat_x: z.number().nullable().optional(),
  koordinat_y: z.number().nullable().optional(),
  fasilitas_kursi: z.any().nullable().optional(), // JSONB for facilities
});

export type TemplateKursiParsed = z.infer<typeof TemplateKursiSchema>;
