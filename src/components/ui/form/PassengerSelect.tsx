import React, { useState, useRef, useEffect } from "react";
import { colors } from "@/app/design-system";

interface PassengerValue {
  adults: number;
  infants: number;
}

interface PassengerSelectProps {
  value: PassengerValue;
  onChange: (val: PassengerValue) => void;
  className?: string;
}

const PassengerSelect: React.FC<PassengerSelectProps> = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const total = value.adults + value.infants;

  const clamp = (n: number) => Math.max(0, Math.min(8, n));

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div
        className="w-full px-3 py-2 bg-white border rounded-lg font-medium cursor-pointer transition-all duration-150 flex items-center justify-between text-sm"
        style={{ borderColor: colors.base.darkActive, color: colors.violet.normal }}
        onClick={() => setIsOpen((s) => !s)}
      >
        <div className="flex items-center space-x-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.violet.normal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-sm font-medium" style={{ color: colors.violet.normal }}>{`${value.adults} Dewasa, ${value.infants} Bayi`}</span>
        </div>
        <svg className={`w-4 h-4 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke={colors.base.darkHover} strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg p-3 text-sm" style={{ borderColor: colors.violet.light }}>
          <div className="space-y-2">
            {[
              { key: "adults", label: "Dewasa" },
              { key: "infants", label: "Bayi" },
            ].map((item) => (
              <div className="flex items-center justify-between" key={item.key}>
                <div>
                  <div className="text-sm font-medium" style={{ color: colors.base.darker }}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-gray-800">{item.key === "adults" ? "12 thn atau lebih" : "Di bawah 2 tahun"}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const current = Number((value as any)[item.key] ?? 0);
                    const minAllowed = item.key === "adults" ? 1 : 0;
                    const maxAllowed = 8;
                    const minusDisabled = current <= minAllowed;
                    const plusDisabled = current >= maxAllowed;
                    return (
                      <>
                        <button
                          className={`w-7 h-7 rounded-md text-sm flex items-center justify-center border ${minusDisabled ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-white text-violet-600 border-gray-300"}`}
                          onClick={() => {
                            if (minusDisabled) return;
                            const next = { ...value, [item.key]: clamp(current - 1) } as PassengerValue;
                            onChange(next);
                          }}
                          aria-label={`Kurangi ${item.label}`}
                          disabled={minusDisabled}
                        >
                          -
                        </button>
                        <div className="w-7 text-center text-sm text-black">{current}</div>
                        <button
                          className={`w-7 h-7 rounded-md text-sm flex items-center justify-center border ${plusDisabled ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-white text-violet-600 border-gray-300"}`}
                          onClick={() => {
                            if (plusDisabled) return;
                            const next = { ...value, [item.key]: clamp(current + 1) } as PassengerValue;
                            onChange(next);
                          }}
                          aria-label={`Tambah ${item.label}`}
                          disabled={plusDisabled}
                        >
                          +
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-right">
            <button onClick={() => setIsOpen(false)} className="px-3 py-1 bg-purple-800 text-white rounded-md text-sm">
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export type { PassengerValue };
export default PassengerSelect;
