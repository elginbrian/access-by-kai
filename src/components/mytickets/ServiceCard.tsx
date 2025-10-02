"use client";

import React from 'react';

type Props = {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  onClick?: () => void;
};

const ServiceCard: React.FC<Props> = ({ icon, title, description, linkText, onClick }) => {
  return (
    <div onClick={onClick} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          <img src={icon} alt={title} className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">{linkText}</button>
    </div>
  );
};

export default ServiceCard;
