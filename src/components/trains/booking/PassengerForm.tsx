"use client";

import React from "react";
import InputField from "@/components/input/InputField";
import { colors } from "@/app/design-system/colors";

export interface PassengerData {
  title: string;
  passengerName: string;
  idType: string;
  idNumber: string;
}

interface PassengerFormProps {
  data: PassengerData;
  onChange: (data: PassengerData) => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ data, onChange }) => {
  const handleInputChange = (field: keyof PassengerData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({
      ...data,
      [field]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Data Penumpang</h2>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gelar</label>
          <div className="relative">
            <select
              value={data.title}
              onChange={handleInputChange("title")}
              className="appearance-none text-black w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="Bapak">Bapak</option>
              <option value="Ibu">Ibu</option>
              <option value="Saudara">Saudara</option>
              <option value="Saudari">Saudari</option>
            </select>
            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
          <InputField
            label="Nama Lengkap"
            type="text"
            placeholder="Sesuai identitas"
            value={data.passengerName}
            onChange={handleInputChange("passengerName")}
            className="w-full px-1 py-1 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
            style={
              {
                "--tw-ring-color": colors.violet.normal,
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Identitas</label>
          <div className="relative">
            <select
              value={data.idType}
              onChange={handleInputChange("idType")}
              className="appearance-none text-black w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="KTP">KTP</option>
              <option value="PASSPORT">Paspor</option>
              <option value="SIM">SIM</option>
            </select>
            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Identitas</label>
          <InputField
            label="Nomor Identitas"
            type="text"
            placeholder="Masukkan nomor identitas"
            value={data.idNumber}
            onChange={handleInputChange("idNumber")}
            className="w-full px-1 py-1 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
            style={
              {
                "--tw-ring-color": colors.violet.normal,
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <span className="text-[#2563eb]">Simpan informasi ini untuk pemesanan selanjutnya</span>
      </label>
    </div>
  );
};

export default PassengerForm;
