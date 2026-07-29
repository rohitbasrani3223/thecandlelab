import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const baseStyles = "animate-shimmer rounded-sm";

  const variantStyles = {
    text: "h-4 w-full rounded-xs my-1",
    circular: "rounded-full w-10 h-10 shrink-0",
    rectangular: "w-full h-32 rounded-md",
    card: "w-full h-64 rounded-md",
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 rounded-md border border-[#E5D9C5] bg-[#FAF6F0] flex flex-col gap-3 ${className}`}>
    <Skeleton variant="rectangular" height={180} />
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="text" width="90%" />
    <Skeleton variant="text" width="60%" />
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F4EFE6]">
      <Skeleton variant="text" width={70} height={24} />
      <Skeleton variant="text" width={90} height={32} />
    </div>
  </div>
);
