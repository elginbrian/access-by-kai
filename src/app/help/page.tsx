"use client";

import React from "react";
import { colors } from "@/app/design-system/colors";

const HelpCenterPage = () => {
  const faqItems = [
    {
      question: "Bagaimana cara memesan tiket kereta api?",
      answer: "Anda dapat memesan tiket melalui website atau aplikasi KAI Access. Pilih stasiun keberangkatan dan tujuan, tanggal perjalanan, lalu pilih kereta yang tersedia.",
    },
    {
      question: "Bagaimana cara melakukan pembatalan tiket?",
      answer: "Pembatalan tiket dapat dilakukan maksimal 2 jam sebelum keberangkatan melalui menu 'Riwayat Tiket' di profil Anda.",
    },
    {
      question: "Apa itu KAI Pay dan bagaimana cara menggunakannya?",
      answer: "KAI Pay adalah dompet digital untuk memudahkan pembayaran tiket kereta api. Anda dapat melakukan top up dan menggunakan saldo untuk pembelian tiket.",
    },
    {
      question: "Bagaimana cara mengumpulkan RaiPoint?",
      answer: "RaiPoint didapat setiap kali Anda melakukan perjalanan dengan kereta api. Poin dapat ditukar dengan berbagai keuntungan dan diskon.",
    },
    {
      question: "Apakah bisa mengubah data penumpang setelah pemesanan?",
      answer: "Data penumpang tidak dapat diubah setelah pembayaran. Pastikan data yang dimasukkan sudah benar sebelum melakukan pembayaran.",
    },
  ];

  const contactMethods = [
    {
      type: "WhatsApp",
      value: "+62 21-12345678",
      icon: "/ic_phone.svg",
      description: "Chat dengan customer service",
    },
    {
      type: "Email",
      value: "cs@kai.id",
      icon: "/ic_mail.svg",
      description: "Kirim pertanyaan via email",
    },
    {
      type: "Call Center",
      value: "121",
      icon: "/ic_phone.svg",
      description: "Hubungi 24/7",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.base.lightHover }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.base.darker }}>
            Pusat Bantuan
          </h1>
          <p className="text-lg" style={{ color: colors.base.darkActive }}>
            Temukan jawaban untuk pertanyaan Anda atau hubungi tim customer service kami
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6" style={{ color: colors.base.darker }}>
                Pertanyaan yang Sering Diajukan
              </h2>

              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-lg mb-3" style={{ color: colors.base.darker }}>
                      {item.question}
                    </h3>
                    <p className="leading-relaxed" style={{ color: colors.base.darkActive }}>
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6" style={{ color: colors.base.darker }}>
                Hubungi Kami
              </h2>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.blue.light }}>
                      <img src={method.icon} alt={method.type} className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1" style={{ color: colors.base.darker }}>
                        {method.type}
                      </h3>
                      <p className="font-medium mb-1" style={{ color: colors.blue.normal }}>
                        {method.value}
                      </p>
                      <p className="text-sm" style={{ color: colors.base.darkActive }}>
                        {method.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Tips */}
              <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: colors.blue.light }}>
                <h3 className="font-semibold mb-2" style={{ color: colors.base.darker }}>
                  💡 Tips Cepat
                </h3>
                <ul className="text-sm space-y-1" style={{ color: colors.base.darkActive }}>
                  <li>• Simpan nomor tiket untuk kemudahan tracking</li>
                  <li>• Datang 30 menit sebelum keberangkatan</li>
                  <li>• Pastikan data penumpang sesuai identitas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Profile */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`,
              boxShadow: "0 4px 12px rgba(74, 144, 226, 0.25)",
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
