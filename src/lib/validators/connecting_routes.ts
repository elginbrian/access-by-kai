import { z } from "zod";

export const ConnectingRoutesSchema = z.object({
  connecting_id: z.number().optional(),
  rute_utama_id: z.number(),
  rute_lanjutan_id: z.number(),
  stasiun_transit_id: z.number(),
  min_transit_time: z.string().default("30 minutes"), // INTERVAL as string
  max_transit_time: z.string().default("4 hours"), // INTERVAL as string
  is_guaranteed_connection: z.boolean().default(false),
  tarif_connecting: z.number().default(0.0),
});

export type ConnectingRoutesParsed = z.infer<typeof ConnectingRoutesSchema>;
