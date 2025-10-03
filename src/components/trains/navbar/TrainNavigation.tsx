"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
  const { user, isAuthenticated, loading } = useAuth();

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
  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#6b46c1] to-[#3b82f6]">
              <img src="/ic_train.svg" alt="Train" />
            </div>
            <span className="text-xl font-bold text-black">KAI</span>
          </div>
          <div className="flex space-x-8">
            <button onClick={() => handleNavClick("/")} className="text-purple-600 font-medium hover:opacity-80 transition-opacity">
              Beranda
            </button>
            <button onClick={() => handleNavClick("/trains")} className="text-black hover:text-purple-600 transition-colors">
              Tiket
            </button>
            <button onClick={() => handleNavClick("/promo")} className="text-black hover:text-purple-600 transition-colors">
              Promo
            </button>
            <button onClick={() => handleNavClick("/contact")} className="text-black hover:text-purple-600 transition-colors">
              Kontak
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {userIsLoggedIn ? (
              <UserDropdown displayName={displayName} displayAvatar={displayAvatar} onLogout={handleAuthClick} onNavigate={(p) => router.push(p)} profilePath={profilePath} />
            ) : (
              <div className="flex items-center space-x-3">
                <button onClick={() => handleNavClick("/auth/login")} className="text-purple-600 hover:text-purple-700 transition-colors font-medium text-sm px-4 py-2 rounded-full border border-purple-600 hover:bg-purple-50">
                  Masuk
                </button>
                <button onClick={() => handleNavClick("/auth/register")} className="bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium text-sm px-4 py-2 rounded-full">
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
