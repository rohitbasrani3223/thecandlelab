import React, { useMemo } from 'react';
import { SparklesIcon, ChevronRightIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface CategoryGridProps {
  onNavigateToShop?: (categoryId?: string) => void;
  onSelectProduct?: (product: any) => void;
}

interface LiveCategoryCard {
  id: string;
  rawId?: string;
  name: string;
  subtitle: string;
  count: number;
  image: string;
  tag: string;
  price?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onNavigateToShop,
  onSelectProduct: _onSelectProduct,
}) => {
  const { products, mainCategories, settings } = useCMS();

  // Helper to match live products for a given category
  const getMatchingProducts = (name: string, id: string) => {
    if (!products || products.length === 0) return [];
    const nameLower = name.toLowerCase().trim();
    const curId = String(id).trim();

    return products.filter((p) => {
      const pCat = (p.category || '').toLowerCase().trim();
      if (p.mainCategoryId && String(p.mainCategoryId) === curId) return true;
      if (pCat === nameLower) return true;

      const pCatClean = pCat.replace(/[^a-z0-9]/g, '');
      const nameClean = nameLower.replace(/[^a-z0-9]/g, '');
      if (pCatClean && nameClean && pCatClean === nameClean) return true;

      return false;
    });
  };

  // ONLY real LIVE Categories with products
  const liveCategories = useMemo<LiveCategoryCard[]>(() => {
    if (mainCategories && mainCategories.length > 0) {
      return mainCategories
        .filter((c) => c.isActive !== false)
        .map((cat) => {
          const cleanName = cat.name.trim();
          const matching = getMatchingProducts(cleanName, cat.id);
          const count = matching.length;
          // Pick live product image if category image is not explicitly set
          const fallbackProductImg = matching.find((p) => p.image || p.imageUrl);
          const image =
            cat.imageUrl ||
            cat.bannerDesktop ||
            fallbackProductImg?.image ||
            fallbackProductImg?.imageUrl ||
            '/hero_candle.png';

          return {
            id: `cat:${cleanName}`,
            rawId: cat.id,
            name: cleanName,
            subtitle: cat.description || `${count} hand-poured formulation${count === 1 ? '' : 's'}`,
            count,
            price: `From ${settings.currencySymbol || '₹'}999`,
            image,
            tag: cleanName.toLowerCase().includes('bestseller') ? 'Bestseller' : 'Category',
          };
        })
        .filter((c) => c.count > 0);
    }

    // Fallback if mainCategories table isn't populated: derive strictly from live products
    if (products && products.length > 0) {
      const uniqueCats = Array.from(
        new Set(products.map((p) => (p.category || '').trim()).filter(Boolean))
      );
      return uniqueCats
        .map((catName) => {
          const matching = getMatchingProducts(catName, catName);
          const count = matching.length;
          const fallbackProductImg = matching.find((p) => p.image || p.imageUrl);
          const image = fallbackProductImg?.image || fallbackProductImg?.imageUrl || '/hero_candle.png';

          return {
            id: `cat:${catName}`,
            name: catName,
            subtitle: `${count} hand-poured formulation${count === 1 ? '' : 's'}`,
            count,
            price: `From ${settings.currencySymbol || '₹'}999`,
            image,
            tag: 'Category',
          };
        })
        .filter((c) => c.count > 0);
    }

    return [];
  }, [mainCategories, products, settings.currencySymbol]);

  // Do not render empty section if no categories exist
  if (liveCategories.length === 0) {
    return null;
  }

  const handleOpenCategory = (item: LiveCategoryCard) => {
    if (onNavigateToShop) {
      onNavigateToShop(item.name);
    } else {
      window.location.hash = `#shop?category=${encodeURIComponent(item.name)}`;
    }
  };

  return (
    <section id="categories" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#EADDCB] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EADDCB] shadow-xs">
            <SparklesIcon size={13} className="text-[#B88B38]" />
            <span className="text-[11px] uppercase tracking-widest text-[#7D6F63] font-bold">
              Live Atelier Catalog • {liveCategories.length} Categories
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#232323] tracking-tight">
            Shop by Category
          </h2>

          <p className="text-xs sm:text-sm text-[#5C5149] max-w-2xl mx-auto leading-relaxed">
            Explore our artisanal hand-poured soy formulations, therapeutic botanical notes, and bespoke luxury gift ateliers.
          </p>
        </div>

        {/* Circular Luxury Showcase Grid — ONLY Real Live Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 pt-2 justify-center">
          {liveCategories.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenCategory(item)}
              className="group flex flex-col items-center cursor-pointer text-center select-none"
            >
              {/* Concentric Circular Image Frame with Luxury Gold Bezel */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44">
                {/* Outer Ring with Champagne Gold Gradient on Hover */}
                <div className="w-full h-full rounded-full p-1.5 sm:p-2 bg-gradient-to-b from-[#EADDCB] via-[#FFFFFF] to-[#EADDCB] border border-[#EADDCB]/80 group-hover:from-[#B88B38] group-hover:via-[#E5C378] group-hover:to-[#8B6F4E] shadow-[0_8px_24px_rgba(28,19,14,0.06)] group-hover:shadow-[0_16px_36px_rgba(184,139,56,0.28)] group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  {/* Inner Masked Circle */}
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-[#F8F6F0] ring-1 ring-black/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/hero_candle.png';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-115 transition-transform duration-700 ease-out"
                    />

                    {/* Subtle Dark Gradient Vignette for Depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500" />

                    {/* Subtle Bottom Badge / Count Pill */}
                    {item.count > 0 && (
                      <div className="absolute bottom-2 inset-x-0 flex justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                        <span className="bg-[#1C130E]/85 backdrop-blur-xs text-[#FAF7F2] text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/20 shadow-xs">
                          {item.count} {item.count === 1 ? 'Item' : 'Items'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Corner Mini Tag Badge */}
                {item.tag && (
                  <div className="absolute top-0 right-0 z-10">
                    <span className="bg-[#FFFFFF]/95 backdrop-blur-xs text-[#8B6F4E] text-[8px] sm:text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-[#EADDCB] shadow-xs group-hover:border-[#B88B38] transition-colors">
                      {item.tag}
                    </span>
                  </div>
                )}
              </div>

              {/* Typography Details Below Circle */}
              <div className="mt-3.5 sm:mt-4 space-y-1 w-full px-1">
                <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-[#232323] group-hover:text-[#8B6F4E] transition-colors line-clamp-2 leading-snug">
                  {item.name}
                </h3>

                {item.subtitle && (
                  <p className="text-[10px] sm:text-xs text-[#7D6F63] font-medium line-clamp-1">
                    {item.subtitle}
                  </p>
                )}

                {/* Subtle Hover Action Link */}
                <div className="pt-0.5 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8B6F4E] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">
                    <span>Explore</span>
                    <ChevronRightIcon size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Categories Bottom CTA */}
        <div className="text-center pt-4 sm:pt-6 border-t border-[#EADDCB]">
          <button
            type="button"
            onClick={() => {
              if (onNavigateToShop) {
                onNavigateToShop();
              } else {
                window.location.hash = '#shop';
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#FFFFFF] text-[#232323] border border-[#EADDCB] hover:border-[#8B6F4E] hover:text-[#8B6F4E] hover:shadow-card transition-all cursor-pointer group"
          >
            <span>Browse Complete Atelier Catalogue</span>
            <ChevronRightIcon size={14} className="group-hover:translate-x-1 transition-transform text-[#8B6F4E]" />
          </button>
        </div>
      </div>
    </section>
  );
};
