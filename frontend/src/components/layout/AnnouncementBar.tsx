import React, { useState, useEffect } from 'react';
import { CloseIcon, ChevronDownIcon, SparklesIcon } from '../../design-system';

const announcements = [
  "✨ Complimentary Gold Foil Gift Packaging on Orders Over $150",
  "🚚 Free Express Shipping Nationwide on All Signature Collections",
  "🎁 Special Offer: Buy 2 Candles & Receive a Free Rosewood Wick Trimmer (Use Code: LUXURY)",
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currency, setCurrency] = useState('USD ($)');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-[#1C130E] text-[#FAF6F0] border-b border-[#3D2C22] py-2 px-4 text-xs font-sans relative z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Currency Selector */}
        <div className="hidden sm:flex items-center gap-2 relative">
          <button
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
            className="flex items-center gap-1 text-[#D4C3AA] hover:text-[#E6CA65] transition-colors focus:outline-none tracking-wider text-[11px]"
          >
            <span>{currency}</span>
            <ChevronDownIcon size={12} />
          </button>

          {isCurrencyOpen && (
            <div className="absolute left-0 top-full mt-1 bg-[#2A1E17] border border-[#4A3B32] rounded-xs shadow-card py-1 w-24 z-50 animate-fade-in">
              {['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setCurrency(curr);
                    setIsCurrencyOpen(false);
                  }}
                  className="w-full text-left px-3 py-1 text-[11px] text-[#E5D9C5] hover:bg-[#3D2C22] hover:text-[#E6CA65]"
                >
                  {curr}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Rotating Ticker Message */}
        <div className="flex-1 text-center overflow-hidden flex items-center justify-center min-h-[20px]">
          <div key={currentIndex} className="animate-fade-in inline-flex items-center gap-1.5 font-medium tracking-wide">
            <span className="text-[#D4AF37] shrink-0"><SparklesIcon size={13} /></span>
            <span className="truncate max-w-xs sm:max-w-xl text-[#FAF6F0]">{announcements[currentIndex]}</span>
          </div>
        </div>

        {/* Right Side: Quick Action & Close */}
        <div className="flex items-center gap-3">
          <a
            href="#seasonal-promo"
            className="hidden md:inline-block text-[#D4AF37] hover:underline text-[11px] font-semibold uppercase tracking-wider"
          >
            Shop Offers →
          </a>
          <button
            onClick={() => setIsVisible(false)}
            className="text-[#8C7A6B] hover:text-[#FAF6F0] p-0.5 rounded-xs transition-colors"
            aria-label="Dismiss Announcement"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
