'use client';

import React from 'react';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );

  const XIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <div
      className="w-full flex justify-center items-center min-h-[4rem]"
      style={{
        paddingTop: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        position: 'fixed',
        zIndex: 100
      }}
    >
      <nav
      className="w-full max-w-[95rem] backdrop-blur-lg flex justify-center"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '160px',
      }}
      >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/ic_train.svg" alt="Train" />
          <span className="text-xl font-bold text-white">KAI Booking</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-white hover:text-white/70 transition-colors font-medium text-sm">
          Home
          </a>
          <a href="#" className="text-white hover:text-white/70 transition-colors font-medium text-sm">
          Tickets
          </a>
          <a href="#" className="text-white hover:text-white/70 transition-colors font-medium text-sm">
          Routes
          </a>
          <a href="#" className="text-white hover:text-white/70 transition-colors font-medium text-sm">
          About
          </a>
          <a href="#" className="text-white hover:text-white/70 transition-colors font-medium text-sm">
          Contact
          </a>
        </div>

        {/* Right side - Bell and Avatar */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Bell Icon */}
          <button className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <img src="/ic_bell.svg" alt="Notifications" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Circle Avatar */}
          <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          alt="Profile"
          className="w-9 h-9 rounded-full border-2 border-white/30 cursor-pointer hover:border-white/50 transition-colors"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md text-white hover:bg-white/10"
        >
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
        className="md:hidden backdrop-blur-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="#" className="block px-3 py-2 rounded-md text-white hover:bg-white/10">
          Home
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-white hover:bg-white/10">
          Tickets
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-white hover:bg-white/10">
          Routes
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-white hover:bg-white/10">
          About
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-white hover:bg-white/10">
          Contact
          </a>
          <div className="flex items-center space-x-4 px-3 py-2">
          <button className="relative p-2 text-white hover:bg-white/10 rounded-full">
        <img src="/ic_bell.svg" alt="Notifications" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <img
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        alt="Profile"
        className="w-9 h-9 rounded-full border-2 border-white/30"
          />
          </div>
        </div>
        </div>
      )}
      </nav>
    </div>
  );
};

export default NavBar;