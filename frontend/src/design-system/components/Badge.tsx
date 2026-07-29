import React from 'react';

export interface BadgeProps {
  variant?: 'gold' | 'espresso' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md';
  pill?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gold',
  size = 'md',
  pill = false,
  icon,
  children,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-bold tracking-wider',
    md: 'text-xs px-2.5 py-1 font-bold tracking-widest',
  };

  const variantStyles = {
    gold: 'bg-[#D4AF37]/15 text-[#8C6B0D] border border-[#D4AF37]/40',
    espresso: 'bg-[#2A1E17] text-[#FAF6F0]',
    success: 'bg-[#EAF5ED] text-[#2E6F40] border border-[#A8D9B4]',
    warning: 'bg-[#FDF5E6] text-[#C87D20] border border-[#F7D49B]',
    error: 'bg-[#FDF0F0] text-[#B33A3A] border border-[#F4B8B8]',
    info: 'bg-[#EBF3FA] text-[#2B6CB0] border border-[#B3D4F5]',
    outline: 'bg-transparent text-[#4A3B32] border border-[#C2AE90]',
  };

  const shapeStyle = pill ? 'rounded-full' : 'rounded-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-sans uppercase uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${shapeStyle} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
