"use client";

import React from "react";
import { useRouter } from "next/navigation";

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
  const mainServices = [
    {
      icon: "/ic_hotels.svg",
      title: "Hotel & Shower",
      description: "Istirahat nyaman di stasiun",
      href: "/locker",
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
      icon: "/ic_meal.svg",
      title: "Makanan di Kereta",
      description: "Pesan makanan dan minuman sebelum perjalanan",
      href: "/trains",
    },
  ]

  const router = useRouter();

  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-black mb-4 text-center">Layanan KAI</h2>
        <p className="text-lg text-black mb-12 max-w-xl mx-auto text-center">Solusi perjalanan lengkap untuk kenyamanan Anda</p>
        
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {mainServices.map((service: any, index) => (
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

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div
            className="flex gap-4 overflow-x-auto pb-4 mb-20 px-2"
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch"
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {mainServices.map((service: any, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64"
                style={{ scrollSnapAlign: "start" }}
              >
                <ServiceCard
                  index={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  clickable={Boolean(service.href)}
                  onClick={() => {
                    if (service.href) router.push(service.href);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
