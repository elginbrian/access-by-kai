"use client";

import React from "react";
import { colors } from "@/app/design-system/colors";

interface FloatingChatProps {
  notificationCount?: number;
  onClick?: () => void;
  isHidden?: boolean;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ notificationCount = 2, onClick, isHidden = false }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-all duration-300 z-30 ${
        isHidden ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
      }`}
    >
      <span className="relative text-2xl">
        <img src="/ic_robot.svg" alt="Chat" />
        {notificationCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">{notificationCount}</span>}
      </span>
    </button>
  );
};

export default FloatingChat;
