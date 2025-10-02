"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string;
  fallbackPath?: string;
}

export function AuthGuard({ children, requireAuth = true, requireRole, fallbackPath = "/auth/login" }: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(fallbackPath);
      return;
    }

    if (requireRole && user?.profile) {
      const userRole = (user.profile as any).role || "user";
      if (userRole !== requireRole) {
        router.push("/unauthorized");
        return;
      }
    }

    if (!requireAuth && isAuthenticated) {
      router.push("/");
      return;
    }
  }, [user, loading, isAuthenticated, requireAuth, requireRole, router, fallbackPath]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireRole && user?.profile) {
    const userRole = (user.profile as any).role || "user";
    if (userRole !== requireRole) {
      return null;
    }
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function withAuth<P extends object>(Component: React.ComponentType<P>, options: Omit<AuthGuardProps, "children"> = {}) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { requireRole: "admin", fallbackPath: "/unauthorized" });
}

export function ProtectedSection({ children, requireRole, fallback }: { children: React.ReactNode; requireRole?: string; fallback?: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return fallback || null;
  }

  if (requireRole && user?.profile) {
    const userRole = (user.profile as any).role || "user";
    if (userRole !== requireRole) {
      return fallback || null;
    }
  }

  return <>{children}</>;
}
