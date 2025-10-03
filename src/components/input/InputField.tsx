import { colors } from "@/app/design-system/colors";
import React from "react";

interface InputFieldProps {
  label: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  value?: any;
  onChange?: any;
  [key: string]: any;
}

const InputField: React.FC<InputFieldProps> = ({ label, startIcon, endIcon, value, onChange, ...props }) => {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: "8px",
          border: `1px solid ${colors.base.normalActive}`,
          backgroundColor: colors.base.light,
          padding: "8px 12px",
          color: colors.base.darker,
          transition: "all 0.2s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.violet.normal;
          e.currentTarget.style.outline = "none";
          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.violet.light}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = colors.base.normalActive;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Start Icon */}
        {startIcon && <span style={{ color: colors.base.dark, display: "flex", alignItems: "center", marginRight: "8px" }}>{startIcon}</span>}

        {/* The actual input element */}
        <input
          placeholder={label}
          style={{
            flex: 1,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            fontSize: "16px",
            color: colors.base.darker,
          }}
          {...(typeof onChange === "function" ? { value: value ?? "", onChange } : { defaultValue: value ?? "" })}
          {...props}
        />

        {/* End Icon */}
        {endIcon && <span style={{ color: colors.base.dark, display: "flex", alignItems: "center", marginLeft: "8px" }}>{endIcon}</span>}
      </div>
    </div>
  );
};

export default InputField;
``;
