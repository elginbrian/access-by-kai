"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import { useRouter, usePathname } from "next/navigation";
// import { useAuth } from "@/lib/auth/AuthContext";

type AdminNavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
};

type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

const NavBarAdmin = () => {
  const router = useRouter();
  const pathname = usePathname();
  // const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Extract admin ID from pathname
  const adminId = pathname?.split("/")[2] || "admin";

  const navigationSections: AdminNavSection[] = [
    {
      title: "Dashboard",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: `/admin/${adminId}`,
          icon: <Icon name="grid" className="w-5 h-5" />,
        },
        {
          id: "notification",
          label: "Notifikasi Admin",
          href: `/admin/${adminId}/notification`,
          icon: <Icon name="bell" className="w-5 h-5" />,
          badge: "3",
        },
      ],
    },
    {
      title: "Kelola Kereta Penumpang",
      items: [
        {
          id: "jadwal",
          label: "Jadwal & Penumpang",
          href: `/admin/${adminId}/kelola/jadwal`,
          icon: <Icon name="calendar" className="w-5 h-5" />,
        },
        {
          id: "kereta",
          label: "Kelola Kereta",
          href: `/admin/${adminId}/kelola/kereta`,
          icon: <Icon name="truck" className="w-5 h-5" />,
        },
      ],
    },
    {
      title: "Kelola Logistik",
      items: [
        {
          id: "barang",
          label: "Kereta Barang",
          href: `/admin/${adminId}/kelola/barang`,
          icon: <Icon name="box" className="w-5 h-5" />,
        },
        {
          id: "logistic",
          label: "Pemesanan Logistik",
          href: `/admin/${adminId}/kelola/logistic`,
          icon: <Icon name="truck" className="w-5 h-5" />,
        },
      ],
    },
    {
      title: "Kelola Layanan",
      items: [
        {
          id: "eporter",
          label: "e-Porter",
          href: `/admin/${adminId}/kelola/eporter`,
          icon: <Icon name="user" className="w-5 h-5" />,
        },
        {
          id: "showlok",
          label: "Shower & Locker",
          href: `/admin/${adminId}/kelola/showlok`,
          icon: <Icon name="box" className="w-5 h-5" />,
        },
        {
          id: "luxlou",
          label: "Luxury Lounge",
          href: `/admin/${adminId}/kelola/luxlou`,
          icon: <Icon name="grid" className="w-5 h-5" />,
        },
      ],
    },
  ];

  const isActive = (href: string): boolean => {
    if (href === `/admin/${adminId}`) {
      return pathname === href;
    }
    return pathname?.startsWith(href) || false;
  };

  const handleNavigation = (href: string) => {
    console.log("Navigating to:", href, "Current pathname:", pathname);
    router.push(href);
  };

  const handleLogout = () => {
    // Add logout logic here
    router.push("/");
  };

  return (
    <div className={`h-screen overflow-hidden bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div>
                <div className="font-bold text-gray-800">KAI System</div>
                <div className="text-xs text-gray-500">Railway Management</div>
              </div>
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <Icon name="chevDown" className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-hidden">
        {navigationSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-3">{section.title}</div>}

            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "text-purple-600 bg-purple-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">{item.badge}</span>}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="space-y-2">
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-8 h-8 rounded-full border border-gray-200" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">Admin User</div>
                <div className="text-xs text-gray-500 truncate">Administrator</div>
              </div>
            </div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
              <Icon name="logout" className="w-5 h-5" />
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Collapsed User Avatar */}
            <div className="flex justify-center">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-8 h-8 rounded-full border border-gray-200" />
            </div>

            {/* Collapsed Logout Button */}
            <button onClick={handleLogout} className="w-full flex justify-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Keluar">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBarAdmin;
