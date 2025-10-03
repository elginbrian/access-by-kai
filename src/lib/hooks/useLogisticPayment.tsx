"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PaymentService, { PaymentStatus } from "@/lib/services/PaymentService";

export interface LogisticPaymentState {
  isLoading: boolean;
  isProcessing: boolean;
  snapToken: string | null;
  orderId: string | null;
  status: PaymentStatus | null;
  error: string | null;
  isSnapReady: boolean;
}

export interface LogisticPaymentActions {
  createPayment: (pengirimanId: string | number) => Promise<void>;
  checkStatus: (orderId: string) => Promise<void>;
  cancelPayment: (orderId: string) => Promise<void>;
  openSnapPayment: (onClose?: () => void) => void;
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

export default function useLogisticPayment(): LogisticPaymentState & LogisticPaymentActions {
  const [state, setState] = useState<LogisticPaymentState>({
    isLoading: false,
    isProcessing: false,
    snapToken: null,
    orderId: null,
    status: null,
    error: null,
    isSnapReady: false,
  });

  const statusCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadSnapScript = () => {
      if ((window as any).snap) {
        setState((prev) => ({ ...prev, isSnapReady: true }));
        return;
      }

      const script = document.createElement("script");
      script.src = process.env.NODE_ENV === "production" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
      script.onload = () => setState((prev) => ({ ...prev, isSnapReady: true }));
      script.onerror = () => setState((prev) => ({ ...prev, error: "Failed to load payment gateway", isSnapReady: false }));
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
      if (statusCheckIntervalRef.current) clearInterval(statusCheckIntervalRef.current);
    };
  }, [state.orderId, state.status?.status]);

  const startStatusPolling = useCallback((orderId: string) => {
    if (statusCheckIntervalRef.current) clearInterval(statusCheckIntervalRef.current);

    statusCheckIntervalRef.current = setInterval(() => {
      (async () => {
        try {
          const status = await PaymentService.checkPaymentStatus(orderId);
          if (status) setState((prev) => ({ ...prev, status }));

          if (status && ["settlement", "capture", "deny", "cancel", "expire", "failure"].includes(status.status)) {
            if (statusCheckIntervalRef.current) clearInterval(statusCheckIntervalRef.current);
          }
        } catch (e) {
          console.error("Logistic status polling error:", e);
        }
      })();
    }, 5000);

    // stop after 30 minutes
    setTimeout(() => {
      if (statusCheckIntervalRef.current) clearInterval(statusCheckIntervalRef.current);
    }, 30 * 60 * 1000);
  }, []);

  const createPayment = useCallback(async (pengirimanId: string | number) => {
    if (!pengirimanId) {
      setState((prev) => ({ ...prev, error: "pengirimanId required" }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const resp = await fetch("/api/logistic/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pengiriman_id: pengirimanId }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setState((prev) => ({ ...prev, isLoading: false, error: data.error || "Failed to create payment" }));
        return;
      }

      if (data && data.snapToken) {
        setState((prev) => ({ ...prev, isLoading: false, snapToken: data.snapToken, orderId: data.orderId || null, status: { orderId: data.orderId || "", status: "pending", transactionStatus: "pending" } }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false, error: "Failed to create payment" }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false, error: error instanceof Error ? error.message : String(error) }));
    }
  }, []);

  const checkStatus = useCallback(async (orderId: string) => {
    try {
      const status = await PaymentService.checkPaymentStatus(orderId);
      if (status) setState((prev) => ({ ...prev, status }));
    } catch (e) {
      console.error("checkStatus error:", e);
    }
  }, []);

  const cancelPayment = useCallback(async (orderId: string) => {
    setState((prev) => ({ ...prev, isProcessing: true }));
    try {
      const resp = await fetch(`/api/payments/cancel/${encodeURIComponent(orderId)}`, { method: "POST" });
      const data = await resp.json();
      if (resp.ok && data.success) {
        setState((prev) => ({ ...prev, isProcessing: false, status: prev.status ? { ...prev.status, status: "cancel" } : null }));
      } else {
        setState((prev) => ({ ...prev, isProcessing: false, error: data.error || "Failed to cancel payment" }));
      }
    } catch (err) {
      setState((prev) => ({ ...prev, isProcessing: false, error: "Failed to cancel payment" }));
    }
  }, []);

  const openSnapPayment = useCallback(
    (onClose?: () => void) => {
      if (!state.snapToken || !state.isSnapReady) {
        setState((prev) => ({ ...prev, error: "Payment gateway belum siap" }));
        return;
      }

      setState((prev) => ({ ...prev, isProcessing: true, error: null }));

      window.snap.pay(state.snapToken, {
        enabledPayments: ["credit_card", "bca_va", "bni_va", "bri_va", "mandiri_va", "gopay", "shopeepay", "qris"],
        skipOrderSummary: false,
        onSuccess: (result) => {
          console.log("Logistic payment success:", result);
          setState((prev) => ({
            ...prev,
            isProcessing: false,
            status: { orderId: result.order_id, status: "settlement", transactionStatus: result.transaction_status, paymentType: result.payment_type, grossAmount: parseFloat(result.gross_amount), transactionTime: result.transaction_time },
          }));
          // redirect to logistic payment success handler
          window.location.href = `/logistic/payment/success?order_id=${result.order_id}`;
        },
        onPending: (result) => {
          console.log("Logistic payment pending:", result);
          setState((prev) => ({
            ...prev,
            isProcessing: false,
            status: { orderId: result.order_id, status: "pending", transactionStatus: result.transaction_status, paymentType: result.payment_type, grossAmount: parseFloat(result.gross_amount), transactionTime: result.transaction_time },
          }));
          if (result.order_id) startStatusPolling(result.order_id);
        },
        onError: (result) => {
          console.error("Logistic payment error:", result);
          setState((prev) => ({ ...prev, isProcessing: false, error: result?.status_message || "Pembayaran gagal diproses" }));
        },
        onClose: () => {
          console.log("Logistic payment popup closed");
          setState((prev) => ({ ...prev, isProcessing: false }));
          onClose?.();
        },
      });
    },
    [state.snapToken, state.isSnapReady, startStatusPolling]
  );

  const resetPayment = useCallback(() => {
    if (statusCheckIntervalRef.current) clearInterval(statusCheckIntervalRef.current);
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);

    setState({ isLoading: false, isProcessing: false, snapToken: null, orderId: null, status: null, error: null, isSnapReady: state.isSnapReady });
  }, [state.isSnapReady]);

  const retryPayment = useCallback(async () => {
    resetPayment();
    retryTimeoutRef.current = setTimeout(() => {
      // no-op: caller should call createPayment again with pengirimanId
    }, 500);
  }, [resetPayment]);

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
