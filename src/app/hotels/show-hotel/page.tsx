"use client";

import React from "react";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";
import SearchSummary from "@/components/trains/trainSummary/SearchSummary";
import PromoBanner from "@/components/trains/promotions/PromoBanner";
import FloatingChat from "@/components/trains/floatButton/FloatingChat";
import ChatSidebar from "@/components/trains/chat/ChatSidebar";
import PassengerSelectionCard from "@/components/hotels/show-hotel/PassengerSelectionCard";
import HotelCard from "@/components/hotels/show-hotel/HotelCard";
import { colors } from "@/app/design-system";

interface Passenger {
  id: string;
  name: string;
  type: 'Adult' | 'Child' | 'Toddler' | string;
  isSelected: boolean;
}

const HotelsShowHotelPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [priceValue, setPriceValue] = React.useState(800000);
  const [passengers, setPassengers] = React.useState<Passenger[]>([
    { id: '1', name: 'John Doe', type: 'Adult', isSelected: false },
    { id: '2', name: 'Jane Doe', type: 'Toddler', isSelected: false },
    { id: '3', name: 'Emma Doe', type: 'Child', isSelected: false }
  ]);

  const handleChatClick = () => setIsChatOpen(true);
  const handleCloseChatSidebar = () => setIsChatOpen(false);

  const handlePassengerToggle = (id: string) => {
    setPassengers(prev =>
      prev.map(p => p.id === id ? { ...p, isSelected: !p.isSelected } : p)
    );
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: colors.violet.light }}>
      <div className="sticky top-0 z-30 bg-white">
        <TrainNavigation onNavClick={() => { }} />
        <SearchSummary
          departure="Bekasi"
          arrival="Bandung"
          date="15 Dec 2024"
          passengers="2 Adults"
          onEditSchedule={() => { }}
          onSwitchStations={() => { }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        <PromoBanner
          title="Special Weekend Discount!"
          description="Get up to 30% off on Executive class tickets"
          buttonText="View Offers"
          onViewOffers={() => { }}
        />

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-black">Tersedia</h2>
            <span className="text-sm text-gray-500 rounded-lg bg-gray-100 px-3 py-1.5">Semua</span>
            <span className="text-sm text-gray-500 rounded-lg bg-gray-100 px-3 py-1.5">Luxury Lounge</span>
            <span className="bg-gradient-to-r from-[#6b46c1] to-[#3b82f6] text-white px-4 py-1.5 rounded-full text-sm font-medium">Shower and Locker</span>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Filter:
            <select className="ml-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Departure Time</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left filters column */}
          <aside className="w-full lg:w-80 lg:flex-shrink-0 space-y-4">

            <PassengerSelectionCard
              passengers={passengers}
              onPassengerToggle={handlePassengerToggle}
              maxPorters={3}
            />
          </aside>

          {/* Results list */}
          <main className="flex-1 space-y-6">
            <div className="space-y-4">

              <HotelCard
                title="Shower and Locker Yogyakarta"
                subtitle="300m from Yogyakarta Station"
                price="Rp 80,000"
                rating="8.8"
                tags={['Tersedia', 'CAMPURAN']}
              />
              <HotelCard
                title="Shower and Locker Yogyakarta"
                subtitle="300m from Yogyakarta Station"
                price="Rp 80,000"
                rating="8.8"
                tags={['Tersedia', 'CAMPURAN']}
              />
              <HotelCard
                title="Shower and Locker Yogyakarta"
                subtitle="300m from Yogyakarta Station"
                price="Rp 80,000"
                rating="8.8"
                tags={['Tersedia', 'CAMPURAN']}
              />
            </div>
          </main>
        </div>
      </div>

      <FloatingChat notificationCount={3} onClick={handleChatClick} isHidden={isChatOpen} />
      <ChatSidebar isOpen={isChatOpen} onClose={handleCloseChatSidebar} />
    </div>
  );
};

export default HotelsShowHotelPage;