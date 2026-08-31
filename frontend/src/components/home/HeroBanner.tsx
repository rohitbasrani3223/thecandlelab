import React, { useState, useEffect } from 'react';
import { Button, Badge, SparklesIcon, CandleIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export const HeroBanner: React.FC = () => {
  const { hero } = useCMS();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroTagline = hero.tagline || 'HANDCRAFTED BOTANICAL SOY CANDLES';
  const heroTitle = hero.title || 'Illuminate Your Sanctuary With Pure Elegance';
  const heroSubtitle = hero.subtitle || 'Artisanal soy wax candles infused with fine botanical essential oils, hand-poured in small luxury batches.';
  const heroPrimaryBtn = hero.primaryBtnText || 'Explore Collections';
  const heroSecondaryBtn = hero.secondaryBtnText || 'Our Atelier Story';
  const heroBgImage = (hero.imageUrl && !hero.imageUrl.includes('unsplash.com/photo-1603006905003'))
    ? hero.imageUrl
    : '/hero_candle.png';

  return (
    <section className="relative w-full max-w-full bg-[#1F1D1B] border-b border-[#2C2623] overflow-hidden py-16 sm:py-28 lg:py-32 font-sans text-white">
      {/* 1. Full-Bleed High Quality Background Photography Layer with Parallax */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-100 ease-out z-0 scale-105"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      >
        <img
          src={heroBgImage}
          alt="The Candle Lab Atelier"
          className="w-full h-full object-cover opacity-75 filter brightness-95 contrast-105"
        />
        {/* Luxury Vignette & Warm Earth Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F1D1B]/75 via-[#1F1D1B]/35 to-[#1F1D1B]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F1D1B]/60 via-transparent to-[#1F1D1B]/60" />
      </div>

      {/* 2. Floating Warm Beige & Gold Candle Flame Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] sm:max-w-[600px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-[#EADDCB]/25 via-[#C8A75A]/20 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* 3. Hero Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-9">
          {/* Tagline Badge */}
          <div className="inline-flex max-w-full flex-wrap justify-center items-center gap-1.5 sm:gap-2 bg-[#232323]/85 backdrop-blur-md px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-[#EADDCB]/40 shadow-[0_0_24px_rgba(234,221,203,0.25)]">
            <Badge variant="gold" size="sm" icon={<SparklesIcon size={12} />}>{heroTagline}</Badge>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#EADDCB] font-semibold">
              • 100% PURE BOTANICAL SOY
            </span>
          </div>

          {/* Main Centered Heading */}
          <h1 className="text-2xl sm:text-5xl lg:text-7xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#FAF7F2] to-[#EADDCB] leading-[1.12] sm:leading-[1.08] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] break-words">
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-lg text-[#EADDCB]/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md px-2">
            {heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full max-w-md mx-auto sm:max-w-none">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-[#8B6F4E] hover:bg-[#745A3D] border-[#8B6F4E] text-white font-extrabold rounded-full px-8 sm:px-10 py-3.5 sm:py-4 shadow-[0_4px_24px_rgba(139,111,78,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-sm sm:text-base"
              leftIcon={<SparklesIcon size={18} />}
              onClick={() => {
                const el = document.getElementById('best-sellers') || document.getElementById('shop');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.location.hash = '#shop';
              }}
            >
              {heroPrimaryBtn || 'SHOP NOW'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-[#232323]/60 backdrop-blur-md border border-[#EADDCB]/60 text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#232323] hover:border-[#FFFFFF] rounded-full px-8 sm:px-10 py-3.5 sm:py-4 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg text-sm sm:text-base"
              leftIcon={<CandleIcon size={18} className="text-[#C8A75A]" />}
              onClick={() => {
                const el = document.getElementById('scent-quiz-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.location.hash = '#collections';
              }}
            >
              {heroSecondaryBtn || 'EXPLORE COLLECTION'}
            </Button>
          </div>

          {/* Bottom Highlights Bar */}
          <div className="pt-6 sm:pt-10 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center max-w-4xl mx-auto w-full">
            <div className="bg-[#232323]/75 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#EADDCB]/25 shadow-xl">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#EADDCB] block">100% Soy Wax</span>
              <span className="text-[9px] sm:text-[11px] text-[#DFCFBC]/80">Clean & Non-Toxic</span>
            </div>
            <div className="bg-[#232323]/75 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#EADDCB]/25 shadow-xl">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#C8A75A] block">Essential Oils</span>
              <span className="text-[9px] sm:text-[11px] text-[#DFCFBC]/80">IFRA Certified</span>
            </div>
            <div className="bg-[#232323]/75 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#EADDCB]/25 shadow-xl">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#EADDCB] block">Wood Wicks</span>
              <span className="text-[9px] sm:text-[11px] text-[#DFCFBC]/80">Dual Crackling</span>
            </div>
            <div className="bg-[#232323]/75 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#EADDCB]/25 shadow-xl">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#6B6E4A] block">Eco Friendly</span>
              <span className="text-[9px] sm:text-[11px] text-[#DFCFBC]/80">Sustainable Glass</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Promo Ticker Ribbon */}
      <div className="bg-[#1F1D1B] border-t border-[#2C2623] py-2.5 px-3 text-center text-[10px] sm:text-xs text-[#EADDCB] font-semibold tracking-wider flex flex-wrap items-center justify-center gap-2 sm:gap-6 overflow-hidden w-full">
        <span>✨ Pan-India Free Delivery Above ₹999</span>
        <span className="hidden sm:inline text-[#8B6F4E]">✦</span>
        <span className="hidden sm:inline">🏷️ 10% OFF Code: <strong className="text-[#C8A75A]">SAVE10</strong></span>
        <span className="hidden md:inline text-[#8B6F4E]">✦</span>
        <span className="hidden md:inline">🎁 Complimentary Premium Gift Packaging</span>
      </div>
    </section>
  );
};
