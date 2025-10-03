"use client";

import React from "react";

interface Step {
  number: string;
  icon: string;
  title: string;
  description: string;
}

interface StepsSectionProps {
  title?: string;
  description?: string;
  steps?: Step[];
}

const StepsSection: React.FC<StepsSectionProps> = ({
  title = "Langkah-Langkah\nMenggunakan KAI Logistik",
  description = "KAI Logistik adalah layanan pengiriman barang berbasis kereta api yang praktis, cepat, dan aman. Melalui sistem ini, Anda bisa menghitung estimasi biaya, melakukan pemesanan, melacak paket secara real-time, hingga memantau riwayat pengiriman dalam satu platform.",
  steps = [
    {
      number: "01",
      icon: "/ic_logistic_step1.svg",
      title: "Simulasi Harga",
      description: "Masukkan asal, tujuan, berat, dan volume barang Anda untuk menghitung estimasi biaya pengiriman secara otomatis.",
    },
    {
      number: "02",
      icon: "/ic_logistic_step2.svg",
      title: "Pemesanan",
      description: "Lengkapi detail pengirim dan penerima serta deskripsi barang yang akan dikirim. Setelah itu lakukan pemesanan.",
    },
    {
      number: "03",
      icon: "/ic_logistic_step3.svg",
      title: "Pelacakan",
      description: "Pantau perjalanan paket Anda secara real-time dengan memasukkan nomor resi di fitur pelacakan.",
    },
    {
      number: "04",
      icon: "/ic_logistic_step4.svg",
      title: "Selesai",
      description: "Lihat riwayat pengiriman Anda untuk memantau status paket yang sudah dikirim.",
    },
  ],
}) => {
  return (
    <div className="container mx-auto px-8 py-16">
      <div className="grid grid-cols-2 gap-16 items-start">
        {/* Left Side */}
        <div className="flex flex-col justify-center h-full">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line.includes("KAI Logistik") ? (
                  <>
                    {line.split("KAI Logistik")[0]}
                    <span className="bg-gradient-to-br from-[#5c2ca4] to-[#dd577a] bg-clip-text text-transparent">KAI Logistik</span>
                    {line.split("KAI Logistik")[1]}
                  </>
                ) : (
                  line
                )}
                {index < title.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Right Side - Steps */}
        <div className="">
          {steps.map((step, index) => (
            <div key={index} className={`flex items-start gap-6`}>
              <div className="text-4xl font-bold text-gray-900">{step.number}</div>
              <div className="flex items-start gap-4 pl-4">
                <img src={step.icon} alt={step.title} className="w-12 h-12 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepsSection;
