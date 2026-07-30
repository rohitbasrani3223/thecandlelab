import React from 'react';
import { Card, Badge, ChevronRightIcon } from '../../design-system';

const categories = [
  {
    id: 'glass-jars',
    title: 'Luxury Glass Jars',
    description: 'Heavy-base Italian frosted glass with wooden lids.',
    count: '12 Fragrances',
    icon: '🕯️',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'travel-tins',
    title: 'Botanical Travel Tins',
    description: 'Seamless brass and matte black travel tins.',
    count: '8 Fragrances',
    icon: '✨',
    tag: 'Compact',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pillars',
    title: 'Aromatherapy Pillars',
    description: 'Unscented & essential oil pure beeswax pillars.',
    count: '15 Fragrances',
    icon: '🌿',
    tag: 'Pure Oils',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'diffusers',
    title: 'Reed Diffusers & Oils',
    description: 'Long-lasting flame-free ambient fragrance.',
    count: '6 Fragrances',
    icon: '💧',
    tag: 'Flame-Free',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gift-boxes',
    title: 'Bespoke Gift Sets',
    description: 'Curated candle & wick trimmer gift sets.',
    count: '10 Sets',
    icon: '🎁',
    tag: 'Luxury Box',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
  },
];

export interface CategoryGridProps {
  onNavigateToShop?: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigateToShop }) => {
  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToShop) {
      window.location.hash = '#categories';
    } else {
      window.location.hash = '#categories';
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#E5D9C5] pb-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
              Curated Vessel Types
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1E17]">
              Explore by Category
            </h2>
          </div>
          <a
            href="#shop"
            onClick={handleCategoryClick}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2A1E17] hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <span>View All Categories</span>
            <ChevronRightIcon size={14} />
          </a>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              variant="gold-border"
              padding="none"
              onClick={handleCategoryClick}
              className="group cursor-pointer flex flex-col justify-between h-72 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden bg-[#FAF6F0] hover:shadow-card hover:border-[#D4AF37] border border-[#E5D9C5]"
            >
              {/* Card Image Header */}
              <div className="relative h-36 overflow-hidden bg-[#2A1E17]">
                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0] via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-lg flex items-center justify-center shadow-subtle">
                    {cat.icon}
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="gold" size="sm">{cat.tag}</Badge>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-[#8C7A6B] leading-snug line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E5D9C5] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#69574A]">{cat.count}</span>
                  <span className="text-[#D4AF37] font-bold group-hover:translate-x-1 transition-transform">
                    Browse →
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
