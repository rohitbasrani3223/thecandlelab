import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SparklesIcon, ShoppingBagIcon } from '../../design-system';
import { useCMS, type CMSHeroBannerSlide } from '../../context/CMSContext';

export interface HeroBannerProps {
  onNavigateToShop?: () => void;
  onNavigateToCollections?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigateToShop,
  onNavigateToCollections,
}) => {
  const { hero, heroSlides, settings, announcement } = useCMS();

  // Navigation handlers
  const handleExploreCollections = useCallback(() => {
    if (onNavigateToCollections) {
      onNavigateToCollections();
    } else {
      window.location.hash = '#collections';
    }
  }, [onNavigateToCollections]);

  const handleShopAll = useCallback(() => {
    if (onNavigateToShop) {
      onNavigateToShop();
    } else {
      window.location.hash = '#shop';
    }
  }, [onNavigateToShop]);

  // Compute active slides sorted by priority
  const activeSlides: CMSHeroBannerSlide[] = useMemo(() => {
    const valid = (heroSlides || [])
      .filter((s) => s.isActive && s.imageUrl)
      .sort((a, b) => (Number(a.priority) || 1) - (Number(b.priority) || 1));

    if (valid.length > 0) return valid;

    // Fallback if no active slides configured yet
    const fallbackImage = (hero.imageUrl && !hero.imageUrl.includes('unsplash.com/photo-1603006905003'))
      ? hero.imageUrl
      : '/hero_candle.png';

    return [
      {
        id: 'default-hero-1',
        name: hero.title || 'The Candle Lab Artisanal Candles',
        imageUrl: fallbackImage,
        mobileImageUrl: hero.mobileImageUrl || '',
        priority: 1,
        deeplink: '#shop',
        isActive: true,
      },
    ];
  }, [heroSlides, hero]);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Safeguard index if slides length changes
  const safeIndex = currentIndex >= activeSlides.length ? 0 : currentIndex;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-play timer with 5.5s duration
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;
    const interval = setInterval(goToNext, 5500);
    return () => clearInterval(interval);
  }, [activeSlides.length, isPaused, goToNext]);

  // Touch swipe support for mobile/tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    if (diffX > 45) {
      goToNext();
    } else if (diffX < -45) {
      goToPrev();
    }
    setTouchStartX(null);
  };

  // Handle slide click to navigate via deeplink
  const handleSlideClick = (slide: CMSHeroBannerSlide) => {
    const link = slide.deeplink?.trim();
    if (!link) {
      handleShopAll();
      return;
    }

    if (link === '#collections' || link.startsWith('#collections')) {
      handleExploreCollections();
    } else if (link === '#shop' || link.startsWith('#shop')) {
      handleShopAll();
    } else if (link.startsWith('#')) {
      window.location.hash = link;
    } else if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = link;
    }
  };

  const primaryBtnText = hero.primaryBtnText?.trim() || 'Explore Collections';
  const secondaryBtnText = hero.secondaryBtnText?.trim() || 'Shop All';

  // Ribbon info derived from CMS hero & store settings (100% editable)
  const ribbonShippingTitle = hero.ribbonShippingText?.trim() || 'Express Delivery Across India';
  const ribbonShippingSubtitle = hero.ribbonShippingSubtext?.trim() || (settings.freeShippingThreshold ? `Above ₹${settings.freeShippingThreshold}` : 'Dispatched in 24h');
  const couponDiscount = announcement.discountText?.trim() || '';
  const couponCode = announcement.couponCode?.trim() || '';
  const hasActiveCoupon = Boolean(announcement.visible && couponCode);

  return (
    <section className="relative w-full max-w-full overflow-hidden font-sans">
      {/* 1. Main Hero Carousel Container */}
      <div
        className="relative w-full overflow-hidden bg-[#141211] group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Presentation Layer - 100% Responsive, Zero Cropping, Full Visual Fidelity */}
        <div className="relative w-full overflow-hidden bg-[#141211]">
          {activeSlides.map((slide, idx) => {
            const isCurrent = idx === safeIndex;
            const slideDesktopImg = slide.imageUrl || '/hero_candle.png';
            const slideMobileImg = slide.mobileImageUrl || '';

            return (
              <div
                key={slide.id}
                onClick={() => handleSlideClick(slide)}
                className={`w-full cursor-pointer transition-opacity duration-1000 ease-in-out ${isCurrent
                  ? 'relative z-10 opacity-100 block'
                  : 'absolute inset-0 z-0 opacity-0 pointer-events-none'
                  }`}
              >
                <picture className="w-full block">
                  {slideMobileImg && (
                    <source media="(max-width: 639px)" srcSet={slideMobileImg} />
                  )}
                  <img
                    src={slideDesktopImg}
                    alt={slide.name || 'The Candle Lab Artisanal Candles'}
                    className="w-full h-auto block object-cover sm:object-cover object-center filter brightness-100 contrast-[1.02] transition-transform duration-700 ease-out select-none"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/hero_candle.png';
                    }}
                  />
                </picture>

                {/* Ambient edge blend gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>

        {/* Soft bottom edge blend to transition smoothly into the ticker */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141211]/50 via-transparent to-black/10 pointer-events-none z-15" />

        {/* Slide Pagination Dots / Indicator Bars */}
        {activeSlides.length > 1 && (
          <div
            className="absolute bottom-12 xs:bottom-14 sm:bottom-18 md:bottom-20 left-1/2 -translate-x-1/2 z-25 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            {activeSlides.map((slide, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${isActive
                    ? 'w-5 sm:w-7 bg-[#B88B38] shadow-[0_0_8px_rgba(184,139,56,0.9)]'
                    : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/80'
                    }`}
                />
              );
            })}
          </div>
        )}

        {/* Floating Frosted Glass Capsule with Action Buttons */}
        <div
          className="absolute bottom-2.5 xs:bottom-3 sm:bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-25 w-auto max-w-[95%] px-1 sm:px-2 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-row items-center justify-center gap-1.5 xs:gap-2 sm:gap-3.5 p-1 xs:p-1.5 sm:p-2 rounded-full bg-black/55 backdrop-blur-md border border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
            <button
              type="button"
              id="hero-explore-collections-btn"
              onClick={handleExploreCollections}
              className="group/btn bg-[#8B6F4E] hover:bg-[#A88E72] active:bg-[#735A3D] text-white font-bold text-[10px] xs:text-[11px] sm:text-xs md:text-sm tracking-wider uppercase px-3 xs:px-4 sm:px-7 py-1.5 xs:py-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg cursor-pointer whitespace-nowrap"
            >
              <SparklesIcon size={14} className="text-[#F5EFE6] transition-transform duration-300 group-hover/btn:rotate-12 shrink-0 hidden xs:inline-block" />
              <span>{primaryBtnText}</span>
            </button>

            <button
              type="button"
              id="hero-shop-all-btn"
              onClick={handleShopAll}
              className="group/btn bg-white/20 hover:bg-white text-white hover:text-[#181615] border border-white/40 font-bold text-[10px] xs:text-[11px] sm:text-xs md:text-sm tracking-wider uppercase px-3 xs:px-4 sm:px-7 py-1.5 xs:py-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg cursor-pointer whitespace-nowrap backdrop-blur-sm"
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

      {/* 3. Patti 2: Static Info Ribbon right below Patti 1 (100% Editable via CMS) */}
      <div className="w-full bg-[#221E1B] border-b border-[#362E29] py-2 sm:py-2.5 px-3 sm:px-4 text-center z-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-1.5 text-[10px] xs:text-[11px] sm:text-xs text-[#EADDCB] font-medium tracking-wide">
          <div className="inline-flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm">🚚</span>
            <span className="font-semibold text-white">{ribbonShippingTitle}</span>
            {ribbonShippingSubtitle && (
              <span className="text-[#C8B199] hidden xs:inline">• {ribbonShippingSubtitle}</span>
            )}
          </div>

          {hasActiveCoupon && (
            <>
              <span className="text-[#8B6F4E] text-[10px] opacity-70">✦</span>

              <div className="inline-flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm">🏷️</span>
                {couponDiscount && <span className="font-semibold text-white">{couponDiscount}</span>}
                <span className="text-[#C8B199] hidden xs:inline">Code:</span>
                <span className="px-1.5 py-0.5 rounded bg-[#8B6F4E]/30 border border-[#8B6F4E]/60 text-[#FAF7F2] font-mono font-bold text-[9px] xs:text-[10px] sm:text-xs tracking-wider">
                  {couponCode}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
