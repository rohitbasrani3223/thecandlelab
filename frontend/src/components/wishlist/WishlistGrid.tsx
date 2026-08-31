import React from 'react';
import { StarIcon } from '../../design-system';

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stockStatus: string;
  notes: string;
}

export interface WishlistGridProps {
  items: WishlistItem[];
  onMoveToCart: (item: WishlistItem) => void;
  onRemoveItem: (id: string, name: string) => void;
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({
  items,
  onMoveToCart,
  onRemoveItem,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
      {items.map((item) => {
        const inrPrice = Math.round(item.price || 0);
        const inrOriginal = (item.originalPrice && item.originalPrice > inrPrice) ? Math.round(item.originalPrice) : null;
        const discount = inrOriginal ? inrOriginal - inrPrice : 0;

        return (
          <div
            key={item.id}
            className="group bg-white border border-[#EADDCB] rounded-3xl overflow-hidden shadow-subtle hover:shadow-card hover:border-[#EADDCB] transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Vessel Media Container */}
            <div className="relative h-60 bg-[#FAF7F2] flex items-center justify-center p-6 overflow-hidden rounded-t-3xl">
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#8B6F4E] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    SAVE ₹{discount}
                  </span>
                </div>
              )}

              {/* Remove Button */}
              <button
                onClick={() => onRemoveItem(item.id, item.name)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-[#BE123C] hover:bg-[#BE123C] hover:text-white transition-all z-20 cursor-pointer"
                title="Remove from Wishlist"
              >
                ✕
              </button>

              {/* Center Icon */}
              <div className="w-24 h-24 rounded-full bg-white border border-[#EADDCB] flex items-center justify-center text-4xl shadow-xs group-hover:scale-105 transition-transform">
                🕯️
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B6F4E] block">
                  {item.category}
                </span>

                <h3 className="text-base font-serif font-bold text-[#232323] leading-snug">
                  {item.name}
                </h3>

                <p className="text-xs text-[#5C5149] italic">
                  {item.notes}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-xs text-[#E8C86D] font-bold pt-1">
                  <div className="flex text-[#E8C86D]">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-current text-[#E8C86D]" />
                    ))}
                  </div>
                  <span className="ml-1 text-[#232323]">{item.rating}</span>
                  <span className="text-[#7D6F63] font-normal">({item.reviews})</span>
                </div>
              </div>

              {/* Price & Move to Cart Button */}
              <div className="pt-3 border-t border-[#EADDCB] space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-[#232323]">₹{inrPrice.toLocaleString('en-IN')}</span>
                    {inrOriginal && (
                      <span className="text-xs text-[#7D6F63] line-through">₹{inrOriginal.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#15803D] font-bold">✓ In Stock</span>
                </div>

                <button
                  onClick={() => onMoveToCart(item)}
                  className="w-full bg-[#8B6F4E] hover:bg-[#745A3D] text-white font-bold text-xs py-2.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                  </svg>
                  <span>Move to Shopping Bag</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
