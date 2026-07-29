import React, { useState } from 'react';
import { Card, Button, Badge, StarIcon, SparklesIcon, HeartIcon, useToast } from '../../design-system';

type CategoryTab = 'all' | 'woody' | 'floral' | 'vanilla' | 'aromatherapy';

const bestSellerProducts = [
  {
    id: 'bs-1',
    rank: '#1 Best Seller',
    category: 'woody',
    name: 'Smoked Leather & Tobacco Oud',
    vessel: 'Frosted Obsidian Glass (14 oz)',
    price: '$86.00',
    rating: 4.98,
    reviews: 312,
    scentFamily: 'Woody & Spiced',
    topNote: 'Cardamom & Cedar',
    heartNote: 'Smoked Tobacco Leaf',
    baseNote: 'Rich Leather Oud',
    burnTime: '65 Hours',
    stockLeft: 4,
  },
  {
    id: 'bs-2',
    rank: '#2 Best Seller',
    category: 'vanilla',
    name: 'Bourbon Vanilla & Crushed Tonka',
    vessel: 'Champagne Gold Jar (12 oz)',
    price: '$78.00',
    rating: 4.94,
    reviews: 284,
    scentFamily: 'Warm Vanilla',
    topNote: 'Crushed Tonka Bean',
    heartNote: 'French Bourbon Vanilla',
    baseNote: 'Warm Amber Resin',
    burnTime: '60 Hours',
    stockLeft: 9,
  },
  {
    id: 'bs-3',
    rank: '#3 Best Seller',
    category: 'floral',
    name: 'Damask Rose & Velvet Musk',
    vessel: 'Blush Ivory Vessel (12 oz)',
    price: '$82.00',
    rating: 4.91,
    reviews: 196,
    scentFamily: 'Floral Elegance',
    topNote: 'Pink Peppercorn',
    heartNote: 'Damask Rose Petals',
    baseNote: 'Velvet Musk',
    burnTime: '60 Hours',
    stockLeft: 12,
  },
  {
    id: 'bs-4',
    rank: '#4 Best Seller',
    category: 'aromatherapy',
    name: 'Wild Lavender & Bergamot Bloom',
    vessel: 'Matte Clay Pillar (16 oz)',
    price: '$72.00',
    rating: 4.89,
    reviews: 168,
    scentFamily: 'Aromatherapy',
    topNote: 'Calabrian Bergamot',
    heartNote: 'French Lavender',
    baseNote: 'White Sage',
    burnTime: '70 Hours',
    stockLeft: 6,
  },
];

export const BestSellers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [wishlist, setWishlist] = useState<string[]>(['bs-1']);
  const { toast } = useToast();

  const filteredProducts = activeTab === 'all'
    ? bestSellerProducts
    : bestSellerProducts.filter((p) => p.category === activeTab);

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
    <section id="best-sellers" className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[#E5D9C5] pb-6">
          <div className="space-y-2">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>CUSTOMER FAVORITES</Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1E17]">
              Our Best Sellers
            </h2>
            <p className="text-sm text-[#69574A]">
              The most loved fragrances hand-poured with pure soy wax and crackling wood wicks.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { key: 'all', label: 'All Most Loved' },
              { key: 'woody', label: 'Woody & Spiced' },
              { key: 'floral', label: 'Floral Elegance' },
              { key: 'vanilla', label: 'Warm Vanilla' },
              { key: 'aromatherapy', label: 'Aromatherapy' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as CategoryTab)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all shrink-0 ${activeTab === tab.key ? 'bg-[#2A1E17] text-[#FAF6F0] shadow-sm' : 'bg-[#F4EFE6] text-[#4A3B32] hover:bg-[#E5D9C5]'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Best Sellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <Card
              key={prod.id}
              variant="elevated"
              padding="none"
              className="bg-[#FAF6F0] group flex flex-col justify-between overflow-hidden relative"
            >
              {/* Product Image Mock */}
              <div className="relative h-64 bg-[#1C130E] flex items-center justify-center p-6">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                  🕯️
                </div>

                {/* Rank Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="gold" size="sm">{prod.rank}</Badge>
                </div>

                {/* Stock Warning Badge */}
                {prod.stockLeft <= 5 && (
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="warning" size="sm">Only {prod.stockLeft} Left</Badge>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(prod.id, prod.name)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${wishlist.includes(prod.id) ? 'bg-[#B33A3A] text-white' : 'bg-[#2A1E17]/60 text-white hover:bg-[#D4AF37] hover:text-[#1C130E]'}`}
                  aria-label="Wishlist"
                >
                  <HeartIcon size={16} />
                </button>
              </div>

              {/* Card Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#D4AF37] font-bold uppercase tracking-wider">{prod.scentFamily}</span>
                    <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                      <StarIcon size={14} className="fill-current text-[#D4AF37]" />
                      <span>{prod.rating}</span>
                      <span className="text-[#8C7A6B] font-normal">({prod.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-base font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-[#8C7A6B]">{prod.vessel}</p>
                </div>

                <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-[#2A1E17]">{prod.price}</span>
                    <span className="text-[10px] text-[#8C7A6B] block">{prod.burnTime}</span>
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
