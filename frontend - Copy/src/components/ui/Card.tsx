"use client";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  hover = false,
  ...rest
}) => {
  const padMap = { none: "", sm: "p-4", md: "p-5", lg: "p-6" };
  return (
    <div
      {...rest}
      className={`
        bg-white rounded-xl border border-[#E2E8F0]
        shadow-[0_1px_3px_rgba(15,23,42,0.07),0_4px_12px_rgba(15,23,42,0.03)]
        ${hover ? "hover:shadow-[0_4px_16px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 transition-all duration-200" : ""}
        font-[Inter,system-ui,sans-serif]
        ${padMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <h3 className={`text-sm font-semibold text-[#0F172A] ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <p className={`text-xs text-[#94A3B8] mt-0.5 ${className}`}>{children}</p>
);
