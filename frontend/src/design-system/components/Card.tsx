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
    flat: 'bg-[#F5EFE6]',
    bordered: 'bg-[#FFFFFF] border border-[#EADDCB] shadow-[0_2px_12px_rgba(35,35,35,0.03)]',
    elevated: 'bg-[#FFFFFF] border border-[#EADDCB] shadow-[0_8px_30px_rgba(139,111,78,0.08)] hover:shadow-[0_16px_40px_rgba(139,111,78,0.14)] transition-shadow duration-300',
    'gold-border': 'bg-[#FFFFFF] border border-[#8B6F4E]/60 shadow-[0_4px_20px_rgba(139, 111, 78,0.15)] hover:border-[#8B6F4E] transition-all duration-300',
    'pink-glow': 'bg-[#FFFFFF] border border-[#EADDCB] shadow-[0_4px_24px_rgba(234,221,203,0.4)] hover:shadow-[0_8px_32px_rgba(234,221,203,0.6)] transition-all duration-300',
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
  <div className={`border-b border-[#EADDCB] pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`py-1 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`border-t border-[#EADDCB] pt-4 mt-4 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);
