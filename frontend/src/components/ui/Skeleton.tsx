"use client";

import React from "react";

export interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  height = "h-4",
  width = "w-full",
  rounded = "rounded-xl"
}) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${height} ${width} ${rounded} ${className}`}
    ></div>
  );
};
