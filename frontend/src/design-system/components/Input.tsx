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

  let borderColorClass = "border-[#EADDCB] focus:border-[#8B6F4E] focus:ring-2 focus:ring-[#EADDCB]/40";
  if (error) {
    borderColorClass = "border-[#BE123C] text-[#BE123C] focus:border-[#BE123C] focus:ring-2 focus:ring-[#BE123C]/30";
  } else if (success) {
    borderColorClass = "border-[#15803D] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/30";
  }

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-[#5C5149] select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#A39486] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          disabled={disabled}
          className={`w-full bg-[#FFFFFF] text-[#232323] placeholder-[#A39486] text-sm px-4 py-2.5 rounded-xl border outline-none transition-all duration-200 disabled:opacity-50 disabled:bg-[#F8F6F0] ${leftIcon ? 'pl-10' : ''} ${(rightIcon || isPassword) ? 'pr-10' : ''} ${borderColorClass} ${className}`}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[#A39486] hover:text-[#232323] focus:outline-none p-1 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        ) : (
          rightIcon && (
            <div className="absolute right-3.5 text-[#A39486] pointer-events-none flex items-center justify-center">
              {rightIcon}
            </div>
          )
        )}
      </div>

      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[#BE123C] font-medium' : 'text-[#7D6F63]'}`}>
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
          className="text-xs font-semibold uppercase tracking-wider text-[#5C5149]"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full bg-[#FFFFFF] text-[#232323] placeholder-[#A39486] text-sm p-3.5 rounded-xl border outline-none transition-all duration-200 ${error ? 'border-[#BE123C]' : 'border-[#EADDCB] focus:border-[#8B6F4E] focus:ring-2 focus:ring-[#EADDCB]/40'} ${className}`}
        {...props}
      />
      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[#BE123C] font-medium' : 'text-[#7D6F63]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
