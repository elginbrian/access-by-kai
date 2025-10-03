"use client";

import React from 'react';
import DropDown from '@/components/DropDown';
import InputField from '@/components/input/InputField';
import { colors } from '@/app/design-system/colors';

interface ProfileFiltersProps {
    selectedStatus: string;
    onStatusChange: (value: string) => void;
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    dateRange: string;
    onDateRangeChange: (value: string) => void;
}

const ProfileFilters: React.FC<ProfileFiltersProps> = ({
    selectedStatus,
    onStatusChange,
    searchQuery,
    onSearchChange,
    dateRange,
    onDateRangeChange
}) => {
    const statusOptions = ["Semua Status", "Selesai", "Dibatalkan", "Akan Datang", "Dalam Perjalanan"];
    const dateRangeOptions = ["30 Hari Terakhir", "7 Hari Terakhir", "90 Hari Terakhir"];

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
                <DropDown
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={onStatusChange}
                    style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        fontSize: '14px',
                        minWidth: '160px'
                    }}
                />

                <DropDown
                    options={dateRangeOptions}
                    value={dateRange}
                    onChange={onDateRangeChange}
                    style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        fontSize: '14px',
                        minWidth: '180px'
                    }}
                />
            </div>

            <div className="w-full sm:w-80">
                <div className="relative">
                    <InputField
                        label="Cari tiket"
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder="Cari tiket..."
                        className="w-full pl-12 pr-1 py-1 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                        style={{ color: colors.base.darker }}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileFilters;