import { z } from "zod";

export const ProgramLoyalitasSchema = z.object({
  program_id: z.number().optional(),
  nama_program: z.string().max(100),
  tier_level: z.string().max(20), // 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM'
  min_poin_required: z.number(),
  max_poin_limit: z.number().nullable().optional(),
  multiplier_earning: z.number().default(1.0),
  benefits: z.any().nullable().optional(), // JSONB for benefits
  is_active: z.boolean().default(true),
});

export type ProgramLoyalitasParsed = z.infer<typeof ProgramLoyalitasSchema>;
