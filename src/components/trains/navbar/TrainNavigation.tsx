"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { signOut } from "@/lib/auth/authService";
import toast from "react-hot-toast";
import UserDropdown from "@/components/ui/UserDropdown";

interface TrainNavigationProps {
  userName?: string;
  userAvatar?: string;
  onNavClick?: (section: string) => void;
}

const TrainNavigation: React.FC<TrainNavigationProps> = ({ userName = "", userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest", onNavClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransparent, setIsTransparent] = useState(pathname === "/");
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const isHome = pathname === "/";
    if (!isHome) {
      setIsTransparent(false);
      return;
    }

    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsTransparent(!scrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const uid = user?.profile?.user_id ?? user?.id;
  const displayName = userName || user?.profile?.nama_lengkap || "";
  const displayAvatar = userAvatar || user?.profile?.foto_profil_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";
  const userIsLoggedIn = isAuthenticated || !!userName;
  const profilePath = uid ? `/profile/${uid}` : "/profile";

  const handleAuthClick = async () => {
    if (userIsLoggedIn) {
      try {
        await signOut();
        toast.success("Logout berhasil!");
        router.push("/");
      } catch (error) {
        toast.error("Terjadi kesalahan saat logout");
      }
    } else {
      router.push("/auth/login");
    }
  };

  const handleNavClick = (path: string) => {
    router.push(path);
  };
  const isHome = pathname === "/";

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav
      className={`${isTransparent ? "bg-transparent" : "bg-white "} ${isHome ? "fixed top-0 left-0" : "relative"} w-full z-50 transition-colors duration-200`}
      style={isHome ? { right: "var(--ai-sidebar-width, 0px)", width: "calc(100% - var(--ai-sidebar-width, 0px))" } : undefined}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10  flex items-center justify-center bg-gradient-to-r ">
              <img src="/access_logo.png" alt="Train" />
            </div>
            <span className={`${isTransparent ? "text-white" : "text-black"} text-xl font-bold`}>KAI</span>
          </div>
          <div className="flex space-x-8">
            <button onClick={() => handleNavClick("/")} className={`${isTransparent ? "text-white" : isActive("/") ? "text-purple-600 underline underline-offset-4 font-semibold" : "text-black font-medium"} hover:opacity-80 transition-all`}>
              Beranda
            </button>

            <button onClick={() => handleNavClick("/trains")} className={`${isTransparent ? "text-white" : isActive("/trains") ? "text-purple-600 font-semibold" : "text-black font-medium"} hover:text-purple-600 transition-colors`}>
              Antarkota
            </button>

            <button onClick={() => handleNavClick("/e-porter")} className={`${isTransparent ? "text-white" : isActive("/e-porter") ? "text-purple-600 font-semibold" : "text-black font-medium"} hover:text-purple-600 transition-colors`}>
              E-Porter
            </button>

            <button onClick={() => handleNavClick("/logistic")} className={`${isTransparent ? "text-white" : isActive("/logistic") ? "text-purple-600 font-semibold" : "text-black font-medium"} hover:text-purple-600 transition-colors`}>
              Logistik
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {userIsLoggedIn ? (
              <UserDropdown displayName={displayName} displayAvatar={displayAvatar} onLogout={handleAuthClick} onNavigate={(p) => router.push(p)} profilePath={profilePath} lightMode={isTransparent} />
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleNavClick("/auth/login")}
                  className={`${isTransparent ? "text-white border-white" : "text-purple-600 border-purple-600"} hover:text-purple-700 transition-colors font-medium text-sm px-4 py-2 rounded-full border`}
                >
                  Masuk
                </button>
                <button
                  onClick={() => handleNavClick("/auth/register")}
                  className={`${isTransparent ? "bg-white text-purple-600" : "bg-purple-600 text-white"} hover:bg-purple-700 transition-colors font-medium text-sm px-4 py-2 rounded-full`}
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TrainNavigation;
