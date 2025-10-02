"use client";

import React, { useState } from "react";
import InputField from "@/components/input/InputField";
import { colors } from "@/app/design-system/colors";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AISeatAssistantProps {
  onSuggestionApply?: (seatIds: string[]) => void;
}

const AISeatAssistant: React.FC<AISeatAssistantProps> = ({ onSuggestionApply }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hai! Saya di sini untuk membantu Anda menemukan kursi yang sempurna. Apa preferensi Anda?",
      sender: "ai",
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Saya ingin kursi jendela untuk kedua penumpang",
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: "3",
      text: "Sempurna! Saya merekomendasikan kursi 3A dan 3C - keduanya kursi jendela yang berdekatan. Apakah Anda ingin saya memilihnya?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const suggestions = [
    {
      icon: "/ic_best_window_seat.svg",
      label: "Kursi jendela terbaik",
    },
    {
      icon: "/ic_family_seat.svg",
      label: "Tempat duduk keluarga",
    },
    {
      icon: "/ic_quiet_zone.svg",
      label: "Area tenang",
    },
    {
      icon: "/ic_scenic_view.svg",
      label: "Pemandangan indah",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "Saya memahami permintaan Anda. Biarkan saya mencari kursi terbaik untuk Anda berdasarkan preferensi Anda.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border">
      <div className="flex items-center gap-3 mb-4 p-4 rounded-2xl" style={{ backgroundColor: colors.violet.light }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ backgroundColor: colors.violet.normal }}>
          <img src="/ic_robot.svg" alt="AI" className="w-6 h-6" />

          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">AI Assistant</h4>
          <p className="text-xs text-gray-600">Online dan siap membantu</p>
        </div>
      </div>

      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-3 cursor-pointer transition-colors border border-gray-200">
              <div className="flex items-center gap-2">
                <img src={suggestion.icon} alt={suggestion.label} className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">{suggestion.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.violet.normal }}>
                  <img src="/ic_robot.svg" alt="AI" className="w-4 h-4" />
                </div>
              )}
              <div className={`rounded-2xl px-4 py-3 max-w-xs text-sm ${msg.sender === "ai" ? "bg-gray-100 text-gray-800" : "text-white"}`} style={msg.sender === "user" ? { backgroundColor: colors.violet.normal } : {}}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex gap-2">
          <InputField
            label=""
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tanyakan apapun..."
            className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ focusRingColor: colors.violet.normal }}
          />
          <button onClick={handleSendMessage} className="px-3 py-2 text-white rounded-2xl hover:opacity-90 transition-colors" style={{ backgroundColor: colors.violet.normal }}>
            <img src="/ic_send.svg" alt="Send Button" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISeatAssistant;
