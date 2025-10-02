"use client";

import React from "react";
import FilterSection from "./FilterSection";
import { colors } from "@/app/design-system";

interface CheckboxOption {
  id: string;
  label: string;
  checked?: boolean;
}

interface CheckboxFilterProps {
  title: string;
  icon: string;
  iconBgColor: string;
  options: CheckboxOption[];
  onChange?: (optionId: string, checked: boolean) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ title, icon, iconBgColor, options, onChange }) => {
  const checkedCount = options.filter((option) => option.checked).length;

  return (
    <FilterSection title={title} icon={icon} iconBgColor={iconBgColor}>
      {checkedCount > 0 && (
        <div className="text-xs font-medium mb-2" style={{ color: colors.violet.normal }}>
          {checkedCount} filter aktif
        </div>
      )}
      {options.map((option) => (
        <label
          key={option.id}
          className="flex items-center space-x-2 cursor-pointer p-2 rounded transition-colors hover:bg-gray-50"
          style={{
            backgroundColor: option.checked ? colors.violet.light : undefined,
            borderColor: option.checked ? colors.violet.lightActive : "transparent",
            borderWidth: option.checked ? "1px" : "0",
            borderStyle: "solid",
          }}
        >
          <input type="checkbox" checked={option.checked || false} onChange={(e) => onChange?.(option.id, e.target.checked)} className="w-4 h-4 cursor-pointer" style={{ accentColor: colors.violet.normal }} />
          <span
            className="text-sm cursor-pointer"
            style={{
              color: option.checked ? colors.violet.dark : colors.base.darker,
              fontWeight: option.checked ? "500" : "400",
            }}
          >
            {option.label}
          </span>
        </label>
      ))}
    </FilterSection>
  );
};

export default CheckboxFilter;
