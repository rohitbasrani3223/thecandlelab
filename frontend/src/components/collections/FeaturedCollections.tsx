import React from 'react';
import { Badge, SparklesIcon } from '../../design-system';

const featuredCollections = [
  {
    id: 'scented-candles',
    name: 'Scented Candles Collection',
    icon: '🕯️',
    tagline: 'Aromatherapy Infused 100% Pure Botanical Soy',
    count: '12 Formulations',
    scents: 'Velvet Rose, Smoked Amber, Bergamot',
    badge: 'LUXURY SOY RESERVE',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'floral-collection',
    name: 'Floral Collection',
    icon: '🌸',
    tagline: 'Hand-poured floral bouquets of Rose, Lavender & Jasmine',
    count: '8 Formulations',
    scents: 'Damask Rose, Wild Lavender, Jasmine Bloom',
    badge: 'ROMANTIC FLORALS',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'vanilla-collection',
    name: 'Vanilla Collection',
    icon: '🍦',
    tagline: 'Warm Madagascar vanilla bean, crushed tonka & bourbon',
    count: '10 Formulations',
    scents: 'Madagascar Vanilla, Bourbon, Caramel Amber',
    badge: 'GOURMAND FAVORITES',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'coffee-collection',
    name: 'Coffee Collection',
    icon: '☕',
    tagline: 'Rich roasted Arabica coffee beans & dark cacao nibs',
    count: '6 Formulations',
    scents: 'Roasted Arabica, Dark Cacao, Smoked Hazelnut',
    badge: 'ENERGIZING AROMA',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'festive-collection',
    name: 'Festive Collection',
    icon: '🌲',
    tagline: 'Spiced cinnamon bark, glowing amber & winter pine',
    count: '7 Formulations',
    scents: 'Ceylon Cinnamon, Clove, Smoked Fir',
    badge: 'HOLIDAY EXCLUSIVE',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'gift-boxes',
    name: 'Bespoke Gift Boxes',
    icon: '🎁',
    tagline: 'Curated candle sets with matte brass wick trimmers',
    count: '10 Sets',
    scents: 'Custom Candle Trios + Brass Accessories',
    badge: 'LUXURY GIFTING',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'luxury-jars',
    name: 'Luxury Glass Jars',
    icon: '🕯️',
    tagline: 'Heavy Italian frosted glass vessels with wooden lids',
    count: '14 Formulations',
    scents: 'Smoked Leather, Tobacco Oud, Vanilla',
    badge: 'ITALIAN GLASS',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'wax-melts',
    name: 'Flame-Free Wax Melts',
    icon: '⚡',
    tagline: 'Flame-free ambient melts formulated with pure essential oils',
    count: '9 Formulations',
    scents: 'Lavender, Rose Petals, Cardamom',
    badge: 'FLAME FREE',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
  },
];

export interface FeaturedCollectionsProps {
  onSelectCollection?: (id: string) => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ onSelectCollection }) => {
  const handleCollectionClick = (id: string) => {
    if (onSelectCollection) {
      onSelectCollection(id);
    } else {
      window.location.hash = '#shop';
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>CURATED COLLECTIONS (8)</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1E17]">
            Our 8 Signature Collections
          </h2>
          <p className="text-sm text-[#69574A]">
            Curated vessel and scent groupings formulated for high aesthetic & olfactory impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCollections.map((col) => (
            <div
              key={col.id}
              onClick={() => handleCollectionClick(col.id)}
              className="bg-white rounded-2xl border border-[#EFE8DB] overflow-hidden shadow-subtle group cursor-pointer hover:border-[#B88B38] hover:shadow-card transition-all flex flex-col justify-between"
            >
              {/* Image Preview Stage */}
              <div className="relative h-48 bg-[#F8F3EA] overflow-hidden">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E16]/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="bg-[#B88B38] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {col.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 text-[10px] font-bold bg-[#2C1E16]/90 text-white px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {col.count}
                </div>
              </div>

              {/* Editorial Description Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">{col.icon}</span>
                    <h3 className="text-base font-serif font-bold text-[#2C1E16] group-hover:text-[#B88B38] transition-colors leading-snug">
                      {col.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A6B5D] font-light leading-relaxed line-clamp-2">
                    {col.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                  <span className="text-[#B88B38] font-bold truncate max-w-[150px]">{col.scents}</span>
                  <button className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-[11px] py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer shrink-0">
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
