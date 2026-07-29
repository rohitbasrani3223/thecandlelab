import React from 'react';

export interface ShippingProgressBarProps {
  currentSubtotal: number;
  threshold?: number;
}

export const ShippingProgressBar: React.FC<ShippingProgressBarProps> = ({
  currentSubtotal,
  threshold = 150.0,
}) => {
  const remaining = Math.max(0, threshold - currentSubtotal);
  const percentage = Math.min(100, (currentSubtotal / threshold) * 100);
  const isUnlocked = remaining === 0;

  return (
    <div className="bg-[#FAF6F0] border border-[#E5D9C5] p-4 rounded-md space-y-2.5 font-sans">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-[#d3d3d3]">
          {isUnlocked ? (
            <strong className="text-[#2E6F40] flex items-center gap-1.5">
              <span>🎉</span> Congratulations! You unlocked FREE Gold Express Shipping
            </strong>
          ) : (
            <span>
              Add <strong className="text-[#9b9890]">${remaining.toFixed(2)}</strong> more to unlock <strong className="text-[#2A1E17]">Free Gold Express Shipping</strong>
            </span>
          )}
        </span>
        <span className="text-[11px] font-bold text-[#8C7A6B]">{percentage.toFixed(0)}%</span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 bg-[#E5D9C5] rounded-full overflow-hidden relative shadow-inner">
        <div
          className={`h-full transition-all duration-500 rounded-full ${isUnlocked ? 'bg-[#2E6F40]' : 'bg-gradient-to-r from-[#D4AF37] to-[#E6CA65] shadow-[0_0_8px_rgba(212,175,55,0.6)]'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
