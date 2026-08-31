import React, { useState } from 'react';
import { CloseIcon, SparklesIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export const AnnouncementBar: React.FC = () => {
  const { announcement } = useCMS();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !announcement.visible) return null;

  return (
    <div className="bg-[#1F1D1B] text-[#FAF7F2] border-b border-[#2C2623] py-2 px-4 text-xs font-sans relative z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side Tag */}
        <div className="hidden sm:flex items-center gap-1.5 text-[#EADDCB] font-bold text-[11px] uppercase tracking-wider">
          <SparklesIcon size={12} className="text-[#C8A75A]" />
          <span>FREE SHIPPING</span>
        </div>

        {/* Center Animated Announcement Text */}
        <div className="flex-1 text-center font-medium tracking-wide truncate px-2 text-[11px] text-[#FFFFFF]">
          <span>{announcement.text || 'FREE SHIPPING ON ORDERS ABOVE ₹999'} </span>
          {announcement.couponCode && (
            <span className="font-mono font-bold text-[#C8A75A] bg-[#2C2623] px-2 py-0.5 rounded-sm mx-1 border border-[#C8A75A]/30">{announcement.couponCode}</span>
          )}
          {announcement.discountText && (
            <span className="text-[#EADDCB]"> {announcement.discountText}</span>
          )}
        </div>

        {/* Right Side: Close Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVisible(false)}
            className="text-[#A39486] hover:text-[#FFFFFF] transition-colors p-0.5 rounded-full"
            aria-label="Close Announcement Bar"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
