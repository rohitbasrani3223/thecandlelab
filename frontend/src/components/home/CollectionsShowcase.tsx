import React from 'react';
import { Button, Badge, SparklesIcon } from '../../design-system';

export const CollectionsShowcase: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>SIGNATURE SPOTLIGHTS</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1E17]">
            Curated Collections
          </h2>
          <p className="text-sm text-[#69574A]">
            Discover two distinct olfactory journeys formulated for atmosphere and serenity.
          </p>
        </div>

        {/* Dual Split Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Banner 1: Autumn Woodfire */}
          <div className="bg-[#2A1E17] text-[#FAF6F0] rounded-md p-8 sm:p-12 border border-[#4A3B32] shadow-card flex flex-col justify-between min-h-[380px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <Badge variant="gold" size="sm">LIMITED AUTUMN BATCH</Badge>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF6F0] leading-tight">
                Smoked Cedar & Fireplace Wood
              </h3>
              <p className="text-xs sm:text-sm text-[#E5D9C5] leading-relaxed max-w-md">
                Evoke the crisp warmth of crackling fires with notes of raw cedarwood, clove bud, and smoked balsam resin.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#D4AF37]">Starting at $54.00</span>
              <Button
                variant="gold"
                size="md"
                onClick={() => {
                  const el = document.getElementById('best-sellers');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Shop Collection →
              </Button>
            </div>
          </div>

          {/* Banner 2: 24K Gold Signature */}
          <div className="bg-gradient-to-br from-[#1C130E] via-[#2A1E17] to-[#3D2C22] text-[#FAF6F0] rounded-md p-8 sm:p-12 border border-[#D4AF37]/40 shadow-goldGlow flex flex-col justify-between min-h-[380px] relative overflow-hidden group">
            <div className="space-y-4 relative z-10">
              <Badge variant="gold" icon={<SparklesIcon size={12} />}>24K GOLD RESERVE</Badge>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#D4AF37] leading-tight">
                The Royal Gold Vessel Collection
              </h3>
              <p className="text-xs sm:text-sm text-[#E5D9C5] leading-relaxed max-w-md">
                Hand-poured in heavy frosted glass adorned with pure gold leaf branding. Formulated with rare Damask Rose and Vanilla.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#FAF6F0]">Starting at $78.00</span>
              <Button
                variant="outline"
                size="md"
                className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1C130E]"
                onClick={() => {
                  const el = document.getElementById('best-sellers');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Discover Reserve →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
