import React from 'react';
import { CheckIcon } from './Icons';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  checked,
  onChange,
  disabled,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div className="w-4 h-4 rounded-xs border border-[#8C7A6B] bg-[#FAF6F0] peer-checked:bg-[#2A1E17] peer-checked:border-[#2A1E17] transition-all flex items-center justify-center peer-focus:ring-2 peer-focus:ring-[#D4AF37]/50">
          {checked && <CheckIcon size={12} className="text-[#FAF6F0]" />}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && <span className="text-sm font-medium text-[#2A1E17]">{label}</span>}
          {description && <span className="text-xs text-[#8C7A6B]">{description}</span>}
        </div>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
