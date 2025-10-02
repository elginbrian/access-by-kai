"use client";

import React, { useState } from "react";
import InputField from "@/components/input/InputField";
import { colors } from "@/app/design-system/colors";
import { useSeatAI, type SeatAIMessage } from "@/lib/hooks/useSeatAI";
import FormattedText from "@/components/trains/chat/FormattedText";

interface AISeatAssistantProps {
  jadwalId?: number;
  currentCar: number;
  totalPassengers: number;
  onSeatSelect: (seatIds: string[]) => void;
}

const AISeatAssistant: React.FC<AISeatAssistantProps> = ({ jadwalId = 0, currentCar, totalPassengers, onSeatSelect }) => {
  const [message, setMessage] = useState("");

  const { messages, isTyping, error, isConnected, lastRecommendation, sendMessage, sendPreferenceSuggestion, applyRecommendation, retryLastMessage } = useSeatAI(jadwalId, currentCar, totalPassengers);

  const suggestions = [
    {
      icon: "/ic_best_window_seat.svg",
      label: "Kursi jendela terbaik",
      action: "window",
    },
    {
      icon: "/ic_family_seat.svg",
      label: "Tempat duduk keluarga",
      action: "family",
    },
    {
      icon: "/ic_quiet_zone.svg",
      label: "Area tenang",
      action: "quiet",
    },
    {
      icon: "/ic_scenic_view.svg",
      label: "Pemandangan indah",
      action: "scenic",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleSuggestionClick = (action: string) => {
    sendPreferenceSuggestion(action);
  };

  const handleApplyRecommendation = () => {
    const success = applyRecommendation(onSeatSelect);
    if (!success) {
      console.log("No recommendation available to apply");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isTyping) {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border">
      <div className="flex items-center gap-3 mb-4 p-4 rounded-2xl" style={{ backgroundColor: colors.violet.light }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ backgroundColor: colors.violet.normal }}>
          <img src="/ic_robot.svg" alt="AI" className="w-6 h-6" />
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">AI Seat Assistant</h4>
          <p className="text-xs text-gray-600">{isConnected ? "Online dan siap membantu" : "Sedang mencoba terhubung..."}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={index} onClick={() => handleSuggestionClick(suggestion.action)} className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-3 cursor-pointer transition-colors border border-gray-200">
              <div className="flex items-center gap-2">
                <img src={suggestion.icon} alt={suggestion.label} className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">{suggestion.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.isUser ? "flex-row-reverse" : ""}`}>
              {!msg.isUser && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.violet.normal }}>
                  <img src="/ic_robot.svg" alt="AI" className="w-4 h-4" />
                </div>
              )}
              <div className={`rounded-2xl px-4 py-3 max-w-xs text-sm ${!msg.isUser ? "bg-gray-100 text-gray-800" : "text-white"}`} style={msg.isUser ? { backgroundColor: colors.violet.normal } : {}}>
                <FormattedText text={msg.text} />

                {msg.recommendation && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-col gap-2">
                      <div className="text-xs text-gray-600 mb-1">
                        <span className="font-medium">Rekomendasi:</span> {msg.recommendation.seatIds.length} kursi
                      </div>

                      <button
                        onClick={handleApplyRecommendation}
                        className="flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          backgroundColor: colors.violet.normal,
                          color: "white",
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Pilih Kursi Ini</span>
                      </button>

                      <div className="text-xs text-gray-500 mt-1">
                        {msg.recommendation.seatIds.map((seat: string, index: number) => (
                          <span key={seat} className="inline-block bg-gray-50 px-2 py-1 rounded-md mr-1 mb-1">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.violet.normal }}>
                <img src="/ic_robot.svg" alt="AI" className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="text-gray-500 ml-2">Sedang menganalisis...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-red-800">{error.message}</p>
                {error.retryable && (
                  <button onClick={retryLastMessage} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full mt-2 transition-colors">
                    Coba Lagi
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
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
            disabled={isTyping}
          />
          <button onClick={handleSendMessage} disabled={isTyping || !message.trim()} className="px-3 py-2 text-white rounded-2xl hover:opacity-90 transition-colors disabled:opacity-50" style={{ backgroundColor: colors.violet.normal }}>
            <img src="/ic_send.svg" alt="Send Button" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISeatAssistant;
