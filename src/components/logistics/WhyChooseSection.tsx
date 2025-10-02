'use client';

import React from 'react';

interface FeatureCard {
    icon: string;
    title: string;
    description: string;
}

interface WhyChooseSectionProps {
    title?: string;
    subtitle?: string;
    features?: FeatureCard[];
}

const WhyChooseSection: React.FC<WhyChooseSectionProps> = ({
    title = "Kenapa Memilih KAI Logistik?",
    subtitle = "Ada beberapa alasan kenapa KAI Logistik menjadi pilihan utama\nuntuk kebutuhan pengiriman Anda.",
    features = [
        {
            icon: "/ic_big_range.svg",
            title: "Jangkauan Luas",
            description: "Didukung oleh jaringan kereta api nasional yang menjangkau berbagai kota di seluruh Indonesia."
        },
        {
            icon: "/ic_price.svg",
            title: "Harga Terjangkau & Transparan",
            description: "Simulasi ongkir instan, tanpa biaya tersembunyi."
        },
        {
            icon: "/ic_safe.svg",
            title: "Aman & Tepat Waktu",
            description: "Barang dijamin aman dengan apar asuransi dan tracking real-time."
        }
    ]
}) => {
    return (
        <div className="bg-gradient-to-br from-[#5c2ca4] to-[#dd577a] py-16">
            <div className="container mx-auto px-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
                <p className="text-white/90 text-lg mb-12">
                    {subtitle.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < subtitle.split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>

                <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-xl">
                            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <img src={feature.icon} alt={feature.title} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhyChooseSection;