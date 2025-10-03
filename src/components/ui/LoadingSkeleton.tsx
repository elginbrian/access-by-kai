"use client";

import React from "react";

type Variant = "card" | "text" | "chart" | "list";

type Props = {
  variant?: Variant;
  className?: string;
};

export default function LoadingSkeleton({ variant = "card", className = "" }: Props) {
  const base = "animate-pulse bg-gray-200 rounded-md";

  switch (variant) {
    case "card":
      return <div className={`${base} ${className}`} style={{ height: 80 }} />;
    case "chart":
      return <div className={`${base} ${className}`} style={{ height: 260 }} />;
    case "list":
      return (
        <div className={`${className} space-y-2`}>
          <div className={`${base} h-12`} />
          <div className={`${base} h-12`} />
          <div className={`${base} h-12`} />
        </div>
      );
    default:
      return <div className={`${base} ${className}`} style={{ height: 16, width: "100%" }} />;
  }
}
