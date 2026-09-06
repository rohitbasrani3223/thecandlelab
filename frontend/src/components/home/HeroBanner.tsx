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

  const heroMobileBgImage = hero.mobileImageUrl || '';

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

  const primaryBtnText = hero.primaryBtnText?.trim() || 'Explore Collections';
  const secondaryBtnText = hero.secondaryBtnText?.trim() || 'Shop All';

  return (
    <section className="relative w-full max-w-full overflow-hidden font-sans">
      {/* 1. Hero Banner Image Container - Fully Responsive, 100% visible, Zero cropping */}
      <div
        className="relative w-full overflow-hidden bg-[#141211] group cursor-pointer"
        onClick={handleShopAll}
      >
        <picture className="w-full block">
          {heroMobileBgImage && (
            <source media="(max-width: 639px)" srcSet={heroMobileBgImage} />
          )}
          <img
            src={heroBgImage}
            alt={hero.title || 'The Candle Lab Artisanal Candles'}
            className={`w-full h-auto ${
              heroMobileBgImage
                ? 'max-sm:aspect-auto sm:aspect-[21/9]'
                : 'aspect-[21/9]'
            } object-cover object-center filter brightness-100 contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-[1.012] block`}
          />
        </picture>

        {/* Soft bottom edge blend to transition smoothly into the ticker */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141211]/50 via-transparent to-black/10 pointer-events-none" />

        {/* Floating Frosted Glass Capsule with the two action buttons */}
        <div
          className="absolute bottom-2.5 xs:bottom-3 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[95%] px-1 sm:px-2 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-row items-center justify-center gap-1.5 xs:gap-2 sm:gap-3.5 p-1 xs:p-1.5 sm:p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.65)]">
            <button
              type="button"
              id="hero-explore-collections-btn"
              onClick={handleExploreCollections}
              className="group/btn bg-[#8B6F4E] hover:bg-[#A88E72] active:bg-[#735A3D] text-white font-bold text-[10px] xs:text-[11px] sm:text-xs md:text-sm tracking-wider uppercase px-3 xs:px-4 sm:px-7 py-1.5 xs:py-2 sm:py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg cursor-pointer whitespace-nowrap"
            >
              <SparklesIcon size={14} className="text-[#F5EFE6] transition-transform duration-300 group-hover/btn:rotate-12 shrink-0 hidden xs:inline-block" />
              <span>{primaryBtnText}</span>
            </button>

            <button
              type="button"
              id="hero-shop-all-btn"
              onClick={handleShopAll}
              className="group/btn bg-white/20 hover:bg-white text-white hover:text-[#181615] border border-white/40 font-bold text-[10px] xs:text-[11px] sm:text-xs md:text-sm tracking-wider uppercase px-3 xs:px-4 sm:px-7 py-1.5 xs:py-2 sm:py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <ShoppingBagIcon size={14} className="transition-transform duration-300 group-hover/btn:scale-110 shrink-0 hidden xs:inline-block" />
              <span>{secondaryBtnText}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Patti 1: Running/Scrolling Infinite Marquee Strip */}
      <div className="relative w-full bg-[#181615] border-y border-[#2E2722] py-2 xs:py-2.5 sm:py-3.5 overflow-hidden select-none z-10">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {[0, 1].map((copyIdx) => (
            <div key={copyIdx} className="flex items-center gap-6 xs:gap-8 sm:gap-12 shrink-0 pr-6 xs:pr-8 sm:pr-12">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm">
                <span className="text-sm sm:text-base">🌿</span>
                <span className="font-bold text-[#FAF7F2] uppercase tracking-wider">100% Pure Soy Wax</span>
                <span className="text-[#C8B199] hidden sm:inline">• Clean & Non-Toxic Burn</span>
              </div>
              <span className="text-[#8B6F4E] text-xs">✦</span>

              <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm">
                <span className="text-sm sm:text-base">🌸</span>
                <span className="font-bold text-[#FAF7F2] uppercase tracking-wider">Botanical Essential Oils</span>
                <span className="text-[#C8B199] hidden sm:inline">• IFRA Certified Aromatherapy</span>
              </div>
              <span className="text-[#8B6F4E] text-xs">✦</span>

              <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm">
                <span className="text-sm sm:text-base">🪵</span>
                <span className="font-bold text-[#FAF7F2] uppercase tracking-wider">Natural Wood Wicks</span>
                <span className="text-[#C8B199] hidden sm:inline">• Dual Crackling Flame</span>
              </div>
              <span className="text-[#8B6F4E] text-xs">✦</span>

              <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm">
                <span className="text-sm sm:text-base">♻️</span>
                <span className="font-bold text-[#FAF7F2] uppercase tracking-wider">Eco-Friendly & Sustainable</span>
                <span className="text-[#C8B199] hidden sm:inline">• Recyclable Artisanal Glass</span>
              </div>
              <span className="text-[#8B6F4E] text-xs">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Patti 2: Static Info Ribbon right below Patti 1 */}
      <div className="w-full bg-[#221E1B] border-b border-[#362E29] py-2 sm:py-2.5 px-3 sm:px-4 text-center z-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-3 xs:gap-x-4 sm:gap-x-8 gap-y-1.5 text-[10px] xs:text-[11px] sm:text-xs text-[#EADDCB] font-medium tracking-wide">
          <div className="inline-flex items-center gap-1 sm:gap-1.5">
            <span className="text-xs sm:text-sm">🚚</span>
            <span className="font-semibold text-white">Free Pan-India Delivery</span>
            <span className="text-[#C8B199] hidden xs:inline">Above ₹999</span>
          </div>
          <span className="text-[#8B6F4E] text-[10px] opacity-70">✦</span>

          <div className="inline-flex items-center gap-1 sm:gap-1.5">
            <span className="text-xs sm:text-sm">🏷️</span>
            <span className="font-semibold text-white">10% OFF</span>
            <span className="text-[#C8B199] hidden xs:inline">Code:</span>
            <span className="px-1.5 py-0.5 rounded bg-[#8B6F4E]/30 border border-[#8B6F4E]/60 text-[#FAF7F2] font-mono font-bold text-[9px] xs:text-[10px] sm:text-xs tracking-wider">
              SAVE10
            </span>
          </div>
          <span className="text-[#8B6F4E] text-[10px] opacity-70">✦</span>

          <div className="inline-flex items-center gap-1 sm:gap-1.5">
            <span className="text-xs sm:text-sm">🎁</span>
            <span className="font-semibold text-white">Complimentary</span>
            <span className="text-[#C8B199]">Gift Packaging</span>
          </div>
        </div>
      </div>
    </section>
  );
};
