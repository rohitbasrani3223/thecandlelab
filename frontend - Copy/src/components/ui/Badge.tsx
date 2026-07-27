"use client";
import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "blue" | "indigo" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  default: "bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]",
  blue:    "bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]",
  indigo:  "bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]",
  success: "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]",
  warning: "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]",
  danger:  "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]",
  info:    "bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]",
  neutral: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
};

const dotMap: Record<BadgeVariant, string> = {
  default: "bg-[#2563EB]",
  blue:    "bg-[#2563EB]",
  indigo:  "bg-[#6366F1]",
  success: "bg-[#16A34A]",
  warning: "bg-[#F59E0B]",
  danger:  "bg-[#DC2626]",
  info:    "bg-[#2563EB]",
  neutral: "bg-[#94A3B8]",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  dot = false,
  className = "",
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
        text-[11px] font-semibold font-[Inter,system-ui,sans-serif]
        ${variantMap[variant]}
        ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[variant]}`} />}
      {children}
    </span>
  );
};
