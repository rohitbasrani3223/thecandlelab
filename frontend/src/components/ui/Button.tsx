"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "emerald" | "amber";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  shortcut?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "sm",
  isLoading = false,
  leftIcon,
  rightIcon,
  shortcut,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-xs active:scale-[0.98]",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 active:scale-[0.98]",
    outline: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs active:scale-[0.98]",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 active:scale-[0.98]",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-[0.98]",
    emerald: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-[0.98]",
    amber: "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs active:scale-[0.98]"
  };

  const sizes = {
    xs: "px-2 py-1 text-[11px] gap-1",
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs gap-2",
    lg: "px-5 py-2.5 text-sm gap-2.5"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      {shortcut && (
        <kbd className="ml-1.5 bg-slate-800/20 text-[10px] font-mono px-1 py-0.2 rounded border border-slate-700/30">
          {shortcut}
        </kbd>
      )}
    </button>
  );
};
