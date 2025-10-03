"use client";

import React, { useState } from "react";
import PassengerSelection from "./PassengerSelection";
import PickupDetails from "./PickupDetails";

interface Passenger {
  id: string;
  name: string;
  type: "Adult" | "Child";
  isSelected: boolean;
}

interface PorterBookingFormProps {
  ticketId: string;
  onBack: () => void;
  onSubmit: (data: any) => void;
}

const PorterBookingForm: React.FC<PorterBookingFormProps> = ({ ticketId, onBack, onSubmit }) => {
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: "1", name: "John Doe", type: "Adult", isSelected: false },
    { id: "2", name: "Jane Doe", type: "Adult", isSelected: false },
    { id: "3", name: "Emma Doe", type: "Child", isSelected: false },
  ]);

  const [meetingPoint, setMeetingPoint] = useState("");
  const [notes, setNotes] = useState("");

  const handlePassengerToggle = (passengerId: string) => {
    setPassengers((prev) => prev.map((p) => (p.id === passengerId ? { ...p, isSelected: !p.isSelected } : p)));
  };

  const handleSubmit = () => {
    const selectedPassengers = passengers.filter((p) => p.isSelected);

    if (selectedPassengers.length === 0) {
      alert("Silakan pilih setidaknya satu penumpang");
      return;
    }

    if (!meetingPoint) {
      alert("Silakan pilih titik pertemuan");
      return;
    }

    const formData = {
      ticketId,
      passengers: selectedPassengers,
      meetingPoint,
      notes,
    };

    onSubmit(formData);
  };

  const selectedCount = passengers.filter((p) => p.isSelected).length;
  const canSubmit = selectedCount > 0 && meetingPoint;

  return (
    <div className="space-y-6">
      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PassengerSelection passengers={passengers} onPassengerToggle={handlePassengerToggle} maxPorters={3} />

        <PickupDetails onMeetingPointChange={setMeetingPoint} onNotesChange={setNotes} meetingPoint={meetingPoint} notes={notes} />
      </div>

      <div className="flex flex-row w-full gap-4">
        {/* Back Button */}
        <div className="flex-1">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors w-full px-8 py-2.5 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 justify-center transform hover:scale-101"
          >
            Kembali
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex-1">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-8 py-3 rounded-lg font-semibold transition-all w-full flex items-center justify-center gap-2 ${
              canSubmit ? "bg-gradient-to-b from-[#6b46c1] to-[#3b82f6] text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-101" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Pesan Porter
            <img src="/ic_arrow_right.svg" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PorterBookingForm;
