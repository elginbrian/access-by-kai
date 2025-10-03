"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavBarServices from "@/components/navbar/NavBarServices";

interface PaymentPageProps {
  params: { id: string };
}

const PaymentPage = ({ params }: PaymentPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const facilityId = params.id;
  const ticketId = searchParams.get("ticket");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => {
    router.push(`/showlok/booking/${facilityId}?ticket=${ticketId}`);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect back to ShowLok main page after successful payment
      router.push('/showlok?payment=success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <NavBarServices service="ShowLok" />
      
      <div className="container mx-auto px-8 py-16">
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isProcessing}
          >
            <span>←</span> Kembali ke booking
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Pembayaran ShowLok
        </h1>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center py-16">
            <p className="text-gray-600 mb-6">
              Halaman pembayaran sedang dalam pengembangan...
            </p>
            <div className="mt-4 text-sm text-gray-500 mb-8">
              <p>Facility ID: {facilityId}</p>
              <p>Ticket ID: {ticketId}</p>
            </div>
            
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-blue-600">Memproses pembayaran...</p>
              </div>
            ) : (
              <button
                onClick={handlePayment}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Bayar Sekarang
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;