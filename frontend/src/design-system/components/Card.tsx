import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'bordered' | 'elevated' | 'gold-border';
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
    flat: 'bg-[#F4EFE6]',
    bordered: 'bg-[#FAF6F0] border border-[#E5D9C5] shadow-[0_2px_10px_rgba(42,30,23,0.04)]',
    elevated: 'bg-[#FAF6F0] border border-[#F5EEE4] shadow-[0_8px_30px_rgba(42,30,23,0.08)] hover:shadow-[0_12px_40px_rgba(42,30,23,0.12)] transition-shadow duration-300',
    'gold-border': 'bg-[#FAF6F0] border border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(212,175,55,0.1)] hover:border-[#D4AF37] transition-all duration-300',
  };

  return (
    <div
      className={`rounded-md transition-all duration-200 ${paddingStyles[padding]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`border-b border-[#E5D9C5] pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`py-1 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`border-t border-[#E5D9C5] pt-4 mt-4 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);
