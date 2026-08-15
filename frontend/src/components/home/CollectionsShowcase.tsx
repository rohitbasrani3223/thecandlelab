import React from 'react';
import { Button, Badge, SparklesIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface CollectionsShowcaseProps {
  onNavigateToShop?: () => void;
}

export const CollectionsShowcase: React.FC<CollectionsShowcaseProps> = () => {
  const { collections } = useCMS();

  // If no collections have been created yet by the user in Admin, do not render hardcoded mock collections
  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FFF6F8] border-b border-[#F5E8EE] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>CURATED SPOTLIGHTS</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1217]">
            Signature Collection Spotlight
          </h2>
          <p className="text-sm text-[#624855] leading-relaxed">
            Discover distinct olfactory journeys formulated for atmosphere, serenity, and warmth.
          </p>
        </div>

        {/* Dynamic Live Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.slice(0, 2).map((col, idx) => {
            const isAlt = idx % 2 === 1;
            const bgClass = isAlt
              ? 'bg-gradient-to-br from-[#1C1217] via-[#2C1D25] to-[#422D38] border-[#F9B8CA]/30'
              : 'bg-gradient-to-br from-[#140B10] via-[#1C1217] to-[#2C1D25] border-[#F9B8CA]/20';
            const imgUrl = col.imageUrl || col.bannerImage || (isAlt
              ? 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
              : 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80');

            return (
              <div
                key={col.id}
                className={`${bgClass} text-[#FFFFFF] rounded-3xl p-8 sm:p-12 border shadow-[0_16px_36px_rgba(20,11,16,0.2)] flex flex-col justify-between min-h-[390px] relative overflow-hidden group`}
              >
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#F9B8CA]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
                  <img
                    src={imgUrl}
                    alt={col.name}
                    className="w-48 h-48 object-cover rounded-tl-full"
                  />
                </div>

                <div className="space-y-4 relative z-10">
                  <span className="bg-[#E87A96] text-[#FFFFFF] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                    {col.icon || '✨'} {col.name.toUpperCase()}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#FFFFFF] leading-tight">
                    {col.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FCD5E2] leading-relaxed max-w-md">
                    {col.description || 'Handcrafted botanical candle collection poured in limited luxury batches.'}
                  </p>
                </div>

                <div className="pt-6 relative z-10 flex items-center justify-between border-t border-[#422D38]">
                  <span className="text-xs font-bold text-[#F9B8CA]">Curated Selection</span>
                  <Button
                    variant="pink"
                    size="md"
                    className="rounded-full shadow-subtle hover:scale-105 transition-all"
                    onClick={() => {
                      window.location.hash = `#collections?id=${col.id}`;
                    }}
                  >
                    Explore Collection →
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
