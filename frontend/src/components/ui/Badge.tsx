"use client";

import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "emerald" | "amber" | "rose" | "indigo" | "purple" | "sky" | "slate";
  pulse?: boolean;
  size?: "xs" | "sm";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "slate",
  pulse = false,
  size = "sm",
  className = ""
}) => {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200"
  };

  const dots = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    sky: "bg-sky-500",
    slate: "bg-slate-500"
  };

  const sizeStyles = {
    xs: "px-2 py-0.2 text-[10px]",
    sm: "px-2.5 py-0.5 text-[11px]"
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold border transition-colors ${styles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 mr-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dots[variant]}`}></span>
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dots[variant]}`}></span>
        </span>
      )}
      {children}
    </span>
  );
};
