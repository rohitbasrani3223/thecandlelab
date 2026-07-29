import React from 'react';
import { Badge, SparklesIcon } from '../../design-system';

export const FragrancePyramidSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#2A1E17] text-[#FAF6F0] border-t border-b border-[#4A3B32] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>JO MALONE STYLE ARCHITECTURE</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FAF6F0]">
            The Olfactory Scent Pyramid
          </h2>
          <p className="text-sm text-[#E5D9C5]">
            Formulated in Grasse, France, designed to continuously release layered fragrance notes as the soy wax pool warms.
          </p>
        </div>

        {/* Visual Pyramid Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Notes */}
          <div className="bg-[#1C130E] p-8 rounded-md border border-[#D4AF37]/30 shadow-card space-y-4 relative overflow-hidden group hover:border-[#D4AF37] transition-colors">
            <div className="flex items-center justify-between border-b border-[#3D2C22] pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">1. Top Notes</span>
              <span className="text-[10px] text-[#8C7A6B]">First 15 Mins</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#FAF6F0]">
              Calabrian Bergamot & Pink Pepper
            </h3>
            <p className="text-xs text-[#E5D9C5] leading-relaxed">
              Zesty, sparkling citrus accord combined with crushed pink peppercorn that greets you upon lighting.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-[#2A1E17] rounded-full text-[10px] text-[#D4AF37] border border-[#4A3B32]">
                Sparkling Citrus
              </span>
              <span className="px-2.5 py-1 bg-[#2A1E17] rounded-full text-[10px] text-[#D4AF37] border border-[#4A3B32]">
                Pink Peppercorn
              </span>
            </div>
          </div>

          {/* Heart Notes */}
          <div className="bg-[#1C130E] p-8 rounded-md border border-[#D4AF37]/30 shadow-card space-y-4 relative overflow-hidden group hover:border-[#D4AF37] transition-colors">
            <div className="flex items-center justify-between border-b border-[#3D2C22] pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">2. Heart Notes</span>
              <span className="text-[10px] text-[#8C7A6B]">Main Body</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#FAF6F0]">
              Damask Rose & Clove Bud
            </h3>
            <p className="text-xs text-[#E5D9C5] leading-relaxed">
              Deep velvety Damask Rose petals infused with warm, aromatic clove bud and nutmeg heart.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-[#2A1E17] rounded-full text-[10px] text-[#D4AF37] border border-[#4A3B32]">
                Damask Rose
              </span>
              <span className="px-2.5 py-1 bg-[#2A1E17] rounded-full text-[10px] text-[#D4AF37] border border-[#4A3B32]">
                Warm Clove Bud
              </span>
            </div>
          </div>

          {/* Base Notes */}
          <div className="bg-[#1C130E] p-8 rounded-md border border-[#D4AF37]/30 shadow-card space-y-4 relative overflow-hidden group hover:border-[#D4AF37] transition-colors">
            <div className="flex items-center justify-between border-b border-[#3D2C22] pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">3. Base Notes</span>
              <span className="text-[10px] text-[#8C7A6B]">Lingering Atmosphere</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#FAF6F0]">
              Smoked Amber & Cambodian Oud
            </h3>
            <p className="text-xs text-[#E5D9C5] leading-relaxed">
              Rich, smoky resinous amber and aged Cambodian oud wood that linger in your room for hours.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-[#2A1E17] rounded-full text-[10px] text-[#D4AF37] border border-[#4A3B32]">
                Smoked Amber
              </span>
              <span className="px-2.5 py-1 bg-[#2A1E17] rounded-full text-[10px] text-[#D4AF37] border border-[#4A3B32]">
                Aged Oud Wood
              </span>
            </div>
          </div>
        </div>

        {/* Scent Intensity Scale */}
        <div className="bg-[#1C130E] p-6 rounded-md border border-[#4A3B32] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
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
            <span className="text-[#D4AF37] font-semibold">4 / 5 (Rich Room Filling)</span>
          </div>

          <div className="text-[#E5D9C5]">
            Best Suited For: <strong className="text-[#FAF6F0]">Living Rooms, Bedrooms & Evening Relaxation</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
