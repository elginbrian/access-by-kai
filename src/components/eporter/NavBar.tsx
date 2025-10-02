'use client';

import React from 'react';

const NavBarEPorter: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-white">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <img src="/ic_train.svg" alt="Train" />
                </div>
                <span className="text-xl font-semibold text-gray-800">KAI e-Porter</span>
            </div>

            <div className="flex gap-8">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Booking</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Promo</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">JD</span>
                </div>
                <span className="text-gray-700 font-medium">John Doe</span>
            </div>
        </nav>
    );
};

export default NavBarEPorter;