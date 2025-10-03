"use client";

import React, { useState } from "react";
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
  const adminId = pathname?.split('/')[2] || 'admin';

  const navigationSections: AdminNavSection[] = [
    {
      title: "Dashboard",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: `/admin/${adminId}`,
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          ),
        },
        {
          id: "notification",
          label: "Notifikasi Admin",
          href: `/admin/${adminId}/notification`,
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
          ),
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
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
          ),
        },
        {
          id: "kereta",
          label: "Kelola Kereta",
          href: `/admin/${adminId}/kelola/kereta`,
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 011-1h1a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM6 4a2 2 0 012-2h6a2 2 0 012 2v11a2 2 0 01-2 2H8a2 2 0 01-2-2V4z"/>
            </svg>
          ),
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
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          ),
        },
        {
          id: "logistic",
          label: "Pemesanan Logistik",
          href: `/admin/${adminId}/kelola/logistic`,
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          ),
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
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
          ),
        },
        {
          id: "showlok",
          label: "Shower & Locker",
          href: `/admin/${adminId}/kelola/showlok`,
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          ),
        },
        {
          id: "luxlou",
          label: "Luxury Lounge",
          href: `/admin/${adminId}/kelola/luxlou`,
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          ),
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
    console.log('Navigating to:', href, 'Current pathname:', pathname);
    router.push(href);
  };

  const handleLogout = () => {
    // Add logout logic here
    router.push('/');
  };

  return (
    <div className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
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
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-3">
                {section.title}
              </div>
            )}
            
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
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
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="Admin"
                className="w-8 h-8 rounded-full border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  Admin User
                </div>
                <div className="text-xs text-gray-500 truncate">Administrator</div>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Collapsed User Avatar */}
            <div className="flex justify-center">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="Admin"
                className="w-8 h-8 rounded-full border border-gray-200"
              />
            </div>
            
            {/* Collapsed Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Keluar"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBarAdmin;