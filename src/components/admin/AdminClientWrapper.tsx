"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { AuthGuard } from "@/lib/auth/AuthGuard";

export default function AdminClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* <AuthGuard requireRole={"admin"} fallbackPath="/unauthorized"> */}
      {children}
      {/* </AuthGuard> */}
    </AuthProvider>
  );
}
