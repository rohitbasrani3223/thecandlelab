import React, { useState, useMemo } from 'react';
import { SparklesIcon, ChevronRightIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface CategoryGridProps {
  onNavigateToShop?: (categoryId?: string) => void;
  onSelectProduct?: (product: any) => void;
}

interface LiveCurationCard {
  id: string;
  rawId?: string;
  type: 'category' | 'collection';
  name: string;
  subtitle: string;
  count: number;
  image: string;
  tag: string;
  price?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onNavigateToShop: _onNavigateToShop,
  onSelectProduct: _onSelectProduct,
}) => {
  const { products, mainCategories, collections, settings } = useCMS();
  const [activeTab, setActiveTab] = useState<'all' | 'categories' | 'collections'>('all');

  // Helper for finding matching products for a category or collection
  const getMatchingProducts = (name: string, id: string) => {
    if (!products || products.length === 0) return [];
    const nameLower = name.toLowerCase().trim();
    const curId = String(id);

    return products.filter((p) => {
      const pCat = (p.category || '').toLowerCase().trim();
      const pCollection = (p.collection || '').toLowerCase().trim();

      if (
        p.collectionIds?.some((cId) => String(cId) === curId || String(cId).toLowerCase() === nameLower) ||
        p.collections?.some((col) => String(col) === curId || String(col).toLowerCase() === nameLower)
      ) {
        return true;
      }

      if (pCollection === nameLower || pCollection === curId.toLowerCase()) return true;
      if (p.mainCategoryId && String(p.mainCategoryId) === curId) return true;
      if (pCat === nameLower) return true;

      const pCatClean = pCat.replace(/[^a-z0-9]/g, '');
      const nameClean = nameLower.replace(/[^a-z0-9]/g, '');
      if (pCatClean && nameClean && pCatClean === nameClean) return true;

      const pColClean = pCollection.replace(/[^a-z0-9]/g, '');
      if (pColClean && nameClean && pColClean === nameClean) return true;

      return false;
    });
  };

  // 1. LIVE Categories strictly from CMS mainCategories or Products
  const liveCategories = useMemo<LiveCurationCard[]>(() => {
    if (mainCategories && mainCategories.length > 0) {
      return mainCategories
        .filter((c) => c.isActive !== false)
        .map((cat) => {
          const matching = getMatchingProducts(cat.name, cat.id);
          const count = matching.length;
          // Pick live product image if category image is not explicitly set
          const fallbackProductImg = matching.find((p) => p.image || p.imageUrl);
          const image = cat.imageUrl || cat.bannerDesktop || fallbackProductImg?.image || fallbackProductImg?.imageUrl || '/hero_candle.png';

          return {
            id: `cat:${cat.name}`,
            rawId: cat.id,
            type: 'category',
            name: cat.name,
            subtitle: cat.description || `${count} hand-poured formulation${count === 1 ? '' : 's'}`,
            count,
            price: `From ${settings.currencySymbol || '₹'}999`,
            image,
            tag: cat.name.toLowerCase().includes('bestseller') ? 'Bestseller' : 'Category',
          };
        });
    }

    // If mainCategories table is empty, derive categories dynamically from live products
    if (products && products.length > 0) {
      const uniqueCats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
      return uniqueCats.map((catName) => {
        const matching = getMatchingProducts(catName, catName);
        const count = matching.length;
        const fallbackProductImg = matching.find((p) => p.image || p.imageUrl);
        const image = fallbackProductImg?.image || fallbackProductImg?.imageUrl || '/hero_candle.png';

        return {
          id: `cat:${catName}`,
          type: 'category',
          name: catName,
          subtitle: `${count} hand-poured formulation${count === 1 ? '' : 's'}`,
          count,
          price: `From ${settings.currencySymbol || '₹'}999`,
          image,
          tag: 'Category',
        };
      });
    }

    return [];
  }, [mainCategories, products, settings.currencySymbol]);

  // 2. LIVE Collections strictly from CMS collections
  const liveCollections = useMemo<LiveCurationCard[]>(() => {
    if (!collections || collections.length === 0) return [];

    return collections
      .filter((c) => c.isActive !== false)
      .map((col) => {
        const matching = getMatchingProducts(col.name, col.id);
        const count = matching.length;
        const fallbackProductImg = matching.find((p) => p.image || p.imageUrl);
        const image = col.imageUrl || col.bannerImage || fallbackProductImg?.image || fallbackProductImg?.imageUrl || '/hero_candle.png';

        return {
          id: col.id,
          rawId: col.id,
          type: 'collection',
          name: col.name,
          subtitle: col.description || 'Exclusive Atelier Curation',
          count,
          image,
          tag: col.isFeatured ? 'Signature' : 'Collection',
        };
      });
  }, [collections, products]);

  // Unified list of ONLY live items
  const allLiveCurations = useMemo<LiveCurationCard[]>(() => {
    return [...liveCategories, ...liveCollections];
  }, [liveCategories, liveCollections]);

  // Tab Filtering
  const visibleCards = useMemo(() => {
    if (activeTab === 'categories') return liveCategories;
    if (activeTab === 'collections') return liveCollections;
    return allLiveCurations;
  }, [allLiveCurations, liveCategories, liveCollections, activeTab]);

  // If there are literally no live categories or collections, do not render an empty shell
  if (allLiveCurations.length === 0) {
    return null;
  }

  const handleOpenItem = (item: LiveCurationCard) => {
    if (item.type === 'collection' || item.id.startsWith('cat:') || item.rawId) {
      const targetId = item.rawId || item.id;
      window.location.hash = `#collections?id=${encodeURIComponent(targetId)}`;
    } else {
      window.location.hash = `#categories?id=${encodeURIComponent(item.name)}`;
    }
  };

  const hasBothTypes = liveCategories.length > 0 && liveCollections.length > 0;

  return (
    <section id="categories" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#EADDCB] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EADDCB] shadow-xs">
            <SparklesIcon size={13} className="text-[#B88B38]" />
            <span className="text-[11px] uppercase tracking-widest text-[#7D6F63] font-bold">
              Live Atelier Catalog
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#232323] tracking-tight">
            Shop by Category
          </h2>

          <p className="text-xs sm:text-sm text-[#5C5149] max-w-2xl mx-auto leading-relaxed">
            Explore our artisanal hand-poured soy formulations, therapeutic botanical notes, and bespoke luxury gift ateliers.
          </p>

          {/* Segmented Filter Pills (Only shown when both categories and collections exist in DB) */}
          {hasBothTypes && (
            <div className="pt-2 flex items-center justify-center gap-2 overflow-x-auto scrollbar-none pb-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  activeTab === 'all'
                    ? 'bg-[#232323] text-white shadow-md'
                    : 'bg-[#FFFFFF] text-[#5C5149] border border-[#EADDCB] hover:border-[#B88B38] hover:text-[#232323]'
                }`}
              >
                ✦ All ({allLiveCurations.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  activeTab === 'categories'
                    ? 'bg-[#232323] text-white shadow-md'
                    : 'bg-[#FFFFFF] text-[#5C5149] border border-[#EADDCB] hover:border-[#B88B38] hover:text-[#232323]'
                }`}
              >
                🕯️ Categories ({liveCategories.length})
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  activeTab === 'collections'
                    ? 'bg-[#232323] text-white shadow-md'
                    : 'bg-[#FFFFFF] text-[#5C5149] border border-[#EADDCB] hover:border-[#B88B38] hover:text-[#232323]'
                }`}
              >
                ✨ Collections ({liveCollections.length})
              </button>
            </div>
          )}
        </div>

        {/* Circular Luxury Showcase Grid — 100% Live Database Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 pt-2">
          {visibleCards.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
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
                        // Safe fallback to hero image if live URL fails to load
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

        {/* View All Collections Bottom CTA */}
        <div className="text-center pt-4 sm:pt-6 border-t border-[#EADDCB]">
          <button
            onClick={() => {
              window.location.hash = '#collections';
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
