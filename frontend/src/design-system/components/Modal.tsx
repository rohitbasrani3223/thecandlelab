import React, { useEffect } from 'react';
import { CloseIcon } from './Icons';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C130E]/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={`relative w-full max-w-[92vw] ${sizeStyles[size]} bg-[#FAF6F0] border border-[#E5D9C5] rounded-md shadow-modal z-10 overflow-hidden animate-modal-zoom my-8 font-sans`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-start justify-between p-5 border-b border-[#E5D9C5] bg-[#F4EFE6]">
            <div>
              {title && <h3 className="text-lg font-serif font-bold text-[#2A1E17]">{title}</h3>}
              {subtitle && <p className="text-xs text-[#8C7A6B] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-[#8C7A6B] hover:text-[#2A1E17] p-1.5 rounded-sm hover:bg-[#E5D9C5]/50 transition-colors"
              aria-label="Close dialog"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        )}

        {!title && !subtitle && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 text-[#8C7A6B] hover:text-[#2A1E17] p-1.5 rounded-sm hover:bg-[#E5D9C5]/50 transition-colors"
            aria-label="Close dialog"
          >
            <CloseIcon size={18} />
          </button>
        )}

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 bg-[#F4EFE6] border-t border-[#E5D9C5] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
