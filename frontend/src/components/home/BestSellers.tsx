import React, { useState } from 'react';
import { Card, Button, Badge, StarIcon, SparklesIcon, HeartIcon, useToast } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

type CategoryTab = 'all' | 'woody' | 'floral' | 'vanilla' | 'aromatherapy';

export interface BestSellersProps {
  onNavigateToShop?: () => void;
  onSelectProduct?: (product: any) => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({ onSelectProduct }) => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { toast } = useToast();
  const { products, settings } = useCMS();

  const handleProductClick = (prod: any) => {
    try {
      localStorage.setItem('tcl_selected_product', JSON.stringify(prod));
    } catch { }
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else {
      window.location.hash = '#pdp';
    }
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
    : products.filter((p) => (p.rating || 0) >= 4.85);

  if (bestSellerList.length === 0) {
    return null;
  }

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
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E5DAC7] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-[#E5DAC7] pb-6">
          <div>
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>MOST LOVED FORMULATIONS</Badge>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#241812] mt-2">
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                    ? 'bg-[#241812] text-[#FDFBF8] shadow-card'
                    : 'bg-[#F5EEE4] text-[#5E4E42] hover:text-[#241812] hover:bg-[#EFE4D3] border border-[#E5DAC7]'
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
                onClick={() => handleProductClick(prod)}
                className="bg-[#FAF6F0] group flex flex-col justify-between overflow-hidden hover:shadow-[0_16px_36px_rgba(36,24,18,0.11)] hover:border-[#C5983A] border border-[#E5DAC7] transition-all duration-300 relative cursor-pointer rounded-2xl"
              >
                {/* Vessel Image Container */}
                <div className="relative h-64 bg-[#F5EEE4] flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image || prod.imageUrl || [
                      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'
                    ][idx % 4]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#180F0A]/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="gold" size="sm" icon={<SparklesIcon size={10} />}>
                      {rankLabel}
                    </Badge>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(prod.id, prod.name, e)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20 cursor-pointer ${isWishlisted
                        ? 'bg-[#BA6648] text-white'
                        : 'bg-[#180F0A]/50 text-white hover:bg-[#C5983A] hover:text-[#180F0A]'
                      }`}
                  >
                    <HeartIcon size={16} />
                  </button>

                  {/* Scent Notes Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#180F0A]/90 text-[#FAF7F2] p-2.5 rounded-md text-[10px] space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs z-10">
                    <div className="font-semibold text-[#DEB554] uppercase tracking-wider">Fragrance Notes:</div>
                    <div className="truncate text-[#E5DAC7]">
                      Top: {prod.topNotes || 'Bergamot'} | Heart: {prod.heartNotes || 'Rose'} | Base: {prod.baseNotes || 'Amber'}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#847262] font-medium">{prod.scentProfile || prod.category}</span>
                      <div className="flex items-center gap-1 text-[#C5983A] font-bold">
                        <StarIcon size={14} className="fill-current text-[#C5983A]" />
                        <span>{prod.rating || 4.9}</span>
                        <span className="text-[#847262] font-normal">({prod.reviewsCount || 42})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-[#241812] group-hover:text-[#C5983A] transition-colors leading-snug">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#E5DAC7] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#241812] font-serif">{formattedPrice}</span>
                      <span className="text-[10px] text-[#847262] font-mono">{prod.burnTime || '60 Hours'}</span>
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
