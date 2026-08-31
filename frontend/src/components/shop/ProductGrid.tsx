import React, { useState } from 'react';
import { StarIcon, HeartIcon } from '../../design-system';
import type { ShopProduct } from './ProductListItem';

export interface ProductGridProps {
  products: ShopProduct[];
  onQuickView: (product: ShopProduct) => void;
  onSelectProduct?: (product: ShopProduct) => void;
  onNavigateToCart?: () => void;
  wishlist: string[];
  onToggleWishlist: (id: string, name: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onQuickView,
  onSelectProduct,
  onNavigateToCart,
  wishlist,
  onToggleWishlist,
}) => {
  const [cartAddedProduct, setCartAddedProduct] = useState<ShopProduct | null>(null);
  const handleProductClick = (prod: ShopProduct) => {
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else if (onQuickView) {
      onQuickView(prod);
    }
  };

  const handleAddToCartDirect = (prod: ShopProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const inrPrice = Math.round(prod.price || 0);
    const inrOriginal = prod.originalPrice ? Math.round(prod.originalPrice) : Math.round(inrPrice * 1.25);

    const itemToAdd = {
      id: prod.id,
      name: prod.name,
      category: prod.category || 'Scented Candles',
      price: inrPrice,
      originalPrice: inrOriginal,
      image: (prod as any).image || (prod as any).imageUrl || '',
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
      // Show mini cart-added notification
      setCartAddedProduct(prod);
      setTimeout(() => setCartAddedProduct(null), 3500);
    } catch (err) {
      console.error('Cart add error:', err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
      {products.map((prod) => {
        const isWishlisted = wishlist.includes(prod.id);
        const inrPrice = Math.round(prod.price || 0);
        const inrOriginal = prod.originalPrice ? Math.round(prod.originalPrice) : Math.round(inrPrice * 1.25);
        const discountAmount = inrOriginal - inrPrice;

        return (
          <div
            key={prod.id}
            className="group bg-white border border-[#EADDCB] rounded-3xl overflow-hidden shadow-subtle hover:shadow-card hover:border-[#EADDCB] transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Vessel Media Container */}
            <div
              onClick={() => handleProductClick(prod)}
              className="relative h-60 bg-[#FAF7F2] flex items-center justify-center cursor-pointer overflow-hidden rounded-t-3xl"
            >
              {((prod as any).image || (prod as any).imageUrl) ? (
                <img
                  src={(prod as any).image || (prod as any).imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF7F2] gap-2">
                  <span className="text-4xl">🕯️</span>
                  <span className="text-xs font-semibold text-[#7D6F63] text-center px-4">{prod.name}</span>
                  <span className="text-[10px] text-[#A39486]">No image yet</span>
                </div>
              )}

              {/* SAVE Discount Pill Badge */}
              {discountAmount > 0 && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#8B6F4E] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    SAVE ₹{discountAmount}
                  </span>
                </div>
              )}

              {/* Wishlist Circle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(prod.id, prod.name);
                }}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center transition-all z-20 cursor-pointer hover:scale-105 ${
                  isWishlisted ? 'text-[#BE123C]' : 'text-[#7D6F63] hover:text-[#8B6F4E]'
                }`}
                aria-label="Wishlist"
              >
                <HeartIcon size={16} className={isWishlisted ? 'fill-current text-[#BE123C]' : ''} />
              </button>

              {/* Hover Notes Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-[#232323]/90 text-white p-2.5 rounded-xl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs z-10">
                <div className="font-bold text-[#EADDCB] uppercase">Notes:</div>
                <div className="truncate text-[#F8F6F0]">{prod.topNotes}</div>
              </div>
            </div>

            {/* Lower Details Content Section */}
            <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between bg-white">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B6F4E] block">
                  {prod.category}
                </span>

                <h3
                  onClick={() => handleProductClick(prod)}
                  className="text-base font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors leading-snug cursor-pointer line-clamp-1"
                >
                  {prod.name}
                </h3>

                <p className="text-xs text-[#5C5149] italic truncate">
                  Notes: {prod.topNotes}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-xs text-[#E8C86D] font-bold pt-1">
                  <div className="flex text-[#E8C86D]">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-current text-[#E8C86D]" />
                    ))}
                  </div>
                  <span className="ml-1 text-[#232323]">{prod.rating}</span>
                  <span className="text-[#7D6F63] font-normal">({prod.reviewsCount})</span>
                </div>
              </div>

              {/* Bottom Price & Add to Cart Row */}
              <div className="pt-3 border-t border-[#EADDCB] flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  {inrOriginal && (
                    <span className="text-xs text-[#7D6F63] line-through font-normal">
                      ₹{inrOriginal}
                    </span>
                  )}
                  <span className="text-base font-bold text-[#232323]">
                    ₹{inrPrice}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleAddToCartDirect(prod, e)}
                    className="bg-[#8B6F4E] hover:bg-[#745A3D] text-white font-bold text-xs py-2 px-3.5 rounded-full flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                    </svg>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* ─── Cart Added Notification (Top Right Below Header) ─── */}
    {cartAddedProduct && (
      <div
        className="fixed top-16 left-3 right-3 sm:left-auto sm:right-6 sm:w-80 z-[9999] bg-white border border-[#EADDCB] rounded-3xl shadow-2xl overflow-hidden animate-slide-right font-sans"
        style={{ animation: 'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(110%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-[#15803D] flex items-center gap-1">
              ✓ Added to Bag
            </span>
            <button
              onClick={() => setCartAddedProduct(null)}
              className="text-[#7D6F63] hover:text-[#232323] text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] overflow-hidden shrink-0 border border-[#EADDCB]">
              {((cartAddedProduct as any).image || (cartAddedProduct as any).imageUrl) ? (
                <img
                  src={(cartAddedProduct as any).image || (cartAddedProduct as any).imageUrl}
                  alt={cartAddedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl flex items-center justify-center h-full">🕯️</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#232323] truncate">{cartAddedProduct.name}</p>
              <p className="text-[11px] text-[#8B6F4E] font-bold">₹{Math.round(cartAddedProduct.price || 0)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setCartAddedProduct(null);
                if (onNavigateToCart) {
                  onNavigateToCart();
                } else {
                  window.location.hash = '#cart';
                }
              }}
              className="w-full text-center text-xs py-2 bg-[#FAF7F2] text-[#232323] rounded-full border border-[#EADDCB] font-bold hover:bg-[#FDE8EF]"
            >
              View Bag
            </button>
            <button
              onClick={() => {
                setCartAddedProduct(null);
                window.location.hash = '#checkout';
              }}
              className="w-full text-center text-xs py-2 bg-[#8B6F4E] text-white rounded-full font-bold hover:bg-[#745A3D]"
            >
              Checkout →
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
