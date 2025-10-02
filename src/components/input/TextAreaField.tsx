import { colors } from '@/app/design-system/colors';
import React from 'react';

interface TextAreaFieldProps {
  label?: string;
  rows?: number;
  [key: string]: any;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ label = '', rows = 3, ...props }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          width: '100%',
          borderRadius: '8px',
          border: `1px solid ${colors.base.normalActive}`,
          backgroundColor: colors.base.light,
          padding: '6px 8px',
          color: colors.base.darker,
          transition: 'all 0.2s',
        }}
        onFocus={(e: any) => {
          e.currentTarget.style.borderColor = colors.violet.normal;
          e.currentTarget.style.outline = 'none';
          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.violet.light}`;
        }}
        onBlur={(e: any) => {
          e.currentTarget.style.borderColor = colors.base.normalActive;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <textarea
          rows={rows}
          placeholder={label}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            color: colors.base.darker,
            resize: 'vertical',
            padding: '6px 4px',
          }}
          {...props}
        />
      </div>
    </div>
  );
};

export default TextAreaField;
