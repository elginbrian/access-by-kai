"use client";

import React from "react";
import { colors } from "../../app/design-system/colors";

interface ButtonProps {
  variant: "active" | "disabled" | "outline";
  color?: string;
  backgroundColor?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ variant, color, backgroundColor, onClick, children, type = "button", disabled = false, className, style }) => {
  const isDisabled = variant === "disabled" || disabled;

  if (className) {
    return (
      <button type={type} disabled={isDisabled} onClick={isDisabled ? undefined : onClick} className={className} style={style}>
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: variant === "outline" ? `1px solid ${color}` : "none",
        color: isDisabled ? colors.base.disabled : colors.base.disabledHover,
        background: isDisabled ? colors.base.disabled : variant === "outline" ? "transparent" : backgroundColor,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        transition: "background-color 0.3s, background-image 0.3s, border-color 0.3s",
      }}
      onMouseDown={(e) => {
        if (variant !== "disabled") {
          Object.assign((e.target as HTMLButtonElement).style, {
            background: colors.violet.normal,
          });
        }
      }}
      onMouseUp={(e) => {
        if (variant !== "disabled") {
          Object.assign((e.target as HTMLButtonElement).style, {
            background: colors.violet.normalActive,
          });
        }
      }}
    >
      {children}
    </button>
  );
};

export default Button;
