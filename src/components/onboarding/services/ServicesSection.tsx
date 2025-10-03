"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { colors } from "../../../app/design-system";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
  clickable?: boolean;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, index, clickable = false, onClick }) => {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Buka layanan ${title}` : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`bg-white rounded-3xl px-6 py-8 text-center shadow-lg transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center ${clickable ? "cursor-pointer hover:-translate-y-2 hover:shadow-2xl" : ""}`}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: index % 2 === 0 ? "linear-gradient(135deg, #a855f7 0%, #6b46c1 100%)" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        }}
      >
        <img src={icon} alt={title} className="w-8 h-8" />
      </div>
      <h4 className="text-black text-lg font-semibold mb-3">{title}</h4>
      <p className="text-black text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: "/ic_ticket_booking.svg",
      title: "Antar Kota",
      description: "Pesan tiket kereta dengan mudah",
      href: "/trains",
    },
    {
      icon: "/ic_e_porter.svg",
      title: "E-porter",
      description: "Pesan porter bagasi secara online",
      href: "/e-porter",
    },
    {
      icon: "/ic_kai_logistics.svg",
      title: "KAI Logistics",
      description: "Kirim paket ke seluruh negeri",
      href: "/logistic",
    },
    {
      icon: "/ic_hotels.svg",
      title: "Hotel & Shower",
      description: "Istirahat nyaman di stasiun",
    },
    {
      icon: "/ic_meal.svg",
      title: "Makanan di Kereta",
      description: "Pesan makanan dan minuman sebelum perjalanan",
    },
    {
      icon: "/ic_train.svg",
      title: "Kereta Lokal",
      description: "Tiket kereta lokal untuk perjalanan sehari-hari",
    },
    {
      icon: "/ic_train.svg",
      title: "Commuter Line",
      description: "Tiket commuter untuk perjalanan harian",
    },
    {
      icon: "/ic_train.svg",
      title: "LRT",
      description: "Tiket light rail transit",
    },
    {
      icon: "/ic_train.svg",
      title: "Bandara",
      description: "Tiket kereta bandara",
    },
    {
      icon: "/ic_train.svg",
      title: "Whoosh",
      description: "Tiket kereta cepat",
    },
  ];

  const router = useRouter();

  return (
    <section className="max-w-[100rem] mx-auto flex flex-col items-center py-20 pt-40 px-6 relative">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-black mb-4 text-center">Layanan KAI</h2>
        <p className="text-lg text-black mb-12 max-w-xl mx-auto text-center">Solusi perjalanan lengkap untuk kenyamanan Anda</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mx-auto">
          {services.map((service: any, index) => (
            <ServiceCard
              key={index}
              index={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              clickable={Boolean(service.href)}
              onClick={() => {
                if (service.href) router.push(service.href);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
