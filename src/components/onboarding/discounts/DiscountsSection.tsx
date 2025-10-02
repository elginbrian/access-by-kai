'use client';

import React from 'react';
import { colors } from '../../../app/design-system';

interface DiscountCardProps {
  title: string;
  image: string;
  isPromo?: boolean;
  dueDate?: string;
}

const DiscountCard: React.FC<DiscountCardProps> = ({ title, image, isPromo, dueDate }) => {
  return (
    <div
      className="relative rounded-2xl overflow-hidden h-[400px] flex flex-col justify-end shadow-xl cursor-pointer transition-all duration-300 group"
      style={{ backgroundImage: `url(${image})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
    >
      {/* Overlay gradient only on corners */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at 0% 0%, rgba(10,18,38,0.55) 0%, transparent 20%), radial-gradient(circle at 100% 0%, rgba(10,18,38,0.55) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(10,18,38,0.55) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(10,18,38,0.55) 0%, transparent 60%)'
        }}
      />
      {/* Content */}
      <div className="relative z-20 p-8 flex flex-col items-start h-full justify-end">
        {/* Promo pill and date */}
        {isPromo && (
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-yellow-400 text-gray-900 rounded-lg px-4 py-1 text-xs font-bold uppercase tracking-wide">Promo</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="inline-block"><rect x="3" y="6" width="14" height="11" rx="2" fill="#fff" opacity="0.7" /><rect x="7" y="2" width="2" height="4" rx="1" fill="#fff" opacity="0.7" /><rect x="11" y="2" width="2" height="4" rx="1" fill="#fff" opacity="0.7" /></svg>
            <span className="text-white text-sm opacity-85">{dueDate}</span>
          </div>
        )}
        {/* Title */}
        <h3 className="text-white text-lg font-bold mb-2 leading-snug drop-shadow-lg text-left">{title}</h3>
        {/* CTA link */}
        <span className="text-white text-sm cursor-pointer opacity-90">Baca Selengkapnya</span>
      </div>
    </div>
  );
};

const DiscountsSection: React.FC = () => {
  const discounts = [
    {
      title: 'Nikmati diskon hingga 20% untuk perjalanan rute favoritmu',
      image: '/person_listening_music.png',
      isPromo: true,
      dueDate: '15 Sep, 2021',
    },
    {
      title: 'Paket Olahraga Premium dengan Harga Terjangkau',
      image: '/joystick.png',
      isPromo: false,
    },
    {
      title: 'Produk Tech Terbaru - Smart Banking Solutions',
      image: '/person_with_googles.png',
      isPromo: false,
    }
  ];

  return (
  <section className="py-20 px-6 text-center">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-bold text-black mb-4">Diskon & Promo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {discounts.map((discount, index) => (
            <DiscountCard
              key={index}
              title={discount.title}
              image={discount.image}
              isPromo={discount.isPromo}
              dueDate={discount.dueDate}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscountsSection;