import { Card, Badge, ChevronRightIcon } from '../../design-system';


const categories = [
  {
    id: 'glass-jars',
    title: 'Luxury Glass Jars',
    description: 'Heavy-base Italian frosted glass with wooden lids.',
    count: '12 Fragrances',
    icon: '🕯️',
    tag: 'Popular',
  },
  {
    id: 'travel-tins',
    title: 'Botanical Travel Tins',
    description: 'Seamless brass and matte black travel tins.',
    count: '8 Fragrances',
    icon: '✨',
    tag: 'Compact',
  },
  {
    id: 'pillars',
    title: 'Aromatherapy Pillars',
    description: 'Unscented & essential oil pure beeswax pillars.',
    count: '15 Fragrances',
    icon: '🌿',
    tag: 'Pure Oils',
  },
  {
    id: 'diffusers',
    title: 'Reed Diffusers & Oils',
    description: 'Long-lasting flame-free ambient fragrance.',
    count: '6 Fragrances',
    icon: '💧',
    tag: 'Flame-Free',
  },
  {
    id: 'gift-boxes',
    title: 'Bespoke Gift Sets',
    description: 'Curated candle & wick trimmer gift sets.',
    count: '10 Sets',
    icon: '🎁',
    tag: 'Luxury Box',
  },
];

export const CategoryGrid: React.FC = () => {
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
            href="#all-categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2A1E17] hover:text-[#D4AF37] transition-colors"
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
              padding="lg"
              className="group cursor-pointer flex flex-col justify-between h-64 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-[#F4EFE6] text-2xl flex items-center justify-center shadow-subtle group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <Badge variant="gold" size="sm">{cat.tag}</Badge>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#8C7A6B] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5D9C5] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#69574A]">{cat.count}</span>
                <span className="text-[#D4AF37] font-bold group-hover:translate-x-1 transition-transform">
                  Browse →
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
