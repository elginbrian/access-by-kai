"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { colors } from "../../design-system/colors";
import Button from "../../../components/button/Button";
import ProgressBar from "../../../components/register/RegisterIndicator";
import Step1 from "../../../components/register/steps/Step1";
import Step2 from "../../../components/register/steps/Step2";
import Step3 from "../../../components/register/steps/Step3";
import { useRegister } from "@/lib/auth/authHooks";
import { RegisterSchema, type RegisterForm } from "@/lib/validators/auth";

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ["Data Diri", "Verifikasi", "Selesai"];
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof RegisterForm)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["email", "nama_lengkap", "nomor_telepon"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["password", "confirmPassword"];
    }

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep((prev) => (prev < steps.length ? prev + 1 : prev));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const onSubmit = async (data: RegisterForm) => {
    registerMutation.mutate(data);
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
              Daftar
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6 w-full">
              <ProgressBar steps={steps} currentStep={currentStep} />
            </div>

            {currentStep === 1 && <Step1 register={register} errors={errors} />}

            {currentStep === 2 && <Step2 register={register} errors={errors} />}

            {currentStep === 3 && (
              <div className="text-center py-5">
                <div
                  className="rounded-xl p-6 mb-6"
                  style={{
                    backgroundColor: colors.violet.light,
                    border: `1px solid ${colors.violet.normalActive}`,
                  }}
                >
                  <h3 className="text-lg font-semibold mb-3" style={{ color: colors.violet.normal }}>
                    🎉 Registrasi Berhasil!
                  </h3>
                  <p className="text-sm leading-relaxed m-0" style={{ color: colors.violet.dark }}>
                    Silakan cek email Anda untuk verifikasi akun sebelum login.
                  </p>
                </div>

                <Button
                  variant="active"
                  className="w-full p-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  style={{
                    background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
                  }}
                  onClick={() => (window.location.href = "/auth/login")}
                >
                  <div className="flex items-center justify-center gap-2 w-full">
                    <img src="/ic_door_in.svg" alt="Login Icon" className="w-4 h-4" />
                    <p className="m-0 text-base font-medium">Lanjut ke Login</p>
                  </div>
                </Button>
              </div>
            )}

            {currentStep < 3 && (
              <div className="mt-6">
                {/* Step 1: Hanya tombol Selanjutnya */}
                {currentStep === 1 && (
                  <Button
                    type="button"
                    variant="active"
                    className="w-full p-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    style={{
                      background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
                    }}
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center justify-center gap-2 w-full">
                      <img src="/ic_door_in.svg" alt="Next Icon" className="w-4 h-4" />
                      <p className="m-0 text-base font-medium">Selanjutnya</p>
                    </div>
                  </Button>
                )}

                {/* Step 2: Tombol Sebelumnya (outline) dan Daftar (filled) */}
                {currentStep === 2 && (
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full p-3 rounded-lg font-medium border disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity bg-transparent"
                      style={{
                        borderColor: colors.violet.normal,
                        color: colors.violet.normal,
                      }}
                      onClick={handlePrev}
                      disabled={registerMutation.isPending}
                    >
                      <div className="flex items-center justify-center gap-2 w-full">
                        <p className="m-0 text-base font-medium" style={{ color: colors.violet.normal }}>
                          Sebelumnya
                        </p>
                      </div>
                    </Button>

                    <Button
                      type="submit"
                      variant="active"
                      className="w-full p-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                      style={{
                        background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
                      }}
                      disabled={isSubmitting || registerMutation.isPending}
                    >
                      <div className="flex items-center justify-center gap-2 w-full">
                        <img src="/ic_door_in.svg" alt="Register Icon" className="w-4 h-4" />
                        <p className="m-0 text-base font-medium">{isSubmitting || registerMutation.isPending ? "Memproses..." : "Daftar"}</p>
                      </div>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentStep < 3 && (
              <div className="text-center mt-4">
                <span className="text-sm" style={{ color: colors.base.darkHover }}>
                  Sudah punya akun?{" "}
                  <Link
                    href="/auth/login"
                    className="no-underline font-semibold hover:opacity-80 transition-opacity"
                    style={{
                      background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Masuk
                  </Link>
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
