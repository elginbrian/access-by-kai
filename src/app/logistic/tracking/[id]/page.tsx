"use client";

import React from "react";
import Stepper from "@/components/logistics/Stepper";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";

const LogisticTrackingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <TrainNavigation />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <Stepper currentStep={4} />

        <div className="bg-white rounded-xl p-8 shadow-sm mt-8">
          {/* Header Section */}
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-100">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pelacakan Real-time</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">Paket #KAI123456789</div>
                  <div className="text-gray-600">Jakarta → Surabaya</div>
                </div>
                <div className="ml-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">Dalam Perjalanan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="relative">
            {/* Package Picked Up */}
            <div className="flex items-start pb-12">
              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Paket Diambil</h3>
                <p className="text-gray-600">Depo Jakarta - 15 Okt 2024 10:30</p>
              </div>
              {/* Vertical line */}
              <div className="absolute left-6 top-12 w-0.5 h-20 bg-blue-600"></div>
            </div>

            {/* In Transit */}
            <div className="flex items-start pb-12">
              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Dalam Perjalanan</h3>
                <p className="text-gray-600">Saat ini di Hub Cirebon - 15 Okt 2024 18:45</p>
              </div>
              {/* Vertical line */}
              <div className="absolute left-6 top-32 w-0.5 h-20 bg-blue-300"></div>
            </div>

            {/* Out for Delivery */}
            <div className="flex items-start">
              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v6m8-6v6" />
                </svg>
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-500 mb-1">Dalam Pengantaran</h3>
                <p className="text-gray-500">Estimasi 16 Okt 2024</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogisticTrackingPage;
