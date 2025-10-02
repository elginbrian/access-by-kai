"use client";

import React, { useState } from "react";
import { colors } from "@/app/design-system/colors";
import { useCentralBooking } from "@/lib/hooks/useCentralBooking";
import { validateBookingCompletion, getBookingCompletionStatus } from "@/lib/validation/bookingValidation";

interface PaymentButtonProps {
  onClick?: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ onClick }) => {
  const { bookingData } = useCentralBooking();
  const [showErrors, setShowErrors] = useState(false);

  const validation = validateBookingCompletion(bookingData);
  const status = getBookingCompletionStatus(bookingData);

  const handleClick = () => {
    if (validation.isValid) {
      onClick?.();
    } else {
      setShowErrors(true);
      setTimeout(() => setShowErrors(false), 5000);
    }
  };

  return (
    <div className="space-y-4">
      {showErrors && !validation.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-red-700">Data belum lengkap:</span>
          </div>
          <ul className="text-sm text-red-600 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-red-400 mt-1">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={!validation.isValid}
        className={`w-full py-4 text-white rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${validation.isValid ? "hover:opacity-90 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
        style={{
          background: validation.isValid ? `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)` : `linear-gradient(135deg, ${colors.base.darkActive} 0%, ${colors.base.darker} 100%)`,
        }}
      >
        {validation.isValid ? (
          <>
            Lanjut ke Pemesanan Makanan
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        ) : (
          <>
            Lengkapi Data Terlebih Dahulu
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default PaymentButton;
