import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import type { CreatePaymentRequest, PaymentCallback, TransactionStatusResponse, InternalPaymentStatus } from "@/lib/midtrans/types";
import { CreatePaymentRequestSchema, PaymentCallbackSchema } from "@/lib/midtrans/types";
import type { Pembayaran } from "@/types/models";
import { toast } from "react-hot-toast";

const supabase = createClient();

export const PAYMENT_QUERY_KEYS = {
  all: ["payments"] as const,
  payment: (id: number) => [...PAYMENT_QUERY_KEYS.all, "detail", id] as const,
  transactions: (orderId: string) => [...PAYMENT_QUERY_KEYS.all, "transaction", orderId] as const,
  snapToken: (orderId: string) => [...PAYMENT_QUERY_KEYS.all, "snap-token", orderId] as const,
} as const;

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreatePaymentRequest) => {
      const validatedRequest = CreatePaymentRequestSchema.parse(request);

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create payment");
      }

      const data = await response.json();
      return data as { snapToken: string; orderId: string; paymentId: number };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["pembayaran"] });

      queryClient.setQueryData(PAYMENT_QUERY_KEYS.snapToken(data.orderId), data.snapToken);

      toast.success("Payment berhasil dibuat");
    },
    onError: (error: Error) => {
      console.error("Create payment error:", error);
      toast.error(error.message || "Gagal membuat pembayaran");
    },
  });
}

export function useTransactionStatus(orderId: string | null, enabled = true) {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.transactions(orderId || ""),
    queryFn: async (): Promise<TransactionStatusResponse> => {
      if (!orderId) throw new Error("Order ID is required");

      const response = await fetch(`/api/payments/status/${orderId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to get transaction status");
      }

      return response.json();
    },
    enabled: enabled && !!orderId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && ["settlement", "deny", "cancel", "expire", "failure"].includes(data.transaction_status)) {
        return false;
      }
      return 5000;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function usePaymentCallback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (callback: PaymentCallback) => {
      const validatedCallback = PaymentCallbackSchema.parse(callback);

      const response = await fetch("/api/payments/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedCallback),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process payment callback");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["pembayaran"] });
      queryClient.invalidateQueries({ queryKey: ["pemesanan"] });

      if (variables.status === "success") {
        toast.success("Pembayaran berhasil!");
      } else if (variables.status === "failure") {
        toast.error("Pembayaran gagal");
      }
    },
    onError: (error: Error) => {
      console.error("Payment callback error:", error);
      toast.error("Gagal memproses callback pembayaran");
    },
  });
}

export function useCancelPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`/api/payments/cancel/${orderId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cancel payment");
      }

      return response.json();
    },
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.transactions(orderId) });
      queryClient.invalidateQueries({ queryKey: ["pembayaran"] });

      toast.success("Pembayaran berhasil dibatalkan");
    },
    onError: (error: Error) => {
      console.error("Cancel payment error:", error);
      toast.error(error.message || "Gagal membatalkan pembayaran");
    },
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, amount, reason }: { orderId: string; amount?: number; reason?: string }) => {
      const response = await fetch(`/api/payments/refund/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to refund payment");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.transactions(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: ["pembayaran"] });

      toast.success("Refund berhasil diproses");
    },
    onError: (error: Error) => {
      console.error("Refund payment error:", error);
      toast.error(error.message || "Gagal memproses refund");
    },
  });
}

export function useSnapToken(orderId: string | null, enabled = true) {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.snapToken(orderId || ""),
    queryFn: async (): Promise<string> => {
      if (!orderId) throw new Error("Order ID is required");

      const { data: payment } = await supabase.from("pembayaran").select("metode_pembayaran, status_pembayaran").eq("order_id", orderId).single();

      const response = await fetch(`/api/payments/snap-token/${orderId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to get snap token");
      }

      const data = await response.json();
      return data.snapToken;
    },
    enabled: enabled && !!orderId,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const response = await fetch("/api/payments/methods");

      if (!response.ok) {
        throw new Error("Failed to fetch payment methods");
      }

      return response.json();
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export function usePaymentStatusMapper() {
  return (transactionStatus: string, fraudStatus?: string): InternalPaymentStatus => {
    if (fraudStatus === "deny") {
      return "GAGAL";
    }

    switch (transactionStatus) {
      case "capture":
      case "settlement":
        return fraudStatus === "accept" ? "BERHASIL" : "MENUNGGU";

      case "pending":
      case "authorize":
        return "MENUNGGU";

      case "deny":
      case "cancel":
      case "expire":
      case "failure":
        return "GAGAL";

      default:
        return "MENUNGGU";
    }
  };
}
