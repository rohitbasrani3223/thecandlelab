import React from 'react';
import { Card, Badge, SparklesIcon } from '../../design-system';

const categories = [
  {
    id: 'glass-jars',
    name: 'Luxury Glass Jars',
    description: 'Heavy Italian frosted glass with blush rose foil branding & wooden lids.',
    itemsCount: '12 Fragrances',
    icon: '🕯️',
    tag: 'Flagship',
  },
  {
    id: 'travel-tins',
    name: 'Botanical Travel Tins',
    description: 'Seamless brass and blush travel tins engineered for compact portability.',
    itemsCount: '8 Fragrances',
    icon: '✨',
    tag: 'Compact',
  },
  {
    id: 'pillars',
    name: 'Aromatherapy Pillars',
    description: '100% pure organic beeswax and essential oil therapeutic pillar candles.',
    itemsCount: '15 Fragrances',
    icon: '🌿',
    tag: 'Pure Oils',
  },
  {
    id: 'diffusers',
    name: 'Reed Diffusers & Oils',
    description: 'Flame-free ambient fragrance diffusers with natural rattan reeds.',
    itemsCount: '6 Fragrances',
    icon: '💧',
    tag: 'Flame-Free',
  },
  {
    id: 'gift-boxes',
    name: 'Bespoke Gift Boxes',
    description: 'Handcrafted box sets featuring candles, blush ribbon, and snuffer tools.',
    itemsCount: '10 Sets',
    icon: '🎁',
    tag: 'Gift Sets',
  },
];

export interface CategoryCardsProps {
  onSelectCategory?: (id: string) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#F5E8EE] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>VESSEL TYPES</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1217]">
            Category Catalogue
          </h2>
          <p className="text-sm text-[#624855]">
            Select your preferred vessel format designed for specific home spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              variant="bordered"
              padding="lg"
              onClick={() => onSelectCategory?.(cat.id)}
              className="bg-[#FFFFFF] border-[#F5E8EE] rounded-3xl group cursor-pointer flex flex-col justify-between h-72 hover:-translate-y-1 hover:border-[#F9B8CA] hover:shadow-card transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF6F8] text-2xl flex items-center justify-center shadow-subtle group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <Badge variant="pink" size="sm">{cat.tag}</Badge>
                </div>

                <h3 className="text-lg font-serif font-bold text-[#1C1217] group-hover:text-[#E87A96] transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs text-[#886C7B] leading-relaxed font-light">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F5E8EE] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#624855]">{cat.itemsCount}</span>
                <span className="text-[#E87A96] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  Explore →
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
