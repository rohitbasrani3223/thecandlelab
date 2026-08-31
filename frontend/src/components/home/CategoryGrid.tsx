import React, { useMemo } from 'react';
import { Badge, SparklesIcon, ChevronRightIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface CategoryGridProps {
  onNavigateToShop?: (categoryId?: string) => void;
  onSelectProduct?: (product: any) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigateToShop: _onNavigateToShop, onSelectProduct: _onSelectProduct }) => {
  const { products, mainCategories, collections, settings } = useCMS();

  // Helper for accurate product matching
  const getMatchingProductCount = (name: string, id: string) => {
    if (!products || products.length === 0) return 0;
    const nameLower = name.toLowerCase().trim();
    const curId = String(id);
    const count = products.filter((p) => {
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
    }).length;
    return count;
  };

  // Prepare unified list of Categories and Collections
  const categoryCards = useMemo(() => {
    if (mainCategories && mainCategories.length > 0) {
      return mainCategories
        .filter((c) => c.isActive !== false)
        .map((cat) => {
          const count = getMatchingProductCount(cat.name, cat.id);
          const fallbackImg = (products || []).find((p) => p.image || p.imageUrl)?.image || '/hero_candle.png';

          return {
            id: `cat:${cat.name}`,
            type: 'category',
            name: cat.name,
            subtitle: cat.description || `${count} handcrafted formulation${count === 1 ? '' : 's'}`,
            count: count,
            price: `From ${settings.currencySymbol || '₹'}999`,
            image: cat.imageUrl || cat.bannerDesktop || fallbackImg,
            tag: cat.name.includes('Bestseller') ? 'Bestseller' : 'Category',
          };
        });
    }

    if (products && products.length > 0) {
      const uniqueCats = Array.from(new Set(products.map((p) => p.category || 'Scented Candles')));
      return uniqueCats.map((catName) => {
        const count = getMatchingProductCount(catName, catName);
        const fallbackImg = products[0]?.image || products[0]?.imageUrl || '/hero_candle.png';

        return {
          id: `cat:${catName}`,
          type: 'category',
          name: catName,
          subtitle: `${count} handcrafted formulation${count === 1 ? '' : 's'}`,
          count: count,
          price: `From ${settings.currencySymbol || '₹'}999`,
          image: fallbackImg,
          tag: 'Category',
        };
      });
    }

    return [];
  }, [products, mainCategories, settings.currencySymbol]);

  const collectionCards = useMemo(() => {
    return (collections || []).map((col) => {
      const count = getMatchingProductCount(col.name, col.id);
      return {
        id: col.id,
        type: 'collection',
        name: col.name,
        subtitle: col.description || 'Exclusive Curated Collection',
        count: count,
        price: 'Curated',
        image: col.imageUrl || col.bannerImage || '/hero_candle.png',
        tag: 'Collection',
      };
    });
  }, [collections, products]);

  const allCards = useMemo(() => {
    return categoryCards.length > 0 ? categoryCards : collectionCards;
  }, [categoryCards, collectionCards]);

  const handleOpenCollectionPage = (cardId?: string) => {
    if (cardId) {
      window.location.hash = `#collections?id=${encodeURIComponent(cardId)}`;
    } else {
      window.location.hash = '#collections';
    }
  };

  return (
    <section id="categories" className="py-16 sm:py-24 bg-[#F8F6F0] border-b border-[#EADDCB] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 border-b border-[#EADDCB] pb-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="gold" icon={<SparklesIcon size={12} />}>
                CURATED ARTISANAL LINE
              </Badge>
              <span className="text-[11px] uppercase tracking-wider text-[#7D6F63] font-semibold hidden sm:inline-block">
                • {allCards.length} Collections Available
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#232323] tracking-tight">
              SHOP BY CATEGORY
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5149] max-w-2xl leading-relaxed">
              Explore our artisanal product categories. Click any category to view its hand-poured formulations.
            </p>
          </div>

          <button
            onClick={() => handleOpenCollectionPage()}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#232323] hover:text-[#8B6F4E] transition-colors cursor-pointer group shrink-0 pb-1"
          >
            <span>View All Collections</span>
            <ChevronRightIcon size={14} className="group-hover:translate-x-1.5 transition-transform text-[#8B6F4E]" />
          </button>
        </div>

        {/* 1. Quick Filter Pills / Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleOpenCollectionPage('all')}
            className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shadow-xs bg-[#232323] text-[#FFFFFF] hover:bg-[#8B6F4E]"
          >
            <span>🌟 All Formulations</span>
            <span className="bg-[#FFFFFF]/20 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {products.length}
            </span>
          </button>

          {allCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleOpenCollectionPage(card.id)}
              className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shadow-xs bg-[#FFFFFF] text-[#5C5149] border border-[#EADDCB] hover:bg-[#EADDCB] hover:text-[#232323]"
            >
              <span>{card.type === 'collection' ? '✨' : '🕯️'} {card.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-[#F5EFE6] text-[#7D6F63]">
                {card.count}
              </span>
            </button>
          ))}
        </div>

        {/* 2. Visual Category & Collection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {allCards.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenCollectionPage(item.id)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#EADDCB] hover:border-[#8B6F4E] hover:shadow-[0_16px_36px_rgba(139,111,78,0.14)] transition-all duration-500 flex flex-col justify-between relative hover:-translate-y-1.5"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#232323]">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#232323]/80 via-[#232323]/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                {/* Tag Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="bg-[#FFFFFF]/95 backdrop-blur-xs text-[#8B6F4E] text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-[#EADDCB] shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Count Pill */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <span className="bg-[#232323]/80 backdrop-blur-xs text-[#FFFFFF] text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-white/10">
                    {item.count} items
                  </span>
                </div>

                {/* Bottom Image Overlay Title */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#FFFFFF] drop-shadow-md truncate group-hover:text-[#EADDCB] transition-colors">
                    {item.name}
                  </h3>
                </div>
              </div>

              {/* Bottom Strip */}
              <div className="p-3 bg-[#FAF7F2] flex items-center justify-between border-t border-[#EADDCB] text-[11px]">
                <span className="text-[#5C5149] font-medium truncate pr-1">
                  {item.subtitle}
                </span>
                <span className="text-[#8B6F4E] font-bold shrink-0 group-hover:underline flex items-center gap-0.5">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
