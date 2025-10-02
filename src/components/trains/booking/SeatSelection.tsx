'use client';

import React, { useState, useCallback } from 'react';
import TrainInfoHeader from '@/components/trains/seat-selection/TrainInfoHeader';
import SeatStatusLegend from '@/components/trains/seat-selection/SeatStatusLegend';
import CarSelector from '@/components/trains/seat-selection/CarSelector';
import SeatMap, { Seat, SeatStatus } from '@/components/trains/seat-selection/SeatMap';
import PassengerList, { Passenger } from '@/components/trains/seat-selection/PassengerList';
import AISeatAssistant from '@/components/trains/seat-selection/AISeatAssistant';
import SeatSelectionBottomBar from '@/components/trains/seat-selection/SeatSelectionBottomBar';

interface SeatSelectionProps {
    onClose: () => void;
    onSeatSelect: (seats: string[]) => void;
    selectedSeats: string[];
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
    onClose,
    onSeatSelect,
    selectedSeats
}) => {
    const [currentCar, setCurrentCar] = useState(1);
    const [passengers, setPassengers] = useState<Passenger[]>([
        {
            id: '1',
            name: 'John Doe',
            seat: '2B',
            isAdult: true,
            type: 'adult'
        },
        {
            id: '2',
            name: 'Jane Doe',
            seat: '2C',
            isAdult: true,
            type: 'adult'
        }
    ]);

    // Generate seat layout for the current car
    const generateSeats = useCallback((): Seat[] => {
        const seats: Seat[] = [];
        const occupiedSeats = [
            '1A', '1B', '1C', '2A', '3A', '3B', '3C', '4A', '4B', '4C',
            '5A', '5B', '5C', '6A', '6B', '6C', '7A', '7B', '7C', '8A',
            '8B', '8C', '10A', '10B', '10C', '11A', '11B', '11C', '12A',
            '12B', '12C', '13A', '13B', '13C', '14A', '14B', '14C',
            '15A', '15B', '15C', '16A', '16B', '16C'
        ];

        // Add some occupied-lp (priority) seats for demo
        const occupiedLpSeats = ['2D', '5D', '8D', '11D', '14D'];

        for (let row = 1; row <= 16; row++) {
            ['A', 'B', 'C', 'D'].forEach(letter => {
                const seatId = `${row}${letter}`;
                let status: SeatStatus = 'available';

                if (selectedSeats.includes(seatId)) {
                    status = 'selected';
                } else if (occupiedLpSeats.includes(seatId)) {
                    status = 'occupied-lp';
                } else if (occupiedSeats.includes(seatId)) {
                    status = 'occupied';
                } else if (seatId === '9D') {
                    status = 'child';
                }

                seats.push({
                    id: seatId,
                    row,
                    letter,
                    status
                });
            });
        }

        return seats;
    }, [selectedSeats]);

    const seats = generateSeats();

    const handleSeatClick = useCallback((seatId: string, status: SeatStatus) => {
        if (status === 'occupied' || status === 'occupied-lp') return;

        let newSelectedSeats = [...selectedSeats];
        if (newSelectedSeats.includes(seatId)) {
            newSelectedSeats = newSelectedSeats.filter(id => id !== seatId);
        } else {
            newSelectedSeats.push(seatId);
        }
        onSeatSelect(newSelectedSeats);
    }, [selectedSeats, onSeatSelect]);

    const handleCarChange = useCallback((carNumber: number) => {
        setCurrentCar(carNumber);
    }, []);

    const handlePassengerChange = useCallback((passengerId: string) => {
        // Handle passenger change logic here
        console.log('Change passenger:', passengerId);
    }, []);

    const handleUseAISuggestion = useCallback(() => {
        // Apply AI suggestion logic here
        const suggestedSeats = ['3A', '3C'];
        onSeatSelect(suggestedSeats);
    }, [onSeatSelect]);

    const handleContinueBooking = useCallback(() => {
        // Handle continue booking logic here
        onClose();
    }, [onClose]);

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-8 pb-24">
            {/* Train Header */}
            <TrainInfoHeader
                trainNumber="67"
                trainName="Argo Parahyangan"
                trainCode="KA 21"
                departureTime="13:45"
                departureStation="Bekasi (BKS)"
                arrivalTime="17:00"
                arrivalStation="Bandung (BD)"
                duration="3h 15m"
                totalPrice="Rp. 170.000"
                onClose={onClose}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side - Seat Selection */}
                <div className="lg:col-span-8">
                    <SeatStatusLegend />
                    <CarSelector
                        currentCar={currentCar}
                        onCarChange={handleCarChange}
                        totalCars={8}
                    />
                    <div className="flex flex-row">
                        <SeatMap
                            seats={seats}
                            currentCar={currentCar}
                            onSeatClick={handleSeatClick}
                        />
                        <PassengerList
                            passengers={passengers}
                            onPassengerChange={handlePassengerChange}
                        />
                    </div>
                </div>

                {/* Right Side - Passenger Info & AI Assistant */}
                <div className="lg:col-span-4 space-y-6">
                    <AISeatAssistant
                        onSuggestionApply={handleUseAISuggestion}
                    />
                </div>
            </div>

            {/* Bottom Action Bar */}
            <SeatSelectionBottomBar
                selectedSeatsCount={selectedSeats.length}
                totalPrice="Rp 170,000"
                onUseAISuggestion={handleUseAISuggestion}
                onContinueBooking={handleContinueBooking}
            />
        </div>
    );
};

export default SeatSelection;