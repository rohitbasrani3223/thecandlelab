import React from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({
  label,
  description,
  checked,
  onChange,
  disabled,
  className = '',
  id,
  ...props
}, ref) => {
  const radioId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={radioId}
      className={`inline-flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          ref={ref}
          id={radioId}
          type="radio"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div className="w-4 h-4 rounded-full border border-[#8C7A6B] bg-[#FAF6F0] peer-checked:border-[#D4AF37] transition-all flex items-center justify-center peer-focus:ring-2 peer-focus:ring-[#D4AF37]/50">
          {checked && <div className="w-2 h-2 rounded-full bg-[#2A1E17]" />}
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

Radio.displayName = 'Radio';
