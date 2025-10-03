"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors } from "@/app/design-system/colors";
import type { Pengguna } from "@/types/models";

interface Props {
  profile?: Pengguna | null;
  kaiPayBalance?: number;
  railPointBalance?: number;
}

const ProfileSidebar: React.FC<Props> = ({ profile, kaiPayBalance = 125000, railPointBalance = 2450 }) => {
  const pathname = usePathname();
  const userId = profile?.user_id;
  const email = profile?.email || "john.doe@email.com";
  const avatarInitials = (profile?.nama_lengkap || "JD")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const navigationItems = [
    {
      label: "Riwayat Tiket",
      path: userId ? `/${userId}` : '#',
      icon: null,
    },
    {
      label: "KAI Pay & RaiPoint", 
      path: userId ? `/${userId}/paycard` : '#',
      icon: null,
    },
    {
      label: "Ganti Kata Sandi",
      path: userId ? `/${userId}/change-password` : '#',
      icon: null,
    },
    {
      label: "Daftar Penumpang",
      path: userId ? `/${userId}/manage/passengers` : '#',
      icon: null,
    },
    {
      label: "Pusat Bantuan",
      path: `/help`, // You might want to create this page or link to external help
      icon: null,
    },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    // You might want to call your logout function here
  };

  const isActivePath = (path: string) => {
    if (path === `/${userId}`) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-white p-6 shadow-2xl border-r border-gray-100 overflow-y-auto z-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.redPurple.normal} 100%)` }}>
          {avatarInitials}
        </div>
        <div>
          <div className="font-bold text-lg" style={{ color: colors.base.darker }}>
            {name}
          </div>
          <div className="text-sm" style={{ color: colors.base.darkActive }}>
            {email}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {userId ? (
          <>
            <Link 
              href={`/${userId}/paycard`}
              className="block"
            >
              <div
                className="text-white rounded-xl p-5 shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)`,
                  boxShadow: "0 8px 24px rgba(74, 144, 226, 0.25)",
                }}
              >
                <div className="flex items-center gap-3">
                  <img src="/ic_ewallet_white.svg" alt="Kai Pay" className="w-4 h-4" />
                  <div className="text-sm">Kai Pay</div>
                </div>
                <div className="text-2xl font-bold mt-2">Rp. {formatCurrency(kaiPayBalance)}</div>
              </div>
            </Link>

            <Link 
              href={`/${userId}/paycard`}
              className="block"
            >
              <div
                className="text-white rounded-xl p-5 shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, #f97316 0%, #ea580c 100%)`,
                  boxShadow: "0 8px 24px rgba(252, 187, 108, 0.25)",
                }}
              >
                <div className="flex items-center gap-3">
                  <img src="/ic_star_white.svg" alt="RaiPoint" className="w-4 h-4" />
                  <div className="text-sm">RaiPoint</div>
                </div>
                <div className="text-2xl font-bold mt-2">{formatCurrency(railPointBalance)}</div>
              </div>
            </Link>
          </>
        ) : (
          <>
            <div
              className="text-white rounded-xl p-5 shadow-lg opacity-50 cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)`,
                boxShadow: "0 8px 24px rgba(74, 144, 226, 0.25)",
              }}
            >
              <div className="flex items-center gap-3">
                <img src="/ic_ewallet_white.svg" alt="Kai Pay" className="w-4 h-4" />
                <div className="text-sm">Kai Pay</div>
              </div>
              <div className="text-2xl font-bold mt-2">Rp. {formatCurrency(kaiPayBalance)}</div>
            </div>

            <div
              className="text-white rounded-xl p-5 shadow-lg opacity-50 cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, #f97316 0%, #ea580c 100%)`,
                boxShadow: "0 8px 24px rgba(252, 187, 108, 0.25)",
              }}
            >
              <div className="flex items-center gap-3">
                <img src="/ic_star_white.svg" alt="RaiPoint" className="w-4 h-4" />
                <div className="text-sm">RaiPoint</div>
              </div>
              <div className="text-2xl font-bold mt-2">{formatCurrency(railPointBalance)}</div>
            </div>
          </>
        )}
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = isActivePath(item.path);
          const isDisabled = item.path === '#';
          
          return isDisabled ? (
            <div
              key={item.path}
              className="block w-full text-left px-4 py-3 rounded-xl font-medium opacity-50 cursor-not-allowed border border-gray-100"
              style={{ color: colors.base.darkActive }}
            >
              {item.label}
            </div>
          ) : (
            <Link
              key={item.path}
              href={item.path}
              className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                isActive
                  ? "text-white shadow-md"
                  : "hover:bg-gray-50 border border-gray-100"
              }`}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`,
                      boxShadow: "0 4px 12px rgba(92, 44, 173, 0.25)",
                    }
                  : { color: colors.base.darker }
              }
            >
              {item.label}
            </Link>
          );
        })}
        
        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 transform hover:scale-[1.01] border border-gray-100" 
          style={{ color: colors.red.normal }}
        >
          Keluar
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
