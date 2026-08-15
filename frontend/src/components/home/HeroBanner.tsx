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
    <section className="relative w-full max-w-full bg-[#140B10] border-b border-[#2C1D25] overflow-hidden py-16 sm:py-28 lg:py-32 font-sans text-white">
      {/* 1. Full-Bleed High Quality Background Photography Layer with Parallax */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-100 ease-out z-0 scale-105"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      >
        <img
          src={heroBgImage}
          alt="Atelier Sanctuary"
          className="w-full h-full object-cover opacity-80 filter brightness-95 contrast-105"
        />
        {/* Luxury Vignette & Subtle Soft Pink / Noir Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#140B10]/70 via-[#140B10]/30 to-[#140B10]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#140B10]/50 via-transparent to-[#140B10]/50" />
      </div>

      {/* 2. Floating Rose Gold & Candle Flame Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] sm:max-w-[600px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-[#F9B8CA]/25 via-[#E8C86D]/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* 3. Hero Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-9">
          {/* Tagline Badge */}
          <div className="inline-flex max-w-full flex-wrap justify-center items-center gap-1.5 sm:gap-2 bg-[#1C1217]/80 backdrop-blur-md px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-[#F9B8CA]/40 shadow-[0_0_24px_rgba(249,184,202,0.3)]">
            <Badge variant="pink" size="sm" icon={<SparklesIcon size={12} />}>{heroTagline}</Badge>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#FCD5E2] font-semibold">
              • 2026 Atelier Reserve
            </span>
          </div>

          {/* Main Centered Heading */}
          <h1 className="text-2xl sm:text-5xl lg:text-7xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#FFF0F4] to-[#F9B8CA] leading-[1.12] sm:leading-[1.08] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] break-words">
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-lg text-[#FCD5E2] max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md px-2">
            {heroSubtitle}
          </p>

          {/* Soft Pill CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full max-w-md mx-auto sm:max-w-none">
            <Button
              variant="pink"
              size="lg"
              className="w-full sm:w-auto font-extrabold rounded-full px-7 sm:px-9 py-3.5 sm:py-4 shadow-[0_0_30px_rgba(249,184,202,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-sm sm:text-base"
              leftIcon={<SparklesIcon size={18} />}
              onClick={() => {
                const el = document.getElementById('best-sellers') || document.getElementById('shop');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.location.hash = '#shop';
              }}
            >
              {heroPrimaryBtn}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-[#1C1217]/60 backdrop-blur-md border border-[#F9B8CA]/60 text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#1C1217] hover:border-[#FFFFFF] rounded-full px-7 sm:px-9 py-3.5 sm:py-4 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg text-sm sm:text-base"
              leftIcon={<CandleIcon size={18} className="text-[#F9B8CA]" />}
              onClick={() => {
                const el = document.getElementById('scent-quiz-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.location.hash = '#collections';
              }}
            >
              {heroSecondaryBtn}
            </Button>
          </div>

          {/* Bottom Highlights Bar */}
          <div className="pt-6 sm:pt-10 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center max-w-4xl mx-auto w-full">
            <div className="bg-[#1C1217]/70 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#F9B8CA]/25 shadow-xl">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F9B8CA] block">100% Soy Wax</span>
              <span className="text-[9px] sm:text-[11px] text-[#FCD5E2]/80">Clean & Non-Toxic</span>
            </div>
            <div className="bg-[#1C1217]/70 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#F9B8CA]/25 shadow-xl">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F9B8CA] block">Essential Oils</span>
              <span className="text-[9px] sm:text-[11px] text-[#FCD5E2]/80">IFRA Certified</span>
            </div>
            <div className="bg-[#1C1217]/70 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#F9B8CA]/25 shadow-xl">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F9B8CA] block">Wood Wicks</span>
              <span className="text-[9px] sm:text-[11px] text-[#FCD5E2]/80">Crackling Flame</span>
            </div>
            <div className="bg-[#1C1217]/70 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#F9B8CA]/25 shadow-xl">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F9B8CA] block">Hand-Poured</span>
              <span className="text-[9px] sm:text-[11px] text-[#FCD5E2]/80">Small Batches</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Promo Ticker Ribbon */}
      <div className="bg-[#1C1217] border-t border-[#2C1D25] py-2 px-3 text-center text-[10px] sm:text-xs text-[#FCD5E2] font-semibold tracking-wider flex flex-wrap items-center justify-center gap-2 sm:gap-6 overflow-hidden w-full">
        <span>✨ Pan-India Free Delivery Above ₹1,499</span>
        <span className="hidden sm:inline text-[#F9B8CA]">✦</span>
        <span className="hidden sm:inline">🏷️ 10% OFF Code: <strong className="text-[#E8C86D]">SAVE10</strong></span>
        <span className="hidden md:inline text-[#F9B8CA]">✦</span>
        <span className="hidden md:inline">🎁 Complimentary Care Kit</span>
      </div>
    </section>
  );
};
