import React, { useState } from 'react';
import { CloseIcon, SparklesIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export const AnnouncementBar: React.FC = () => {
  const { announcement } = useCMS();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !announcement.visible) return null;

  return (
    <div className="bg-[#1C130E] text-[#FAF6F0] border-b border-[#3D2C22] py-2 px-4 text-xs font-sans relative z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side Tag */}
        <div className="hidden sm:flex items-center gap-1.5 text-[#B88B38] font-bold text-[11px] uppercase tracking-wider">
          <SparklesIcon size={12} />
          <span>ATELIER PROMO</span>
        </div>

        {/* Center Animated Announcement Text */}
        <div className="flex-1 text-center font-medium tracking-wide truncate px-2 text-[11px] text-[#FAF6F0]">
          <span>{announcement.text} </span>
          <span className="font-mono font-bold text-[#B88B38] underline px-1">{announcement.couponCode}</span>
          <span> {announcement.discountText}</span>
        </div>

        {/* Right Side: Close Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVisible(false)}
            className="text-[#8C7A6B] hover:text-[#FAF6F0] transition-colors p-0.5"
            aria-label="Close Announcement Bar"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
