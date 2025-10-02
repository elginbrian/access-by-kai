"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useCentralBooking } from "./useCentralBooking";
import PaymentService, { PaymentStatus, PaymentResponse } from "@/lib/services/PaymentService";

export interface PaymentState {
  isLoading: boolean;
  isProcessing: boolean;
  snapToken: string | null;
  orderId: string | null;
  paymentId: string | null;
  status: PaymentStatus | null;
  error: string | null;
  isSnapReady: boolean;
}

export interface PaymentActions {
  createPayment: (paymentMethods?: string[]) => Promise<void>;
  checkStatus: (orderId: string) => Promise<void>;
  cancelPayment: (orderId: string) => Promise<void>;
  openSnapPayment: () => void;
  resetPayment: () => void;
  retryPayment: () => Promise<void>;
}

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
          enabledPayments?: string[];
          skipOrderSummary?: boolean;
        }
      ) => void;
      hide: () => void;
      show: () => void;
    };
  }
}

export function usePayment(): PaymentState & PaymentActions {
  const { bookingData } = useCentralBooking();
  const [state, setState] = useState<PaymentState>({
    isLoading: false,
    isProcessing: false,
    snapToken: null,
    orderId: null,
    paymentId: null,
    status: null,
    error: null,
    isSnapReady: false,
  });

  const statusCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadSnapScript = () => {
      if (window.snap) {
        setState((prev) => ({ ...prev, isSnapReady: true }));
        return;
      }

      const script = document.createElement("script");
      script.src = process.env.NODE_ENV === "production" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
      script.onload = () => {
        setState((prev) => ({ ...prev, isSnapReady: true }));
      };
      script.onerror = () => {
        setState((prev) => ({
          ...prev,
          error: "Failed to load payment gateway",
          isSnapReady: false,
        }));
      };
      document.head.appendChild(script);
    };

    loadSnapScript();

    return () => {
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state.orderId && state.status?.status === "pending") {
      startStatusPolling(state.orderId);
    }

    return () => {
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
    };
  }, [state.orderId, state.status?.status]);

  const createPayment = useCallback(
    async (paymentMethods?: string[]) => {
      if (!bookingData.journey.jadwalId || !bookingData.booker.fullName) {
        setState((prev) => ({
          ...prev,
          error: "Data pemesanan tidak lengkap",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await PaymentService.createPayment({
          bookingData,
          paymentMethod: paymentMethods,
        });

        if (response.success && response.snapToken) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            snapToken: response.snapToken!,
            orderId: response.orderId!,
            paymentId: response.paymentId!,
            status: {
              orderId: response.orderId!,
              status: "pending",
              transactionStatus: "pending",
            },
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error || "Gagal membuat pembayaran",
          }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga",
        }));
      }
    },
    [bookingData]
  );

  const checkStatus = useCallback(async (orderId: string) => {
    try {
      const status = await PaymentService.checkPaymentStatus(orderId);
      if (status) {
        setState((prev) => ({ ...prev, status }));

        // Stop polling if payment is completed or failed
        if (["settlement", "capture", "deny", "cancel", "expire", "failure"].includes(status.status)) {
          if (statusCheckIntervalRef.current) {
            clearInterval(statusCheckIntervalRef.current);
          }
        }
      }
    } catch (error) {
      console.error("Status check error:", error);
    }
  }, []);

  const startStatusPolling = useCallback(
    (orderId: string) => {
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }

      statusCheckIntervalRef.current = setInterval(() => {
        checkStatus(orderId);
      }, 5000); // Check every 5 seconds

      // Stop polling after 30 minutes
      setTimeout(() => {
        if (statusCheckIntervalRef.current) {
          clearInterval(statusCheckIntervalRef.current);
        }
      }, 30 * 60 * 1000);
    },
    [checkStatus]
  );

  const cancelPayment = useCallback(async (orderId: string) => {
    setState((prev) => ({ ...prev, isProcessing: true }));

    try {
      const success = await PaymentService.cancelPayment(orderId);
      if (success) {
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          status: prev.status ? { ...prev.status, status: "cancel" } : null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: "Gagal membatalkan pembayaran",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error: "Terjadi kesalahan saat membatalkan pembayaran",
      }));
    }
  }, []);

  const openSnapPayment = useCallback(() => {
    if (!state.snapToken || !state.isSnapReady) {
      setState((prev) => ({
        ...prev,
        error: "Payment gateway belum siap",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isProcessing: true, error: null }));

    window.snap.pay(state.snapToken, {
      enabledPayments: ["credit_card", "bca_va", "bni_va", "bri_va", "mandiri_va", "gopay", "shopeepay", "qris"],
      skipOrderSummary: false,
      onSuccess: (result) => {
        console.log("Payment success:", result);
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          status: {
            orderId: result.order_id,
            status: "settlement",
            transactionStatus: result.transaction_status,
            paymentType: result.payment_type,
            grossAmount: parseFloat(result.gross_amount),
            transactionTime: result.transaction_time,
          },
        }));

        // Redirect to success page
        window.location.href = `/trains/payment/success?order_id=${result.order_id}`;
      },
      onPending: (result) => {
        console.log("Payment pending:", result);
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          status: {
            orderId: result.order_id,
            status: "pending",
            transactionStatus: result.transaction_status,
            paymentType: result.payment_type,
            grossAmount: parseFloat(result.gross_amount),
            transactionTime: result.transaction_time,
          },
        }));

        // Start status polling for pending payments
        if (result.order_id) {
          startStatusPolling(result.order_id);
        }
      },
      onError: (result) => {
        console.error("Payment error:", result);
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: result?.status_message || "Pembayaran gagal diproses",
        }));
      },
      onClose: () => {
        console.log("Payment popup closed");
        setState((prev) => ({ ...prev, isProcessing: false }));
      },
    });
  }, [state.snapToken, state.isSnapReady, startStatusPolling]);

  const resetPayment = useCallback(() => {
    if (statusCheckIntervalRef.current) {
      clearInterval(statusCheckIntervalRef.current);
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    setState({
      isLoading: false,
      isProcessing: false,
      snapToken: null,
      orderId: null,
      paymentId: null,
      status: null,
      error: null,
      isSnapReady: state.isSnapReady, // Keep Snap ready state
    });
  }, [state.isSnapReady]);

  const retryPayment = useCallback(async () => {
    resetPayment();

    // Wait a bit before retrying
    retryTimeoutRef.current = setTimeout(() => {
      createPayment();
    }, 1000);
  }, [resetPayment, createPayment]);

  return {
    ...state,
    createPayment,
    checkStatus,
    cancelPayment,
    openSnapPayment,
    resetPayment,
    retryPayment,
  };
}

// Hook for payment status display
export function usePaymentStatus(status: PaymentStatus | null) {
  const statusDisplay = status ? PaymentService.getStatusDisplay(status.status) : null;

  const isCompleted = status?.status === "settlement" || status?.status === "capture";
  const isFailed = status?.status === "deny" || status?.status === "cancel" || status?.status === "expire" || status?.status === "failure";
  const isPending = status?.status === "pending";

  return {
    statusDisplay,
    isCompleted,
    isFailed,
    isPending,
    canRetry: isFailed,
  };
}
