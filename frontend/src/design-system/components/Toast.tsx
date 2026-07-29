import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckIcon, AlertCircleIcon, CloseIcon, SparklesIcon } from './Icons';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'luxury';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ type, title, description, duration = 4000 }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, description, duration };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  const typeIcons: Record<ToastType, React.ReactNode> = {
    success: <CheckIcon size={18} className="text-[#2E6F40]" />,
    error: <AlertCircleIcon size={18} className="text-[#B33A3A]" />,
    warning: <AlertCircleIcon size={18} className="text-[#C87D20]" />,
    info: <AlertCircleIcon size={18} className="text-[#2B6CB0]" />,
    luxury: <SparklesIcon size={18} className="text-[#D4AF37]" />,
  };

  const bgStyles: Record<ToastType, string> = {
    success: 'bg-[#FAF6F0] border-l-4 border-l-[#2E6F40] border-y border-r border-[#E5D9C5]',
    error: 'bg-[#FAF6F0] border-l-4 border-l-[#B33A3A] border-y border-r border-[#E5D9C5]',
    warning: 'bg-[#FAF6F0] border-l-4 border-l-[#C87D20] border-y border-r border-[#E5D9C5]',
    info: 'bg-[#FAF6F0] border-l-4 border-l-[#2B6CB0] border-y border-r border-[#E5D9C5]',
    luxury: 'bg-[#2A1E17] text-[#FAF6F0] border-l-4 border-l-[#D4AF37] border-y border-r border-[#4A3B32]',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between p-4 rounded-md shadow-hover animate-slide-right transition-all font-sans ${bgStyles[toast.type]}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{typeIcons[toast.type]}</div>
        <div className="flex flex-col text-left">
          <h4 className={`text-sm font-semibold ${toast.type === 'luxury' ? 'text-[#D4AF37]' : 'text-[#2A1E17]'}`}>
            {toast.title}
          </h4>
          {toast.description && (
            <p className={`text-xs mt-0.5 ${toast.type === 'luxury' ? 'text-[#E5D9C5]' : 'text-[#8C7A6B]'}`}>
              {toast.description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className={`ml-3 shrink-0 p-1 rounded-sm hover:opacity-75 focus:outline-none ${toast.type === 'luxury' ? 'text-[#E5D9C5]' : 'text-[#8C7A6B]'}`}
        aria-label="Close notification"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
};
