"use client";

import React from "react";
import { colors } from "@/app/design-system/colors";

interface FloatingChatButtonProps {
  onClick?: () => void;
  notificationCount?: number;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, notificationCount = 2 }) => {
  return (
    <button onClick={onClick} className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.violet.normal }}>
      <img src="/ic_robot.svg" alt="Chat" className="w-8 h-8 filter brightness-0 invert" />
      {notificationCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">{notificationCount}</span>}
    </button>
  );
};

export default FloatingChatButton;
