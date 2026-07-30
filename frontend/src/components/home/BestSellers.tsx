import React, { useState } from 'react';
import { Card, Button, Badge, StarIcon, SparklesIcon, HeartIcon, useToast } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

type CategoryTab = 'all' | 'woody' | 'floral' | 'vanilla' | 'aromatherapy';

export interface BestSellersProps {
  onNavigateToShop?: () => void;
}

export const BestSellers: React.FC<BestSellersProps> = () => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { toast } = useToast();
  const { products, settings } = useCMS();

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

  // Filter products from CMS for BestSellers
  const bestSellerList = products.filter((p) => p.isBestSeller).length > 0
    ? products.filter((p) => p.isBestSeller)
    : products.filter((p) => p.rating >= 4.85);

  const filteredProducts = activeTab === 'all'
    ? bestSellerList
    : bestSellerList.filter((p) => {
        const cat = p.scentProfile?.toLowerCase() || p.category?.toLowerCase() || '';
        if (activeTab === 'woody') return cat.includes('wood') || cat.includes('spice');
        if (activeTab === 'floral') return cat.includes('floral') || cat.includes('rose');
        if (activeTab === 'vanilla') return cat.includes('vanilla') || cat.includes('gourmand');
        if (activeTab === 'aromatherapy') return cat.includes('aroma') || cat.includes('fresh') || cat.includes('citrus');
        return true;
      });

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
          {filteredProducts.map((prod, idx) => {
            const isWishlisted = wishlist.includes(prod.id);
            const rankLabel = `#${idx + 1} Best Seller`;
            const formattedPrice = `${settings.currencySymbol}${prod.price}`;

            return (
              <Card
                key={prod.id}
                variant="bordered"
                padding="none"
                onClick={handleProductClick}
                className="bg-[#FAF6F0] group flex flex-col justify-between overflow-hidden hover:shadow-hover hover:border-[#D4AF37] transition-all duration-300 relative cursor-pointer"
              >
                {/* Vessel Image Container */}
                <div className="relative h-64 bg-[#FAF6F0] flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.imageUrl || [
                      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
                    ][idx % 4]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="gold" size="sm" icon={<SparklesIcon size={10} />}>
                      {rankLabel}
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
                      Top: {prod.topNotes || 'Bergamot'} | Heart: {prod.heartNotes || 'Rose'} | Base: {prod.baseNotes || 'Amber'}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8C7A6B] font-medium">{prod.scentProfile || prod.category}</span>
                      <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                        <StarIcon size={14} className="fill-current text-[#D4AF37]" />
                        <span>{prod.rating || 4.9}</span>
                        <span className="text-[#8C7A6B] font-normal">({prod.reviewsCount || 42})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#E5D9C5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#2A1E17] font-serif">{formattedPrice}</span>
                      <span className="text-[10px] text-[#8C7A6B] font-mono">{prod.burnTime || '60 Hours'}</span>
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
