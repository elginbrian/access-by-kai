"use client";

import React, { useState } from "react";
import InputField from "@/components/input/InputField";

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
      color: "bg-blue-50",
    },
    {
      icon: "/ic_family_seat.svg",
      label: "Tempat duduk keluarga",
      color: "bg-green-50",
    },
    {
      icon: "/ic_quiet_zone.svg",
      label: "Area tenang",
      color: "bg-purple-50",
    },
    {
      icon: "/ic_scenic_view.svg",
      label: "Pemandangan indah",
      color: "bg-orange-50",
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 flex items-center justify-center">
          <img src="/ic_wifi.svg" alt="ChatBot" className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">Asisten Pemilihan Kursi AI</h4>
          <p className="text-xs text-gray-500">Dapatkan rekomendasi yang dipersonalisasi</p>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="space-y-2 mb-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className={`${suggestion.color} rounded-lg p-3 cursor-pointer hover:opacity-80 transition-opacity`}>
            <div className="flex items-center gap-2">
              <img src={suggestion.icon} alt={suggestion.label} className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">{suggestion.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`text-xs p-2 rounded-lg ${msg.sender === "ai" ? "bg-gray-100 mr-4" : "bg-blue-100 ml-4"}`}>
            <p className="text-gray-700">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <InputField
          label=""
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tanyakan apapun..."
          className="flex-1 text-sm px-1 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button onClick={handleSendMessage} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <img src="/ic_send.svg" alt="Send Button" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default AISeatAssistant;
