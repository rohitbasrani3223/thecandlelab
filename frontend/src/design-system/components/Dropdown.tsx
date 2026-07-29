import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: (DropdownItem | 'divider')[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left font-sans ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-flex">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-40 mt-2 w-56 rounded-md bg-[#FAF6F0] border border-[#E5D9C5] shadow-hover py-1 animate-fade-in ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {items.map((item, index) => {
            if (item === 'divider') {
              return <div key={`divider-${index}`} className="my-1 border-t border-[#E5D9C5]" />;
            }

            return (
              <button
                key={item.key}
                disabled={item.disabled}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold tracking-wider text-left transition-colors ${item.disabled ? 'opacity-50 cursor-not-allowed text-[#8C7A6B]' : item.danger ? 'text-[#B33A3A] hover:bg-[#FDF0F0]' : 'text-[#2A1E17] hover:bg-[#F4EFE6]'}`}
              >
                {item.icon && <span className="inline-flex shrink-0 text-[#8C7A6B]">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
