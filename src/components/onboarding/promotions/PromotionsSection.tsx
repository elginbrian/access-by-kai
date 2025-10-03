"use client";

import React from "react";
import { colors } from "../../../app/design-system";

interface PromotionCardProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ title, description, image, buttonText }) => {
  return (
    <div
      style={{
        background: colors.base.light,
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(44, 44, 84, 0.12)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: "32px",
        gap: "32px",
        margin: "0 auto",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(44, 44, 84, 0.16)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(44, 44, 84, 0.12)";
      }}
    >
      {/* Left: Content */}
      <div style={{ flex: 1, textAlign: "left" }}>
        {/* Limited Time pill */}
        <div
          style={{
            display: "inline-block",
            background: "hsla(0, 0%, 80%, 0.3)",
            color: "#C44F4F",
            borderRadius: "16px",
            padding: "6px 18px",
            fontSize: "15px",
            fontWeight: 500,
            marginBottom: "16px",
          }}
        >
          Terbatas
        </div>
        <h4
          style={{
            color: colors.base.darker,
            fontSize: "24px",
            fontWeight: 600,
            margin: "12px 0 8px 0",
          }}
        >
          {title}
        </h4>
        <p
          style={{
            color: colors.base.dark,
            fontSize: "16px",
            lineHeight: 1.5,
            marginBottom: "24px",
          }}
        >
          {description}
        </p>
        <button
          style={{
            background: "linear-gradient(90deg, hsla(258, 50%, 52%, 1) 0%, hsla(217, 91%, 60%, 1) 100%)",
            color: colors.base.light,
            border: "none",
            borderRadius: "8px",
            padding: "12px 32px",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(44,44,84,0.08)",
            transition: "all 0.2s ease",
          }}
        >
          {buttonText}
        </button>
      </div>
      {/* Right: Image */}
      <div
        style={{
          flexShrink: 0,
          width: "120px",
          height: "120px",
          borderRadius: "16px",
          background: "hsla(217, 91%, 95%, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img src={image} alt="Promo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
    </div>
  );
};

const PromotionsSection: React.FC = () => {
  const promotions = [
    {
      title: "Diskon 50% Kelas Eksekutif",
      description: "Dapatkan diskon besar untuk tiket kelas eksekutif di rute tertentu",
      image: "/img_executive_class.png",
      buttonText: "Pesan Sekarang",
    },
    {
      title: "Paket Bundel",
      description: "Paket perjalanan lengkap dengan akomodasi dan transportasi",
      image: "/img_bundle_package.png",
      buttonText: "Pelajari Lebih Lanjut",
    },
  ];

  return (
    <section
      style={{
        padding: "80px 24px",
        background: "linear-gradient(180deg, hsla(258, 50%, 52%, 1) 0%, hsla(217, 91%, 60%, 1) 60%, hsla(0, 0%, 100%, 1) 100%)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: colors.base.light,
            marginBottom: "16px",
          }}
        >
          Promo Spesial
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
            margin: "0 auto",
          }}
        >
          {promotions.map((promo, index) => (
            <PromotionCard key={index} title={promo.title} description={promo.description} image={promo.image} buttonText={promo.buttonText} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
