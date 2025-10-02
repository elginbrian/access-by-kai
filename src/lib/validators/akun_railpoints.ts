import { z } from "zod";

export const AkunRailpointsSchema = z.object({
  akun_id: z.number().optional(),
  user_id: z.number(),
  program_id: z.number(),
  saldo_poin: z.number().nullable().optional(),
  tier_saat_ini: z.string().nullable().optional(),
  poin_untuk_tier_berikutnya: z.number().nullable().optional(),
  total_poin_earned_lifetime: z.number().nullable().optional(),
  tanggal_join: z.string().nullable().optional(), // TIMESTAMP
  tanggal_tier_upgrade: z.string().nullable().optional(), // TIMESTAMP
});

export type AkunRailpointsParsed = z.infer<typeof AkunRailpointsSchema>;
