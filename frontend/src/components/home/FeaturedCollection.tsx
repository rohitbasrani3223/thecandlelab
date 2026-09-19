import React, { useState, useRef, useCallback } from 'react';
import { Card, Button, Badge, HeartIcon, StarIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon, useToast } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface FeaturedCollectionProps {
  onSelectProduct?: (product: any) => void;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ onSelectProduct }) => {
  const { toast } = useToast();
  const { products } = useCMS();
  const [wishlist, setWishlist] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const toggleWishlist = (id: string, name: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((w) => w !== id));
      toast({ type: 'info', title: 'Removed from Wishlist' });
    } else {
      setWishlist([...wishlist, id]);
      toast({ type: 'luxury', title: 'Saved to Wishlist', description: name });
    }
  };

  const handleProductClick = (prod: any) => {
    try {
      localStorage.setItem('tcl_selected_product', JSON.stringify(prod));
    } catch {}
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else {
      window.location.hash = '#pdp';
    }
  };

  const handleAddToCart = (prod: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const inrPrice = Math.round(prod.price || 0);
    const inrOriginal = (prod.originalPrice && prod.originalPrice > inrPrice) ? Math.round(prod.originalPrice) : undefined;

    const itemToAdd = {
      id: prod.id,
      name: prod.name,
      category: prod.category || 'Glass Jars',
      price: inrPrice,
      originalPrice: inrOriginal,
      image: prod.image || prod.imageUrl || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      quantity: 1,
      size: '12oz',
      wick: 'Organic Wood Wick',
    };

    try {
      const saved = localStorage.getItem('tcl_cart_items');
      const existing = saved ? JSON.parse(saved) : [];
      const index = existing.findIndex((i: any) => i.id === itemToAdd.id);
      if (index > -1) {
        existing[index].quantity += 1;
      } else {
        existing.push(itemToAdd);
      }
      localStorage.setItem('tcl_cart_items', JSON.stringify(existing));
      window.dispatchEvent(new Event('tcl-cart-updated'));
    } catch (err) {
      console.error('Cart add error:', err);
    }

    toast({ type: 'luxury', title: 'Added to Shopping Bag', description: prod.name });
  };

  // Show all live products prioritising featured
  const featuredList = (
    products.filter((p) => p.isFeatured).length > 0
      ? [...products.filter((p) => p.isFeatured), ...products.filter((p) => !p.isFeatured)]
      : products
  ).slice(0, 8);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 14 : clientWidth * 0.78;
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveSlideIndex(Math.max(0, Math.min(featuredList.length - 1, idx)));
  }, [featuredList.length]);

  const handleScroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 14 : el.clientWidth * 0.78;
    el.scrollBy({ left: dir === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  if (featuredList.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#EADDCB] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 border-b border-[#EADDCB] pb-6">
          <div className="text-center sm:text-left max-w-2xl space-y-2 sm:space-y-3">
            <Badge variant="pink" icon={<SparklesIcon size={12} />}>2026 ROYAL RESERVE</Badge>
            <h2 className="text-2xl sm:text-5xl font-serif font-bold text-[#232323]">
              Featured Royal Collection
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5149] leading-relaxed">
              Hand-poured in numbered small batches with custom-blended essential oils and pure blush rose gold labeling.
            </p>
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
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

        {/* Products Container: Mobile Swipe Carousel / Desktop Clean Grid */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 sm:gap-6 -mx-4 px-4 pb-4 no-scrollbar touch-pan-x sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible w-full max-w-full min-w-0"
        >
          {featuredList.map((prod) => {
            const isWishlisted = wishlist.includes(prod.id);
            const inrPrice = Math.round(prod.price || 0);
            const formattedPrice = `₹${inrPrice.toLocaleString('en-IN')}`;
            const origPrice = (prod.originalPrice && prod.originalPrice > inrPrice) ? `₹${Math.round(prod.originalPrice).toLocaleString('en-IN')}` : null;

            return (
              <Card
                key={prod.id}
                variant="bordered"
                padding="none"
                onClick={() => handleProductClick(prod)}
                className="w-[78vw] max-w-[290px] shrink-0 snap-start sm:w-auto sm:max-w-none bg-[#FFFFFF] group flex flex-col justify-between overflow-hidden hover:shadow-[0_16px_36px_rgba(230,106,138,0.12)] border border-[#EADDCB] hover:border-[#EADDCB] transition-all duration-300 relative cursor-pointer rounded-3xl"
              >
                {/* Product Image Container */}
                <div className="relative h-60 sm:h-64 bg-[#FAF7F2] flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image || prod.imageUrl || prod.images?.[0] || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141312]/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                  {/* Tag Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="pink" size="sm">{prod.collection || 'Flagship'}</Badge>
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod.id, prod.name);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${isWishlisted ? 'bg-[#8B6F4E] text-white' : 'bg-[#141312]/50 text-white hover:bg-[#8B6F4E] hover:text-white'}`}
                    aria-label="Wishlist"
                  >
                    <HeartIcon size={16} />
                  </button>

                  {/* Scent Pyramid Pill Hover overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#141312]/90 text-[#FFFFFF] p-2.5 rounded-xl text-[10px] space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs border border-[#EADDCB]/20">
                    <div className="font-semibold text-[#EADDCB] uppercase tracking-wider">Fragrance Notes:</div>
                    <div className="truncate text-[#FCD5E2]">Top: {prod.topNotes || 'Bergamot'} • Heart: {prod.heartNotes || 'Rose'} • Base: {prod.baseNotes || 'Amber'}</div>
                  </div>
                </div>

                {/* Product Details Content */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#7D6F63] font-medium">{prod.scentProfile || prod.category}</span>
                      <div className="flex items-center gap-1 text-[#E8C86D] font-bold">
                        <StarIcon size={14} className="fill-current text-[#E8C86D]" />
                        <span>{prod.rating || 4.9}</span>
                        <span className="text-[#7D6F63] font-normal">({prod.reviewsCount || 88})</span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors leading-snug line-clamp-1 sm:line-clamp-none">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#EADDCB] flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#232323]">{formattedPrice}</span>
                      {origPrice && <span className="text-xs text-[#7D6F63] line-through">{origPrice}</span>}
                    </div>

                    <Button
                      variant="pink"
                      size="sm"
                      onClick={(e) => handleAddToCart(prod, e)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Mobile Pagination Indicator & Swipe Hint (Only on Mobile) */}
        {featuredList.length > 1 && (
          <div className="flex sm:hidden items-center justify-between pt-1 px-1">
            <span className="text-[10px] font-bold text-[#8B6F4E] tracking-wider uppercase flex items-center gap-1">
              <span>👈 Swipe Featured Reserve 👉</span>
            </span>
            <div className="flex items-center gap-1.5">
              {featuredList.slice(0, 8).map((_, i) => (
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
