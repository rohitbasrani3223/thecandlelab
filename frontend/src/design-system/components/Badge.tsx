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
    pink: 'bg-[#F5EFE6] text-[#8B6F4E] border border-[#EADDCB]',
    rose: 'bg-[#EADDCB]/40 text-[#745A3D] border border-[#DFCFBC]',
    gold: 'bg-[#F9F2DC] text-[#876A2A] border border-[#DFC27E]',
    espresso: 'bg-[#232323] text-[#FFFFFF] border border-[#3D3531]',
    success: 'bg-[#EFF1E5] text-[#6B6E4A] border border-[#BFC69E]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
    error: 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]',
    info: 'bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD]',
    outline: 'bg-transparent text-[#5C5149] border border-[#DFCFBC]',
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
