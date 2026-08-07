import React from 'react';
import { Badge, SparklesIcon } from '../../design-system';

export interface FragrancePyramidSectionProps {
  product?: {
    name?: string;
    topNotes?: string;
    heartNotes?: string;
    baseNotes?: string;
    scentProfile?: string;
  } | null;
}

export const FragrancePyramidSection: React.FC<FragrancePyramidSectionProps> = ({ product }) => {
  const topNotes = product?.topNotes || product?.scentProfile || 'Calabrian Bergamot & Pink Pepper';
  const heartNotes = product?.heartNotes || 'Damask Rose & Clove Bud';
  const baseNotes = product?.baseNotes || 'Smoked Amber & Cambodian Oud';

  return (
    <section className="py-16 sm:py-24 bg-[#2A1E17] text-[#FAF6F0] border-t border-b border-[#4A3B32] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>
            ATELIER OLFACTORY ARCHITECTURE
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FAF6F0]">
            The Scent Pyramid
          </h2>
          <p className="text-sm text-[#E5D9C5]">
            Formulated with fine essential oils, designed to continuously release layered fragrance notes as the soy wax pool warms.
          </p>
        </div>

        {/* Visual Pyramid Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Notes */}
          <div className="bg-[#1C130E] p-8 rounded-xl border border-[#D4AF37]/30 shadow-card space-y-4 relative overflow-hidden group hover:border-[#D4AF37] transition-colors">
            <div className="flex items-center justify-between border-b border-[#3D2C22] pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">1. Top Notes</span>
              <span className="text-[10px] text-[#8C7A6B]">First 15 Mins</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#FAF6F0] capitalize">
              {topNotes}
            </h3>
            <p className="text-xs text-[#E5D9C5] leading-relaxed">
              Zesty, sparkling opening accord that greets you immediately upon lighting the wick.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {topNotes.split(',').map((note, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#2A1E17] rounded-full text-[10px] text-[#D4AF37] border border-[#4A3B32]">
                  {note.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Heart Notes */}
          <div className="bg-[#1C130E] p-8 rounded-xl border border-[#D4AF37]/30 shadow-card space-y-4 relative overflow-hidden group hover:border-[#D4AF37] transition-colors">
            <div className="flex items-center justify-between border-b border-[#3D2C22] pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">2. Heart Notes</span>
              <span className="text-[10px] text-[#8C7A6B]">Main Fragrance Body</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#FAF6F0] capitalize">
              {heartNotes}
            </h3>
            <p className="text-xs text-[#E5D9C5] leading-relaxed">
              The rich, harmonious heart notes that bloom as the wax pool reaches full melt.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {heartNotes.split(',').map((note, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#2A1E17] rounded-full text-[10px] text-[#D4AF37] border border-[#4A3B32]">
                  {note.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Base Notes */}
          <div className="bg-[#1C130E] p-8 rounded-xl border border-[#D4AF37]/30 shadow-card space-y-4 relative overflow-hidden group hover:border-[#D4AF37] transition-colors">
            <div className="flex items-center justify-between border-b border-[#3D2C22] pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">3. Base Notes</span>
              <span className="text-[10px] text-[#8C7A6B]">Lingering Atmosphere</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#FAF6F0] capitalize">
              {baseNotes}
            </h3>
            <p className="text-xs text-[#E5D9C5] leading-relaxed">
              Deep, lingering woody and amber foundations that stay in your room long after extinguishing.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {baseNotes.split(',').map((note, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#2A1E17] rounded-full text-[10px] text-[#D4AF37] border border-[#4A3B32]">
                  {note.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scent Throw Strength Indicator */}
        <div className="bg-[#1C130E] p-6 rounded-xl border border-[#4A3B32] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#FAF6F0] uppercase tracking-wider">Fragrance Throw Strength:</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <span
                  key={lvl}
                  className={`w-3.5 h-3.5 rounded-full ${lvl <= 4 ? 'bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'bg-[#3D2C22]'}`}
                />
              ))}
            </div>
            <span className="text-[#D4AF37] font-semibold">4 / 5 (Room Filling Aroma)</span>
          </div>

          <div className="text-[#E5D9C5]">
            Best Suited For: <strong className="text-[#FAF6F0]">Living Rooms, Bedrooms & Gifting</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
