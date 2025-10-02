"use client";

import React from 'react';
import { colors } from '@/app/design-system/colors';

export interface PassengerData {
    id: string;
    name: string;
    gender: 'Dewasa' | 'Anak' | 'Balita';
    idType: 'KTP' | 'Passport' | 'Akta Lahir';
    idNumber: string;
    birthDate: string;
    isMain?: boolean;
}

interface PassengerCardProps {
    passenger: PassengerData;
    onEdit: (passenger: PassengerData) => void;
    onDelete: (passengerId: string) => void;
}

const PassengerCard: React.FC<PassengerCardProps> = ({ passenger, onEdit, onDelete }) => {
    const getGenderIcon = (gender: string) => {
        if (gender === 'Anak') {
            return (
                <div className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 bg-orange-100">
                    <img src="/ic_child_orange.svg" alt="Image" />
                </div>
            );
        }
        if (gender === 'Balita') {
            return (
                <div className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 bg-purple-100">
                    <img src="/ic_baby_purple.svg" alt="Image" />
                </div>
            );
        }

        return (
            <div className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 bg-blue-100">
                <img src="/ic_person_blue.svg" alt="Image" />
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {getGenderIcon(passenger.gender)}

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                            <h3 className="text-lg font-semibold truncate" style={{ color: colors.base.darker }}>
                                {passenger.name}
                            </h3>
                            {passenger.isMain && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium self-start bg-[#dcfce7] text-[#166534]">
                                    Utama
                                </span>
                            )}
                        </div>

                        <div className="text-sm space-y-1" style={{ color: colors.base.darkActive }}>
                            <div className="break-words">{passenger.gender} • {passenger.idType}: {passenger.idNumber}</div>
                            <div>Lahir: {passenger.birthDate}</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => onEdit(passenger)}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-110"
                        style={{ color: colors.base.darkActive }}
                        title="Edit penumpang"
                    >
                        <img src="/ic_pencil_edit.svg" alt="" />
                    </button>

                    {!passenger.isMain && (
                        <button
                            onClick={() => onDelete(passenger.id)}
                            className="w-10 h-10 rounded-lg border border-red-200 flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                            style={{ color: colors.red.normal }}
                            title="Hapus penumpang"
                        >
                            <img src="/ic_delete.svg" alt="" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PassengerCard;