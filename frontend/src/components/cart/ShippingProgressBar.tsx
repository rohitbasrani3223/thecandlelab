import React from 'react';

export interface ShippingProgressBarProps {
  currentSubtotal: number;
  threshold?: number;
}

export const ShippingProgressBar: React.FC<ShippingProgressBarProps> = ({
  currentSubtotal,
  threshold = 1499.0,
}) => {
  const remaining = Math.max(0, threshold - currentSubtotal);
  const percentage = Math.min(100, (currentSubtotal / threshold) * 100);
  const isUnlocked = remaining === 0;

  return (
    <div className="bg-[#FFFFFF] border border-[#F5E8EE] p-4 rounded-2xl space-y-2.5 font-sans shadow-xs">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-[#1C1217]">
          {isUnlocked ? (
            <strong className="text-[#15803D] flex items-center gap-1.5">
              <span>🎉</span> Congratulations! You unlocked FREE Atelier Express Shipping
            </strong>
          ) : (
            <span>
              Add <strong className="text-[#E87A96]">₹{remaining.toFixed(0)}</strong> more to unlock <strong className="text-[#1C1217]">Free Atelier Express Shipping</strong>
            </span>
          )}
        </span>
        <span className="text-[11px] font-bold text-[#886C7B]">{percentage.toFixed(0)}%</span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 bg-[#FFF6F8] rounded-full overflow-hidden relative border border-[#F5E8EE]">
        <div
          className={`h-full transition-all duration-500 rounded-full ${isUnlocked ? 'bg-[#15803D]' : 'bg-gradient-to-r from-[#F9B8CA] via-[#E87A96] to-[#D45D7D] shadow-[0_0_10px_rgba(249,184,202,0.6)]'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
