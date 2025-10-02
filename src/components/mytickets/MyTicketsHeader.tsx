"use client";

import React from 'react';

type Props = {
  userName?: string;
};

const MyTicketsHeader: React.FC<Props> = ({ userName = 'Ahmad Rizki' }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.36 9 10.93 5.16-1.57 9-5.38 9-10.93V7l-10-5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">RailTravel</span>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">Beranda</button>
            <button className="text-blue-600 font-medium">Tiket Saya</button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">Riwayat</button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">AR</span>
              </div>
              <span className="text-gray-700 font-medium">{userName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MyTicketsHeader;
