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
  const baseStyles = "animate-shimmer rounded-xl";

  const variantStyles = {
    text: "h-4 w-full rounded-md my-1",
    circular: "rounded-full w-10 h-10 shrink-0",
    rectangular: "w-full h-32 rounded-xl",
    card: "w-full h-64 rounded-2xl",
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
  <div className={`p-4 rounded-2xl border border-[#F5E8EE] bg-[#FFFFFF] flex flex-col gap-3 ${className}`}>
    <Skeleton variant="rectangular" height={180} />
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="text" width="90%" />
    <Skeleton variant="text" width="60%" />
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#FFF6F8]">
      <Skeleton variant="text" width={70} height={24} />
      <Skeleton variant="text" width={90} height={32} />
    </div>
  </div>
);
