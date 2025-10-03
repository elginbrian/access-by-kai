"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Stepper from "@/components/logistics/Stepper";
import PriceForm from "@/components/logistics/simulation/PriceForm";
import EstimatedCost from "@/components/logistics/simulation/EstimatedCost";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";

const LogisticsPriceSimulationPage = () => {
  const router = useRouter();

  function goToBooking() {
    router.push("/logistic/booking");
  }

  const [estimate, setEstimate] = React.useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <TrainNavigation />
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <Stepper currentStep={1} />
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#ebf8ff] text-white">
              <img src="/ic_calculator.svg" alt="icon" className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Simulasi Harga</h3>
          </div>
          <PriceForm onEstimate={(e: any) => setEstimate(e)} />
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <EstimatedCost totalPriceIdr={estimate?.priceIdr ?? null} breakdown={estimate?.breakdown ?? []} estimatedWeightKg={estimate?.estimatedWeightKg ?? null} estimatedVolumeM3={estimate?.estimatedVolumeM3 ?? null} />
          <button
            onClick={goToBooking}
            disabled={!estimate}
            aria-disabled={!estimate}
            className={`w-full py-3 rounded-lg text-white font-semibold mt-6 flex items-center justify-center gap-2 ${estimate ? "bg-gradient-to-b from-[#6b46c1] to-[#3b82f6] hover:opacity-95" : "bg-gray-300 cursor-not-allowed"}`}
          >
            <span className="flex items-center justify-center gap-2">
              Selanjutnya
              <img src="/ic_arrow_right.svg" alt="" className="h-4 w-4" />
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default LogisticsPriceSimulationPage;
