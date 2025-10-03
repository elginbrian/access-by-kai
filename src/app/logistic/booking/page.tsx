"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Stepper from "@/components/logistics/Stepper";
import Button from "@/components/button/Button";
import InputField from "@/components/input/InputField";
import TextAreaField from "@/components/input/TextAreaField";
import { useStasiunList } from "@/lib/hooks/stasiun";
import CustomSelect from "@/components/ui/form/CustomSelect";
import { useAuth } from "@/lib/auth/AuthContext";
import { useBookingFormData } from "@/lib/hooks/useBookingFormData";
import useLogisticFlow from "@/lib/hooks/useLogisticFlow";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";

const BookingDetailsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [stasiunAsal, setStasiunAsal] = React.useState<number | null>(null);
  const [stasiunTujuan, setStasiunTujuan] = React.useState<number | null>(null);

  const { user } = useAuth();
  const { userData, updateBookerData } = useBookingFormData();

  const [bookerName, setBookerName] = React.useState<string>(userData.fullName || "");
  const [bookerPhone, setBookerPhone] = React.useState<string>(userData.phoneNumber || "");
  const [senderAddress, setSenderAddress] = React.useState<string>("");
  const [receiverName, setReceiverName] = React.useState<string>("");
  const [receiverPhone, setReceiverPhone] = React.useState<string>("");
  const [receiverAddress, setReceiverAddress] = React.useState<string>("");

  const { flow, setSimulation, updateBooking } = useLogisticFlow();

  React.useEffect(() => {
    setBookerName(userData.fullName || "");
    setBookerPhone(userData.phoneNumber || "");
  }, [userData.fullName, userData.phoneNumber]);

  React.useEffect(() => {
    if (!flow) return;
    try {
      if (flow.simulation?.origin) setStasiunAsal(Number(flow.simulation.origin));
      if (flow.simulation?.destination) setStasiunTujuan(Number(flow.simulation.destination));
      if (flow.booking?.sender) {
        setBookerName(flow.booking.sender.name || userData.fullName || "");
        setBookerPhone(flow.booking.sender.phone || userData.phoneNumber || "");
        setSenderAddress(flow.booking.sender.address || "");
      }
      if (flow.booking?.receiver) {
        setReceiverName(flow.booking.receiver.name || "");
        setReceiverPhone(flow.booking.receiver.phone || "");
        setReceiverAddress(flow.booking.receiver.address || "");
      }
    } catch (e) {
      // ignore malformed flow
    }
  }, [flow, userData.fullName, userData.phoneNumber]);

  const stasiunQ = useStasiunList();
  const stationOptions = React.useMemo(() => {
    if (!stasiunQ.data) return [];
    return stasiunQ.data.map((s) => ({ value: s.id, label: s.nama, code: s.kode, city: s.kota, province: s.provinsi, type: "station" as const }));
  }, [stasiunQ.data]);

  async function goToPayment() {
    setError(null);
    setLoading(true);
    try {
      // use controlled state values
      const fullNameInput = bookerName;
      const phoneInput = bookerPhone;

      const payload = {
        user_id: Number(1),
        nomor_resi: `KAI-${Date.now()}`,
        stasiun_asal_id: stasiunAsal ?? undefined,
        stasiun_tujuan_id: stasiunTujuan ?? undefined,
        pengirim_nama: fullNameInput,
        pengirim_nomor_telepon: phoneInput,
        pengirim_alamat: senderAddress,
        penerima_nama: receiverName,
        penerima_nomor_telepon: receiverPhone,
        penerima_alamat: receiverAddress,
        biaya_pengiriman: Number(0),
        status_pengiriman: "PENDING_PAYMENT",
        waktu_pembuatan: new Date().toISOString(),
      } as any;

      const res = await fetch("/api/logistic/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create order");

      const created = data.order;
      const orderId = created?.pengiriman_id ?? created?.pengiriman_id;
      if (!orderId) throw new Error("Missing order id in response");

      router.push(`/logistic/payment/${orderId}`);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <TrainNavigation />
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <Stepper currentStep={2} />

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#8b5cf6] to-[#dd577a] text-white">
              <img src="/ic_box_white.svg" alt="icon" className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Detail Pemesanan</h3>
          </div>

          <section className="mb-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Informasi Pengirim</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Nama Lengkap"
                className="w-full"
                value={bookerName}
                onChange={(e: any) => {
                  setBookerName(e.target.value);
                  updateBookerData({ fullName: e.target.value });
                  try {
                    updateBooking({ sender: { ...(flow.booking?.sender || {}), name: e.target.value } });
                  } catch (er) {}
                }}
              />
              <InputField
                label="Nomor Telepon"
                className="w-full"
                value={bookerPhone}
                onChange={(e: any) => {
                  setBookerPhone(e.target.value);
                  updateBookerData({ phoneNumber: e.target.value });
                  try {
                    updateBooking({ sender: { ...(flow.booking?.sender || {}), phone: e.target.value } });
                  } catch (er) {}
                }}
              />
              <div className="md:col-span-2 w-full">
                <TextAreaField
                  rows={3}
                  label="Alamat Pengirim"
                  className="w-full"
                  value={senderAddress}
                  onChange={(e: any) => {
                    setSenderAddress(e.target.value);
                    try {
                      updateBooking({ sender: { ...(flow.booking?.sender || {}), address: e.target.value } });
                    } catch (er) {}
                  }}
                />
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Stasiun Pengambilan / Pengantaran</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stasiun Asal</label>
                {stasiunQ.isLoading ? (
                  <div className="text-sm text-gray-500">Loading stations...</div>
                ) : stasiunQ.isError ? (
                  <div className="text-sm text-red-500">Failed to load stations</div>
                ) : (
                  <CustomSelect
                    options={stationOptions}
                    value={stasiunAsal ?? ""}
                    onChange={(v) => {
                      const n = typeof v === "number" ? v : Number(v);
                      setStasiunAsal(n);
                      try {
                        setSimulation({ origin: n });
                      } catch (e) {}
                    }}
                    placeholder={stasiunQ.isLoading ? "Memuat stasiun..." : "Pilih stasiun asal"}
                    disabled={stasiunQ.isLoading}
                    loading={stasiunQ.isLoading}
                    searchable={true}
                  />
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stasiun Tujuan</label>
                {stasiunQ.isLoading ? (
                  <div className="text-sm text-gray-500">Loading stations...</div>
                ) : stasiunQ.isError ? (
                  <div className="text-sm text-red-500">Failed to load stations</div>
                ) : (
                  <CustomSelect
                    options={stationOptions}
                    value={stasiunTujuan ?? ""}
                    onChange={(v) => {
                      const n = typeof v === "number" ? v : Number(v);
                      setStasiunTujuan(n);
                      try {
                        setSimulation({ destination: n });
                      } catch (e) {}
                    }}
                    placeholder={stasiunQ.isLoading ? "Memuat stasiun..." : "Pilih stasiun tujuan"}
                    disabled={stasiunQ.isLoading}
                    loading={stasiunQ.isLoading}
                    searchable={true}
                  />
                )}
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Informasi Penerima</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Nama Lengkap"
                className="w-full"
                value={receiverName}
                onChange={(e: any) => {
                  setReceiverName(e.target.value);
                  try {
                    updateBooking({ receiver: { ...(flow.booking?.receiver || {}), name: e.target.value } });
                  } catch (er) {}
                }}
              />
              <InputField
                label="Nomor Telepon"
                className="w-full"
                value={receiverPhone}
                onChange={(e: any) => {
                  setReceiverPhone(e.target.value);
                  try {
                    updateBooking({ receiver: { ...(flow.booking?.receiver || {}), phone: e.target.value } });
                  } catch (er) {}
                }}
              />
              <div className="md:col-span-2 w-full">
                <TextAreaField
                  rows={3}
                  label="Alamat Penerima"
                  className="w-full"
                  value={receiverAddress}
                  onChange={(e: any) => {
                    setReceiverAddress(e.target.value);
                    try {
                      updateBooking({ receiver: { ...(flow.booking?.receiver || {}), address: e.target.value } });
                    } catch (er) {}
                  }}
                />
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Deskripsi Barang</h4>
            <TextAreaField rows={4} label="Deskripsikan barang Anda..." className="w-full" />
          </section>

          <div className="mt-6">
            {(() => {
              const isDisabled = !(bookerName.trim() && bookerPhone.trim() && senderAddress.trim() && stasiunAsal && stasiunTujuan);
              const enabledClass = "w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]";
              const disabledClass = "w-full py-3 rounded-full text-white font-semibold bg-gray-400 cursor-not-allowed";
              return (
                <Button onClick={goToPayment} variant="active" disabled={isDisabled} className={isDisabled ? disabledClass : enabledClass}>
                  Selanjutnya →
                </Button>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingDetailsPage;
