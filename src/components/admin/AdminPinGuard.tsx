"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminPinGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const isAdmin = sessionStorage.getItem("isAdminAuthenticated");
      if (!isAdmin) {
        const url = new URL(window.location.href);
        const redirect = pathname || "/admin/1";
        router.push(`/auth/login-admin?redirect=${encodeURIComponent(redirect)}`);
      }
    } catch (err) {}
  }, [router, pathname]);

  if (typeof window === "undefined") return null;

  const isAdmin = sessionStorage.getItem("isAdminAuthenticated");
  if (!isAdmin) return null;

  return <>{children}</>;
}
