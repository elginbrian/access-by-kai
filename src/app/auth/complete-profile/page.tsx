"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { colors } from "../../design-system/colors";
import Button from "../../../components/button/Button";
import InputField from "../../../components/input/InputField";
import { useCompleteGoogleProfile } from "@/lib/auth/authHooks";
import { CompleteGoogleProfileSchema, type CompleteGoogleProfileForm } from "@/lib/validators/auth";

const CompleteProfilePage = () => {
  const completeProfileMutation = useCompleteGoogleProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompleteGoogleProfileForm>({
    resolver: zodResolver(CompleteGoogleProfileSchema),
  });

  const onSubmit = async (data: CompleteGoogleProfileForm) => {
    completeProfileMutation.mutate(data);
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
          <div className="text-center">
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Lengkapi Profil
            </h1>
            <p className="text-sm mb-6" style={{ color: colors.base.darkHover }}>
              Silakan lengkapi informasi profil Anda untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium" style={{ color: colors.violet.normal }}>
                Nomor Telepon
              </label>
              <InputField
                startIcon={<img src="/ic_phone.svg" alt="Phone Icon" className="w-6 h-6" />}
                type="tel"
                label="Masukkan nomor telepon"
                {...register("nomor_telepon")}
                className="w-full p-3 rounded-lg border"
                style={{ borderColor: errors.nomor_telepon ? colors.red.normal : colors.violet.normal }}
              />
              {errors.nomor_telepon && (
                <span className="text-xs mt-1 block" style={{ color: colors.red.normal }}>
                  {errors.nomor_telepon.message}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium" style={{ color: colors.violet.normal }}>
                Tanggal Lahir (Opsional)
              </label>
              <InputField
                startIcon={<img src="/ic_calendar.svg" alt="Calendar Icon" className="w-6 h-6" />}
                type="date"
                label=""
                {...register("tanggal_lahir")}
                className="w-full p-3 rounded-lg border"
                style={{ borderColor: errors.tanggal_lahir ? colors.red.normal : colors.violet.normal }}
              />
              {errors.tanggal_lahir && (
                <span className="text-xs mt-1 block" style={{ color: colors.red.normal }}>
                  {errors.tanggal_lahir.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="active"
              className="w-full p-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{
                background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
              }}
              disabled={isSubmitting || completeProfileMutation.isPending}
            >
              <div className="flex items-center justify-center gap-2 w-full">
                <img src="/ic_door_in.svg" alt="Complete Icon" className="w-4 h-4" />
                <p className="m-0 text-base font-medium">{isSubmitting || completeProfileMutation.isPending ? "Memproses..." : "Lengkapi Profil"}</p>
              </div>
            </Button>
          </form>

          <div className="text-center mt-4">
            <Link
              href="/auth/login"
              className="no-underline text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{
                background: `linear-gradient(180deg, ${colors.violet.normal} 0%, ${colors.redPurple.normal} 100%)`,
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

export default CompleteProfilePage;
