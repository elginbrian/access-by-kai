"use client";

import React from "react";
import InputField from "@/components/input/InputField";
import { colors } from "@/app/design-system/colors";
import { RequiredFieldIndicator } from "./RequiredFieldIndicator";

export interface BookerData {
  fullName: string;
  phoneNumber: string;
  email: string;
}

interface BookerFormProps {
  data: BookerData;
  onChange: (data: BookerData) => void;
}

const BookerForm: React.FC<BookerFormProps> = ({ data, onChange }) => {
  const handleInputChange = (field: keyof BookerData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      [field]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Data Pemesan</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <InputField
            label="Nama Lengkap"
            type="text"
            placeholder="Masukkan nama lengkap Anda"
            value={data.fullName}
            onChange={handleInputChange("fullName")}
            className="w-full px-1 py-1 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
            style={
              {
                "--tw-ring-color": colors.violet.normal,
              } as React.CSSProperties
            }
          />
          <RequiredFieldIndicator hasValue={!!data.fullName.trim()} fieldName="Nama lengkap" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Telepon <span className="text-red-500">*</span>
          </label>
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
              label="Nomor Telepon"
              type="tel"
              placeholder="812-3456-7890"
              value={data.phoneNumber}
              onChange={handleInputChange("phoneNumber")}
              className="flex-1 px-1 py-1 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
              style={
                {
                  "--tw-ring-color": colors.violet.normal,
                } as React.CSSProperties
              }
            />
          </div>
          <RequiredFieldIndicator hasValue={!!data.phoneNumber.trim()} fieldName="Nomor telepon" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat Email <span className="text-red-500">*</span>
          </label>
          <InputField
            label="Alamat Email"
            type="email"
            placeholder="email.anda@contoh.com"
            value={data.email}
            onChange={handleInputChange("email")}
            className="w-full px-1 py-1 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
            style={
              {
                "--tw-ring-color": colors.violet.normal,
              } as React.CSSProperties
            }
          />
          <RequiredFieldIndicator hasValue={!!data.email.trim()} fieldName="Alamat email" />
        </div>
      </div>
    </div>
  );
};

export default BookerForm;
