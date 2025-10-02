import { z } from "zod";

export const PerhentianRuteSchema = z.object({
  perhentian_rute_id: z.number().optional(),
  rute_id: z.number(),
  stasiun_id: z.number(),
  urutan: z.number(),
  waktu_tiba: z.string().nullable().optional(),
  waktu_berangkat: z.string().nullable().optional(),
});

export type PerhentianRuteParsed = z.infer<typeof PerhentianRuteSchema>;
