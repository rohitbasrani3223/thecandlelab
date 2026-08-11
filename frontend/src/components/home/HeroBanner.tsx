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
  const featuredTitle = hero.featuredTitle || 'French Vanilla & Cinnamon';
  const featuredSubtitle = hero.featuredSubtitle || '12 oz Heavy Italian Glass • 65 Hours';
  const featuredImg = hero.featuredImage || heroBgImage;
  const layoutStyle = hero.layoutStyle || 'centered-glass';

  return (
    <section className="relative w-full max-w-full bg-[#1C130E] border-b border-[#3D2C22] overflow-hidden py-16 sm:py-28 lg:py-36 font-sans text-white">
      {/* 1. Full-Bleed Background Photography Layer with Parallax & Soft Dark Vignette */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-100 ease-out z-0 scale-105"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      >
        <img
          src={heroBgImage}
          alt="Atelier Sanctuary"
          className="w-full h-full object-cover opacity-45 filter brightness-90 contrast-105"
        />
        {/* Luxury Vignette & Radial Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C130E]/70 via-[#1C130E]/40 to-[#1C130E]" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
      </div>

      {/* 2. Floating Gold Glow Lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#B88B38]/20 via-[#E6CA65]/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* 3. Hero Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {layoutStyle === 'centered-glass' ? (
          /* Option A: Centered Full-Bleed Luxury Layout (scentandchill.in aesthetic) */
          <div className="max-w-4xl mx-auto text-center space-y-7 sm:space-y-9">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FAF6F0]/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#D4AF37]/30 shadow-lg">
              <Badge variant="gold" icon={<SparklesIcon size={12} />}>{heroTagline}</Badge>
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#E5D9C5] font-semibold">
                • 2026 Atelier Reserve
              </span>
            </div>

            {/* Main Centered Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-[#FAF6F0] leading-[1.08] tracking-tight drop-shadow-lg">
              {heroTitle}
            </h1>

            {/* Centered Subtitle Description */}
            <p className="text-base sm:text-xl text-[#E5D9C5] max-w-2xl mx-auto leading-relaxed font-light drop-shadow-sm">
              {heroSubtitle}
            </p>

            {/* Soft Pill CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="gold"
                size="lg"
                className="bg-[#B88B38] hover:bg-[#D4AF37] text-[#1C130E] font-bold rounded-full px-8 py-4 shadow-xl shadow-[#B88B38]/25 transition-all hover:scale-105"
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
                className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1C130E] rounded-full px-8 py-4 backdrop-blur-md transition-all hover:scale-105"
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

            {/* Trust Highlights Bar */}
            <div className="pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">100% Soy Wax</span>
                <span className="text-[11px] text-[#E5D9C5]/80">Clean & Non-Toxic</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">Essential Oils</span>
                <span className="text-[11px] text-[#E5D9C5]/80">IFRA Certified</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">Wood Wicks</span>
                <span className="text-[11px] text-[#E5D9C5]/80">Crackling Flame</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">Hand-Poured</span>
                <span className="text-[11px] text-[#E5D9C5]/80">Small Batches</span>
              </div>
            </div>
          </div>
        ) : (
          /* Option B: Split Glassmorphic Featured Card Layout */
          <div className="grid w-full grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 bg-[#FAF6F0]/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#D4AF37]/30">
                <Badge variant="gold" icon={<SparklesIcon size={12} />}>{heroTagline}</Badge>
                <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#E5D9C5] font-semibold">• 2026 Atelier Reserve</span>
              </div>

              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-[#FAF6F0] leading-[1.08] tracking-tight drop-shadow-md">
                {heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-[#E5D9C5] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                {heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  variant="gold"
                  size="lg"
                  className="bg-[#B88B38] hover:bg-[#D4AF37] text-[#1C130E] font-bold rounded-full px-7 py-3.5 shadow-lg transition-all"
                  onClick={() => { window.location.hash = '#shop'; }}
                >
                  {heroPrimaryBtn}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1C130E] rounded-full px-7 py-3.5"
                  onClick={() => { window.location.hash = '#collections'; }}
                >
                  {heroSecondaryBtn}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/40 bg-[#2A1E17]/60 backdrop-blur-xl group hover:border-[#D4AF37] transition-all duration-500">
                <img src={featuredImg} alt={featuredTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E] via-[#1C130E]/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-1 shadow-lg">
                  <span className="bg-[#B88B38] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                    ATELIER FEATURED
                  </span>
                  <h4 className="font-serif font-bold text-xl text-[#FAF6F0]">{featuredTitle}</h4>
                  <p className="text-xs text-[#E5D9C5] italic">{featuredSubtitle}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


