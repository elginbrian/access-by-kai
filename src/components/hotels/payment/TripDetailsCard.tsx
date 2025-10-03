"use client";

import React from "react";

export interface TripDetail {
  id: string;
  title: string;
  trainCode: string;
  icon: string;
  route: string;
  class: string;
  date: string;
  time: string;
  passengers: number;
  passengerType: string;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
}

export interface TripDetailsCardProps {
  title: string;
  titleIcon?: string;
  trip: TripDetail;
}

const TripDetailsCard: React.FC<TripDetailsCardProps> = ({
  title,
  titleIcon = "/ic_train_blue.svg",
  trip
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <img src={titleIcon} alt="Icon" />
        <h2 className="text-lg font-semibold text-black">{title}</h2>
      </div>

      <div className={`${trip.bgColor} rounded-lg p-4 border ${trip.borderColor}`}>
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 ${trip.iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <img src={trip.icon} alt={trip.title} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-black">{trip.title}</h3>
            <p className="text-sm text-black mb-2">{trip.trainCode}</p>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-black">{trip.route}</p>
                <p className="text-sm text-black">{trip.class}</p>
                <p className="text-sm text-black">{trip.date} • {trip.time}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-black">{trip.passengers} Penumpang</p>
                <p className="text-sm text-black">{trip.passengerType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsCard;