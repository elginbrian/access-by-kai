"use client";

import React from "react";
import { colors } from "@/app/design-system/colors";
import { ChatMessage as ChatMessageType } from "@/lib/hooks/useChat";
import FormattedText from "./FormattedText";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (message.isUser) {
    return (
      <div className="flex items-start justify-end gap-3">
        <div className="flex flex-col items-end max-w-[280px] sm:max-w-xs">
          <div className="rounded-2xl rounded-br-md px-4 py-3 text-white" style={{ backgroundColor: colors.violet.normal }}>
            <FormattedText text={message.text} className="text-sm leading-relaxed break-words" />
          </div>
          <span className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</span>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.violet.light }}>
          <img src="/ic_person.svg" alt="User" className="w-4 h-4" />
        </div>
      </div>
    );
  }

  const isTyping = message.text === "Sedang mengetik..." || message.isStreaming;

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.violet.normal }}>
        <img src="/ic_robot.svg" alt="AI" className="w-4 h-4 filter brightness-0 invert" />
      </div>
      <div className="flex flex-col max-w-[280px] sm:max-w-xs">
        <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
          {isTyping && message.text === "Sedang mengetik..." ? (
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Sedang mengetik</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          ) : (
            <FormattedText text={message.text} className="text-sm text-gray-800 leading-relaxed break-words" />
          )}
        </div>
        {!isTyping && <span className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</span>}
      </div>
    </div>
  );
};

export default ChatMessage;
