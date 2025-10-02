'use client';

import React from 'react';

const HelpSection: React.FC = () => {
  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(0deg, #a21caf 0%, #7c3aed 100%)"
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Overlay */}
        <div className="absolute inset-0 opacity-50 bg-gray-400/50 z-10 pointer-events-none" />
        <div className="flex items-center gap-15 relative z-20">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="w-15 h-15 rounded-full flex items-center justify-center mb-4 shadow-lg"
              style={{
              background: "linear-gradient(0deg, #a21caf 0%, #7c3aed 100%)"
              }}
            >
              <img src="/ic_robot.svg" alt="KAI App" className="w-8 h-8 filter brightness-0 invert" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-5 leading-tight text-center">
              Need Help?
            </h2>
            <p className="text-lg text-white mb-8 leading-relaxed opacity-90 max-w-lg text-center">
              Ask our AI Assistant anytime for instant support and travel recommendations.
            </p>

            <div className="flex gap-4 mb-8 flex-wrap justify-center">
              <button className="bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-xl px-8 py-4 font-semibold text-base cursor-pointer transition-all duration-300 backdrop-blur-sm flex items-center gap-2 hover:shadow-[0_0_0_4px_rgba(255,255,255,0.5)]">
                Chat Now
              </button>
            </div>
          </div>

          <div className="w-75 h-96 bg-cover bg-center bg-no-repeat flex-shrink-0 relative" style={{ backgroundImage: "url('/img_phone_mockup.png')" }}>
            {/* Phone mockup with app interface */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-50 h-80 bg-white rounded-3xl shadow-2xl p-5 flex flex-col items-center justify-center">
              <div className="w-15 h-15 rounded-2xl flex items-center justify-center mb-4" style={{
                background: "linear-gradient(0deg, #a21caf 0%, #7c3aed 100%)"
              }}>
                <img src="/ic_train.svg" alt="KAI App" className="w-8 h-8 filter brightness-0 invert" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute -top-12 -right-12 w-50 h-50 bg-white/5 rounded-full z-10" />
      <div className="absolute -bottom-24 -left-24 w-75 h-75 bg-white/3 rounded-full z-10" />
    </section>
  );
};

export default HelpSection;