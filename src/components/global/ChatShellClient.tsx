"use client";

import React from "react";
import ChatSidebar from "@/components/trains/chat/ChatSidebar";
import { useChat } from "@/lib/hooks/useChat";

const ChatShellClient: React.FC = () => {
  const { isOpen, openChat, closeChat, isConnected } = useChat();

  React.useEffect(() => {
    const width = isOpen ? "420px" : "0px";
    try {
      document.documentElement.style.setProperty("--ai-sidebar-width", width);
    } catch (err) {}
  }, [isOpen]);

  return (
    <>
      <ChatSidebar isOpen={isOpen} onClose={closeChat} />

      {!isOpen && (
        <div className="fixed bottom-6 z-50" style={{ right: isOpen ? `calc(var(--ai-sidebar-width, 0px) + 24px)` : "24px" }}>
          <button aria-label="Open AI Assistant" onClick={openChat} className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white transition-colors relative">
            <img src="/ic_robot.svg" alt="AI" className="w-10 h-10" />
          </button>
        </div>
      )}
    </>
  );
};

export default ChatShellClient;
