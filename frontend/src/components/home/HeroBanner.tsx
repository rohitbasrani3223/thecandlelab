import React from 'react';
import { Button, Badge, SparklesIcon, CandleIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export const HeroBanner: React.FC = () => {
  const { hero } = useCMS();

  return (
    <section className="relative w-full max-w-full bg-gradient-to-b from-[#FAF6F0] via-[#F4EFE6] to-[#FAF6F0] border-b border-[#E5D9C5] overflow-hidden py-10 sm:py-20 lg:py-24 font-sans">
      {/* Background Decorative Gold Radial Light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#B88B38]/10 via-[#E6CA65]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid w-full grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <Badge variant="gold" icon={<SparklesIcon size={12} />}>{hero.tagline}</Badge>
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#8C7A6B] font-semibold">• 2026 Atelier Reserve</span>
            </div>

            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-[#2A1E17] leading-[1.08] tracking-tight">
              {hero.title}
            </h1>

            <p className="text-base sm:text-lg text-[#69574A] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              {hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="gold"
                size="lg"
                className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold"
                leftIcon={<SparklesIcon size={18} />}
                onClick={() => {
                  const el = document.getElementById('best-sellers');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {hero.primaryBtnText}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#B88B38] text-[#B88B38] hover:bg-[#B88B38] hover:text-white"
                leftIcon={<CandleIcon size={18} className="text-[#B88B38]" />}
                onClick={() => {
                  const el = document.getElementById('scent-quiz-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {hero.secondaryBtnText}
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
                <span className="text-[11px] text-[#8C7A6B]">IFRA Certified Perfume</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">Wood Wicks</span>
                <span className="text-[11px] text-[#8C7A6B]">Crackling Fireside Sound</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">Hand-Poured</span>
                <span className="text-[11px] text-[#8C7A6B]">Small Batches in India</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] sm:aspect-3/4 rounded-2xl overflow-hidden shadow-card border border-[#EFE8DB] bg-[#F8F3EA] group">
              <img
                src={hero.imageUrl}
                alt="Luxury Soy Candle"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E16]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="bg-[#B88B38] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  ATELIER FEATURED
                </span>
                <h4 className="font-serif font-bold text-xl text-white">French Vanilla & Cinnamon</h4>
                <p className="text-xs text-[#E5D9C5] italic">12 oz Heavy Italian Glass • 65 Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
