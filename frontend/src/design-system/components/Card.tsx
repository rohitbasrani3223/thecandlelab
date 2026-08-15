import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'bordered' | 'elevated' | 'gold-border' | 'pink-glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'bordered',
  padding = 'md',
  children,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5 sm:p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    flat: 'bg-[#FFF6F8]',
    bordered: 'bg-[#FFFFFF] border border-[#F5E8EE] shadow-[0_2px_12px_rgba(230,106,138,0.04)]',
    elevated: 'bg-[#FFFFFF] border border-[#F5E8EE] shadow-[0_8px_30px_rgba(230,106,138,0.08)] hover:shadow-[0_16px_40px_rgba(230,106,138,0.14)] transition-shadow duration-300',
    'gold-border': 'bg-[#FFFFFF] border border-[#E8C86D]/60 shadow-[0_4px_20px_rgba(232,200,109,0.15)] hover:border-[#CCA243] transition-all duration-300',
    'pink-glow': 'bg-[#FFFFFF] border border-[#F9B8CA] shadow-[0_4px_24px_rgba(249,184,202,0.35)] hover:shadow-[0_8px_32px_rgba(249,184,202,0.5)] transition-all duration-300',
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${paddingStyles[padding]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`border-b border-[#F5E8EE] pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`py-1 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`border-t border-[#F5E8EE] pt-4 mt-4 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);
