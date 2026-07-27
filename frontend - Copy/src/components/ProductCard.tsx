"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CandleProduct, useStore } from "@/context/StoreContext";
import { Heart, Flame, ShoppingBag, Clock, Star, Eye } from "lucide-react";

interface ProductCardProps {
  product: CandleProduct;
  onQuickView?: (product: CandleProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { wishlist, toggleWishlist, addToCart, toggleCompare, currency } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const [currentImgIndex] = useState(0);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6DFD3]/80 dark:border-[#383838] shadow-sm hover:border-[#C8A75A] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full min-h-[520px] max-h-[560px] overflow-hidden">
      
      {/* Product Image Container (4:5 Fixed Aspect Ratio) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF7F2] dark:bg-[#151515] shrink-0">
        <img
          src={product.images[currentImgIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Subtle Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

        {/* Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="bg-[#FAF7F2]/95 dark:bg-[#151515]/95 text-[#1F1F1F] dark:text-[#C8A75A] text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-[#C8A75A]/60 backdrop-blur-md shadow-sm">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#C8A75A] text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button Overlay (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-[#151515]/90 backdrop-blur-md border border-[#E6DFD3] dark:border-[#383838] text-[#1F1F1F] dark:text-[#F8F5F0] hover:text-[#C94A4A] hover:border-[#C94A4A] transition-all z-10 shadow-sm"
          title="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-[#C94A4A] text-[#C94A4A]" : ""}`} />
        </button>

        {/* Burn Time & Wax Pills (Bottom Overlay) */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <span className="bg-white/90 dark:bg-[#151515]/90 text-[#1F1F1F] dark:text-[#D8D2C8] text-[10px] font-light px-2.5 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 border border-[#E6DFD3]/80">
            <Clock className="w-3 h-3 text-[#C8A75A]" /> {product.burnTimeHours}h Burn
          </span>
          <span className="bg-white/90 dark:bg-[#151515]/90 text-[#C8A75A] text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md border border-[#E6DFD3]/80">
            {product.waxType}
          </span>
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="bg-white text-[#1F1F1F] px-4 py-2 rounded-full text-xs font-bold shadow-xl hover:bg-[#C8A75A] hover:text-white transition-all flex items-center gap-1.5 scale-95 group-hover:scale-100"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
          )}
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          
          {/* Fragrance Scent Notes Chips */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-[9px] bg-[#FAF7F2] dark:bg-[#151515] text-[#666666] dark:text-[#D8D2C8] px-1.5 py-0.5 rounded font-mono border border-[#E6DFD3] truncate max-w-[120px]">
              Top: {product.fragranceNotes.top[0]}
            </span>
            <span className="text-[9px] bg-[#C8A75A]/15 text-[#C8A75A] px-1.5 py-0.5 rounded font-semibold truncate max-w-[120px]">
              Base: {product.fragranceNotes.base[0]}
            </span>
          </div>

          {/* Title (Max 2 Lines Clamped) */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-sm font-bold text-[#1F1F1F] dark:text-[#F8F5F0] group-hover:text-[#C8A75A] transition-colors line-clamp-2 min-h-[2.5rem] leading-snug">
              {product.name}
            </h3>
          </Link>
          
          {/* Subtitle / Tagline (Max 2 Lines Clamped) */}
          <p className="text-[11px] text-[#666666] dark:text-[#A8A29E] line-clamp-2 font-light min-h-[2rem] leading-tight">
            {product.tagline}
          </p>

          {/* Rating & Fragrance Strength */}
          <div className="flex items-center justify-between pt-0.5 text-xs text-[#666666] dark:text-[#A8A29E]">
            <div className="flex items-center gap-0.5" title={`Fragrance Strength: ${product.fragranceStrength}/5`}>
              {[1, 2, 3, 4, 5].map((flameNum) => (
                <Flame
                  key={flameNum}
                  className={`w-3 h-3 ${
                    flameNum <= product.fragranceStrength
                      ? "text-[#C8A75A] fill-[#C8A75A]"
                      : "text-[#E6DFD3] dark:text-[#383838]"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 text-[#C8A75A] font-bold text-xs">
              <Star className="w-3 h-3 fill-[#C8A75A] text-[#C8A75A]" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-[#666666] dark:text-[#A8A29E] font-normal">({product.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Pricing Hierarchy & Pinned Buttons */}
        <div className="mt-auto pt-2.5 border-t border-[#E6DFD3] dark:border-[#383838] space-y-2">
          
          {/* Luxury Price Hierarchy */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-serif text-base font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">
                {currency}{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-gray-400 line-through font-light">
                  {currency}{product.originalPrice}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Luxury Micro-Animated Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => toggleCompare(product)}
              className="w-full py-2.5 rounded-xl border border-[#E6DFD3] dark:border-[#383838] text-[#1F1F1F] dark:text-[#D8D2C8] hover:text-[#C8A75A] hover:border-[#C8A75A] text-[10px] font-bold uppercase tracking-wider transition-colors text-center"
            >
              Compare
            </button>

            <button
              onClick={() => addToCart(product)}
              className="w-full bg-[#C8A75A] hover:bg-[#1F1F1F] text-white hover:text-[#C8A75A] border border-[#C8A75A] py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
