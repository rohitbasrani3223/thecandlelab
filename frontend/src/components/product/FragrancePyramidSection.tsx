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
    <section className="py-16 sm:py-24 bg-[#FFFFFF] text-[#1C1217] border-t border-b border-[#F5E8EE] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>
            ATELIER OLFACTORY ARCHITECTURE
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1217]">
            The Scent Pyramid
          </h2>
          <p className="text-sm text-[#624855]">
            Formulated with fine essential oils, designed to continuously release layered fragrance notes as the soy wax pool warms.
          </p>
        </div>

        {/* Visual Pyramid Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Notes */}
          <div className="bg-[#FFF6F8] p-8 rounded-3xl border border-[#F5E8EE] shadow-subtle space-y-4 relative overflow-hidden group hover:border-[#F9B8CA] transition-colors">
            <div className="flex items-center justify-between border-b border-[#F5E8EE] pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#E87A96]">1. Top Notes</span>
              <span className="text-[10px] text-[#886C7B]">First 15 Mins</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1217] capitalize">
              {topNotes}
            </h3>
            <p className="text-xs text-[#624855] leading-relaxed">
              Zesty, sparkling opening accord that greets you immediately upon lighting the wick.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {topNotes.split(',').map((note, idx) => (
                <span key={idx} className="px-3 py-1 bg-white rounded-full text-[10px] text-[#E87A96] font-semibold border border-[#F5E8EE]">
                  {note.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Heart Notes */}
          <div className="bg-[#FFF6F8] p-8 rounded-3xl border border-[#F5E8EE] shadow-subtle space-y-4 relative overflow-hidden group hover:border-[#F9B8CA] transition-colors">
            <div className="flex items-center justify-between border-b border-[#F5E8EE] pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#E87A96]">2. Heart Notes</span>
              <span className="text-[10px] text-[#886C7B]">Main Fragrance Body</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1217] capitalize">
              {heartNotes}
            </h3>
            <p className="text-xs text-[#624855] leading-relaxed">
              The rich, harmonious heart notes that bloom as the wax pool reaches full melt.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {heartNotes.split(',').map((note, idx) => (
                <span key={idx} className="px-3 py-1 bg-white rounded-full text-[10px] text-[#E87A96] font-semibold border border-[#F5E8EE]">
                  {note.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Base Notes */}
          <div className="bg-[#FFF6F8] p-8 rounded-3xl border border-[#F5E8EE] shadow-subtle space-y-4 relative overflow-hidden group hover:border-[#F9B8CA] transition-colors">
            <div className="flex items-center justify-between border-b border-[#F5E8EE] pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#E87A96]">3. Base Notes</span>
              <span className="text-[10px] text-[#886C7B]">Lingering Atmosphere</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1217] capitalize">
              {baseNotes}
            </h3>
            <p className="text-xs text-[#624855] leading-relaxed">
              Deep, lingering woody and amber foundations that stay in your room long after extinguishing.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {baseNotes.split(',').map((note, idx) => (
                <span key={idx} className="px-3 py-1 bg-white rounded-full text-[10px] text-[#E87A96] font-semibold border border-[#F5E8EE]">
                  {note.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scent Throw Strength Indicator */}
        <div className="bg-[#FFF6F8] p-6 rounded-3xl border border-[#F5E8EE] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#1C1217] uppercase tracking-wider">Fragrance Throw Strength:</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <span
                  key={lvl}
                  className={`w-3.5 h-3.5 rounded-full ${lvl <= 4 ? 'bg-[#E87A96] shadow-[0_0_8px_rgba(232,122,150,0.6)]' : 'bg-[#F5E8EE]'}`}
                />
              ))}
            </div>
            <span className="text-[#E87A96] font-semibold">4 / 5 (Room Filling Aroma)</span>
          </div>

          <div className="text-[#624855]">
            Best Suited For: <strong className="text-[#1C1217]">Living Rooms, Bedrooms & Gifting</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
