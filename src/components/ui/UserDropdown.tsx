"use client";

import React from "react";

interface Props {
  displayName?: string;
  displayAvatar?: string;
  onLogout?: () => Promise<void> | void;
  onNavigate?: (path: string) => void;
}

const UserDropdown: React.FC<Props> = ({ displayName = "User", displayAvatar, onLogout, onNavigate }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <img src={displayAvatar} alt="Profile" className="w-8 h-8 rounded-full" />
        <span className="text-sm text-black">{displayName}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg z-50 text-black">
          <button
            onClick={() => {
              setOpen(false);
              onNavigate?.("/profile");
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Profil
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onNavigate?.("/mytickets");
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Tiket Saya
          </button>
          <div className="border-t" />
          <button
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
