'use client';

import React, { useState } from 'react';
import { colors } from '../../../app/design-system';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="bg-white rounded-xl mb-4 shadow-md overflow-hidden transition-all duration-300">
      <button
        className="w-full p-6 bg-transparent border-none text-left cursor-pointer flex justify-between items-center text-lg font-semibold text-black"
        onClick={onClick}
      >
        <span>{question}</span>
        <div
          className="w-6 h-6 flex items-center justify-center transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
      </button>
      <div
        className="transition-all duration-300 overflow-hidden"
        style={{ maxHeight: isOpen ? '200px' : '0' }}
      >
        <div className="px-6 pb-6 text-gray-700 text-base leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Apa itu Access by KAI?',
      answer: 'Access by KAI adalah platform digital terpercaya untuk pemesanan tiket kereta api dan layanan pendukung perjalanan di Indonesia. Platform ini menyediakan layanan lengkap mulai dari pencarian jadwal, pemesanan tiket, hingga layanan tambahan seperti e-porter, logistik, dan pemesanan makanan di kereta.'
    },
    {
      question: 'Bagaimana cara memesan tiket kereta api di platform ini?',
      answer: 'Anda dapat memesan tiket dengan mudah melalui fitur pencarian di beranda. Pilih stasiun keberangkatan dan tujuan, tentukan tanggal perjalanan, jumlah penumpang, dan kelas kereta yang diinginkan. Sistem akan menampilkan jadwal dan harga tiket yang tersedia untuk dipilih.'
    },
    {
      question: 'Layanan apa saja yang tersedia di Access by KAI?',
      answer: 'Kami menyediakan berbagai layanan meliputi: pemesanan tiket kereta api, KAI e-Porter untuk bantuan bagasi, KAI Logistik untuk pengiriman paket, pemesanan makanan dan minuman di kereta, layanan hotel & shower di stasiun, serta fitur transfer tiket antar pengguna terpercaya.'
    },
    {
      question: 'Apakah saya bisa mengubah atau membatalkan tiket yang sudah dipesan?',
      answer: 'Ya, platform kami menyediakan fitur ganti kursi dengan biaya tambahan 15% dari harga tiket. Untuk pembatalan tiket, kebijakan dan biaya pembatalan mengikuti ketentuan resmi PT KAI. Anda dapat mengakses fitur ini melalui halaman "Tiket Saya" setelah login.'
    },
    {
      question: 'Bagaimana cara menggunakan layanan KAI e-Porter?',
      answer: 'KAI e-Porter membantu Anda mengangkat bagasi di stasiun. Pilih tiket aktif Anda, tentukan penumpang yang membutuhkan bantuan, pilih titik pertemuan di stasiun, dan lakukan pemesanan. Porter resmi KAI akan membantu membawa barang bawaan Anda dengan aman.'
    },
    {
      question: 'Apakah pembayaran di platform ini aman?',
      answer: 'Ya, kami menggunakan sistem pembayaran yang aman dan terintegrasi dengan Midtrans. Platform mendukung berbagai metode pembayaran termasuk kartu kredit, e-wallet, dan transfer bank. Semua transaksi dienkripsi dan mengikuti standar keamanan internasional.'
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-[100rem] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">Pertanyaan Yang Sering Diajukan</h2>
        </div>
        <div>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFAQ === index}
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;