import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { useCreatePembatalan } from "./pembatalan";
import { useTicketActions } from "./useTickets";
import toast from "react-hot-toast";

const supabase = createClient();

interface CancelTicketWithRefundParams {
  ticketId: string;
  tiketDbId: number;
  userId: number;
  reason: string;
  refundMethod: "kaipay" | "creditcard";
  cancellationFee: number;
  refundAmount: number;
}

interface RefundProcessResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

export function useCancelTicketWithRefund() {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const createPembatalan = useCreatePembatalan();
  const { cancelTicket } = useTicketActions(0); // Will be overridden with actual userId

  const processKaiPayRefund = async (amount: number, userId: number): Promise<RefundProcessResult> => {
    try {
      // Simulate KAIPay API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user's KAIPay balance in the database
      const { data: user, error: fetchError } = await supabase
        .from("pengguna")
        .select("saldo_kaipay")
        .eq("user_id", userId)
        .single();

      if (fetchError) throw fetchError;

      const currentBalance = user.saldo_kaipay || 0;
      const newBalance = currentBalance + amount;

      const { error: updateError } = await supabase
        .from("pengguna")
        .update({ saldo_kaipay: newBalance })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      return {
        success: true,
        transactionId: `KAIPAY_${Date.now()}`,
        message: `Refund Rp ${amount.toLocaleString("id-ID")} berhasil ditambahkan ke KAIPay Anda`
      };
    } catch (error) {
      console.error("KAIPay refund error:", error);
      return {
        success: false,
        message: "Gagal memproses refund ke KAIPay"
      };
    }
  };

  const processCreditCardRefund = async (amount: number): Promise<RefundProcessResult> => {
    try {
      // Simulate credit card refund API call to payment gateway
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would call Midtrans or other payment gateway
      // For now, we just simulate the process
      
      return {
        success: true,
        transactionId: `CC_REFUND_${Date.now()}`,
        message: `Refund Rp ${amount.toLocaleString("id-ID")} akan diproses ke kartu kredit dalam 3-5 hari kerja`
      };
    } catch (error) {
      console.error("Credit card refund error:", error);
      return {
        success: false,
        message: "Gagal memproses refund ke kartu kredit"
      };
    }
  };

  const cancelTicketWithRefund = useMutation({
    mutationFn: async (params: CancelTicketWithRefundParams): Promise<void> => {
      setIsProcessing(true);
      
      try {
        // 1. Create pembatalan record first
        const pembatalanData = {
          tiket_id: params.tiketDbId,
          pemohon_user_id: params.userId,
          alasan_pembatalan: params.reason,
          kategori_pembatalan: "VOLUNTARY",
          biaya_pembatalan: params.cancellationFee,
          jumlah_refund: params.refundAmount,
          status_refund: "MENUNGGU_PROSES" as const,
        };

        const pembatalan = await createPembatalan.mutateAsync(pembatalanData);

        // 2. Update ticket status to cancelled
        const { error: ticketUpdateError } = await supabase
          .from("tiket")
          .update({ status_tiket: "DIBATALKAN" })
          .eq("kode_tiket", params.ticketId);

        if (ticketUpdateError) throw ticketUpdateError;

        // 3. Process refund based on selected method
        let refundResult: RefundProcessResult;
        
        if (params.refundMethod === "kaipay") {
          refundResult = await processKaiPayRefund(params.refundAmount, params.userId);
        } else {
          refundResult = await processCreditCardRefund(params.refundAmount);
        }

        if (!refundResult.success) {
          throw new Error(refundResult.message);
        }

        // 4. Update pembatalan status based on refund result
        const finalStatus = params.refundMethod === "kaipay" ? "SELESAI" : "DIPROSES";
        
        await supabase
          .from("pembatalan_tiket")
          .update({ 
            status_refund: finalStatus,
            waktu_diproses: new Date().toISOString(),
            keterangan_admin: `Refund processed via ${params.refundMethod.toUpperCase()}. Transaction ID: ${refundResult.transactionId}`
          })
          .eq("pembatalan_id", pembatalan.pembatalan_id);

        // 5. Free up the seat inventory
        const { data: ticketData } = await supabase
          .from("tiket")
          .select("jadwal_kursi_id")
          .eq("kode_tiket", params.ticketId)
          .single();

        if (ticketData?.jadwal_kursi_id) {
          await supabase
            .from("jadwal_kursi")
            .update({ status_inventaris: "TERSEDIA" })
            .eq("jadwal_kursi_id", ticketData.jadwal_kursi_id);
        }

        toast.success(refundResult.message);

      } catch (error: any) {
        console.error("Cancel ticket with refund error:", error);
        throw new Error(error?.message || "Gagal membatalkan tiket");
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticketDetail"] });
      queryClient.invalidateQueries({ queryKey: ["pembatalan_tiket"] });
      queryClient.invalidateQueries({ queryKey: ["pengguna"] }); // For updated KAIPay balance
      
      // Force refresh all ticket-related queries to ensure status updates
      queryClient.refetchQueries({ queryKey: ["userTickets"] });
      queryClient.refetchQueries({ queryKey: ["ticketDetail"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setIsProcessing(false);
    }
  });

  return {
    cancelTicketWithRefund,
    isProcessing
  };
}