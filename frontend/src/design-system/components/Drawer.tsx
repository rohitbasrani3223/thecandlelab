import React, { useEffect } from 'react';
import { CloseIcon } from './Icons';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  position = 'right',
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

  const widthStyles = {
    sm: 'w-full max-w-[85vw] sm:w-72',
    md: 'w-full max-w-[92vw] sm:w-96',
    lg: 'w-full max-w-[95vw] sm:w-[480px]',
    full: 'w-full',
  };

  const positionClasses = {
    right: `top-0 right-0 h-full ${widthStyles[size]} animate-slide-right border-l border-[#EADDCB]`,
    left: `top-0 left-0 h-full ${widthStyles[size]} animate-slide-left border-r border-[#EADDCB]`,
    bottom: `bottom-0 left-0 right-0 max-h-[85vh] animate-slide-up rounded-t-2xl border-t border-[#EADDCB]`,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#141312]/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div
        className={`fixed bg-[#FFFFFF] shadow-drawer z-10 flex flex-col justify-between ${positionClasses[position]}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile handle indicator for bottom sheet */}
        {position === 'bottom' && (
          <div className="w-12 h-1.5 bg-[#FCD5E2] rounded-full mx-auto my-2 shrink-0" />
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-[#EADDCB] bg-[#FAF7F2] shrink-0">
            <h3 className="text-lg font-serif font-bold text-[#232323]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#7D6F63] hover:text-[#232323] p-1.5 rounded-full hover:bg-[#FDE8EF] transition-colors"
              aria-label="Close drawer"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        )}

        {!title && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 text-[#7D6F63] hover:text-[#232323] p-1.5 rounded-full hover:bg-[#FDE8EF] transition-colors"
            aria-label="Close drawer"
          >
            <CloseIcon size={18} />
          </button>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#EADDCB] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
