import { z } from "zod";

export const AdminPinSchema = z.object({
  pin: z
    .string()
    .min(6, "PIN harus 6 karakter")
    .max(6, "PIN harus 6 karakter")
    .regex(/^[a-zA-Z0-9]{6}$/, "PIN harus berupa alfanumerik 6 karakter"),
});

export type AdminPinForm = z.infer<typeof AdminPinSchema>;
