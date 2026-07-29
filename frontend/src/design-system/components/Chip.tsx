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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 select-none ${onSelect && !disabled ? 'cursor-pointer' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${selected ? 'bg-[#2A1E17] text-[#FAF6F0] shadow-xs' : 'bg-[#F4EFE6] text-[#4A3B32] hover:bg-[#E5D9C5] border border-[#E5D9C5]'} ${className}`}
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
