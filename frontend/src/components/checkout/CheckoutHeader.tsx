import React from 'react';

export type CheckoutStep = 1 | 2 | 3 | 4;

export interface CheckoutHeaderProps {
  currentStep: CheckoutStep;
  onStepClick: (step: CheckoutStep) => void;
}

const steps = [
  { num: 1, title: '1. Shipping Address', short: 'Address' },
  { num: 2, title: '2. Delivery Method', short: 'Delivery' },
  { num: 3, title: '3. Payment Option', short: 'Payment' },
  { num: 4, title: '4. Order Review', short: 'Review' },
];

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ currentStep, onStepClick }) => {
  return (
    <header className="bg-[#FAF6F0] border-b border-[#E5D9C5] py-3.5 px-4 sm:px-12 font-sans sticky top-0 z-30 shadow-subtle">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Brand Logo & Security Badge */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <a href="#home" className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="The Candle Lab Logo" className="h-8 sm:h-9 w-auto object-contain rounded-xs" />
            <span className="font-serif font-extrabold text-base sm:text-lg text-[#2A1E17] tracking-wider">
              THE CANDLE LAB
            </span>
          </a>
          <span className="h-4 w-px bg-[#E5D9C5] hidden sm:inline-block" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2E6F40] flex items-center gap-1">
            🔒 256-Bit SSL
          </span>
        </div>

        {/* Step Progress Tracker Stepper */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs font-bold uppercase tracking-wider">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;

            return (
              <button
                key={s.num}
                disabled={s.num > currentStep && !isCompleted}
                onClick={() => onStepClick(s.num as CheckoutStep)}
                className={`flex items-center gap-1.5 transition-colors shrink-0 ${isActive ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-0.5' : isCompleted ? 'text-[#2A1E17] hover:text-[#D4AF37]' : 'text-[#A68B75] cursor-not-allowed'}`}
              >
                <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${isActive ? 'bg-[#D4AF37] text-[#1C130E]' : isCompleted ? 'bg-[#2A1E17] text-[#FAF6F0]' : 'bg-[#E5D9C5] text-[#8C7A6B]'}`}>
                  {isCompleted ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline-block">{s.title}</span>
                <span className="sm:hidden text-[11px] font-bold">{isActive ? s.short : ''}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
