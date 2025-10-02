'use client';

import React from 'react';

interface FloatingChatProps {
  notificationCount?: number;
  onClick?: () => void;
}

const FloatingChat: React.FC<FloatingChatProps> = ({
  notificationCount = 2,
  onClick
}) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-colors"
    >
      <span className="relative text-2xl">
        <img src="/ic_robot.svg" alt="Chat" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </span>
    </button>
  );
};

export default FloatingChat;