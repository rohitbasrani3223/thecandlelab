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
      {/* Toast Container - Top Right Positioned Below Header */}
      <div className="fixed top-20 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
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
    success: <CheckIcon size={18} className="text-[#15803D]" />,
    error: <AlertCircleIcon size={18} className="text-[#BE123C]" />,
    warning: <AlertCircleIcon size={18} className="text-[#B45309]" />,
    info: <AlertCircleIcon size={18} className="text-[#0369A1]" />,
    luxury: <SparklesIcon size={18} className="text-[#8B6F4E]" />,
  };

  const bgStyles: Record<ToastType, string> = {
    success: 'bg-[#FFFFFF] border-l-4 border-l-[#15803D] border-y border-r border-[#EADDCB]',
    error: 'bg-[#FFFFFF] border-l-4 border-l-[#BE123C] border-y border-r border-[#EADDCB]',
    warning: 'bg-[#FFFFFF] border-l-4 border-l-[#B45309] border-y border-r border-[#EADDCB]',
    info: 'bg-[#FFFFFF] border-l-4 border-l-[#0369A1] border-y border-r border-[#EADDCB]',
    luxury: 'bg-[#232323] text-[#FFFFFF] border-l-4 border-l-[#8B6F4E] border-y border-r border-[#2C1D25] shadow-[0_8px_30px_rgba(249,184,202,0.25)]',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl shadow-hover animate-slide-right transition-all font-sans ${bgStyles[toast.type]}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{typeIcons[toast.type]}</div>
        <div className="flex flex-col text-left">
          <h4 className={`text-sm font-semibold ${toast.type === 'luxury' ? 'text-[#EADDCB]' : 'text-[#232323]'}`}>
            {toast.title}
          </h4>
          {toast.description && (
            <p className={`text-xs mt-0.5 ${toast.type === 'luxury' ? 'text-[#FCD5E2]' : 'text-[#7D6F63]'}`}>
              {toast.description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className={`ml-3 shrink-0 p-1 rounded-full hover:opacity-75 focus:outline-none ${toast.type === 'luxury' ? 'text-[#FCD5E2]' : 'text-[#7D6F63]'}`}
        aria-label="Close notification"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
};
