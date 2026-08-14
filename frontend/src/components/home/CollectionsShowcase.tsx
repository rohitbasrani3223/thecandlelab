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
    <section className="py-16 sm:py-24 bg-[#F5EEE4] border-b border-[#E5DAC7] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>CURATED SPOTLIGHTS</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#241812]">
            Signature Collection Spotlight
          </h2>
          <p className="text-sm text-[#5E4E42] leading-relaxed">
            Discover two distinct olfactory journeys formulated for atmosphere, serenity, and warmth.
          </p>
        </div>

        {/* Dual Split Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Banner 1: Coffee Collection */}
          <div className="bg-[#241812] text-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-[#3E3027] shadow-[0_16px_36px_rgba(36,24,18,0.14)] flex flex-col justify-between min-h-[390px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#C5983A]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
                alt="Coffee Notes"
                className="w-48 h-48 object-cover rounded-tl-full"
              />
            </div>

            <div className="space-y-4 relative z-10">
              <span className="bg-[#C5983A] text-[#180F0A] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                ☕ COFFEE ATELIER COLLECTION
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF7F2] leading-tight">
                Roasted Arabica & Dark Cacao
              </h3>
              <p className="text-xs sm:text-sm text-[#E5DAC7] leading-relaxed max-w-md">
                Evoke the energizing warmth of artisanal cafes with notes of rich roasted Arabica espresso beans, dark cacao, and smoked hazelnut.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between border-t border-[#3E3027]">
              <span className="text-xs font-bold text-[#DEB554]">Starting at ₹1,499.00</span>
              <Button
                variant="gold"
                size="md"
                className="bg-gradient-to-r from-[#DEB554] to-[#C5983A] text-[#180F0A] font-bold rounded-full shadow-subtle hover:scale-105 transition-all"
                onClick={handleShopClick}
              >
                Shop Coffee Collection →
              </Button>
            </div>
          </div>

          {/* Banner 2: Vanilla Collection */}
          <div className="bg-gradient-to-br from-[#180F0A] via-[#241812] to-[#3E3027] text-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-[#C5983A]/30 shadow-[0_16px_36px_rgba(36,24,18,0.14)] flex flex-col justify-between min-h-[390px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#DEB554]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
              <img
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80"
                alt="Vanilla Amber"
                className="w-48 h-48 object-cover rounded-tl-full"
              />
            </div>

            <div className="space-y-4 relative z-10">
              <span className="bg-[#C5983A] text-[#180F0A] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                🍦 VANILLA & AMBER LUXE
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#DEB554] leading-tight">
                Madagascar Vanilla & Bourbon
              </h3>
              <p className="text-xs sm:text-sm text-[#E5DAC7] leading-relaxed max-w-md">
                Hand-poured in champagne gold jars. Formulated with crushed Madagascar vanilla pods, warm oak bourbon, and sweet amber resin.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between border-t border-[#C5983A]/20">
              <span className="text-xs font-bold text-[#DEB554]">Starting at ₹1,599.00</span>
              <Button
                variant="gold"
                size="md"
                className="bg-gradient-to-r from-[#DEB554] to-[#C5983A] text-[#180F0A] font-bold rounded-full shadow-subtle hover:scale-105 transition-all"
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
