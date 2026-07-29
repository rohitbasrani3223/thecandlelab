import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  success,
  leftIcon,
  rightIcon,
  type = 'text',
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  let borderColorClass = "border-[#E5D9C5] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]";
  if (error) {
    borderColorClass = "border-[#B33A3A] text-[#B33A3A] focus:border-[#B33A3A] focus:ring-1 focus:ring-[#B33A3A]";
  } else if (success) {
    borderColorClass = "border-[#2E6F40] focus:border-[#2E6F40] focus:ring-1 focus:ring-[#2E6F40]";
  }

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-[#4A3B32] select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#8C7A6B] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          disabled={disabled}
          className={`w-full bg-[#FAF6F0] text-[#2A1E17] placeholder-[#A68B75] text-sm px-4 py-2.5 rounded-sm border outline-none transition-all duration-200 disabled:opacity-50 disabled:bg-[#EBE2D3] ${leftIcon ? 'pl-10' : ''} ${(rightIcon || isPassword) ? 'pr-10' : ''} ${borderColorClass} ${className}`}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[#8C7A6B] hover:text-[#2A1E17] focus:outline-none p-1 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        ) : (
          rightIcon && (
            <div className="absolute right-3.5 text-[#8C7A6B] pointer-events-none flex items-center justify-center">
              {rightIcon}
            </div>
          )
        )}
      </div>

      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[#B33A3A] font-medium' : 'text-[#8C7A6B]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  helperText,
  error,
  className = '',
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-wider text-[#4A3B32]"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full bg-[#FAF6F0] text-[#2A1E17] placeholder-[#A68B75] text-sm p-3.5 rounded-sm border outline-none transition-all duration-200 ${error ? 'border-[#B33A3A]' : 'border-[#E5D9C5] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'} ${className}`}
        {...props}
      />
      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[#B33A3A] font-medium' : 'text-[#8C7A6B]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
