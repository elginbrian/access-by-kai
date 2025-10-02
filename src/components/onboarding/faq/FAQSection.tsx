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
      question: 'Apa itu PIER?',
      answer: 'PIER adalah platform e-commerce yang telah berkembang di usia yang ke-10 untuk membangun para vendor melalui teknologi terdepan. PIER berkomitmen untuk memberikan platform terbaik bagi para vendor.'
    },
    {
      question: 'Mengapa harus melakukan registrasi vendor pada platform PIER?',
      answer: 'Registrasi vendor pada platform PIER memberikan akses ke jutaan pelanggan, sistem pembayaran yang aman, dukungan logistik terintegrasi, dan berbagai tools untuk mengembangkan bisnis Anda.'
    },
    {
      question: 'Dokumen apa saja yang perlu disiapkan untuk registrasi vendor?',
      answer: 'Dokumen yang diperlukan meliputi KTP/identitas diri, NPWP, surat izin usaha, rekening bank atas nama perusahaan/individu, dan foto produk yang akan dijual.'
    },
    {
      question: 'Berapa lama proses verifikasi vendor?',
      answer: 'Proses verifikasi vendor biasanya memakan waktu 3-7 hari kerja setelah semua dokumen lengkap diterima dan diverifikasi oleh tim kami.'
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