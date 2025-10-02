import React from 'react';
import { colors } from '../app/design-system/colors';

interface DropDownProps {
  options: string[];
  label?: string;
  startIcon?: React.ReactNode;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
  value?: string;
}

const DropDown: React.FC<DropDownProps> = ({ options, label, startIcon, onChange, style, value }) => {
  return (
    <div
      style={{ 
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${colors.base.normalActive}`,
        borderRadius: '8px',
        padding: '8px 12px',
        width: '100%',
        backgroundColor: colors.base.light,
        ...style
      }}
    >
      {startIcon && (
        <span style={{ marginRight: '8px', color: colors.base.dark }}>
          {startIcon}
        </span>
      )}
      <select
        style={{ 
          flex: 1,
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          color: colors.base.dark,
          fontSize: '16px'
        }}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      >
        {label && (
          <option value="" disabled style={{ color: colors.base.normal }}>
            {label}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option} style={{ color: colors.base.dark }}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropDown;