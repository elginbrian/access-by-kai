'use client';

import React from 'react';

interface FilterSectionProps {
  title: string;
  icon: string;
  iconBgColor: string;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, icon, iconBgColor, children }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <img src={icon} alt={title} className={`w-8 h-8 p-1 ${iconBgColor} rounded`} />
        <h3 className="font-bold text-black">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

export default FilterSection;