"use client";

import React from "react";

interface WhyChooseCardProps {
  title: string;
  description: string;
  icon: string;
}

const WhyChooseCard: React.FC<WhyChooseCardProps> = ({ title, description, icon }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className={`${hovered ? "bg-white text-gray-800" : "bg-white/8 text-white/50"} rounded-2xl p-4 cursor-pointer flex items-center gap-6 min-w-[440px] max-w-[600px] transition-all duration-300 ${
        hovered ? "opacity-100 shadow-lg" : "opacity-70"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${hovered ? "bg-gradient-to-br from-indigo-100 to-gray-100" : "bg-white/12"}`}>
        <img src={icon} alt={title} className="w-8 h-8" />
      </div>
      <div className="text-left">
        <h4 className="text-lg font-bold m-0 text-black">{title}</h4>
        <p className="text-sm mt-2 mb-0 text-black">{description}</p>
      </div>
    </div>
  );
};

const WhyChooseSection: React.FC = () => {
  const reasons = [
    {
      title: "Layanan Tepat Waktu",
      description: "Kereta kami berangkat dan tiba tepat waktu dengan tingkat ketepatan tinggi, memastikan Anda sampai sesuai jadwal.",
      icon: "/ic_flight.svg",
    },
    {
      title: "Aman & Terpercaya",
      description: "Sistem keselamatan dan protokol keamanan canggih untuk membuat perjalanan Anda nyaman dan tenang.",
      icon: "/ic_hotel.svg",
    },
    {
      title: "Kenyamanan Utama",
      description: "Rasakan kenyamanan prima dengan kursi luas, pengaturan suhu, dan fasilitas onboard yang baik.",
      icon: "/ic_lugage.svg",
    },
  ];

  return (
    <section className="py-16 relative w-full flex justify-center items-center">
      <div className="flex flex-row items-center gap-16 justify-center max-w-6xl w-full">
        {/* Left: Circular image */}
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-radial from-purple-300 via-indigo-300 to-blue-300 overflow-hidden flex items-center justify-center shadow-lg">
          <img src="/img_whychoose.png" alt="Why Choose KAI" className="w-full h-full object-cover" />
        </div>
        {/* Right: Column with heading, description, and cards */}
        <div className="flex flex-col items-start justify-center flex-1">
          <h2 className="text-4xl font-bold text-black">Kenapa memilih KAI?</h2>
          <p className="text-lg leading-relaxed max-w-lg mb-4 text-black">Nikmati pengalaman berbeda di setiap destinasi dan temukan petualangan baru yang terjangkau.</p>
          <div className="flex flex-col gap-4 items-start justify-center">
            {reasons.map((reason, index) => (
              <WhyChooseCard key={index} title={reason.title} description={reason.description} icon={reason.icon} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
