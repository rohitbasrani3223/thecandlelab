import React from 'react';
import { Button } from './Button';
import { CandleIcon } from './Icons';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <CandleIcon size={48} className="text-[#D4AF37]" />,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-md bg-[#FAF6F0] border border-dashed border-[#E5D9C5] max-w-md mx-auto my-6 font-sans ${className}`}>
      <div className="w-16 h-16 rounded-full bg-[#F4EFE6] flex items-center justify-center mb-4 shadow-subtle">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-[#2A1E17] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#8C7A6B] leading-relaxed mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="gold" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
