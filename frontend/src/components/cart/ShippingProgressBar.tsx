import React from 'react';

export interface ShippingProgressBarProps {
  currentSubtotal: number;
  threshold?: number;
}

export const ShippingProgressBar: React.FC<ShippingProgressBarProps> = ({
  currentSubtotal,
  threshold = 999.0,
}) => {
  const remaining = Math.max(0, threshold - currentSubtotal);
  const percentage = Math.min(100, (currentSubtotal / threshold) * 100);
  const isUnlocked = remaining === 0;

  return (
    <div className="bg-[#FFFFFF] border border-[#EADDCB] p-4 rounded-2xl space-y-2.5 font-sans shadow-xs">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-[#232323]">
          {isUnlocked ? (
            <strong className="text-[#15803D] flex items-center gap-1.5">
              <span>🎉</span> Congratulations! You unlocked FREE Atelier Express Shipping
            </strong>
          ) : (
            <span>
              Add <strong className="text-[#8B6F4E]">₹{remaining.toFixed(0)}</strong> more to unlock <strong className="text-[#232323]">Free Atelier Express Shipping</strong>
            </span>
          )}
        </span>
        <span className="text-[11px] font-bold text-[#7D6F63]">{percentage.toFixed(0)}%</span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden relative border border-[#EADDCB]">
        <div
          className={`h-full transition-all duration-500 rounded-full ${isUnlocked ? 'bg-[#15803D]' : 'bg-gradient-to-r from-[#EADDCB] via-[#8B6F4E] to-[#745A3D] shadow-[0_0_10px_rgba(249,184,202,0.6)]'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
