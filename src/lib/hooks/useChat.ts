"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
  isStreaming?: boolean;
}

export interface ChatError {
  message: string;
  code?: string;
  retryable?: boolean;
}

interface ApiResponse {
  ok: boolean;
  model?: string;
  sessionId?: string;
  error?: string;
  code?: string;
  message?: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  // Session management
  const sessionIdRef = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Storage keys
  const STORAGE_KEYS = {
    MESSAGES: "kai_chat_messages",
    SESSION_ID: "kai_chat_session_id",
    LAST_ACTIVITY: "kai_chat_last_activity",
  };

  // Helper functions for localStorage
  const saveToStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  }, []);

  const loadFromStorage = useCallback((key: string) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn("Failed to load from localStorage:", error);
      return null;
    }
  }, []);

  const clearStorage = useCallback(() => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }
  }, []);

  const addMessage = useCallback(
    (text: string, isUser: boolean, isStreaming = false) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString() + (isUser ? "_user" : "_ai"),
        text,
        isUser,
        timestamp: new Date(),
        isStreaming,
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, newMessage];
        // Save to localStorage (debounced to avoid excessive writes)
        setTimeout(() => {
          saveToStorage(STORAGE_KEYS.MESSAGES, updatedMessages);
          saveToStorage(STORAGE_KEYS.LAST_ACTIVITY, Date.now());
        }, 100);
        return updatedMessages;
      });

      return newMessage.id;
    },
    [saveToStorage, STORAGE_KEYS.MESSAGES, STORAGE_KEYS.LAST_ACTIVITY]
  );

  const updateStreamingMessage = useCallback((messageId: string, newText: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, text: newText } : msg)));
  }, []);

  const finishStreamingMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isStreaming: false } : msg)));
    setStreamingMessageId(null);
  }, []);

  const callChatAPI = useCallback(async (prompt: string): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mcp-secret": process.env.NEXT_PUBLIC_MCP_SHARED_SECRET || "",
        },
        body: JSON.stringify({
          prompt,
          sessionId: sessionIdRef.current,
          conversationStyle: "casual",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      if (!data.ok) {
        throw new Error(data.message || data.error || "API returned error");
      }

      retryCountRef.current = 0;
      setError(null);
      setIsConnected(true);

      return data.model || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
    } catch (err: any) {
      clearTimeout(timeoutId);

      let errorMessage = "Terjadi kesalahan saat menghubungi server";
      let isRetryable = true;
      let errorCode = "UNKNOWN_ERROR";

      if (err.name === "AbortError") {
        errorMessage = "Permintaan timeout. Silakan coba lagi.";
        errorCode = "TIMEOUT_ERROR";
      } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        errorMessage = "Masalah koneksi internet. Periksa koneksi Anda.";
        errorCode = "NETWORK_ERROR";
        setIsConnected(false);
      } else if (err.message.includes("401") || err.message.includes("unauthorized")) {
        errorMessage = "Sesi Anda telah berakhir. Silakan refresh halaman.";
        errorCode = "AUTH_ERROR";
        isRetryable = false;
      } else if (err.message.includes("429")) {
        errorMessage = "Terlalu banyak permintaan. Tunggu sebentar dan coba lagi.";
        errorCode = "RATE_LIMIT_ERROR";
      } else if (err.message.includes("500")) {
        errorMessage = "Server sedang bermasalah. Coba lagi dalam beberapa saat.";
        errorCode = "SERVER_ERROR";
      }

      const chatError: ChatError = {
        message: errorMessage,
        code: errorCode,
        retryable: isRetryable,
      };

      setError(chatError);
      throw chatError;
    }
  }, []);

  const simulateStreaming = useCallback(
    async (response: string, typingMessageId: string): Promise<void> => {
      return new Promise((resolve) => {
        setStreamingMessageId(typingMessageId);

        let currentText = "";
        let currentIndex = 0;

        const streamInterval = setInterval(() => {
          if (currentIndex < response.length) {
            const charsToAdd = Math.min(Math.floor(Math.random() * 3) + 1, response.length - currentIndex);
            currentText += response.slice(currentIndex, currentIndex + charsToAdd);
            currentIndex += charsToAdd;

            updateStreamingMessage(typingMessageId, currentText);
          } else {
            clearInterval(streamInterval);
            finishStreamingMessage(typingMessageId);
            resolve();
          }
        }, 30 + Math.random() * 50);
      });
    },
    [addMessage, updateStreamingMessage, finishStreamingMessage]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      addMessage(text, true);
      setError(null);

      // Show typing indicator
      const typingMessageId = addMessage("Sedang mengetik...", false, true);

      try {
        const response = await callChatAPI(text);

        await simulateStreaming(response, typingMessageId);
      } catch (err: any) {
        console.error("Chat API error:", err);

        // Remove typing indicator on error
        setMessages((prev) => prev.filter((msg) => msg.id !== typingMessageId));

        if (err.retryable && retryCountRef.current < maxRetries) {
          retryCountRef.current++;

          addMessage(`Maaf, terjadi gangguan. Mencoba lagi... (${retryCountRef.current}/${maxRetries})`, false);

          setTimeout(() => {
            sendMessage(text);
          }, 2000 * retryCountRef.current);
        } else {
          const fallbackMessage = err.retryable ? "Maaf, saya tidak dapat terhubung ke server saat ini. Silakan coba lagi nanti. 😔" : err.message;

          addMessage(fallbackMessage, false);
        }
      }
    },
    [addMessage, callChatAPI]
  );

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        text: "Halo! Saya AI Assistant KAI Access. Ada yang bisa saya bantu untuk perjalanan kereta Anda? 🚂",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setError(null);
    retryCountRef.current = 0;

    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

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

  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mcp-secret": process.env.NEXT_PUBLIC_MCP_SHARED_SECRET || "",
        },
        body: JSON.stringify({
          prompt: "ping",
          sessionId: "health_check",
          conversationStyle: "casual",
        }),
      });

      setIsConnected(response.ok);
      return response.ok;
    } catch {
      setIsConnected(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsConnected(true);
      setError(null);
      checkConnection();
    };

    const handleOffline = () => {
      setIsConnected(false);
      setError({
        message: "Tidak ada koneksi internet",
        code: "OFFLINE",
        retryable: true,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkConnection]);

  return {
    messages,
    isTyping,
    isOpen,
    error,
    isConnected,
    sendMessage,
    openChat,
    closeChat,
    clearMessages,
    addMessage,
    retryLastMessage,
    checkConnection,
  };
};
