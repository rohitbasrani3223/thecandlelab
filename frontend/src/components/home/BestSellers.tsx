import React, { useState, useRef, useCallback } from 'react';
import { Card, Button, Badge, StarIcon, SparklesIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon, useToast } from '../../design-system';
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

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
    : products;

  if (products.length === 0) {
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

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 14 : clientWidth * 0.78;
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveSlideIndex(Math.max(0, Math.min(filteredProducts.length - 1, idx)));
  }, [filteredProducts.length]);

  const handleScroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 14 : el.clientWidth * 0.78;
    el.scrollBy({ left: dir === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F8F6F0] border-b border-[#EADDCB] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 border-b border-[#EADDCB] pb-6 w-full max-w-full min-w-0">
          <div className="space-y-1 sm:space-y-2">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>MOST LOVED FORMULATIONS</Badge>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#232323]">
              Boutique Best Sellers
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Filter Tabs */}
            <div className="w-full sm:w-auto max-w-full min-w-0 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 pb-2 sm:pb-0 touch-pan-x">
              {[
                { id: 'all', label: 'All Best Sellers' },
                { id: 'woody', label: 'Woody & Spiced' },
                { id: 'vanilla', label: 'Warm Vanilla' },
                { id: 'floral', label: 'Floral & Rose' },
                { id: 'aromatherapy', label: 'Aromatherapy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as CategoryTab);
                    if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] sm:min-h-[32px] flex items-center justify-center ${
                    activeTab === tab.id
                      ? 'bg-[#232323] text-[#FFFFFF] shadow-sm'
                      : 'bg-[#FFFFFF] text-[#5C5149] hover:text-[#232323] hover:bg-[#EADDCB] border border-[#EADDCB]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mobile Navigation Arrows */}
            <div className="flex sm:hidden items-center gap-1.5 shrink-0 pl-1">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#EADDCB] flex items-center justify-center text-[#232323] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAF7F2] transition-all cursor-pointer shadow-xs"
                aria-label="Previous candle"
              >
                <ChevronLeftIcon size={14} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#EADDCB] flex items-center justify-center text-[#232323] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAF7F2] transition-all cursor-pointer shadow-xs"
                aria-label="Next candle"
              >
                <ChevronRightIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Best Seller Container: Mobile Horizontal Swipe Carousel / Desktop Clean Grid */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 sm:gap-6 -mx-4 px-4 pb-4 no-scrollbar touch-pan-x sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible w-full max-w-full min-w-0"
        >
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
                className="w-[78vw] max-w-[290px] shrink-0 snap-start sm:w-auto sm:max-w-none bg-[#FFFFFF] group flex flex-col justify-between overflow-hidden hover:shadow-[0_16px_36px_rgba(139,111,78,0.14)] hover:border-[#8B6F4E] border border-[#EADDCB] transition-all duration-300 relative cursor-pointer rounded-3xl"
              >
                {/* Vessel Image Container */}
                <div className="relative h-60 sm:h-64 bg-[#FAF7F2] flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image || prod.imageUrl || prod.images?.[0] || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#232323]/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="pink" size="sm" icon={<SparklesIcon size={10} />}>
                      {rankLabel}
                    </Badge>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(prod.id, prod.name, e)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20 cursor-pointer shadow-sm ${isWishlisted
                        ? 'bg-[#8B6F4E] text-white'
                        : 'bg-[#232323]/60 text-white hover:bg-[#8B6F4E] hover:text-white'
                      }`}
                  >
                    <HeartIcon size={16} />
                  </button>

                  {/* Scent Notes Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#232323]/90 text-[#FFFFFF] p-2.5 rounded-xl text-[10px] space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs z-10 border border-[#EADDCB]/20">
                    <div className="font-semibold text-[#EADDCB] uppercase tracking-wider">Fragrance Notes:</div>
                    <div className="truncate text-[#DFCFBC]">
                      Top: {prod.topNotes || 'Bergamot'} | Heart: {prod.heartNotes || 'Rose'} | Base: {prod.baseNotes || 'Amber'}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#7D6F63] font-medium">{prod.scentProfile || prod.category}</span>
                      <div className="flex items-center gap-1 text-[#8B6F4E] font-bold">
                        <StarIcon size={14} className="fill-current text-[#8B6F4E]" />
                        <span>{prod.rating || 4.9}</span>
                        <span className="text-[#7D6F63] font-normal">({prod.reviewsCount || 42})</span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors leading-snug line-clamp-1 sm:line-clamp-none">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#EADDCB] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg font-bold text-[#232323] font-serif">{formattedPrice}</span>
                      <span className="text-[10px] text-[#7D6F63] font-mono">{prod.burnTime || '60 Hours'}</span>
                    </div>

                    <Button
                      variant="pink"
                      size="sm"
                      fullWidth
                      onClick={() => handleProductClick(prod)}
                    >
                      View Formulation →
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Mobile Pagination Indicator & Swipe Hint (Only on Mobile) */}
        {filteredProducts.length > 1 && (
          <div className="flex sm:hidden items-center justify-between pt-1 px-1">
            <span className="text-[10px] font-bold text-[#8B6F4E] tracking-wider uppercase flex items-center gap-1">
              <span>👈 Swipe Best Sellers 👉</span>
            </span>
            <div className="flex items-center gap-1.5">
              {filteredProducts.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const el = scrollRef.current;
                    if (!el) return;
                    const card = el.children[i] as HTMLElement;
                    if (card) {
                      el.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
                    }
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    activeSlideIndex === i
                      ? 'w-5 h-1.5 bg-[#8B6F4E]'
                      : 'w-1.5 h-1.5 bg-[#EADDCB]'
                  }`}
                  aria-label={`Go to product ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
