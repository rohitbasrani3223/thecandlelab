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
  const heroBgImage = hero.imageUrl || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1600&auto=format&fit=crop';

  return (
    <section className="relative w-full max-w-full bg-[#140D09] border-b border-[#3D2C22] overflow-hidden py-16 sm:py-28 lg:py-32 font-sans text-white">
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
          className="w-full h-full object-cover opacity-65 filter brightness-90 contrast-105"
        />
        {/* Luxury Vignette & Subtle Dim Overlay for Crisp Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#140D09]/75 via-[#140D09]/45 to-[#140D09]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#140D09]/60 via-transparent to-[#140D09]/60" />
      </div>

      {/* 2. Floating Gold Flame Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#B88B38]/25 via-[#E6CA65]/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* 3. Hero Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-7 sm:space-y-9">
          {/* Tagline Badge */}
          <div className="inline-flex max-w-full flex-wrap justify-center items-center gap-2 bg-[#1C130E]/70 backdrop-blur-md px-3.5 sm:px-5 py-2 rounded-full border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>{heroTagline}</Badge>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#E5D9C5] font-semibold">
              • 2026 Atelier Reserve
            </span>
          </div>

          {/* Main Centered Heading */}
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#FFF5E4] to-[#E5C384] leading-[1.08] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-xl text-[#E5D9C5] max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
            {heroSubtitle}
          </p>

          {/* Soft Pill CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <Button
              variant="gold"
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[#C59B43] via-[#E6CA65] to-[#B88B38] hover:from-[#D4AF37] hover:to-[#C59B43] text-[#1C130E] font-extrabold rounded-full px-8 py-4 shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
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
              className="w-full sm:w-auto bg-[#1C130E]/50 backdrop-blur-md border border-[#D4AF37]/60 text-[#F5E6CA] hover:bg-[#D4AF37] hover:text-[#1C130E] hover:border-[#D4AF37] rounded-full px-8 py-4 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              leftIcon={<CandleIcon size={18} className="text-[#D4AF37]" />}
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
          <div className="pt-8 sm:pt-10 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-center max-w-4xl mx-auto">
            <div className="bg-[#140D09]/70 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-[#D4AF37]/25 shadow-xl">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">100% Soy Wax</span>
              <span className="text-[10px] sm:text-[11px] text-[#E5D9C5]/80">Clean & Non-Toxic</span>
            </div>
            <div className="bg-[#140D09]/70 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-[#D4AF37]/25 shadow-xl">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">Essential Oils</span>
              <span className="text-[10px] sm:text-[11px] text-[#E5D9C5]/80">IFRA Certified</span>
            </div>
            <div className="bg-[#140D09]/70 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-[#D4AF37]/25 shadow-xl">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">Wood Wicks</span>
              <span className="text-[10px] sm:text-[11px] text-[#E5D9C5]/80">Crackling Flame</span>
            </div>
            <div className="bg-[#140D09]/70 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-[#D4AF37]/25 shadow-xl">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">Hand-Poured</span>
              <span className="text-[10px] sm:text-[11px] text-[#E5D9C5]/80">Small Batches</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Promo Ticker Ribbon (like scentandchill.in bottom bar!) */}
      <div className="bg-[#1F140D] border-t border-[#3D2C22] py-2.5 px-4 text-center text-xs text-[#E5D9C5] font-semibold tracking-wider flex items-center justify-center gap-6 overflow-hidden">
        <span>✨ Pan-India Free Delivery on Orders Above ₹1,499</span>
        <span className="hidden sm:inline text-[#D4AF37]">✦</span>
        <span className="hidden sm:inline">🏷️ 10% OFF Code: <strong className="text-[#D4AF37]">SAVE10</strong></span>
        <span className="hidden md:inline text-[#D4AF37]">✦</span>
        <span className="hidden md:inline">🎁 Complimentary Care Kit with Every Order</span>
      </div>
    </section>
  );
};




