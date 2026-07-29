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
    price: '₹1,599.00',
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
    price: '₹1,499.00',
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
    price: '₹1,399.00',
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
    price: '₹1,299.00',
    rating: 4.88,
    reviews: 164,
    scentFamily: 'Aromatherapy',
    topNote: 'Calabrian Bergamot',
    heartNote: 'French Wild Lavender',
    baseNote: 'White Sage & Oakmoss',
    burnTime: '75 Hours',
    stockLeft: 6,
  },
];

export interface BestSellersProps {
  onNavigateToShop?: () => void;
}

export const BestSellers: React.FC<BestSellersProps> = () => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { toast } = useToast();

  const handleProductClick = () => {
    window.location.hash = '#pdp';
  };

  const toggleWishlist = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((w) => w !== id));
      toast({ type: 'info', title: 'Removed from Wishlist' });
    } else {
      setWishlist([...wishlist, id]);
      toast({ type: 'luxury', title: 'Saved to Wishlist', description: name });
    }
  };

  const filteredProducts = activeTab === 'all'
    ? bestSellerProducts
    : bestSellerProducts.filter((p) => p.category === activeTab);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-[#E5D9C5] pb-6">
          <div>
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>MOST LOVED FORMULATIONS</Badge>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1E17] mt-2">
              Boutique Best Sellers
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Best Sellers' },
              { id: 'woody', label: 'Woody & Spiced' },
              { id: 'vanilla', label: 'Warm Vanilla' },
              { id: 'floral', label: 'Floral' },
              { id: 'aromatherapy', label: 'Aromatherapy' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CategoryTab)}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#2A1E17] text-[#D4AF37] shadow-card'
                    : 'bg-transparent text-[#69574A] hover:text-[#2A1E17] hover:bg-[#F4EFE6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Best Seller Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const isWishlisted = wishlist.includes(prod.id);
            return (
              <Card
                key={prod.id}
                variant="bordered"
                padding="none"
                onClick={handleProductClick}
                className="bg-[#FAF6F0] group flex flex-col justify-between overflow-hidden hover:shadow-hover hover:border-[#D4AF37] transition-all duration-300 relative cursor-pointer"
              >
                {/* Vessel Image Mock */}
                <div className="relative h-64 bg-[#2A1E17] flex items-center justify-center p-6 overflow-hidden">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-500">🕯️</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/60 to-transparent" />

                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="gold" size="sm" icon={<SparklesIcon size={10} />}>
                      {prod.rank}
                    </Badge>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(prod.id, prod.name, e)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20 cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#B33A3A] text-white'
                        : 'bg-[#1C130E]/50 text-white hover:bg-[#D4AF37] hover:text-[#1C130E]'
                    }`}
                  >
                    <HeartIcon size={16} />
                  </button>

                  {/* Scent Notes Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#1C130E]/90 text-[#FAF6F0] p-2.5 rounded-xs text-[10px] space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs z-10">
                    <div className="font-semibold text-[#D4AF37] uppercase tracking-wider">Fragrance Notes:</div>
                    <div className="truncate text-[#E5D9C5]">
                      Top: {prod.topNote} | Heart: {prod.heartNote} | Base: {prod.baseNote}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8C7A6B] font-medium">{prod.scentFamily}</span>
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

                  <div className="pt-3 border-t border-[#E5D9C5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#2A1E17] font-serif">{prod.price}</span>
                      <span className="text-[10px] text-[#8C7A6B] font-mono">{prod.burnTime}</span>
                    </div>

                    <Button
                      variant="gold"
                      size="sm"
                      fullWidth
                      onClick={handleProductClick}
                    >
                      View Product Details →
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
