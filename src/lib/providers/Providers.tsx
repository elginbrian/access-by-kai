"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/lib/providers/ToastProvider";
import { BookingTimerProvider } from "@/lib/providers/BookingTimerProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingTimerProvider>
          {children}
          <ToastProvider />
        </BookingTimerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
