"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { colors } from "../../design-system/colors";

const OAuthSuccessPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Check if profile is complete
        if (user.profile?.nomor_telepon) {
          router.push("/dashboard");
        } else {
          router.push("/auth/complete-profile");
        }
      } else {
        router.push("/auth/login?error=oauth_failed");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: `3px solid ${colors.violet.normal}`,
            borderTop: "3px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: colors.violet.normal, fontSize: "16px" }}>Memproses login...</p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default OAuthSuccessPage;
