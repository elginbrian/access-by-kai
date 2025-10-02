'use client';

import React from 'react';

interface TrainNavigationProps {
  userName?: string;
  userAvatar?: string;
  onNavClick?: (section: string) => void;
}

const TrainNavigation: React.FC<TrainNavigationProps> = ({
  userName = 'Sari',
  userAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sari',
  onNavClick
}) => {
  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#6b46c1] to-[#3b82f6]">
              <img src="/ic_train.svg" alt="Train" />
            </div>
            <span className="text-xl font-bold text-black">KAI</span>
          </div>
          <div className="flex space-x-8">
            <a 
              href="#" 
              onClick={() => onNavClick?.('home')}
              className="text-purple-600 font-medium hover:opacity-80 transition-opacity"
            >
              Home
            </a>
            <a 
              href="#" 
              onClick={() => onNavClick?.('booking')}
              className="text-black hover:text-purple-600 transition-colors"
            >
              Booking
            </a>
            <a 
              href="#" 
              onClick={() => onNavClick?.('promo')}
              className="text-black hover:text-purple-600 transition-colors"
            >
              Promo
            </a>
            <a 
              href="#" 
              onClick={() => onNavClick?.('contact')}
              className="text-black hover:text-purple-600 transition-colors"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <img src={userAvatar} alt="Profile" className="w-8 h-8 rounded-full" />
            <span className="text-sm text-black">{userName}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TrainNavigation;