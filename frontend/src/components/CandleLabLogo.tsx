"use client";

import React from "react";

interface CandleLabLogoProps {
  className?: string;
  variant?: "light" | "dark" | "gold";
  size?: "sm" | "md" | "lg";
}

export const CandleLabLogo: React.FC<CandleLabLogoProps> = ({
  className = "",
  variant = "dark",
  size = "md"
}) => {
  const dimensions = {
    sm: { width: 180, height: 48, fontSize: 16, subSize: 7, iconScale: 0.7 },
    md: { width: 230, height: 58, fontSize: 20, subSize: 8, iconScale: 0.85 },
    lg: { width: 290, height: 72, fontSize: 24, subSize: 10, iconScale: 1 }
  }[size];

  const textColor = variant === "light" ? "#F8F5F0" : variant === "gold" ? "#C8A75A" : "#1F1F1F";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 260 64"
        width={dimensions.width}
        height={dimensions.height}
        className="w-auto h-9 sm:h-11 transition-all duration-300"
      >
        <defs>
          <linearGradient id="candleGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4B46A" />
            <stop offset="50%" stopColor="#C8A75A" />
            <stop offset="100%" stopColor="#9A7B32" />
          </linearGradient>
          <filter id="flameGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Candle Flame & Pillar Icon */}
        <g transform="translate(6, 6)">
          <rect x="15" y="24" width="18" height="26" rx="3" fill="url(#candleGoldGrad)" />
          <path d="M 24 24 L 24 17" stroke={textColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M 24 5 C 17 12 19 18 24 18 C 29 18 31 12 24 5 Z" fill="url(#candleGoldGrad)" filter="url(#flameGlow)" />
          <path d="M 24 9 C 20 13 21 16 24 16 C 27 16 28 13 24 9 Z" fill="#FFF9EB" />
          <path d="M 37 10 L 39 13 L 42 14 L 39 15 L 37 18 L 35 15 L 32 14 L 35 13 Z" fill="#C8A75A" opacity="0.85" />
        </g>

        {/* Brand Text */}
        <text
          x="58"
          y="33"
          fontFamily="'Playfair Display', 'Cinzel', serif"
          fontSize={dimensions.fontSize}
          fontWeight="700"
          letterSpacing="2.5"
          fill={textColor}
        >
          THE CANDLE LAB
        </text>

        {/* Subtitle */}
        <text
          x="59"
          y="48"
          fontFamily="'Inter', sans-serif"
          fontSize={dimensions.subSize}
          fontWeight="600"
          letterSpacing="3.5"
          fill="#C8A75A"
        >
          ATELIER HOME FRAGRANCES
        </text>
      </svg>
    </div>
  );
};
