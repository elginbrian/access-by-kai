'use client';

import React from 'react';
import BookingProgress from '@/components/trains/booking/BookingProgress';
import { colors } from '@/app/design-system/colors';
import InputField from '@/components/input/InputField';
import TrainNavigation from '@/components/trains/navbar/TrainNavigation';
import SeatSelection from '@/components/trains/booking/SeatSelection';

export default function TrainBooking() {
    const [currentStep, setCurrentStep] = React.useState(1);
    const [isRouteExpanded, setIsRouteExpanded] = React.useState(false);
    const [showSeatSelection, setShowSeatSelection] = React.useState(false);
    const [selectedSeats, setSelectedSeats] = React.useState<string[]>([]);

    const bookingSteps = [
        {
            id: 'pemesanan',
            title: 'Pemesanan'
        },
        {
            id: 'makanan',
            title: 'Pemesanan Makanan'
        },
        {
            id: 'review',
            title: 'Review'
        },
        {
            id: 'bayar',
            title: 'Bayar'
        },
    ];

    const handleStepClick = (step: number) => {
        // Only allow going back to previous steps
        if (step <= currentStep) {
            setCurrentStep(step);
        }
    };

    const handleSeatSelect = (seats: string[]) => {
        setSelectedSeats(seats);
    };

    const handleCloseSeatSelection = () => {
        setShowSeatSelection(false);
    };

    const handleOpenSeatSelection = () => {
        setShowSeatSelection(true);
    };

    const allStations = [
        { name: 'Bandung (BD)', time: '05:00', active: true },
        { name: 'Cimahi', time: '05:20', active: false },
        { name: 'Purwakarta', time: '06:15', active: false },
        { name: 'Bekasi', time: '07:30', active: false },
        { name: 'Jatinegara', time: '07:45', active: false },
        { name: 'Gambir (GMR)', time: '08:00', active: true }
    ];

    const displayedStations = isRouteExpanded ? allStations : [allStations[0], allStations[allStations.length - 1]];
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="sticky top-0 z-30 bg-gray-50">
                {/* Header */}
                <TrainNavigation />

                {/* Progress Steps */}
                <BookingProgress
                    steps={bookingSteps}
                    currentStep={currentStep}
                    onStepClick={handleStepClick}
                />
            </div>

            {/* Main Content */}
            {!showSeatSelection ? (
                <div className="max-w-[1400px] mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Train Summary */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h2 className="text-sm font-semibold text-gray-900 mb-5">Train Summary</h2>
                                <div className="flex items-start gap-3 mb-6">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: colors.violet.normal }}
                                    >
                                        <img src="/ic_train.svg" alt="Train" className="w-6 h-6 filter brightness-0 invert" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-base">Argo Parahyangan</h3>
                                        <p className="text-sm text-gray-500">KA 21</p>
                                    </div>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
                                        Eksekutif
                                    </span>
                                </div>

                                <div className="flex items-center mb-2">
                                    {/* Bandung */}
                                    <div className="flex-1 text-left">
                                        <div className="text-xl font-bold text-gray-900">05:00</div>
                                        <div className="text-xs text-gray-500">Bandung (BD)</div>
                                    </div>
                                    {/* Line from Bandung to Train Image */}
                                    <div className="w-12 h-0.5 bg-gray-200 mx-2" />
                                    {/* Train Image */}
                                    <div className="flex flex-col items-center px-2">
                                        <img src="/ic_train_gradient.svg" alt="Train" />
                                    </div>
                                    {/* Line from Train Image to Gambir */}
                                    <div className="w-12 h-0.5 bg-gray-200 mx-2" />
                                    {/* Gambir */}
                                    <div className="flex-1 text-right">
                                        <div className="text-xl font-bold text-gray-900">08:00</div>
                                        <div className="text-xs text-gray-500">Gambir (GMR)</div>
                                    </div>
                                </div>

                                <p className="text-center text-xs text-gray-500 mb-4">Duration: 3h 00m</p>

                                <button
                                    onClick={() => setIsRouteExpanded(!isRouteExpanded)}
                                    className="text-indigo-600 text-xs font-medium flex items-center gap-1 hover:text-indigo-700 transition-colors"
                                >
                                    {isRouteExpanded ? 'Lihat Lebih Sedikit' : 'Lihat Rute Lengkap'}
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${isRouteExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isRouteExpanded && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3 mt-3 text-sm">Rute</h3>
                                        <div className="space-y-3 transition-all duration-300">
                                            {displayedStations.map((station, idx) => (
                                                <div key={idx} className="flex items-center gap-2.5">
                                                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${station.active ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-sm ${station.active ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                                            {station.name}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">{station.time}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* About This Train */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h2 className="text-sm font-semibold text-gray-900 mb-4">About This Train</h2>
                                <div className="relative rounded-xl overflow-hidden mb-3">
                                    <img
                                        src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=180&fit=crop"
                                        alt="Train interior"
                                        className="w-full h-40 object-cover"
                                    />
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Kereta Parahyangan adalah layanan Ekonomi AC dengan fasilitas nyaman untuk...
                                </p>
                            </div>

                            {/* Facilities */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h2 className="text-sm font-semibold text-gray-900 mb-4">Facilities</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <img src="/ic_ac_blue.svg" alt="Air Conditioning" />
                                            <span>Air Conditioning</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <img src="/ic_toilet_blue.svg" alt="Toilet" />
                                            <span>Toilet</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <img src="/ic_charging_ports.svg" alt="Charging Ports" />
                                            <span>Charging Ports</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <img src="/ic_luggage_blue.svg" alt="Free Baggage" />
                                            <span>Free Baggage</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <img src="/ic_meal_blue.svg" alt="Kereta Makan" />
                                        <span>Kereta Makan</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Data Pemesan */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Data Pemesan</h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <InputField
                                            label="Full Name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="w-full px-1 py-1 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                                            style={{
                                                '--tw-ring-color': colors.violet.normal,
                                            } as React.CSSProperties}
                                        />
                                        <p className="text-xs text-gray-400 mt-1.5">No special characters allowed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <div className="flex gap-2">
                                            <div className="relative">
                                                <select className="appearance-none text-black h-full pl-3 pr-8 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                                                    <option>🇮🇩</option>
                                                </select>
                                                <svg className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            <InputField
                                                label="Phone Number"
                                                type="number"
                                                placeholder="812-3456-7890"
                                                className="flex-1 px-1 py-1 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                                                style={{
                                                    '--tw-ring-color': colors.violet.normal,
                                                } as React.CSSProperties}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1.5">Include country code</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <InputField
                                            label="Email Address"
                                            type="email"
                                            placeholder="your.email@example.com"
                                            className="w-full px-1 py-1 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                                            style={{
                                                '--tw-ring-color': colors.violet.normal,
                                            } as React.CSSProperties}
                                        />
                                        <p className="text-xs text-gray-400 mt-1.5">We'll send confirmation to this email</p>
                                    </div>
                                </div>
                            </div>

                            {/* Data Penumpang */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Data Penumpang</h2>

                                <div className="grid grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <div className="relative">
                                            <select className="appearance-none text-black w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                                                <option>Mr.</option>
                                                <option>Mrs.</option>
                                                <option>Ms.</option>
                                            </select>
                                            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <InputField
                                            label="Full Name"
                                            type="text"
                                            placeholder="As per ID"
                                            className="w-full px-1 py-1 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                                            style={{
                                                '--tw-ring-color': colors.violet.normal,
                                            } as React.CSSProperties}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Type</label>
                                        <div className="relative">
                                            <select className="appearance-none text-black w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                                                <option>KTP</option>
                                                <option>Passport</option>
                                                <option>SIM</option>
                                            </select>
                                            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                                        <InputField
                                            label="ID Number"
                                            type="number"
                                            placeholder="Enter ID number"
                                            className="w-full px-1 py-1 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                                            style={{
                                                '--tw-ring-color': colors.violet.normal,
                                            } as React.CSSProperties}
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                    <span className="text-[#2563eb]">Save this information for future bookings</span>
                                </label>
                            </div>

                            {/* Tempat Duduk */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Tempat Duduk</h2>
                                </div>

                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Available Seats</div>
                                        <div className="text-xs text-gray-500 mb-1">Configuration</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-emerald-600">80 seats left</div>
                                        <div className="text-sm text-gray-900">2-2 Eksekutif</div>
                                    </div>
                                </div>

                                {/* Seat Selection with Navigation */}
                                <div className="bg-gray-100 rounded-lg p-4 mb-8 relative">
                                    <p className="text-sm font-medium text-gray-900">Pilih Kursi</p>
                                    <button 
                                        onClick={handleOpenSeatSelection}
                                        className="absolute top-0 right-0 w-full h-full flex items-center justify-end pr-4 rounded-lg transition-colors hover:bg-gray-200"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    <div className="flex items-center justify-center gap-2 pt-4">
                                        <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                                        <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                                        <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                                        <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Continue Button */}
                            <button
                                className="w-full py-4 text-white rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`
                                }}
                            >
                                Continue to Payment
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <SeatSelection
                    onClose={handleCloseSeatSelection}
                    onSeatSelect={handleSeatSelect}
                    selectedSeats={selectedSeats}
                />
            )}

            {/* Chat Button */}
            <button
                className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: colors.violet.normal }}
            >
                <img src="/ic_robot.svg" alt="Chat" className="w-8 h-8 filter brightness-0 invert" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                    2
                </span>
            </button>
        </div>
    );
}