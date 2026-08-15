import React, { useState } from 'react';
import { CloseIcon, SparklesIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export const AnnouncementBar: React.FC = () => {
  const { announcement } = useCMS();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !announcement.visible) return null;

  return (
    <div className="bg-[#140B10] text-[#FFF6F8] border-b border-[#2C1D25] py-2 px-4 text-xs font-sans relative z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side Tag */}
        <div className="hidden sm:flex items-center gap-1.5 text-[#F9B8CA] font-bold text-[11px] uppercase tracking-wider">
          <SparklesIcon size={12} className="text-[#E8C86D]" />
          <span>ATELIER PROMO</span>
        </div>

        {/* Center Animated Announcement Text */}
        <div className="flex-1 text-center font-medium tracking-wide truncate px-2 text-[11px] text-[#FFFFFF]">
          <span>{announcement.text} </span>
          <span className="font-mono font-bold text-[#E8C86D] bg-[#2C1D25] px-2 py-0.5 rounded-sm mx-1 border border-[#E8C86D]/30">{announcement.couponCode}</span>
          <span className="text-[#FCD5E2]"> {announcement.discountText}</span>
        </div>

        {/* Right Side: Close Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVisible(false)}
            className="text-[#AC94A1] hover:text-[#FFFFFF] transition-colors p-0.5 rounded-full"
            aria-label="Close Announcement Bar"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
