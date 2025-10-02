"use client";

import { useState, useCallback, useRef } from "react";

export interface SeatPreference {
  type: "window" | "aisle" | "middle" | "any";
  location: "front" | "middle" | "back" | "any";
  grouping: "together" | "separate" | "any";
  special?: "quiet" | "family" | "scenic" | "charging" | "wifi";
}

export interface SeatRecommendation {
  seatIds: string[];
  reason: string;
  confidence: number;
  alternativeOptions?: {
    seatIds: string[];
    reason: string;
  }[];
}

export interface SeatAIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  recommendation?: SeatRecommendation;
  isTyping?: boolean;
}

export interface SeatAIError {
  message: string;
  code?: string;
  retryable?: boolean;
}

export const useSeatAI = (jadwalId: number, currentCar: number, totalPassengers: number) => {
  const [messages, setMessages] = useState<SeatAIMessage[]>([
    {
      id: "welcome",
      text: "Hai! Saya AI Assistant untuk membantu Anda memilih kursi terbaik. Apa preferensi kursi Anda?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<SeatAIError | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastRecommendation, setLastRecommendation] = useState<SeatRecommendation | null>(null);

  const sessionIdRef = useRef<string>(`seat_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const addMessage = useCallback((text: string, isUser: boolean, recommendation?: SeatRecommendation) => {
    const newMessage: SeatAIMessage = {
      id: Date.now().toString() + (isUser ? "_user" : "_ai"),
      text,
      isUser,
      timestamp: new Date(),
      recommendation,
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const sendMessage = useCallback(
    async (text: string, preference?: SeatPreference) => {
      addMessage(text, true);
      setError(null);
      setIsTyping(true);

      try {
        const response = await fetch("/api/ai/seat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-mcp-secret": process.env.NEXT_PUBLIC_MCP_SHARED_SECRET || "",
          },
          body: JSON.stringify({
            prompt: text,
            jadwalId,
            currentCar,
            totalPassengers,
            preference,
            sessionId: sessionIdRef.current,
          }),
        });

        const data = await response.json();

        setIsTyping(false);

        if (!response.ok) {
          throw {
            message: data.message || "Failed to get AI response",
            code: data.code || "API_ERROR",
            retryable: data.retryable || false,
            fallbackRecommendation: data.fallbackRecommendation,
          };
        }

        const result = data.data;

        if (result.recommendation) {
          setLastRecommendation(result.recommendation);
          addMessage(result.response, false, result.recommendation);
        } else {
          addMessage(result.response, false);
        }

        setIsConnected(true);
        retryCountRef.current = 0;
      } catch (err: any) {
        setIsTyping(false);
        console.error("Seat AI error:", err);

        if (err.retryable && retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          addMessage(`Maaf, terjadi gangguan. Mencoba lagi... (${retryCountRef.current}/${maxRetries})`, false);

          setTimeout(() => {
            sendMessage(text, preference);
          }, 2000 * retryCountRef.current);
        } else {
          const fallbackMessage = err.retryable ? "Maaf, saya tidak dapat terhubung ke server saat ini. Silakan coba lagi nanti." : err.message || "Terjadi kesalahan saat memproses permintaan Anda.";

          addMessage(fallbackMessage, false);
          setError({
            message: fallbackMessage,
            code: err.code,
            retryable: err.retryable,
          });
        }
      }
    },
    [jadwalId, currentCar, totalPassengers, addMessage]
  );

  const sendPreferenceSuggestion = useCallback(
    (suggestionType: string) => {
      const suggestionMap: Record<string, { text: string; preference: SeatPreference }> = {
        window: {
          text: "Saya ingin kursi jendela terbaik",
          preference: { type: "window", location: "any", grouping: "any" },
        },
        family: {
          text: "Saya ingin tempat duduk keluarga yang berdekatan",
          preference: { type: "any", location: "any", grouping: "together", special: "family" },
        },
        quiet: {
          text: "Saya ingin area yang tenang",
          preference: { type: "any", location: "any", grouping: "any", special: "quiet" },
        },
        scenic: {
          text: "Saya ingin kursi dengan pemandangan indah",
          preference: { type: "window", location: "any", grouping: "any", special: "scenic" },
        },
      };

      const suggestion = suggestionMap[suggestionType];
      if (suggestion) {
        sendMessage(suggestion.text, suggestion.preference);
      }
    },
    [sendMessage]
  );

  const applyRecommendation = useCallback(
    (onSeatSelect: (seats: string[]) => void) => {
      if (lastRecommendation && lastRecommendation.seatIds.length > 0) {
        onSeatSelect(lastRecommendation.seatIds);
        addMessage(`Kursi ${lastRecommendation.seatIds.join(", ")} telah dipilih berdasarkan rekomendasi AI.`, false);
        return true;
      }
      return false;
    },
    [lastRecommendation, addMessage]
  );

  const retryLastMessage = useCallback(() => {
    if (messages.length >= 2) {
      const lastUserMessage = [...messages].reverse().find((msg) => msg.isUser);
      if (lastUserMessage) {
        setError(null);
        retryCountRef.current = 0;
        sendMessage(lastUserMessage.text);
      }
    }
  }, [messages, sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        text: "Hai! Saya AI Assistant untuk membantu Anda memilih kursi terbaik. Apa preferensi kursi Anda?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setError(null);
    setLastRecommendation(null);
    retryCountRef.current = 0;
    sessionIdRef.current = `seat_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  return {
    messages,
    isTyping,
    error,
    isConnected,
    lastRecommendation,
    sendMessage,
    sendPreferenceSuggestion,
    applyRecommendation,
    retryLastMessage,
    clearMessages,
  };
};
