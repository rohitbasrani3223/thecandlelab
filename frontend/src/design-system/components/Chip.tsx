import React from 'react';
import { CloseIcon } from './Icons';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onSelect,
  onRemove,
  icon,
  disabled = false,
  className = '',
}) => {
  return (
    <div
      onClick={() => !disabled && onSelect && onSelect()}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 select-none ${onSelect && !disabled ? 'cursor-pointer' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${selected ? 'bg-[#232323] text-[#FFFFFF] shadow-sm' : 'bg-[#FAF7F2] text-[#5C5149] hover:bg-[#FDE8EF] hover:text-[#C94C6D] border border-[#EADDCB]'} ${className}`}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onRemove();
          }}
          className="hover:opacity-75 focus:outline-none p-0.5 ml-0.5 rounded-full"
          aria-label={`Remove ${label}`}
        >
          <CloseIcon size={12} />
        </button>
      )}
    </div>
  );
};
