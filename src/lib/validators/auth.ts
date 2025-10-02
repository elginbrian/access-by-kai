import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Password harus diisi").min(6, "Password minimal 6 karakter"),
});

export const RegisterSchema = z
  .object({
    email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
    password: z.string().min(1, "Password harus diisi").min(6, "Password minimal 6 karakter").max(100, "Password maksimal 100 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
    nama_lengkap: z.string().min(1, "Nama lengkap harus diisi").min(2, "Nama lengkap minimal 2 karakter").max(100, "Nama lengkap maksimal 100 karakter"),
    nomor_telepon: z
      .string()
      .min(1, "Nomor telepon harus diisi")
      .regex(/^(\+62|62|0)[0-9]{9,13}$/, "Format nomor telepon tidak valid"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(1, "Password harus diisi").min(6, "Password minimal 6 karakter").max(100, "Password maksimal 100 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export const UpdateProfileSchema = z.object({
  nama_lengkap: z.string().min(1, "Nama lengkap harus diisi").min(2, "Nama lengkap minimal 2 karakter").max(100, "Nama lengkap maksimal 100 karakter"),
  nomor_telepon: z
    .string()
    .min(1, "Nomor telepon harus diisi")
    .regex(/^(\+62|62|0)[0-9]{9,13}$/, "Format nomor telepon tidak valid"),
  tanggal_lahir: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Format tanggal tidak valid",
    }),
});

export const GoogleOAuthCallbackSchema = z.object({
  provider: z.literal("google"),
  providerAccountId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  picture: z.string().url().optional(),
});

export const CompleteGoogleProfileSchema = z.object({
  nomor_telepon: z
    .string()
    .min(1, "Nomor telepon harus diisi")
    .regex(/^(\+62|62|0)[0-9]{9,13}$/, "Format nomor telepon tidak valid"),
  tanggal_lahir: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Format tanggal tidak valid",
    }),
});

export type LoginForm = z.infer<typeof LoginSchema>;
export type RegisterForm = z.infer<typeof RegisterSchema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
export type UpdateProfileForm = z.infer<typeof UpdateProfileSchema>;
export type GoogleOAuthCallbackData = z.infer<typeof GoogleOAuthCallbackSchema>;
export type CompleteGoogleProfileForm = z.infer<typeof CompleteGoogleProfileSchema>;
