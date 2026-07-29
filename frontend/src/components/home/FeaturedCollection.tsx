import React, { useState } from 'react';
import { Card, Button, Badge, HeartIcon, StarIcon, SparklesIcon, useToast } from '../../design-system';

const featuredProducts = [
  {
    id: 'prod-1',
    name: 'Velvet Rose & Smoked Amber',
    subtitle: 'Signature Reserve Glass',
    price: '$78.00',
    originalPrice: '$90.00',
    rating: 4.9,
    reviews: 142,
    tag: 'Flagship',
    topNote: 'Bergamot',
    heartNote: 'Damask Rose',
    baseNote: 'Smoked Amber',
    inStock: true,
  },
  {
    id: 'prod-2',
    name: 'French Bourbon Vanilla Bean',
    subtitle: 'Luxury 3-Wick Vessel',
    price: '$94.00',
    originalPrice: '$110.00',
    rating: 4.95,
    reviews: 98,
    tag: 'Best Seller',
    topNote: 'Crushed Tonka',
    heartNote: 'Bourbon Vanilla',
    baseNote: 'White Musk',
    inStock: true,
  },
  {
    id: 'prod-3',
    name: 'Mysore Sandalwood & Cedar',
    subtitle: 'Botanical Travel Tin',
    price: '$42.00',
    originalPrice: '$50.00',
    rating: 4.85,
    reviews: 76,
    tag: 'Limited Edition',
    topNote: 'Golden Cedar',
    heartNote: 'Mysore Sandalwood',
    baseNote: 'Vetiver',
    inStock: true,
  },
  {
    id: 'prod-4',
    name: 'Bergamot & White Jasmine Bloom',
    subtitle: 'Aromatherapy Soy Glass',
    price: '$68.00',
    originalPrice: '$80.00',
    rating: 4.88,
    reviews: 114,
    tag: 'Calming',
    topNote: 'Italian Citrus',
    heartNote: 'White Jasmine',
    baseNote: 'Cashmere Wood',
    inStock: true,
  },
];

export const FeaturedCollection: React.FC = () => {
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<string[]>(['prod-1']);

  const toggleWishlist = (id: string, name: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((w) => w !== id));
      toast({ type: 'info', title: 'Removed from Wishlist' });
    } else {
      setWishlist([...wishlist, id]);
      toast({ type: 'luxury', title: 'Saved to Wishlist', description: name });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>2026 ROYAL RESERVE</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1E17]">
            Featured Royal Collection
          </h2>
          <p className="text-sm text-[#69574A] leading-relaxed">
            Hand-poured in numbered small batches with custom-blended essential oils and 24K gold foil labeling.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <Card
              key={prod.id}
              variant="bordered"
              padding="none"
              className="bg-[#FAF6F0] group flex flex-col justify-between overflow-hidden hover:shadow-hover transition-all duration-300 relative"
            >
              {/* Product Image Mock Container */}
              <div className="relative h-64 bg-[#2A1E17] flex items-center justify-center p-6 overflow-hidden">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                  🕯️
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/60 to-transparent" />

                {/* Tag Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="gold" size="sm">{prod.tag}</Badge>
                </div>

                {/* Wishlist Heart */}
                <button
                  onClick={() => toggleWishlist(prod.id, prod.name)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${wishlist.includes(prod.id) ? 'bg-[#B33A3A] text-white' : 'bg-[#1C130E]/50 text-white hover:bg-[#D4AF37] hover:text-[#1C130E]'}`}
                  aria-label="Wishlist"
                >
                  <HeartIcon size={16} />
                </button>

                {/* Scent Pyramid Pill Hover overlay */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#1C130E]/90 text-[#FAF6F0] p-2.5 rounded-xs text-[10px] space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs">
                  <div className="font-semibold text-[#D4AF37] uppercase tracking-wider">Fragrance Notes:</div>
                  <div className="truncate text-[#E5D9C5]">Top: {prod.topNote} • Heart: {prod.heartNote} • Base: {prod.baseNote}</div>
                </div>
              </div>

              {/* Product Details Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8C7A6B] font-medium">{prod.subtitle}</span>
                    <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                      <StarIcon size={14} className="fill-current text-[#D4AF37]" />
                      <span>{prod.rating}</span>
                      <span className="text-[#8C7A6B] font-normal">({prod.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-base font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {prod.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-[#2A1E17]">{prod.price}</span>
                    <span className="text-xs text-[#8C7A6B] line-through">{prod.originalPrice}</span>
                  </div>

                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => toast({ type: 'luxury', title: 'Added to Cart', description: prod.name })}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
