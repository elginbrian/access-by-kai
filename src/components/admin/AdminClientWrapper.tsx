"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminPinGuard from "./AdminPinGuard";

export default function AdminClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminPinGuard>{children}</AdminPinGuard>
    </AuthProvider>
  );
}
