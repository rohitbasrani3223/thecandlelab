import React from 'react';
import { Badge, SparklesIcon, Button } from '../../design-system';

export interface CollectionBannerProps {
  onExploreClick?: () => void;
}

export const CollectionBanner: React.FC<CollectionBannerProps> = ({ onExploreClick }) => {
  return (
    <section className="relative bg-gradient-to-b from-[#2A1E17] via-[#1C130E] to-[#2A1E17] text-[#FAF6F0] border-b border-[#4A3B32] py-20 sm:py-28 px-6 sm:px-12 font-sans overflow-hidden">
      {/* Background Decorative Gold Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#E6CA65]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>EDITORIAL CATALOGUE 2026</Badge>
          <span className="text-xs uppercase tracking-widest text-[#E5D9C5] font-semibold">• Zara & COS Aesthetics</span>
        </div>

        <h1 className="text-4xl sm:text-7xl font-serif font-extrabold text-[#FAF6F0] leading-[1.05] tracking-tight">
          The Art of Form <span className="italic font-accent-luxury font-normal text-[#D4AF37]">&amp; Fragrance</span>
        </h1>

        <p className="text-sm sm:text-lg text-[#E5D9C5] max-w-2xl mx-auto leading-relaxed font-light">
          An editorial exploration of hand-poured soy wax, botanical aromatics, and artisanal vessel forms engineered for architectural serenity.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Button
            variant="gold"
            size="lg"
            leftIcon={<SparklesIcon size={18} />}
            onClick={onExploreClick}
          >
            Explore Curated Collections
          </Button>
        </div>
      </div>
    </section>
  );
};
