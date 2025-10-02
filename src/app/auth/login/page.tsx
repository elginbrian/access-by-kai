"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { colors } from "../../design-system/colors";
import Button from "../../../components/button/Button";
import InputField from "../../../components/input/InputField";
import { useLogin, useGoogleLogin } from "@/lib/auth/authHooks";
import { LoginSchema, type LoginForm } from "@/lib/validators/auth";

const LoginPage = () => {
  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate();
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
                background: `linear-gradient(180deg, ${colors.violet.normal} 0%, ${colors.redPurple.normal} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Masuk
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium" style={{ color: colors.violet.normal }}>
                Email
              </label>
              <InputField
                startIcon={<img src="/ic_person.svg" alt="Login Icon" className="w-6 h-6" />}
                type="email"
                label="Masukkan email"
                {...register("email")}
                className={`w-full p-3 rounded-lg border`}
                style={{ borderColor: errors.email ? colors.red.normal : colors.violet.normal }}
              />
              {errors.email && (
                <span className="text-xs mt-1 block" style={{ color: colors.red.normal }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium" style={{ color: colors.violet.normal }}>
                Password
              </label>
              <InputField
                startIcon={<img src="/ic_key_lock.svg" alt="Lock Icon" className="w-6 h-6" />}
                type="password"
                label="Masukkan password"
                {...register("password")}
                className={`w-full p-3 rounded-lg border`}
                style={{ borderColor: errors.password ? colors.red.normal : colors.violet.normal }}
              />
              {errors.password && (
                <span className="text-xs mt-1 block" style={{ color: colors.red.normal }}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex items-center mb-6">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm" style={{ color: colors.violet.normal }}>
                Ingat saya
              </label>
            </div>
            <Button
              type="submit"
              variant="active"
              className="w-full p-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{
                background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
              }}
              disabled={isSubmitting || loginMutation.isPending}
            >
              <div className="flex items-center justify-center gap-2 w-full">
                <img src="/ic_door_in.svg" alt="Login Icon" className="w-4 h-4" />
                <p className="m-0 text-base font-medium">{isSubmitting || loginMutation.isPending ? "Memproses..." : "Masuk"}</p>
              </div>
            </Button>
          </form>
          <div className="text-center mt-6">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{
                background: `linear-gradient(180deg, ${colors.violet.normal} 0%, ${colors.redPurple.normal} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Lupa Password?
            </Link>
          </div>

          {/* Divider with "atau" */}
          <div className="flex items-center my-6 gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm font-medium text-gray-600">atau</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <button
            className="w-full p-3 rounded-lg border font-medium flex items-center justify-center gap-3 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: colors.base.dark,
              backgroundColor: colors.base.light,
              color: colors.base.darker,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.base.normalHover;
              e.currentTarget.style.borderColor = colors.violet.normal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.base.light;
              e.currentTarget.style.borderColor = colors.base.dark;
            }}
            onClick={handleGoogleLogin}
            disabled={googleLoginMutation.isPending}
          >
            <img src="/ic_google.svg" alt="Google Icon" />
            <span className="font-semibold" style={{ color: colors.base.darker }}>
              {googleLoginMutation.isPending ? "Memproses..." : "Google"}
            </span>
          </button>

          <div className="text-center mt-4">
            <span className="text-sm" style={{ color: colors.base.darkHover }}>
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="font-semibold hover:opacity-80 transition-opacity"
                style={{
                  background: `linear-gradient(180deg, ${colors.violet.normal} 0%, ${colors.redPurple.normal} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Daftar
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
