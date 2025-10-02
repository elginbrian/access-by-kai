"use client";

import React, { useRef, useEffect } from "react";
import { colors } from "@/app/design-system/colors";
import { useChat } from "@/lib/hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose }) => {
  const { messages, sendMessage, error, isConnected, retryLastMessage, checkConnection } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isTyping = messages.some((msg) => msg.text === "Sedang mengetik..." || msg.isStreaming);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  return (
    <>
      <div
        className={`fixed inset-0 transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 visible z-20" : "opacity-0 invisible z-[-1]"}`}
        onClick={onClose}
        style={{
          top: "64px",
          backgroundColor: isOpen ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
        }}
      />

      <div
        className={`fixed right-0 w-full sm:w-120 bg-white shadow-2xl z-20 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          top: "64px",
          height: "calc(100vh - 64px)",
          maxHeight: "calc(100vh - 64px)",
        }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0" style={{ backgroundColor: colors.violet.light }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ backgroundColor: colors.violet.normal }}>
              <img src="/ic_robot.svg" alt="AI" className="w-6 h-6" />

              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">{isConnected ? "Online dan siap membantu" : "Sedang mencoba terhubung..."}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {error && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-sm text-red-800 mb-2">{error.message}</p>
                {error.retryable && (
                  <div className="flex gap-2">
                    <button onClick={retryLastMessage} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full transition-colors">
                      Coba Lagi
                    </button>
                    <button onClick={checkConnection} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors">
                      Cek Koneksi
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-white">
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping || !isConnected} connectionStatus={isConnected ? "connected" : "disconnected"} />
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
