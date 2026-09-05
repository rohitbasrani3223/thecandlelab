import React from 'react';
import { SparklesIcon, ShoppingBagIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface HeroBannerProps {
  onNavigateToShop?: () => void;
  onNavigateToCollections?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigateToShop,
  onNavigateToCollections,
}) => {
  const { hero } = useCMS();

  const heroBgImage = (hero.imageUrl && !hero.imageUrl.includes('unsplash.com/photo-1603006905003'))
    ? hero.imageUrl
    : '/hero_candle.png';

  const handleExploreCollections = () => {
    if (onNavigateToCollections) {
      onNavigateToCollections();
    } else {
      window.location.hash = '#collections';
    }
  };

  const handleShopAll = () => {
    if (onNavigateToShop) {
      onNavigateToShop();
    } else {
      window.location.hash = '#shop';
    }
  };

  return (
    <section className="relative w-full max-w-full overflow-hidden font-sans">
      {/* 1. Hero Banner Image Container - Clear, crisp, full visibility */}
      <div className="relative w-full h-[52vh] min-h-[380px] sm:h-[65vh] sm:min-h-[480px] md:h-[72vh] md:min-h-[540px] lg:h-[78vh] lg:min-h-[600px] max-h-[760px] bg-[#141211] overflow-hidden group">
        <img
          src={heroBgImage}
          alt="The Candle Lab Artisanal Candles"
          className="w-full h-full object-cover object-center filter brightness-100 contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Soft bottom edge blend to transition smoothly into the ticker */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141211]/70 via-transparent to-black/20 pointer-events-none" />

        {/* Floating Frosted Glass Capsule with slight blur for the two buttons ONLY */}
        <div className="absolute bottom-6 sm:bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[92%] px-2">
          <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 p-2 sm:p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
            <button
              type="button"
              id="hero-explore-collections-btn"
              onClick={handleExploreCollections}
              className="group/btn bg-[#8B6F4E] hover:bg-[#A88E72] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
            >
              <SparklesIcon size={16} className="text-[#F5EFE6] transition-transform duration-300 group-hover/btn:rotate-12" />
              <span>Explore Collections</span>
            </button>

            <button
              type="button"
              id="hero-shop-all-btn"
              onClick={handleShopAll}
              className="group/btn bg-white/20 hover:bg-white text-white hover:text-[#181615] border border-white/40 font-bold text-xs sm:text-sm tracking-wider uppercase px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <ShoppingBagIcon size={16} className="transition-transform duration-300 group-hover/btn:scale-110" />
              <span>Shop All</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Patti 1: Running/Scrolling Infinite Marquee Strip */}
      <div className="relative w-full bg-[#181615] border-y border-[#2E2722] py-3.5 overflow-hidden select-none z-10">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {[0, 1].map((copyIdx) => (
            <div key={copyIdx} className="flex items-center gap-8 sm:gap-12 shrink-0 pr-8 sm:pr-12">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-base sm:text-lg">🌿</span>
                <span className="font-bold text-[#FAF7F2] uppercase tracking-wider">100% Pure Soy Wax</span>
                <span className="text-[#C8B199] hidden sm:inline">• Clean & Non-Toxic Burn</span>
              </div>
              <span className="text-[#8B6F4E] text-xs">✦</span>

              <div className="inline-flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-base sm:text-lg">🌸</span>
                <span className="font-bold text-[#FAF7F2] uppercase tracking-wider">Botanical Essential Oils</span>
                <span className="text-[#C8B199] hidden sm:inline">• IFRA Certified Aromatherapy</span>
              </div>
              <span className="text-[#8B6F4E] text-xs">✦</span>

              <div className="inline-flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-base sm:text-lg">🪵</span>
                <span className="font-bold text-[#FAF7F2] uppercase tracking-wider">Natural Wood Wicks</span>
                <span className="text-[#C8B199] hidden sm:inline">• Dual Crackling Flame</span>
              </div>
              <span className="text-[#8B6F4E] text-xs">✦</span>

              <div className="inline-flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-base sm:text-lg">♻️</span>
                <span className="font-bold text-[#FAF7F2] uppercase tracking-wider">Eco-Friendly & Sustainable</span>
                <span className="text-[#C8B199] hidden sm:inline">• Recyclable Artisanal Glass</span>
              </div>
              <span className="text-[#8B6F4E] text-xs">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Patti 2: Static Info Ribbon right below Patti 1 */}
      <div className="w-full bg-[#221E1B] border-b border-[#362E29] py-2.5 px-4 text-center z-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2 text-[11px] sm:text-xs text-[#EADDCB] font-medium tracking-wide">
          <div className="inline-flex items-center gap-1.5">
            <span className="text-sm">🚚</span>
            <span className="font-semibold text-white">Pan-India Free Delivery</span>
            <span className="text-[#C8B199]">Above ₹999</span>
          </div>
          <span className="hidden sm:inline text-[#8B6F4E]">✦</span>

          <div className="inline-flex items-center gap-1.5">
            <span className="text-sm">🏷️</span>
            <span className="font-semibold text-white">Flat 10% OFF</span>
            <span className="text-[#C8B199]">Use Code:</span>
            <span className="px-2 py-0.5 rounded bg-[#8B6F4E]/30 border border-[#8B6F4E]/60 text-[#FAF7F2] font-mono font-bold text-[10px] sm:text-xs tracking-wider">
              SAVE10
            </span>
          </div>
          <span className="hidden sm:inline text-[#8B6F4E]">✦</span>

          <div className="inline-flex items-center gap-1.5">
            <span className="text-sm">🎁</span>
            <span className="font-semibold text-white">Complimentary</span>
            <span className="text-[#C8B199]">Premium Gift Packaging</span>
          </div>
        </div>
      </div>
    </section>
  );
};
