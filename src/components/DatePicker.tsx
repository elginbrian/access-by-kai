import React from 'react';
import { colors } from '../app/design-system/colors';

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="relative w-full">
      {label && <label className="block mb-2 text-sm font-medium" style={{ color: colors.violet.dark }}>{label}</label>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none"
        style={{
          backgroundColor: colors.base.light,
          borderColor: colors.violet.normal,
          color: colors.base.dark,
        }}
      />
    </div>
  );
};

export default DatePicker;