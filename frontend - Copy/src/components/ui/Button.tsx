"use client";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   "bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-[#2563EB] hover:border-[#1D4ED8] shadow-sm",
  secondary: "bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-sm",
  ghost:     "bg-transparent hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] border border-transparent",
  danger:    "bg-[#DC2626] hover:bg-[#B91C1C] text-white border border-[#DC2626] hover:border-[#B91C1C] shadow-sm",
  success:   "bg-[#16A34A] hover:bg-[#15803D] text-white border border-[#16A34A] hover:border-[#15803D] shadow-sm",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-[11px] rounded-lg gap-1",
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-5 py-2.5 text-sm rounded-xl gap-2",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "sm",
  leftIcon,
  rightIcon,
  loading = false,
  children,
  className = "",
  disabled,
  ...rest
}) => {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-150 select-none
        focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        font-[Inter,system-ui,sans-serif]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round" />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
