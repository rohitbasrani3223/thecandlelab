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
  icon = <CandleIcon size={48} className="text-[#8B6F4E]" />,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-[#FFFFFF] border border-dashed border-[#EADDCB] max-w-md mx-auto my-6 font-sans shadow-xs ${className}`}>
      <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center mb-4 shadow-subtle border border-[#FDE8EF]">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-[#232323] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#7D6F63] leading-relaxed mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="pink" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
