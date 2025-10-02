import { z } from "zod";

// Enum untuk status inventaris kursi
const StatusInventarisEnum = z.enum(["TERSEDIA", "DIKUNCI", "DIPESAN", "TERISI"]);

export const KursiSchema = z.object({
  jadwal_kursi_id: z.number().optional(),
  jadwal_gerbong_id: z.number(),
  template_kursi_id: z.number(),
  kode_kursi: z.string().max(10),
  harga_kursi: z.number().min(0),
  multiplier_kursi: z.number().min(0).nullable().optional(),
  status_inventaris: StatusInventarisEnum.nullable().optional(),
  is_blocked: z.boolean().default(false).optional(),
  keterangan: z.string().nullable().optional(),
});

export type KursiParsed = z.infer<typeof KursiSchema>;
