import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'pink' | 'gold' | 'secondary' | 'outline' | 'ghost' | 'danger';
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
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-300/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wider uppercase";

  // Size variations
  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 rounded-full gap-1.5 h-8 font-semibold",
    md: "text-xs px-5 py-2.5 rounded-full gap-2 h-10 font-bold",
    lg: "text-sm px-7 py-3.5 rounded-full gap-2.5 h-12 font-bold tracking-widest",
  };

  // Variant variations
  const variantStyles = {
    primary: "bg-[#232323] text-[#FFFFFF] hover:bg-[#3D3531] border border-[#232323] shadow-sm hover:shadow-md active:translate-y-[1px]",
    pink: "bg-gradient-to-r from-[#8B6F4E] via-[#9E8160] to-[#745A3D] text-white hover:brightness-105 border border-[#8B6F4E] shadow-[0_4px_16px_rgba(139,111,78,0.35)] active:translate-y-[1px]",
    gold: "bg-gradient-to-r from-[#EFE0B3] via-[#C8A75A] to-[#AA893E] text-[#232323] hover:brightness-105 border border-[#C8A75A] shadow-[0_4px_16px_rgba(200,167,90,0.35)] active:translate-y-[1px]",
    secondary: "bg-[#FFFFFF] text-[#232323] hover:bg-[#EADDCB] hover:text-[#232323] border border-[#DFCFBC] shadow-xs active:translate-y-[1px]",
    outline: "bg-transparent text-[#232323] border border-[#232323] hover:bg-[#EADDCB]/30 hover:text-[#232323] active:translate-y-[1px]",
    ghost: "bg-transparent text-[#5C5149] hover:bg-[#EADDCB]/30 hover:text-[#232323] rounded-full",
    danger: "bg-[#BE123C] text-white hover:bg-[#9F1239] border border-[#BE123C] active:translate-y-[1px]",
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
