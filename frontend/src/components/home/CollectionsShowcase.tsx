import React from 'react';
import { Button, Badge, SparklesIcon } from '../../design-system';

export interface CollectionsShowcaseProps {
  onNavigateToShop?: () => void;
}

export const CollectionsShowcase: React.FC<CollectionsShowcaseProps> = ({ onNavigateToShop }) => {
  const handleShopClick = () => {
    if (onNavigateToShop) {
      onNavigateToShop();
    } else {
      window.location.hash = '#shop';
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>CURATED SPOTLIGHTS</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1E17]">
            Featured 8 Collections
          </h2>
          <p className="text-sm text-[#69574A]">
            Discover two distinct olfactory journeys formulated for atmosphere and serenity.
          </p>
        </div>

        {/* Dual Split Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Banner 1: Coffee Collection */}
          <div className="bg-[#2C1E16] text-[#FAF6F0] rounded-2xl p-8 sm:p-12 border border-[#4A3B32] shadow-card flex flex-col justify-between min-h-[380px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B88B38]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <span className="bg-[#B88B38] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                ☕ COFFEE COLLECTION
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF6F0] leading-tight">
                Roasted Arabica & Dark Cacao
              </h3>
              <p className="text-xs sm:text-sm text-[#E5D9C5] leading-relaxed max-w-md">
                Evoke the energizing warmth of artisanal cafes with notes of rich roasted Arabica espresso beans, dark cacao, and smoked hazelnut.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between border-t border-[#4A3B32]">
              <span className="text-xs font-bold text-[#B88B38]">Starting at ₹1,299.00</span>
              <Button
                variant="gold"
                size="md"
                className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold"
                onClick={handleShopClick}
              >
                Shop Coffee Collection →
              </Button>
            </div>
          </div>

          {/* Banner 2: Vanilla Collection */}
          <div className="bg-gradient-to-br from-[#1C130E] via-[#2C1E16] to-[#3D2C22] text-[#FAF6F0] rounded-2xl p-8 sm:p-12 border border-[#B88B38]/40 shadow-card flex flex-col justify-between min-h-[380px] relative overflow-hidden group">
            <div className="space-y-4 relative z-10">
              <span className="bg-[#B88B38] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                🍦 VANILLA COLLECTION
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#D4AF37] leading-tight">
                Madagascar Vanilla & Bourbon
              </h3>
              <p className="text-xs sm:text-sm text-[#E5D9C5] leading-relaxed max-w-md">
                Hand-poured in champagne gold jars. Formulated with crushed Madagascar vanilla pods, warm bourbon, and sweet amber resin.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between border-t border-[#B88B38]/30">
              <span className="text-xs font-bold text-[#B88B38]">Starting at ₹1,499.00</span>
              <Button
                variant="gold"
                size="md"
                className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold"
                onClick={handleShopClick}
              >
                Shop Vanilla Collection →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
