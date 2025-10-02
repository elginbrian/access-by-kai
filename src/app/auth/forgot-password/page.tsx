"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { colors } from "../../design-system/colors";
import Button from "../../../components/button/Button";
import InputField from "../../../components/input/InputField";
import { useForgotPassword } from "@/lib/auth/authHooks";
import { ForgotPasswordSchema, type ForgotPasswordForm } from "@/lib/validators/auth";

const ForgotPasswordPage = () => {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="relative w-full h-screen flex">
      <style jsx>{`
        .mobile-gradient {
          background: linear-gradient(135deg, ${colors.base.light} 0%, ${colors.violet.light} 100%);
        }
      `}</style>

      {/* Desktop Background Section */}
      <div className="hidden md:block absolute inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: "url(/background_login.png)" }}>
        {/* Optional Overlay */}
        <div className="absolute inset-0 bg-black/25"></div>
        {/* Ornament Section */}
        <div className="flex-1 bg-cover bg-center" style={{ backgroundImage: "url(/ornament.svg)" }} />
      </div>

      {/* Mobile Background Section */}
      <div className="md:hidden absolute inset-0 mobile-gradient -z-10"></div>

      {/* Desktop Left Section */}
      <div className="hidden md:block flex-1 bg-cover bg-center" style={{ backgroundImage: "url(/login_left_section.png)" }} />

      {/* Content Section */}
      <div className="flex-1 flex justify-center items-center md:p-0 p-5">
        <div className="w-full max-w-sm bg-white/95 md:bg-white backdrop-blur-sm md:backdrop-blur-none rounded-2xl p-8 md:shadow-xl shadow-none z-10">
          <div className="text-center mb-6">
            <h1
              className="text-4xl font-bold"
              style={{
                background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Lupa Password
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium" style={{ color: colors.violet.normal }}>
                Email
              </label>
              <InputField
                startIcon={<img src="/ic_person.svg" alt="Email Icon" className="w-6 h-6" />}
                type="email"
                label="Masukkan email"
                {...register("email")}
                className="w-full p-3 rounded-lg border"
                style={{ borderColor: errors.email ? colors.red.normal : colors.violet.normal }}
              />
              {errors.email && (
                <span className="text-xs mt-1 block" style={{ color: colors.red.normal }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm text-center" style={{ color: colors.base.darkHover }}>
                Kami akan mengirimkan link reset password ke email Anda
              </p>
            </div>

            <Button
              type="submit"
              variant="active"
              className="w-full p-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{
                background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
              }}
              disabled={isSubmitting || forgotPasswordMutation.isPending}
            >
              <div className="flex items-center justify-center gap-2 w-full">
                <img src="/ic_door_in.svg" alt="Email Icon" className="w-4 h-4" />
                <p className="m-0 text-base font-medium">{isSubmitting || forgotPasswordMutation.isPending ? "Mengirim..." : "Kirim Link Reset"}</p>
              </div>
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/auth/login"
              className="text-sm font-semibold no-underline hover:opacity-80 transition-opacity"
              style={{
                background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
