import { z } from "zod";

export const TransferRequestSchema = z.object({
  from_user_id: z.number(),
  to_user_id: z.number(),
  tiket_id: z.number(),
  from_accepted: z.boolean().optional().default(false),
  to_accepted: z.boolean().optional().default(false),
  accepted_at: z.string().nullable().optional(),
  waiting_period_seconds: z.number().int().nullable().optional(),
  requested_at: z.string().optional(),
  expires_at: z.string().optional(),
  status: z.enum(["PENDING", "CANCELLED", "REJECTED", "COMPLETED"]).default("PENDING").optional(),
  notes: z.string().nullable().optional(),
});

export type TransferRequestParsed = z.infer<typeof TransferRequestSchema>;

export const TrustedContactSchema = z.object({
  user_id: z.number(),
  contact_user_id: z.number(),
  status: z.enum(["PENDING", "VERIFIED", "REVOKED"]).default("PENDING"),
  created_at: z.string().optional(),
});

export type TrustedContactParsed = z.infer<typeof TrustedContactSchema>;

export const TransferLimitConfigSchema = z.object({
  monthly_limit_tickets: z.number().int().positive().default(10),
  max_tickets_per_transfer: z.number().int().positive().default(4),
});

export type TransferLimitConfigParsed = z.infer<typeof TransferLimitConfigSchema>;
