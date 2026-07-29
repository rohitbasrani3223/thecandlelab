import React from 'react';
import { StarIcon } from '../../design-system';

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  collection: string;
  price: number;
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
        const inrPrice = Math.round(item.price * 19);
        const inrOriginal = Math.round(inrPrice * 1.25);
        const discount = inrOriginal - inrPrice;

        return (
          <div
            key={item.id}
            className="group bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle hover:shadow-hover hover:border-[#B88B38] transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Vessel Media Container */}
            <div className="relative h-60 bg-[#F8F3EA] flex items-center justify-center p-6 overflow-hidden rounded-t-2xl">
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#B93829] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  SAVE ₹{discount}
                </span>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemoveItem(item.id, item.name)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-[#B93829] hover:bg-[#B93829] hover:text-white transition-all z-20 cursor-pointer"
                title="Remove from Wishlist"
              >
                ✕
              </button>

              {/* Center Icon */}
              <div className="w-16 h-16 rounded-full bg-white shadow-card flex items-center justify-center border border-[#EFE8DB] group-hover:scale-110 transition-transform duration-500 text-[#B88B38]">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-9-9h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a4 4 0 014 4c0 2.5-4 6-4 6s-4-3.5-4-6a4 4 0 014-4z" />
                </svg>
              </div>
            </div>

            {/* Lower Details Content */}
            <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between bg-white">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B88B38] block">
                  {item.category}
                </span>

                <h3 className="text-base font-serif font-bold text-[#2C1E16] group-hover:text-[#B88B38] transition-colors leading-snug truncate">
                  {item.name}
                </h3>

                <p className="text-xs text-[#7A6B5D] italic truncate">
                  Notes: {item.notes}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-xs text-[#B88B38] font-bold pt-1">
                  <div className="flex text-[#B88B38]">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-current text-[#B88B38]" />
                    ))}
                  </div>
                  <span className="ml-1 text-[#2C1E16]">{item.rating}</span>
                  <span className="text-[#8C7A6B] font-normal">({item.reviews})</span>
                </div>
              </div>

              {/* Price & Move to Cart Button */}
              <div className="pt-3 border-t border-[#F2ECE1] space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-[#8C7A6B] line-through">₹{inrOriginal}</span>
                    <span className="text-base font-bold text-[#2C1E16]">₹{inrPrice}</span>
                  </div>
                  <span className="text-[10px] text-[#2E6F40] font-bold">✓ In Stock</span>
                </div>

                <button
                  onClick={() => onMoveToCart(item)}
                  className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
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
