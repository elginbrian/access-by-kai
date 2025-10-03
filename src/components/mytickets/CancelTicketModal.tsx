"use client";

import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useCancelTicketWithRefund } from "@/lib/hooks/useCancelTicketWithRefund";
import { useAuth } from "@/lib/auth/AuthContext";
import type { TicketDetailData } from "@/types/ticket";

interface CancelTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketDetail: TicketDetailData;
  onSuccess?: () => void;
}

interface RefundOption {
  id: "kaipay" | "creditcard";
  name: string;
  description: string;
  icon: string;
  processingTime: string;
}

const REFUND_OPTIONS: RefundOption[] = [
  {
    id: "kaipay",
    name: "KAIPay",
    description: "Saldo akan langsung masuk ke dompet KAIPay Anda",
    icon: "/ic_ewallet_blue.svg",
    processingTime: "Instan",
  },
  {
    id: "creditcard", 
    name: "Kartu Kredit",
    description: "Refund akan dikembalikan ke kartu kredit pembayaran",
    icon: "/ic_credit_card.svg",
    processingTime: "3-5 hari kerja",
  },
];

const CANCELLATION_REASONS = [
  "Perubahan rencana perjalanan",
  "Jadwal bentrok dengan kegiatan lain",
  "Kondisi kesehatan tidak memungkinkan",
  "Keadaan darurat",
  "Alasan pribadi lainnya",
];

export default function CancelTicketModal({ 
  isOpen, 
  onClose, 
  ticketDetail, 
  onSuccess 
}: CancelTicketModalProps) {
  const { user } = useAuth();
  const { cancelTicketWithRefund, isProcessing } = useCancelTicketWithRefund();
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [selectedRefundMethod, setSelectedRefundMethod] = useState<"kaipay" | "creditcard">("kaipay");
  const [cancellationReason, setCancellationReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  // Calculate refund amount (assume 10% cancellation fee)
  const ticketPrice = ticketDetail.price?.ticketPrice || 0;
  const cancellationFee = Math.round(ticketPrice * 0.10); // 10% fee
  const refundAmount = ticketPrice - cancellationFee;

  // Keyboard and focus management
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    
    const timer = setTimeout(() => {
      const firstFocusable = containerRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      firstFocusable?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      
      try {
        previouslyFocused.current?.focus();
      } catch (e) {
        // Ignore focus errors
      }
    };
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (!user?.profile?.user_id) {
      toast.error("User tidak teridentifikasi");
      return;
    }

    if (!cancellationReason && !customReason) {
      toast.error("Silakan pilih atau tulis alasan pembatalan");
      return;
    }

    const finalReason = cancellationReason === "Alasan pribadi lainnya" 
      ? customReason 
      : cancellationReason;

    if (!finalReason.trim()) {
      toast.error("Alasan pembatalan tidak boleh kosong");
      return;
    }

    try {
      await cancelTicketWithRefund.mutateAsync({
        ticketId: ticketDetail.id,
        tiketDbId: ticketDetail.tiketId || 0,
        userId: user.profile.user_id,
        reason: finalReason,
        refundMethod: selectedRefundMethod,
        cancellationFee,
        refundAmount,
      });

      onSuccess?.();
      onClose();

    } catch (error: any) {
      console.error("Cancellation error:", error);
      // Error is already handled by the hook with toast
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
    setSelectedRefundMethod("kaipay");
    setCancellationReason("");
    setCustomReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
        className="relative mx-auto my-8 max-w-lg w-full bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ring-1 ring-black/5"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="cancel-modal-title" className="text-xl font-semibold text-gray-900">
                Pembatalan Tiket
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Tiket: {ticketDetail.ticketNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Tutup modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isConfirming ? (
            <>
              {/* Refund Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Ringkasan Refund</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga Tiket</span>
                    <span className="text-gray-900">Rp {ticketPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Pembatalan (10%)</span>
                    <span className="text-red-600">-Rp {cancellationFee.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                    <span className="text-gray-900">Total Refund</span>
                    <span className="text-green-600">Rp {refundAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              {/* Refund Method Selection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Pilih Metode Refund</h4>
                <div className="space-y-3">
                  {REFUND_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedRefundMethod(option.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        selectedRefundMethod === option.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <img src={option.icon} alt={option.name} className="w-6 h-6 mt-0.5" />
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900">{option.name}</h5>
                            <span className="text-sm text-green-600 font-medium">
                              {option.processingTime}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedRefundMethod === option.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}>
                          {selectedRefundMethod === option.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cancellation Reason */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Alasan Pembatalan</h4>
                <div className="space-y-2">
                  {CANCELLATION_REASONS.map((reason) => (
                    <label key={reason} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="cancellation-reason"
                        value={reason}
                        checked={cancellationReason === reason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>

                {cancellationReason === "Alasan pribadi lainnya" && (
                  <div className="mt-3">
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Jelaskan alasan pembatalan..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {customReason.length}/500 karakter
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirming(true)}
                  disabled={!cancellationReason || (cancellationReason === "Alasan pribadi lainnya" && !customReason.trim())}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Lanjutkan
                </button>
              </div>
            </>
          ) : (
            /* Confirmation Step */
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Konfirmasi Pembatalan Tiket
                </h4>
                <p className="text-gray-600">
                  Anda yakin ingin membatalkan tiket ini? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiket</span>
                    <span className="text-gray-900">{ticketDetail.ticketNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode Refund</span>
                    <span className="text-gray-900">
                      {REFUND_OPTIONS.find(opt => opt.id === selectedRefundMethod)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jumlah Refund</span>
                    <span className="text-green-600 font-semibold">
                      Rp {refundAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Batalkan Tiket"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}