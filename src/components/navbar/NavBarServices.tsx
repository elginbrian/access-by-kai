"use client";

import React from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";

interface NavBarServicesProps {
  service?: string;
}

const NavBarServices: React.FC<NavBarServicesProps> = ({ service }) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleNav = (path: string) => router.push(path);

  return (
    <nav className="sticky top-0 w-full z-30 flex items-center justify-between px-8 py-4 bg-white">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <img src="/ic_train.svg" alt="Train" />
        </div>
        <button onClick={() => handleNav("/")} className="text-xl font-semibold text-gray-800">
          KAI {service}
        </button>
      </div>

      <div className="flex gap-8">
        <button onClick={() => handleNav("/")} className="text-gray-700 hover:text-blue-600 font-medium">
          Home
        </button>
        <button onClick={() => handleNav("/trains")} className="text-gray-700 hover:text-blue-600 font-medium">
          Booking
        </button>
        <button onClick={() => handleNav("/promo")} className="text-gray-700 hover:text-blue-600 font-medium">
          Promo
        </button>
        <button onClick={() => handleNav("/contact")} className="text-gray-700 hover:text-blue-600 font-medium">
          Contact
        </button>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <button onClick={() => handleNav(`/profile/${user?.profile?.user_id ?? user?.id}`)} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
              {user?.profile?.foto_profil_url ? (
                <img src={user.profile.foto_profil_url} alt="avatar" className="w-10 h-10 object-cover" />
              ) : (
                <span className="text-white text-sm font-semibold">
                  {user?.profile?.nama_lengkap
                    ? user.profile.nama_lengkap
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                    : "U"}
                </span>
              )}
            </div>
            <span className="text-gray-700 font-medium">{user?.profile?.nama_lengkap ?? "User"}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => handleNav("/auth/login")} className="text-gray-700 hover:text-blue-600 font-medium">
              Login
            </button>
            <button onClick={() => handleNav("/auth/register")} className="bg-blue-600 text-white px-3 py-1 rounded-md">
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarServices;
