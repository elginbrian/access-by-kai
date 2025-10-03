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

const ServCard: React.FC<ServiceCardProps> = ({ icon, title, description, index, clickable = false, onClick }) => {
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
            className={`text-center min-h-[200px] flex flex-col items-center justify-center`}
        >
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
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

const ServSection: React.FC = () => {

    const services = [
        {
            icon: "/ic_ticket_booking.svg",
            title: "Antar Kota",
            description: "Pesan tiket kereta dengan mudah",
            href: "/trains",
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
        <section className="max-w-[100rem] mx-auto flex flex-col items-center py-20 relative">
            <div className="w-full pt-4">
                <div
                    className="flex flex-row gap-6 overflow-x-auto pb-2"
                    style={{ scrollbarWidth: "none" }}
                >
                    {services.map((service: any, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-64"
                            style={{ scrollSnapAlign: "start" }}
                        >
                            <ServCard
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
        </section>
    );
};

export default ServSection;
