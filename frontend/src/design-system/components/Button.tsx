import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wider uppercase";

  // Size variations
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 rounded-sm gap-1.5 h-8 font-semibold",
    md: "text-xs px-5 py-2.5 rounded-sm gap-2 h-10 font-bold",
    lg: "text-sm px-7 py-3.5 rounded-md gap-2.5 h-12 font-bold tracking-widest",
  };

  // Variant variations
  const variantStyles = {
    primary: "bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#4A3B32] border border-[#2A1E17] shadow-sm active:translate-y-[1px]",
    gold: "bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#C5A059] text-[#1C130E] hover:brightness-105 border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)] active:translate-y-[1px]",
    secondary: "bg-[#FAF6F0] text-[#2A1E17] hover:bg-[#F4EFE6] border border-[#E5D9C5] shadow-xs active:translate-y-[1px]",
    outline: "bg-transparent text-[#2A1E17] border border-[#8C7A6B] hover:bg-[#FAF6F0] hover:border-[#2A1E17] active:translate-y-[1px]",
    ghost: "bg-transparent text-[#4A3B32] hover:bg-[#F4EFE6] hover:text-[#2A1E17]",
    danger: "bg-[#B33A3A] text-white hover:bg-[#8C2C2C] border border-[#B33A3A]",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
