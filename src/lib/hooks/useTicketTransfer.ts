import { useState } from "react";
import toast from "react-hot-toast";

interface TransferTicketData {
  ticketId: string;
  targetNik: string;
  targetNama: string;
}

interface TransferResponse {
  success: boolean;
  message: string;
  targetUser?: {
    nama: string;
    nik: string;
  };
  error?: string;
}

export function useTicketTransfer() {
  const [isLoading, setIsLoading] = useState(false);

  const transferTicket = async (data: TransferTicketData): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/tickets/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: data.ticketId,
          targetNik: data.targetNik,
          targetNama: data.targetNama,
        }),
      });

      const result: TransferResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        toast.success(result.message || "Tiket berhasil ditransfer!");
        return;
      } else {
        throw new Error(result.error || "Transfer gagal");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const validateUser = async (nik: string, nama: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/users/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nik,
          nama,
        }),
      });

      const result = await response.json();
      return response.ok && result.exists;
    } catch (error) {
      console.error("User validation error:", error);
      return false;
    }
  };

  return {
    transferTicket,
    validateUser,
    isLoading,
  };
}