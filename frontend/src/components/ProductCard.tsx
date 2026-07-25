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
    <div className="group relative bg-[#1E1E1E] rounded-3xl border border-[#383838] shadow-luxury-card hover:border-[#C8A75A]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Product Image Section */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#151515]">
        <img
          src={product.images[currentImgIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-[#151515]/90 text-[#C8A75A] text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-[#C8A75A]/60 backdrop-blur-md">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#C8A75A] text-[#151515] text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#C94A4A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#151515]/80 backdrop-blur-md border border-[#383838] text-[#F8F5F0] hover:text-[#C94A4A] hover:border-[#C94A4A] transition-all z-10"
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#C94A4A] text-[#C94A4A]" : ""}`} />
        </button>

        {/* Burn Time & Wax Badge (Bottom Overlay) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="bg-[#151515]/90 text-[#D8D2C8] text-[11px] font-light px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 border border-[#383838]">
            <Clock className="w-3 h-3 text-[#C8A75A]" /> {product.burnTimeHours}h Burn
          </span>
          <span className="bg-[#151515]/90 text-[#C8A75A] text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-md border border-[#383838]">
            {product.waxType}
          </span>
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-[#151515]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="bg-[#F8F5F0] text-[#151515] px-4 py-2 rounded-full text-xs font-semibold shadow-xl hover:bg-[#C8A75A] transition-colors flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Scent Notes Preview Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-[10px] bg-[#151515] text-[#D8D2C8] px-2 py-0.5 rounded-md font-light border border-[#383838]">
              Top: {product.fragranceNotes.top[0]}
            </span>
            <span className="text-[10px] bg-[#C8A75A]/15 text-[#C8A75A] px-2 py-0.5 rounded-md font-medium">
              Base: {product.fragranceNotes.base[0]}
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-base font-bold text-[#F8F5F0] group-hover:text-[#C8A75A] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-xs text-[#A8A29E] line-clamp-1 mt-0.5 font-light">
            {product.tagline}
          </p>

          {/* Fragrance Strength Flames & Rating */}
          <div className="flex items-center justify-between mt-2.5 text-xs text-[#A8A29E]">
            <div className="flex items-center gap-0.5" title={`Fragrance Strength: ${product.fragranceStrength}/5`}>
              <span className="text-[10px] text-[#A8A29E] mr-1">Strength:</span>
              {[1, 2, 3, 4, 5].map((flameNum) => (
                <Flame
                  key={flameNum}
                  className={`w-3.5 h-3.5 ${
                    flameNum <= product.fragranceStrength
                      ? "text-[#C8A75A] fill-[#C8A75A]"
                      : "text-[#383838]"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 text-[#C8A75A] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#C8A75A] text-[#C8A75A]" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-[#A8A29E] font-normal">({product.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="pt-3 border-t border-[#383838] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg font-bold text-[#F8F5F0]">
              {currency}{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#A8A29E] line-through">
                {currency}{product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(product)}
              className="p-2 rounded-[14px] border border-[#383838] text-[#A8A29E] hover:text-[#C8A75A] hover:border-[#C8A75A] text-[10px] font-medium transition-colors"
              title="Compare"
            >
              Compare
            </button>

            <button
              onClick={() => addToCart(product)}
              className="bg-[#C8A75A] hover:bg-[#D4B46A] text-[#151515] px-3.5 py-2 rounded-[14px] text-xs font-semibold transition-all flex items-center gap-1.5 shadow"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#151515]" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
