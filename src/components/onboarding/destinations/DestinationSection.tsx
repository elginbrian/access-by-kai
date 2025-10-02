'use client';

import React from 'react';
import { colors } from '../../../app/design-system';

interface DestinationCardProps {
  city: string;
  image: string;
  description: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ city, image, description }) => {
  return (
    <div style={{
      background: colors.base.light,
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(44, 44, 84, 0.12)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      minWidth: '280px',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(44, 44, 84, 0.16)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(44, 44, 84, 0.12)';
      }}>
      <div style={{
        height: '200px',
        background: `url(${image}) center/cover`,
        position: 'relative',
        margin: '10px',
        borderRadius: '20px',
      }}>
      </div>
      <div style={{ padding: '20px' }}>
        <h3 style={{
          color: 'black',
          fontSize: '24px',
          fontWeight: 700,
          margin: 0,
        }}>
          {city}
        </h3>
        <p style={{
          color: 'black',
          fontSize: '14px',
          lineHeight: 1.5,
          margin: 0,
        }}>
          {description}
        </p>
        <button style={{
          background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`,
          color: colors.base.light,
          borderRadius: '6px',
          padding: '8px 16px',
          fontWeight: 600,
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`;
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`;
            e.currentTarget.style.boxShadow = '0 0 0 0';
          }}>
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

const DestinationSection: React.FC = () => {
  const destinations = [
    {
      city: 'Jakarta',
      image: '/dummy_images.png',
      description: 'Explore the bustling capital city with modern attractions and rich culture'
    },
    {
      city: 'Bandung',
      image: '/dummy_images.png',
      description: 'Discover the Paris of Java with cool weather and creative atmosphere'
    },
    {
      city: 'Yogyakarta',
      image: '/dummy_images.png',
      description: 'Experience the cultural heart of Java with historic temples and palaces'
    },
    {
      city: 'Surabaya',
      image: '/dummy_images.png',
      description: 'Visit the heroes city with industrial heritage and culinary delights'
    }
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center mb-12 gap-10">
          <div className="flex flex-row items-center gap-8 flex-1">
            <img src="/img_explore_place.png" alt="Train Icon" />
            <div>
              <h2 className="text-3xl font-bold text-black mb-4">Eksplor Tempat<br />Dengan KAI</h2>
              <p className="text-lg text-black leading-relaxed">
                Jelajahi keindahan Indonesia dengan layanan kereta api yang nyaman. Temukan destinasi menarik dan nikmati perjalanan yang tak terlupakan.
              </p>
            </div>
          </div>
          <div className="w-[200px] h-[200px] bg-[url('/img_mascot.png')] bg-center bg-contain bg-no-repeat flex-shrink-0" />
        </div>

        <div className="relative" style={{ overflowX: 'visible' }}>
          <div className="overflow-x-auto pb-10 px-8 -mx-8 flex gap-6" style={{ scrollbarWidth: 'none' }}>
            {destinations.map((destination, index) => (
              <div className="snap-center min-w-[300px]" key={index}>
                <DestinationCard
                  city={destination.city}
                  image={destination.image}
                  description={destination.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationSection;