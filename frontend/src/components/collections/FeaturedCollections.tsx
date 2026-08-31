import React from 'react';
import { Badge, SparklesIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';
import { CMS_BANNER_PLACEHOLDER } from '../../config/placeholders';

export interface FeaturedCollectionsProps {
  onSelectCollection?: (id: string) => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ onSelectCollection }) => {
  const { collections } = useCMS();

  const handleCollectionClick = (id: string) => {
    if (onSelectCollection) {
      onSelectCollection(id);
    } else {
      window.location.hash = '#shop';
    }
  };

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#EADDCB] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>CURATED COLLECTIONS ({collections.length})</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323]">
            Our Signature Collections
          </h2>
          <p className="text-sm text-[#5C5149]">
            Curated vessel and scent groupings formulated for high aesthetic and olfactory impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => handleCollectionClick(col.id)}
              className="bg-white rounded-3xl border border-[#EADDCB] overflow-hidden shadow-subtle group cursor-pointer hover:border-[#EADDCB] hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 bg-[#FAF7F2] overflow-hidden">
                <img
                  src={col.image || CMS_BANNER_PLACEHOLDER}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {col.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#8B6F4E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {col.badge}
                    </span>
                  </div>
                )}

                {col.count && (
                  <div className="absolute bottom-3 right-3 text-[10px] font-bold bg-white/90 text-[#232323] px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {col.count}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">{col.icon}</span>
                    <h3 className="text-base font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors leading-snug">
                      {col.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#5C5149] font-light leading-relaxed line-clamp-2">
                    {col.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EADDCB] flex items-center justify-between text-xs">
                  <span className="text-[#8B6F4E] font-bold truncate max-w-[150px]">{col.scents}</span>
                  <button className="bg-[#8B6F4E] hover:bg-[#745A3D] text-white font-bold text-[11px] py-1.5 px-3.5 rounded-full flex items-center gap-1 shadow-xs transition-all cursor-pointer shrink-0">
                    Explore →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
