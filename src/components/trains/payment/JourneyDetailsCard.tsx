"use client";

import React from "react";
import Icon from "@/components/ui/Icon";

interface JourneyDetailsCardProps {
  trainName: string;
  trainCode: string;
  passengerCount: number;
  passengerType: string;
  departureStation: string;
  arrivalStation: string;
  departureCode: string;
  arrivalCode: string;
  className: string;
  date: string;
  timeRange: string;
}

const JourneyDetailsCard: React.FC<JourneyDetailsCardProps> = ({ trainName, trainCode, passengerCount, passengerType, departureStation, arrivalStation, departureCode, arrivalCode, className, date, timeRange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Icon name="train" className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-black">Detail Perjalanan</h2>
      </div>

      {/* Train Card */}
      <div className="bg-indigo-50 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="train" className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black">{trainName}</h3>
              <p className="text-black text-sm">{trainCode}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-black">{passengerCount} Penumpang</div>
            <div className="text-sm text-black">{passengerType}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-black">
            <span className="font-semibold">
              {departureStation} ({departureCode})
            </span>
            <Icon name="arrowRight" className="w-4 h-4" />
            <span className="font-semibold">
              {arrivalStation} ({arrivalCode})
            </span>
          </div>
          <div className="text-sm text-black">{className}</div>
          <div className="text-sm text-black">
            {date} • {timeRange}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyDetailsCard;
