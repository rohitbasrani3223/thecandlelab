"use client";

import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverEffect = true,
  padding = "md"
}) => {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-2xs ${
        hoverEffect ? "hover:shadow-md hover:border-slate-300 transition-all duration-200" : ""
      } ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
