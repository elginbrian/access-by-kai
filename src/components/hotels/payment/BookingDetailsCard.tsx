"use client";

import React from "react";

export interface BookingDetail {
  id: string;
  title: string;
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

export interface BookingDetailsCardProps {
  title: string;
  titleIcon?: string;
  booking: BookingDetail;
}

const BookingDetailsCard: React.FC<BookingDetailsCardProps> = ({
  title,
  titleIcon = "/ic_train_blue.svg",
  booking
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <img src={titleIcon} alt="Icon" />
        <h2 className="text-lg font-semibold text-black">{title}</h2>
      </div>

      <div className={`${booking.bgColor} rounded-lg p-4 border ${booking.borderColor}`}>
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 ${booking.iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <img src={booking.icon} alt={booking.title} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 text-black">{booking.title}</h3>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-black">{booking.route}</p>
                <p className="text-sm text-gray-600 text-black">{booking.class}</p>
                <p className="text-sm text-gray-600 text-black">{booking.date} • {booking.time}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-black">{booking.passengers} Penumpang</p>
                <p className="text-sm text-gray-600 text-black">{booking.passengerType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsCard;