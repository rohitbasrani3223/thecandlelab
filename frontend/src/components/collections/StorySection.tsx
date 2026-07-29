import React from 'react';
import { Badge, SparklesIcon } from '../../design-system';

export const StorySection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF6F0] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image Asset / Visual Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] bg-[#2A1E17] rounded-md overflow-hidden border border-[#D4AF37]/40 shadow-card group">
              <img
                src="/hero_candle.png"
                alt="Artisan Candle Making Story"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 right-6 text-[#FAF6F0] space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">GRASSE PERFUMERY HERITAGE</span>
                <h4 className="text-xl font-serif font-bold">Formulated in Small Batches</h4>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>THE PHILOSOPHY</Badge>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1E17] leading-tight">
              Architecture for <br />
              <span className="italic font-accent-luxury text-[#D4AF37] font-normal">Olfactory Serenity</span>
            </h2>

            <p className="text-sm text-[#69574A] leading-relaxed font-light">
              We believe a candle is more than a light source—it is a sculptural ritual that transforms spatial atmosphere. Every candle formulation is developed in Grasse, France, using 100% renewable North American soy wax and wild-harvested botanical oils.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E5D9C5] text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#2A1E17] block uppercase tracking-wider">01. Pure Soy Wax</span>
                <p className="text-[#8C7A6B]">100% paraffin-free, clean non-toxic burn for healthy home air.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[#2A1E17] block uppercase tracking-wider">02. Crackling Wicks</span>
                <p className="text-[#8C7A6B]">FSC-certified wood wicks producing a soothing fireplace crackle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
