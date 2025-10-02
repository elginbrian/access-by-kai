'use client';

import React from 'react';
import { colors } from '../../../app/design-system';

interface ServiceCardProps {
    icon: string;
    title: string;
    description: string;
    index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, index }) => {
    return (
        <div className="bg-white rounded-3xl px-6 py-8 text-center shadow-lg transition-all duration-300 cursor-pointer min-h-[200px] flex flex-col items-center justify-center hover:-translate-y-2 hover:shadow-2xl">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{
                    background: index % 2 === 0
                        ? 'linear-gradient(135deg, #a855f7 0%, #6b46c1 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
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
            icon: '/ic_ticket_booking.svg',
            title: 'Antar Kota',
            description: 'Book your train tickets easily'
        },
        {
            icon: '/ic_e_porter.svg',
            title: 'E-porter',
            description: 'Book luggage porter online'
        },
        {
            icon: '/ic_kai_logistics.svg',
            title: 'KAI Logistics',
            description: 'Send packages nationwide'
        },
        {
            icon: '/ic_hotels.svg',
            title: 'Hotel & Shower',
            description: 'Rest comfortably at station'
        },
        {
            icon: '/ic_meal.svg',
            title: 'On-Board Meal',
            description: 'Pre-order food & drinks'
        },
        {
            icon: '/ic_train.svg',
            title: 'Local Train',
            description: 'Local train tickets for daily commute'
        },
        {
            icon: '/ic_train.svg',
            title: 'Commuter Line',
            description: 'Commuter line tickets for daily travel'
        },
        {
            icon: '/ic_train.svg',
            title: 'LRT',
            description: 'Light rail transit tickets'
        },
        {
            icon: '/ic_train.svg',
            title: 'Bandara',
            description: 'Airport train tickets'
        },
        {
            icon: '/ic_train.svg',
            title: 'Whoosh',
            description: 'High-speed train tickets'
        },
    ];

    return (
        <section className="max-w-[100rem] mx-auto flex flex-col items-center py-20 pt-40 px-6 relative">
            <div className="w-full">
            <h2 className="text-3xl font-bold text-black mb-4 text-center">KAI Services</h2>
            <p className="text-lg text-black mb-12 max-w-xl mx-auto text-center">
                Complete travel solutions for your convenience
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mx-auto">
                {services.map((service, index) => (
                <ServiceCard
                    key={index}
                    index={index}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                />
                ))}
            </div>
            </div>
        </section>
    );
};

export default ServicesSection;