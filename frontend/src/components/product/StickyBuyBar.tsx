import React, { useState, useEffect } from 'react';
import { Button, useToast } from '../../design-system';

export interface StickyBuyBarProps {
  onAddToCart: () => void;
}

export const StickyBuyBar: React.FC<StickyBuyBarProps> = ({ onAddToCart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md text-[#1C1217] border-t border-[#F5E8EE] py-3 px-6 sm:px-12 shadow-modal animate-slide-up font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Product Thumbnail & Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF6F8] text-xl flex items-center justify-center border border-[#F5E8EE]">
            🕯️
          </div>
          <div className="hidden sm:block">
            <h4 className="font-serif font-bold text-sm text-[#1C1217] truncate max-w-xs">
              Velvet Rose & Smoked Amber
            </h4>
            <span className="text-[10px] text-[#E87A96] uppercase tracking-wider font-semibold">
              12 oz Glass Vessel • Organic Wood Wick
            </span>
          </div>
        </div>

        {/* Right Price & Add CTA */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-sm font-bold text-[#1C1217] block">₹1,499</span>
            <span className="text-[10px] text-[#15803D] font-semibold">✓ In Stock</span>
          </div>

          <Button
            variant="pink"
            size="md"
            onClick={() => {
              onAddToCart();
              toast({ type: 'luxury', title: 'Added to Bag', description: 'Velvet Rose & Smoked Amber (₹1,499)' });
            }}
          >
            Add to Bag
          </Button>
        </div>
      </div>
    </div>
  );
};
