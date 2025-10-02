"use client";

import { Toaster } from "react-hot-toast";
import { colors } from "@/app/design-system";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 4000,
        style: {
          background: colors.base.darker,
          color: colors.base.light,
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },

        success: {
          duration: 3000,
          style: {
            background: colors.violet.normal,
            color: colors.base.light,
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(92, 44, 173, 0.25)",
          },
          iconTheme: {
            primary: colors.base.light,
            secondary: colors.violet.normal,
          },
        },
        error: {
          duration: 4000,
          style: {
            background: colors.red.normal,
            color: colors.base.light,
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(238, 22, 12, 0.25)",
          },
          iconTheme: {
            primary: colors.base.light,
            secondary: colors.red.normal,
          },
        },
        loading: {
          style: {
            background: colors.orange.normal,
            color: colors.base.light,
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(252, 187, 108, 0.25)",
          },
          iconTheme: {
            primary: colors.base.light,
            secondary: colors.orange.normal,
          },
        },
      }}
    />
  );
}
