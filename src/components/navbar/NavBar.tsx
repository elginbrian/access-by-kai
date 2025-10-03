"use client";

import React from "react";
import Icon from "@/components/ui/Icon";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { signOut } from "@/lib/auth/authService";
import toast from "react-hot-toast";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAuth();

  const handleAuthClick = async () => {
    if (isAuthenticated) {
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

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const MenuIcon = () => <Icon name="menu" className="w-6 h-6" />;
  const XIcon = () => <Icon name="x" className="w-6 h-6" />;

  return (
    <div
      className="w-full flex justify-center items-center min-h-[4rem]"
      style={{
        paddingTop: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
        position: "fixed",
        zIndex: 100,
        right: "var(--ai-sidebar-width, 0px)",
        width: "calc(100% - var(--ai-sidebar-width, 0px))",
      }}
    >
      <nav
        className="w-full max-w-[95rem] backdrop-blur-lg flex justify-center"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "160px",
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src="/ic_train.svg" alt="Train" />
              <span className="text-xl font-bold text-white">KAI Booking</span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => handleNavClick("/")} className={`text-white ${isActive("/") ? "underline underline-offset-4 font-semibold" : "hover:text-white/70"} transition-colors font-medium text-sm`}>
                Beranda
              </button>
              <button onClick={() => handleNavClick("/trains")} className={`text-white ${isActive("/trains") ? "text-purple-300 font-semibold" : "hover:text-white/70"} transition-colors font-medium text-sm`}>
                Antarkota
              </button>
              <button onClick={() => handleNavClick("/e-porter")} className={`text-white ${isActive("/e-porter") ? "text-purple-300 font-semibold" : "hover:text-white/70"} transition-colors font-medium text-sm`}>
                E-Porter
              </button>
              <button onClick={() => handleNavClick("/logistic")} className={`text-white ${isActive("/logistic") ? "text-purple-300 font-semibold" : "hover:text-white/70"} transition-colors font-medium text-sm`}>
                Logistik
              </button>
            </div>

            {/* Right side - Auth Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Bell Icon - Only show when logged in */}
                  <button className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                    <img src="/ic_bell.svg" alt="Notifications" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Avatar + Dropdown */}
                  <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 group">
                      <img
                        src={user?.profile?.foto_profil_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                        alt="Profile"
                        className="w-9 h-9 rounded-full border-2 border-white/30 group-hover:border-white/50 transition-colors"
                      />
                      {user?.profile?.nama_lengkap && <span className="text-white text-sm font-medium">{user.profile.nama_lengkap}</span>}
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 text-black">
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            const uid = user?.profile?.user_id ?? user?.id;
                            if (uid) router.push(`/profile/${uid}`);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Profil
                        </button>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            router.push("/mytickets");
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Tiket Saya
                        </button>
                        <div className="border-t" />
                        <button
                          onClick={async () => {
                            setIsMenuOpen(false);
                            await handleAuthClick();
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Keluar
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => handleNavClick("/auth/login")} className="text-white hover:text-white/70 transition-colors font-medium text-sm px-4 py-2 rounded-full border border-white/30 hover:border-white/50">
                    Masuk
                  </button>
                  <button onClick={() => handleNavClick("/auth/register")} className="bg-white text-gray-900 hover:bg-white/90 transition-colors font-medium text-sm px-4 py-2 rounded-full">
                    Daftar
                  </button>
                </>
              )}
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-md text-white hover:bg-white/10">
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="md:hidden backdrop-blur-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => handleNavClick("/")} className={`block w-full text-left px-3 py-2 rounded-md ${isActive("/") ? "underline underline-offset-4 font-semibold text-white" : "text-white hover:bg-white/10"}`}>
                Beranda
              </button>
              <button onClick={() => handleNavClick("/trains")} className={`block w-full text-left px-3 py-2 rounded-md ${isActive("/trains") ? "text-purple-300 font-semibold" : "text-white hover:bg-white/10"}`}>
                Antarkota
              </button>
              <button onClick={() => handleNavClick("/e-porter")} className={`block w-full text-left px-3 py-2 rounded-md ${isActive("/e-porter") ? "text-purple-300 font-semibold" : "text-white hover:bg-white/10"}`}>
                E-Porter
              </button>
              <button onClick={() => handleNavClick("/logistic")} className={`block w-full text-left px-3 py-2 rounded-md ${isActive("/logistic") ? "text-purple-300 font-semibold" : "text-white hover:bg-white/10"}`}>
                Logistik
              </button>

              <div className="border-t border-white/10 pt-2 mt-2">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4 px-3 py-2">
                    <button className="relative p-2 text-white hover:bg-white/10 rounded-full">
                      <img src="/ic_bell.svg" alt="Notifications" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button
                      onClick={() => {
                        const uid = user?.profile?.user_id ?? user?.id;
                        if (uid) {
                          setIsMenuOpen(false);
                          router.push(`/profile/${uid}`);
                        }
                      }}
                      className="flex items-center space-x-2"
                    >
                      <img src={user?.profile?.foto_profil_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Profile" className="w-9 h-9 rounded-full border-2 border-white/30" />
                      {user?.profile?.nama_lengkap && <span className="text-white text-sm font-medium">{user.profile.nama_lengkap}</span>}
                    </button>
                  </div>
                ) : (
                  <div className="px-3 py-2 space-y-2">
                    <button onClick={() => handleNavClick("/auth/login")} className="block w-full text-center px-4 py-2 text-white border border-white/30 rounded-full hover:border-white/50 transition-colors">
                      Masuk
                    </button>
                    <button onClick={() => handleNavClick("/auth/register")} className="block w-full text-center px-4 py-2 bg-white text-gray-900 rounded-full hover:bg-white/90 transition-colors">
                      Daftar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
