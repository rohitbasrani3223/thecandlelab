import React from 'react';

export interface BadgeProps {
  variant?: 'pink' | 'rose' | 'gold' | 'espresso' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md';
  pill?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'pink',
  size = 'md',
  pill = true,
  icon,
  children,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2.5 py-0.5 font-bold tracking-wider',
    md: 'text-xs px-3 py-1 font-bold tracking-widest',
  };

  const variantStyles = {
    pink: 'bg-[#FDE8EF] text-[#C94C6D] border border-[#F9B8CA]',
    rose: 'bg-[#FFF0F4] text-[#A83753] border border-[#F293AC]',
    gold: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
    espresso: 'bg-[#1C1217] text-[#FFFFFF] border border-[#2C1D25]',
    success: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
    error: 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]',
    info: 'bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD]',
    outline: 'bg-transparent text-[#624855] border border-[#EBD6DF]',
  };

  const shapeStyle = pill ? 'rounded-full' : 'rounded-md';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${shapeStyle} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
