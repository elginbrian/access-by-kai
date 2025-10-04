"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "../../../components/button/Button";
import { AdminPinSchema, type AdminPinForm } from "../../../lib/validators/admin";
import { colors } from "../../design-system/colors";

export default function LoginAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams?.get("redirect") || "/admin/1";

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<AdminPinForm>({ resolver: zodResolver(AdminPinSchema) });
  const [values, setValues] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const inputBaseStyle: React.CSSProperties = {
    width: 48,
    height: 48,
    textAlign: "center",
    fontFamily: "monospace",
    fontSize: 18,
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 2,
    backgroundColor: "#ffffff",
    color: colors.base.darker ?? "#222",
    outline: "none",
    transition: "border-color 120ms ease, box-shadow 120ms ease",
  };

  // keep form value in sync
  useEffect(() => {
    const combined = values.join("");
    try {
      // keep react-hook-form value in sync so resolver validation reflects current digits
      setValue("pin", combined, { shouldValidate: true, shouldDirty: true });
      // optionally ensure the field is validated immediately
      trigger("pin");
    } catch (e) {
      // ignore
    }
  }, [values]);

  const onSubmit = async (data: AdminPinForm) => {
    // ensure combined value used
    const pin = values.join("");
    // validate quickly (zod will also validate) - here we assume UI-level pass
    if (pin.length !== 6) return;

    // Client-side pretend flow: set session flag
    sessionStorage.setItem("isAdminAuthenticated", "true");
    sessionStorage.setItem("isAdminAuthenticatedAt", new Date().toISOString());
    router.push(redirect);
  };

  return (
    <div className="relative w-full h-screen flex">
      <style jsx>{`
        .mobile-gradient {
          background: linear-gradient(135deg, ${colors.base.light} 0%, ${colors.violet.light} 100%);
        }
      `}</style>

      <div className="hidden md:block absolute inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: "url(/background_login.png)" }}>
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="flex-1 bg-cover bg-center" style={{ backgroundImage: "url(/ornament.svg)" }} />
      </div>

      <div className="md:hidden absolute inset-0 mobile-gradient -z-10"></div>

      <div className="hidden md:block flex-1 bg-cover bg-center" style={{ backgroundImage: "url(/login_left_section.png)" }} />

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
              Login Admin
            </h1>
            <p className="text-sm text-gray-600 mt-2">Masukkan PIN admin 6 karakter (alfanumerik)</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium" style={{ color: colors.violet.normal }}>
                PIN Admin
              </label>

              <div
                className="flex items-center justify-between gap-2"
                onPaste={(e) => {
                  e.preventDefault();
                  const paste = e.clipboardData.getData("Text") || "";
                  const filtered = paste.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6);
                  if (!filtered) return;
                  const next = Array(6)
                    .fill("")
                    .map((_, i) => filtered[i] || "");
                  setValues(next);
                  const lastIndex = Math.min(filtered.length - 1, 5);
                  setTimeout(() => inputRefs.current[lastIndex]?.focus(), 0);
                }}
              >
                {values.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="text"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={val}
                    onChange={(e) => {
                      const raw = e.target.value || "";
                      const ch = raw.replace(/[^a-zA-Z0-9]/g, "").slice(-1);
                      if (!ch) return;
                      const next = [...values];
                      next[idx] = ch;
                      setValues(next);
                      const nextIndex = Math.min(idx + 1, 5);
                      inputRefs.current[nextIndex]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        e.preventDefault();
                        const next = [...values];
                        if (next[idx]) {
                          next[idx] = "";
                          setValues(next);
                          inputRefs.current[idx]?.focus();
                        } else if (idx > 0) {
                          inputRefs.current[idx - 1]?.focus();
                          const prev = [...values];
                          prev[idx - 1] = "";
                          setValues(prev);
                        }
                      }
                    }}
                    style={{
                      ...inputBaseStyle,
                      borderColor: errors.pin ? colors.red.normal : colors.base.dark,
                      caretColor: colors.violet.normal,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.violet.normal;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.violet.light}33`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.pin ? colors.red.normal : colors.base.dark;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                ))}
              </div>

              {errors.pin && (
                <span className="text-xs mt-1 block" style={{ color: colors.red.normal }}>
                  {errors.pin.message}
                </span>
              )}

              <input type="hidden" {...register("pin")} />
            </div>

            <Button
              type="submit"
              variant="active"
              className="w-full p-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{
                background: `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`,
              }}
              disabled={isSubmitting}
            >
              <div className="flex items-center justify-center gap-2 w-full">
                <img src="/ic_lock.svg" alt="Login Icon" className="w-4 h-4" />
                <p className="m-0 text-base font-medium">Masuk sebagai Admin</p>
              </div>
            </Button>
          </form>

          <div className="text-center mt-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{
                background: `linear-gradient(180deg, ${colors.violet.normal} 0%, ${colors.redPurple.normal} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Kembali ke login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
