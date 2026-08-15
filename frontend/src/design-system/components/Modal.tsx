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
        className="fixed inset-0 bg-[#140B10]/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={`relative w-full max-w-[92vw] ${sizeStyles[size]} bg-[#FFFFFF] border border-[#F5E8EE] rounded-2xl shadow-modal z-10 overflow-hidden animate-modal-zoom my-8 font-sans`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[#F5E8EE] bg-[#FFF6F8]">
            <div>
              {title && <h3 className="text-lg font-serif font-bold text-[#1C1217]">{title}</h3>}
              {subtitle && <p className="text-xs text-[#886C7B] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-[#886C7B] hover:text-[#1C1217] p-1.5 rounded-full hover:bg-[#FDE8EF] transition-colors"
              aria-label="Close dialog"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        )}

        {!title && !subtitle && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 text-[#886C7B] hover:text-[#1C1217] p-1.5 rounded-full hover:bg-[#FDE8EF] transition-colors"
            aria-label="Close dialog"
          >
            <CloseIcon size={18} />
          </button>
        )}

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-5 bg-[#FFF6F8] border-t border-[#F5E8EE] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
