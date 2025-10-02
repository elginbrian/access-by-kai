import React from 'react';
import { colors } from '../app/design-system/colors';

interface RadioNodeListProps {
  options: string[];
  name: string;
  label?: string;
  onChange?: (value: string) => void;
}

const RadioNodeList: React.FC<RadioNodeListProps> = ({ options, name, label, onChange }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label style={{ 
          display: 'block',
          marginBottom: '8px', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: colors.violet.dark 
        }}>
          {label}
        </label>
      )}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%' }}>
        {options.map((option, index) => (
          <label 
            key={index} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              outline: `1px solid ${colors.base.normalActive}`,
              padding: '8px',
              borderRadius: '4px',
            }}
          >
            <input
              type="radio"
              name={name}
              value={option}
              onChange={(e) => onChange && onChange(e.target.value)}
              style={{
                accentColor: colors.violet.normal,
                width: '16px',
                height: '16px',
                outline: 'none',
                border: 'none',
              }}
            />
            <span style={{ color: colors.base.dark }}>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioNodeList;