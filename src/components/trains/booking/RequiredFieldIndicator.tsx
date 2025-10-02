import React from "react";
import { colors } from "@/app/design-system/colors";

interface RequiredFieldIndicatorProps {
  isRequired?: boolean;
  hasValue?: boolean;
  fieldName?: string;
  className?: string;
}

export const RequiredFieldIndicator: React.FC<RequiredFieldIndicatorProps> = ({ isRequired = true, hasValue = false, fieldName = "Field", className = "" }) => {
  if (!isRequired) return null;

  return <div className={`flex items-center gap-1 text-xs mt-1 ${className}`}></div>;
};

interface MissingDataAlertProps {
  missingFields: string[];
  className?: string;
}

export const MissingDataAlert: React.FC<MissingDataAlertProps> = ({ missingFields, className = "" }) => {
  if (missingFields.length === 0) return null;

  const getFieldDisplayName = (field: string): string => {
    const fieldMap: Record<string, string> = {
      "booker.fullName": "Nama Pemesan",
      "booker.email": "Email Pemesan",
      "booker.phone": "Nomor Telepon Pemesan",
      "passengers[0].name": "Nama Penumpang",
      "passengers[0].idNumber": "Nomor Identitas Penumpang",
      "passengers[0].seat": "Kursi Penumpang",
      "journey.jadwalId": "Jadwal Kereta",
    };

    return fieldMap[field] || field;
  };

  return (
    <div className={`bg-white-50 border border-white-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 mb-2">Data belum lengkap</h4>
          <p className="text-sm text-gray-700 mb-3">Anda perlu melengkapi data berikut sebelum bisa lanjut ke pemesanan makanan:</p>
          <ul className="space-y-1">
            {missingFields.map((field, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                {getFieldDisplayName(field)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
