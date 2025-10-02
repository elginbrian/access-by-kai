"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { colors } from "@/app/design-system/colors";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  connectionStatus?: "connected" | "disconnected" | "connecting";
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false, connectionStatus = "connected" }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!disabled) {
      onSendMessage(suggestion);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? (connectionStatus === "disconnected" ? "Tidak ada koneksi..." : "AI sedang mengetik...") : "Ketik pesan Anda..."}
            disabled={disabled}
            className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"
            }`}
            style={{
              minHeight: "48px",
              maxHeight: "120px",
            }}
            rows={1}
          />

          {message.length > 100 && <div className="absolute bottom-1 right-12 text-xs text-gray-400">{message.length}/500</div>}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            message.trim() && !disabled ? "text-white shadow-lg hover:shadow-xl transform hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          style={{
            background: message.trim() && !disabled ? `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.violet.dark} 100%)` : undefined,
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">{connectionStatus === "disconnected" ? "⚠️ Koneksi terputus - pesan akan dikirim saat tersambung kembali" : "Tekan Enter untuk kirim, Shift+Enter untuk baris baru"}</p>
    </div>
  );
};

export default ChatInput;
