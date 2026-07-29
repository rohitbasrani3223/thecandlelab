import React from 'react';
import { Button, Badge, SparklesIcon, CandleIcon, HeartIcon } from '../../design-system';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#FAF6F0] via-[#F4EFE6] to-[#FAF6F0] border-b border-[#E5D9C5] overflow-hidden py-12 sm:py-20 lg:py-24 font-sans">
      {/* Background Decorative Gold Radial Light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/10 via-[#E6CA65]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <Badge variant="gold" icon={<SparklesIcon size={12} />}>ARTISANAL HAND-POURED SOY</Badge>
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#8C7A6B] font-semibold">• 2026 Reserve Collection</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-[#2A1E17] leading-[1.08] tracking-tight">
              Crafted for <span className="italic font-accent-luxury font-normal text-[#D4AF37]">Serenity</span>, Poured for Elegance.
            </h1>

            <p className="text-base sm:text-lg text-[#69574A] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Elevate your sanctuary with luxury candles infused with rare botanical essential oils, pure soy wax, and wood-crackling wicks.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="gold"
                size="lg"
                leftIcon={<SparklesIcon size={18} />}
                onClick={() => {
                  const el = document.getElementById('best-sellers');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Signature Collection
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<CandleIcon size={18} className="text-[#D4AF37]" />}
                onClick={() => {
                  const el = document.getElementById('scent-quiz-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Take Scent Match Quiz
              </Button>
            </div>

            {/* Key Trust Highlights */}
            <div className="pt-6 border-t border-[#E5D9C5] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">100% Soy Wax</span>
                <span className="text-[11px] text-[#8C7A6B]">Clean & Non-Toxic</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">Essential Oils</span>
                <span className="text-[11px] text-[#8C7A6B]">Rare Botanical Scents</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">60+ Hrs Burn</span>
                <span className="text-[11px] text-[#8C7A6B]">Long-Lasting Aroma</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">Free Shipping</span>
                <span className="text-[11px] text-[#8C7A6B]">On Orders Over $150</span>
              </div>
            </div>
          </div>

          {/* Right Product Image Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md bg-[#FAF6F0] p-4 sm:p-5 rounded-md border border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(42,30,23,0.15)] group">
              <div className="relative overflow-hidden rounded-sm aspect-[4/5] bg-[#2A1E17]">
                <img
                  src="/hero_candle.png"
                  alt="Velvet Rose & Smoked Amber Luxury Soy Candle"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/80 via-transparent to-transparent opacity-80" />

                {/* Overlaid Product Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="gold" icon={<SparklesIcon size={12} />}>FLAGSHIP VESSEL</Badge>
                </div>

                {/* Overlaid Wishlist Icon */}
                <button
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1C130E]/60 text-white backdrop-blur-xs flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1C130E] transition-colors"
                  aria-label="Add to Wishlist"
                >
                  <HeartIcon size={18} />
                </button>

                {/* Overlaid Details */}
                <div className="absolute bottom-5 left-5 right-5 text-[#FAF6F0] space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Signature Reserve</span>
                  <h3 className="text-xl font-serif font-bold">Velvet Rose & Smoked Amber</h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-semibold text-[#E6CA65]">$78.00</span>
                    <span className="text-xs text-[#E5D9C5]">12 oz Glass Jar</span>
                  </div>
                </div>
              </div>

              {/* Floating Social Proof Pill */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#2A1E17] text-[#FAF6F0] p-3 px-4 rounded-md shadow-hover border border-[#4A3B32] flex items-center gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#1C130E] font-bold text-xs flex items-center justify-center">
                  4.9★
                </div>
                <div>
                  <div className="text-xs font-bold text-[#FAF6F0]">2,400+ Verified 5-Star Reviews</div>
                  <div className="text-[10px] text-[#E5D9C5]">"The scent throw is unmatched..."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
