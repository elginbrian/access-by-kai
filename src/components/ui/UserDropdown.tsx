"use client";

import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

interface Props {
  displayName?: string;
  displayAvatar?: string;
  onLogout?: () => Promise<void> | void;
  onNavigate?: (path: string) => void;
  profilePath?: string;
  lightMode?: boolean;
}

const UserDropdown: React.FC<Props> = ({ displayName = "User", displayAvatar = "/favicon.ico", onLogout, onNavigate, profilePath, lightMode = false }) => {
  const go = (path: string) => {
    onNavigate?.(path);
  };

  return (
    <div className="relative">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center space-x-2 hover:opacity-90 transition-opacity focus:outline-none">
            <img src={displayAvatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            <span className={`text-sm ${lightMode ? "text-white" : "text-black"}`}>{displayName}</span>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 text-black overflow-hidden focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => go(profilePath ?? "/profile")} className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 flex items-center gap-3 text-sm`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5.121 17.804A9 9 0 1118.88 6.196" />
                      <path d="M12 12v.01" />
                    </svg>
                    Profil
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => go("/mytickets")} className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 flex items-center gap-3 text-sm`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 7h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                      <path d="M7 3v4" />
                    </svg>
                    Tiket Saya
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="border-t" />

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => onLogout?.()} className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 flex items-center gap-3 text-sm text-red-600`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V7" />
                      <path d="M16 17l5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                    Keluar
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default UserDropdown;
