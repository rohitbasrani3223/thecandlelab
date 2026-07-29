import React from 'react';
import { StarIcon, HeartIcon } from '../../design-system';
import type { ShopProduct } from './ProductListItem';

export interface ProductGridProps {
  products: ShopProduct[];
  onQuickView: (product: ShopProduct) => void;
  onSelectProduct?: (product: ShopProduct) => void;
  wishlist: string[];
  onToggleWishlist: (id: string, name: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onQuickView,
  onSelectProduct,
  wishlist,
  onToggleWishlist,
}) => {
  const handleProductClick = (prod: ShopProduct) => {
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else {
      window.location.hash = '#pdp';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
      {products.map((prod) => {
        const isWishlisted = wishlist.includes(prod.id);
        const inrPrice = prod.price < 300 ? Math.round(prod.price * 19) : Math.round(prod.price);
        const inrOriginal = prod.originalPrice
          ? (prod.originalPrice < 300 ? Math.round(prod.originalPrice * 19) : Math.round(prod.originalPrice))
          : Math.round(inrPrice * 1.25);
        const discountAmount = inrOriginal - inrPrice;

        return (
          <div
            key={prod.id}
            className="group bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle hover:shadow-hover hover:border-[#B88B38] transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Vessel Media Container */}
            <div
              onClick={() => handleProductClick(prod)}
              className="relative h-60 bg-[#F8F3EA] flex items-center justify-center p-6 cursor-pointer overflow-hidden rounded-t-2xl"
            >
              {/* SAVE Discount Red Pill Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#B93829] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  SAVE ₹{discountAmount}
                </span>
              </div>

              {/* Wishlist Circle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(prod.id, prod.name);
                }}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center transition-all z-20 cursor-pointer hover:scale-105 ${
                  isWishlisted ? 'text-[#B93829]' : 'text-[#4A3B32] hover:text-[#B88B38]'
                }`}
                aria-label="Wishlist"
              >
                <HeartIcon size={16} className={isWishlisted ? 'fill-current text-[#B93829]' : ''} />
              </button>

              {/* Center Emblem Icon Circle Container */}
              <div className="w-16 h-16 rounded-full bg-white shadow-card flex items-center justify-center border border-[#EFE8DB] group-hover:scale-110 transition-transform duration-500 text-[#B88B38]">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-9-9h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a4 4 0 014 4c0 2.5-4 6-4 6s-4-3.5-4-6a4 4 0 014-4z" />
                </svg>
              </div>

              {/* Hover Notes Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-[#2D1E15]/90 text-white p-2 rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs z-10">
                <div className="font-bold text-[#D4AF37] uppercase">Notes:</div>
                <div className="truncate text-[#E5D9C5]">{prod.topNotes}</div>
              </div>
            </div>

            {/* Lower Details Content Section */}
            <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between bg-white">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B88B38] block">
                  {prod.category}
                </span>

                <h3
                  onClick={() => handleProductClick(prod)}
                  className="text-base font-serif font-bold text-[#2C1E16] group-hover:text-[#B88B38] transition-colors leading-snug cursor-pointer line-clamp-1"
                >
                  {prod.name}
                </h3>

                <p className="text-xs text-[#7A6B5D] italic truncate">
                  Notes: {prod.topNotes}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-xs text-[#B88B38] font-bold pt-1">
                  <div className="flex text-[#B88B38]">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-current text-[#B88B38]" />
                    ))}
                  </div>
                  <span className="ml-1 text-[#2C1E16]">{prod.rating}</span>
                  <span className="text-[#8C7A6B] font-normal">({prod.reviewsCount})</span>
                </div>
              </div>

              {/* Bottom Price & Add to Cart Row */}
              <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  {inrOriginal && (
                    <span className="text-xs text-[#8C7A6B] line-through font-normal">
                      ₹{inrOriginal}
                    </span>
                  )}
                  <span className="text-base font-bold text-[#2C1E16]">
                    ₹{inrPrice}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleProductClick(prod)}
                    className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
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
  );
};
