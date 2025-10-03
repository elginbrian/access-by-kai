"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { signOut } from "@/lib/auth/authService";
import toast from "react-hot-toast";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();
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

  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );

  const XIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <div
      className="w-full flex justify-center items-center min-h-[4rem]"
      style={{
        paddingTop: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
        position: "fixed",
        zIndex: 100,
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
              <button onClick={() => handleNavClick("/")} className="text-white hover:text-white/70 transition-colors font-medium text-sm">
                Beranda
              </button>
              <button onClick={() => handleNavClick("/trains")} className="text-white hover:text-white/70 transition-colors font-medium text-sm">
                Tiket
              </button>
              <button onClick={() => handleNavClick("/routes")} className="text-white hover:text-white/70 transition-colors font-medium text-sm">
                Rute
              </button>
              <button onClick={() => handleNavClick("/about")} className="text-white hover:text-white/70 transition-colors font-medium text-sm">
                Tentang
              </button>
              <button onClick={() => handleNavClick("/contact")} className="text-white hover:text-white/70 transition-colors font-medium text-sm">
                Kontak
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
                  {/* Login/Register buttons when not logged in */}
                  <button onClick={() => handleNavClick("/auth/login")} className="text-white hover:text-white/70 transition-colors font-medium text-sm px-4 py-2 rounded-full border border-white/30 hover:border-white/50">
                    Masuk
                  </button>
                  <button onClick={() => handleNavClick("/auth/register")} className="bg-white text-gray-900 hover:bg-white/90 transition-colors font-medium text-sm px-4 py-2 rounded-full">
                    Daftar
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-md text-white hover:bg-white/10">
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden backdrop-blur-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => handleNavClick("/")} className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-white/10">
                Beranda
              </button>
              <button onClick={() => handleNavClick("/trains")} className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-white/10">
                Tiket
              </button>
              <button onClick={() => handleNavClick("/routes")} className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-white/10">
                Rute
              </button>
              <button onClick={() => handleNavClick("/about")} className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-white/10">
                Tentang
              </button>
              <button onClick={() => handleNavClick("/contact")} className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-white/10">
                Kontak
              </button>

              {/* Mobile Auth Section */}
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
