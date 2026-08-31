import React from 'react';
import { ChevronDownIcon } from './Icons';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  helperText,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold uppercase tracking-wider text-[#5C5149]"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          ref={ref}
          id={selectId}
          className={`w-full appearance-none bg-[#FFFFFF] text-[#232323] text-sm pl-4 pr-10 py-2.5 rounded-xl border outline-none cursor-pointer transition-all duration-200 ${error ? 'border-[#BE123C]' : 'border-[#EADDCB] focus:border-[#8B6F4E] focus:ring-2 focus:ring-[#EADDCB]/40'} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#7D6F63]">
          <ChevronDownIcon size={18} />
        </div>
      </div>
      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[#BE123C] font-medium' : 'text-[#7D6F63]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
