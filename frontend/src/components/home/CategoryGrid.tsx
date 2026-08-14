import React, { useMemo } from 'react';
import { Badge, SparklesIcon, ChevronRightIcon, Button } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface CategoryGridProps {
  onNavigateToShop?: (categoryId?: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigateToShop }) => {
  const { products } = useCMS();

  // Dynamically derive categories and counts strictly from live CMS products added by the user
  const dynamicCategories = useMemo(() => {
    if (!products || products.length === 0) return [];

    const map = new Map<string, typeof products>();
    products.forEach((p) => {
      const cat = (p.category || 'Scented Candles').trim();
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(p);
    });

    return Array.from(map.entries()).map(([catName, prods]) => {
      const validPrices = prods
        .map((p) => Number(p.price))
        .filter((price) => !isNaN(price) && price > 0);
      const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
      const firstValidImg =
        prods.find((p) => p.image || p.imageUrl)?.image ||
        prods[0]?.imageUrl ||
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85';

      const isBest = prods.some((p) => p.isBestSeller);
      const isNew = prods.some((p) => p.isNew);

      return {
        id: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: catName,
        subtitle: prods[0]?.vesselDescription || `${prods.length} artisanal formulation${prods.length > 1 ? 's' : ''}`,
        count: `${prods.length} Product${prods.length > 1 ? 's' : ''}`,
        price: minPrice > 0 ? `From ₹${Math.round(minPrice)}` : '',
        image: firstValidImg,
        tag: isBest ? 'Bestseller' : isNew ? 'New Batch' : undefined,
      };
    });
  }, [products]);

  const handleCategoryClick = (catId: string) => {
    if (onNavigateToShop) {
      onNavigateToShop(catId);
    } else {
      window.location.hash = '#shop';
    }
  };

  // If no products/categories have been added yet in Admin CMS, show a clean, elegant setup card
  if (dynamicCategories.length === 0) {
    return (
      <section className="py-12 bg-[#FAF7F2] border-b border-[#E5DAC7] font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <Badge variant="gold" size="sm" icon={<SparklesIcon size={12} />}>
            LIVE PRODUCT CATALOGUE
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#241812]">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#5E4E42] max-w-md mx-auto">
            No products or categories added yet. Add your handcrafted candles in the Admin Panel and they will appear here live in real-time!
          </p>
          <div className="pt-2">
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                window.location.hash = '#admin';
              }}
            >
              Open Admin Panel to Add Products →
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E5DAC7] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#E5DAC7] pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2">
              <Badge variant="gold" size="sm" icon={<SparklesIcon size={12} />}>
                PRODUCT CATEGORIES
              </Badge>
              <span className="text-[11px] uppercase tracking-wider text-[#847262] font-semibold hidden sm:inline-block">
                • {dynamicCategories.length} Categories Live
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#241812] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#5E4E42] max-w-xl">
              Explore your live catalogue of handcrafted soy candles organized by vessel type and fragrance style.
            </p>
          </div>

          <a
            href="#categories"
            onClick={(e) => {
              e.preventDefault();
              handleCategoryClick('all');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#241812] hover:text-[#C5983A] transition-colors cursor-pointer group shrink-0"
          >
            <span>View All Categories</span>
            <ChevronRightIcon size={14} className="group-hover:translate-x-1 transition-transform text-[#C5983A]" />
          </a>
        </div>

        {/* Quick Visual Circle Story Strip (Aroma House / D2C Style) */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none">
          {dynamicCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 border-2 border-[#E5DAC7] group-hover:border-[#C5983A] group-hover:shadow-[0_0_15px_rgba(197,152,58,0.3)] transition-all duration-300 overflow-hidden bg-[#F5EEE4]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-[11px] font-bold text-[#241812] group-hover:text-[#C5983A] transition-colors max-w-[84px] text-center truncate">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* Plain, Simple, Clean & Attractive Dynamic Category Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dynamicCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#E5DAC7] hover:border-[#C5983A] hover:shadow-[0_16px_36px_rgba(36,24,18,0.11)] transition-all duration-300 flex flex-col justify-between relative hover:-translate-y-1.5"
            >
              {/* Image Container with Smooth Hover Scale */}
              <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-[#241812]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out brightness-[0.94] group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#180F0A]/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Floating Tag */}
                {cat.tag && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-[#FAF7F2]/90 backdrop-blur-xs text-[#241812] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E5DAC7] shadow-subtle">
                      {cat.tag}
                    </span>
                  </div>
                )}

                {/* Count Pill Top Right */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="bg-[#180F0A]/70 backdrop-blur-xs text-[#F5EEE4] text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
                    {cat.count}
                  </span>
                </div>
              </div>

              {/* Clean Bottom Label & Details */}
              <div className="p-3.5 sm:p-4 bg-[#FAF7F2] space-y-1 flex-1 flex flex-col justify-between border-t border-[#E5DAC7]/60">
                <div>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#241812] group-hover:text-[#C5983A] transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#847262] line-clamp-1 mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E5DAC7]/50 mt-2">
                  <span className="font-bold text-[#241812] text-[11px] sm:text-xs">
                    {cat.price}
                  </span>
                  <span className="text-[#C5983A] font-bold text-[11px] sm:text-xs group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    Shop →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
