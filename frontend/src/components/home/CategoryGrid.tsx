import React, { useMemo } from 'react';
import { Badge, SparklesIcon, ChevronRightIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface CategoryGridProps {
  onNavigateToShop?: (categoryId?: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigateToShop }) => {
  const { products, mainCategories } = useCMS();

  // Show real categories from mainCategories or derive dynamically from live products
  const displayCategories = useMemo(() => {
    if (mainCategories && mainCategories.length > 0) {
      return mainCategories
        .filter((c) => c.isActive !== false)
        .map((cat) => {
          const prods = (products || []).filter(
            (p) => p.mainCategoryId === cat.id || p.category === cat.name
          );
          const validPrices = prods
            .map((p) => Number(p.price))
            .filter((price) => !isNaN(price) && price > 0);
          const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
          const fallbackImg = prods.find((p) => p.image || p.imageUrl)?.image || prods[0]?.imageUrl || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85';

          return {
            id: cat.id,
            name: cat.name,
            subtitle: cat.description || `${prods.length} artisanal formulation${prods.length === 1 ? '' : 's'}`,
            count: `${prods.length} Product${prods.length === 1 ? '' : 's'}`,
            price: minPrice > 0 ? `From ₹${Math.round(minPrice)}` : '',
            image: cat.imageUrl || cat.bannerDesktop || fallbackImg,
            tag: prods.some((p) => p.isBestSeller) ? 'Bestseller' : undefined,
          };
        });
    }

    // Derive dynamically from active products so nothing disappears
    if (products && products.length > 0) {
      const uniqueCats = Array.from(new Set(products.map((p) => p.category || 'Scented Candles')));
      return uniqueCats.map((catName) => {
        const prods = products.filter((p) => (p.category || 'Scented Candles') === catName);
        const validPrices = prods
          .map((p) => Number(p.price))
          .filter((price) => !isNaN(price) && price > 0);
        const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
        const fallbackImg = prods[0]?.image || prods[0]?.imageUrl || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85';

        return {
          id: catName,
          name: catName,
          subtitle: `${prods.length} handcrafted candle${prods.length === 1 ? '' : 's'}`,
          count: `${prods.length} Product${prods.length === 1 ? '' : 's'}`,
          price: minPrice > 0 ? `From ₹${Math.round(minPrice)}` : '',
          image: fallbackImg,
          tag: prods.some((p) => p.isBestSeller) ? 'Bestseller' : undefined,
        };
      });
    }

    return [];
  }, [products, mainCategories]);

  const handleCategoryClick = (catNameOrId: string) => {
    if (onNavigateToShop) {
      onNavigateToShop(catNameOrId);
    } else {
      window.location.hash = '#shop';
    }
  };

  // If user hasn't added categories yet, do not render any fake placeholder categories
  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E5DAC7] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#E5DAC7] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <Badge variant="gold" size="sm" icon={<SparklesIcon size={12} />}>
                PRODUCT CATEGORIES
              </Badge>
              <span className="text-[11px] uppercase tracking-wider text-[#847262] font-semibold hidden sm:inline-block">
                • {displayCategories.length} Categories Live
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#241812] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#5E4E42] max-w-xl">
              Handcrafted botanical soy candles, aromatic diffusers, and luxury home fragrances curated for every space.
            </p>
          </div>

          <a
            href="#categories"
            onClick={(e) => {
              e.preventDefault();
              handleCategoryClick('all');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#241812] hover:text-[#C5983A] transition-colors cursor-pointer group shrink-0 pb-1"
          >
            <span>View All Categories</span>
            <ChevronRightIcon size={14} className="group-hover:translate-x-1.5 transition-transform text-[#C5983A]" />
          </a>
        </div>

        {/* Clean, Premium Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#E5DAC7] hover:border-[#C5983A] hover:shadow-[0_20px_40px_rgba(36,24,18,0.12)] transition-all duration-500 flex flex-col justify-between relative hover:-translate-y-1.5"
            >
              {/* Image Container with Luxury Overlay */}
              <div className="relative aspect-16/10 sm:aspect-4/3 overflow-hidden bg-[#1E130D]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140D09]/80 via-[#140D09]/20 to-transparent opacity-75 group-hover:opacity-60 transition-opacity" />

                {/* Floating Tag */}
                {cat.tag && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#FAF7F2]/95 backdrop-blur-md text-[#241812] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#E5DAC7] shadow-sm">
                      {cat.tag}
                    </span>
                  </div>
                )}

                {/* Product Count Pill */}
                <div className="absolute top-3 right-3">
                  <span className="bg-[#140D09]/80 backdrop-blur-md text-[#F5EEE4] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                    {cat.count}
                  </span>
                </div>

                {/* Overlay Title on Mobile/Hover */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                  <div className="space-y-0.5">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF7F2] drop-shadow-md group-hover:text-[#E6CA65] transition-colors">
                      {cat.name}
                    </h3>
                    {cat.price && (
                      <span className="text-xs font-semibold text-[#E5D9C5] drop-shadow-sm block">
                        {cat.price}
                      </span>
                    )}
                  </div>
                  <span className="w-8 h-8 rounded-full bg-[#FAF7F2] text-[#241812] group-hover:bg-[#C5983A] group-hover:text-[#180F0A] flex items-center justify-center text-sm font-bold shadow-md group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </div>
              </div>

              {/* Bottom Details Strip */}
              <div className="p-4 bg-[#FAF7F2] flex items-center justify-between border-t border-[#E5DAC7]/70 text-xs">
                <p className="text-[#847262] text-[12px] line-clamp-1 flex-1 pr-2 font-medium">
                  {cat.subtitle}
                </p>
                <span className="text-[#C5983A] font-extrabold text-[11px] uppercase tracking-wider shrink-0 group-hover:underline">
                  Shop Now
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
