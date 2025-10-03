"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Stepper from "@/components/logistics/Stepper";
import NavBarServices from "@/components/navbar/NavBarServices";
import Button from "@/components/button/Button";
import SuccessModal from "@/components/logistics/payment/success/SuccessModal";
import useLogisticPayment from "@/lib/hooks/useLogisticPayment";
import PaymentMethodSelector from "@/components/trains/payment/PaymentMethodSelector";
import PaymentSummary from "@/components/trains/payment/PaymentSummary";
import useLogisticFlow from "@/lib/hooks/useLogisticFlow";

const LogisticPaymentPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const res = await fetch(`/api/logistic/orders/${orderId}`);
        if (!res.ok) return;
        const data = await res.json();
        setOrder(data.order ?? null);
      } catch (err) {}
    })();
  }, [orderId]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const logisticPayment = useLogisticPayment();
  const { flow } = useLogisticFlow();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState<string>("credit");
  const [selectedSpecificMethod, setSelectedSpecificMethod] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [popupClosed, setPopupClosed] = useState(false);

  function goToTracking() {
    const packageId = order?.nomor_resi ?? `KAI${orderId}`;
    router.push(`/logistic/tracking/${packageId}`);
  }

  async function handlePayNow() {
    setPageError(null);

    try {
      let createdOrder = order;

      if (!createdOrder) {
        setIsCreatingOrder(true);

        const payload: any = {
          user_id: Number(1),
          nomor_resi: `KAI-${Date.now()}`,
          stasiun_asal_id: flow?.simulation?.origin ?? undefined,
          stasiun_tujuan_id: flow?.simulation?.destination ?? undefined,
          pengirim_nama: flow?.booking?.sender?.name ?? undefined,
          pengirim_nomor_telepon: flow?.booking?.sender?.phone ?? undefined,
          pengirim_alamat: flow?.booking?.sender?.address ?? undefined,
          penerima_nama: flow?.booking?.receiver?.name ?? undefined,
          penerima_nomor_telepon: flow?.booking?.receiver?.phone ?? undefined,
          penerima_alamat: flow?.booking?.receiver?.address ?? undefined,
          biaya_pengiriman: Number(flow?.simulation?.estimate?.priceIdr ?? 0),
          status_pengiriman: "PENDING_PAYMENT",
          waktu_pembuatan: new Date().toISOString(),
        };

        try {
          const res = await fetch(`/api/logistic/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await res.json();
          if (!res.ok) {
            setPageError(data?.error || "Failed to create order");
            setIsCreatingOrder(false);
            return;
          }

          createdOrder = data.order ?? null;
          setOrder(createdOrder);
        } catch (err) {
          setPageError((err as Error)?.message ?? String(err));
          setIsCreatingOrder(false);
          return;
        } finally {
          setIsCreatingOrder(false);
        }
      }

      const pengirimanId = createdOrder?.pengiriman_id ?? createdOrder?.pengiriman_id ?? orderId;
      if (!pengirimanId) {
        setPageError("Missing order id to create payment");
        return;
      }

      await logisticPayment.createPayment(String(pengirimanId));

      if (logisticPayment.snapToken) {
        setPopupClosed(false);
        logisticPayment.openSnapPayment(() => setPopupClosed(true));
      }
    } catch (err) {
      console.error("handlePayNow error:", err);
      setPageError((err as Error)?.message ?? String(err));
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <NavBarServices service="Logistik" />
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <Stepper currentStep={3} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 text-black">Detail Paket</h3>
              <div className="p-4 bg-[#f5f3ff] rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#6b46c1] text-white">
                    <img src="/ic_package.svg" alt="package" className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-black">{flow?.simulation?.estimate?.packageType ?? order?.jenis_koli ?? "Koli - Koper"}</div>
                    <div className="text-sm text-black">
                      {flow?.simulation?.estimate?.originName && flow?.simulation?.estimate?.destinationName
                        ? `${flow.simulation.estimate.originName} → ${flow.simulation.estimate.destinationName}`
                        : order?.asal && order?.tujuan
                        ? `${order.asal} → ${order.tujuan}`
                        : "Jakarta (GMR) → Surabaya (SBY)"}
                    </div>
                    <div className="text-sm text-black mt-2">
                      Berat: {flow?.simulation?.estimate?.weightKg ?? order?.berat_kg ?? "12"} kg • Volume: {flow?.simulation?.estimate?.volumeM3 ?? order?.volume_m3 ?? "0.06"} m³
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-black">Layanan: {flow?.simulation?.estimate?.service ?? order?.servis ?? "E-Porter"}</div>
                    <div className="text-sm text-black">Pengambilan: {flow?.booking?.sender?.address ?? order?.pengirim_alamat ?? "Stasiun Gambir"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <PaymentMethodSelector
                activePaymentMethod={activePaymentMethod}
                onPaymentMethodChange={(m) => setActivePaymentMethod(m)}
                selectedSpecificMethod={selectedSpecificMethod}
                onSpecificMethodChange={setSelectedSpecificMethod}
                cardNumber={cardNumber}
                cardName={cardName}
                expiryDate={expiryDate}
                cvv={cvv}
                promoCode={promoCode}
                onCardNumberChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                onCardNameChange={(e) => setCardName(e.target.value)}
                onExpiryDateChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length === 0) setExpiryDate("");
                  else if (val.length <= 2) setExpiryDate(val + "/");
                  else setExpiryDate(val.slice(0, 2) + "/" + val.slice(2, 4));
                }}
                onCvvChange={(e) => setCvv(e.target.value)}
                onPromoCodeChange={(e) => setPromoCode(e.target.value)}
              />
            </div>
          </div>

          <aside>
            <PaymentSummary
              ticketPrice={Number(flow?.simulation?.estimate?.priceIdr ?? order?.biaya_pengiriman ?? 150000)}
              foodTotal={0}
              adminFee={Number(flow?.simulation?.estimate?.pickupFee ?? order?.biaya_pengambilan ?? 25000)}
              insurance={Number(flow?.simulation?.estimate?.insurance ?? order?.biaya_asuransi ?? 10000)}
              total={Number(flow?.simulation?.estimate?.priceIdr ?? order?.total_biaya ?? 595000)}
              formatPrice={(p: number) => `Rp ${p.toLocaleString("id-ID")}`}
              foodOrders={[]}
              passengerCount={1}
              onProceedToPayment={handlePayNow}
              onBackToReview={() => router.push("/logistic/booking")}
              isPaymentLoading={logisticPayment.isLoading || logisticPayment.isProcessing || isCreatingOrder}
              paymentStatus={logisticPayment.status}
              paymentError={logisticPayment.error}
              onRetryPayment={logisticPayment.retryPayment}
              onResetPayment={logisticPayment.resetPayment}
              onContinuePayment={() => {
                if (logisticPayment.snapToken) {
                  setPopupClosed(false);
                  logisticPayment.openSnapPayment(() => setPopupClosed(true));
                }
              }}
              isSnapReady={logisticPayment.isSnapReady}
              popupClosed={popupClosed}
              snapToken={logisticPayment.snapToken}
            />

            {pageError && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">Error: {pageError}</div>}

            <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} onNext={goToTracking} />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default LogisticPaymentPage;
