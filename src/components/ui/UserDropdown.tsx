"use client";

import React, { Fragment } from "react";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import NotificationBell from "@/components/notifications/NotificationBell";

interface Props {
  displayName?: string;
  displayAvatar?: string;
  onLogout?: () => Promise<void> | void;
  onNavigate?: (path: string) => void;
  profilePath?: string;
  lightMode?: boolean;
  userId?: string;
}

const UserDropdown: React.FC<Props> = ({ displayName = "User", displayAvatar = "/favicon.ico", onLogout, onNavigate, profilePath, lightMode = false, userId }) => {
  const go = (path: string) => {
    onNavigate?.(path);
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Notification Bell */}
      <NotificationBell 
        userId={userId} 
        className={lightMode ? "text-white" : "text-gray-600"}
        showPreview={true}
      />
      
      {/* User Dropdown */}
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
                    <Icon name="user" className="w-4 h-4 text-gray-600" />
                    Profil
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => go(`/${userId}/notification`)} className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 flex items-center gap-3 text-sm`}>
                    <Icon name="bell" className="w-4 h-4 text-gray-600" />
                    Notifikasi
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => go(`/${userId}/mytickets`)} className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 flex items-center gap-3 text-sm`}>
                    <Icon name="box" className="w-4 h-4 text-gray-600" />
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
                    <Icon name="logout" className="w-4 h-4" />
                    Keluar
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
    </div>
  );
};

export default UserDropdown;
