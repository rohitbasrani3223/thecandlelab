"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CandleProduct, useStore } from "@/context/StoreContext";
import { Heart, Flame, ShoppingBag, Clock, Sparkles, Star, Eye } from "lucide-react";

interface ProductCardProps {
  product: CandleProduct;
  onQuickView?: (product: CandleProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { wishlist, toggleWishlist, addToCart, toggleCompare, currency } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-brand-beige shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Product Image Section */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-surface">
        <img
          src={product.images[currentImgIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-brand-charcoal text-brand-gold text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-brand-gold shadow">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-brand-gold text-brand-charcoal text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow">
              New Arrival
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-amber-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow animate-pulse">
              Flash Deal
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
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
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md text-brand-charcoal hover:text-red-500 hover:bg-white transition-all z-10"
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Burn Time & Wax Badge (Bottom Overlay) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="bg-brand-charcoal/90 text-brand-beige text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 border border-brand-gold/40">
            <Clock className="w-3 h-3 text-brand-gold" /> {product.burnTimeHours}h Burn
          </span>
          <span className="bg-white/90 text-brand-earth text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow">
            {product.waxType}
          </span>
        </div>

        {/* Quick Hover Overlay */}
        <div className="absolute inset-0 bg-brand-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="bg-white text-brand-charcoal px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg hover:bg-brand-gold transition-colors flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Scent Notes Preview Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-[10px] bg-brand-beige/60 text-brand-charcoal px-2 py-0.5 rounded-md font-medium">
              Top: {product.fragranceNotes.top[0]}
            </span>
            <span className="text-[10px] bg-brand-gold/15 text-brand-earth px-2 py-0.5 rounded-md font-medium">
              Base: {product.fragranceNotes.base[0]}
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-base font-bold text-brand-charcoal group-hover:text-brand-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-xs text-brand-earth line-clamp-1 mt-0.5">
            {product.tagline}
          </p>

          {/* Fragrance Strength Flames & Rating */}
          <div className="flex items-center justify-between mt-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-0.5" title={`Fragrance Strength: ${product.fragranceStrength}/5`}>
              <span className="text-[10px] text-brand-earth mr-1">Strength:</span>
              {[1, 2, 3, 4, 5].map((flameNum) => (
                <Flame
                  key={flameNum}
                  className={`w-3.5 h-3.5 ${
                    flameNum <= product.fragranceStrength
                      ? "text-amber-500 fill-amber-500 animate-pulse-subtle"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-gray-400">({product.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="pt-2 border-t border-brand-beige/60 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg font-bold text-brand-charcoal">
              {currency}{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {currency}{product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleCompare(product)}
              className="p-1.5 rounded-lg border border-brand-beige text-brand-earth hover:text-brand-gold hover:border-brand-gold text-[10px] font-bold transition-colors"
              title="Compare Side-by-Side"
            >
              Compare
            </button>

            <button
              onClick={() => addToCart(product)}
              className="bg-brand-charcoal hover:bg-brand-gold hover:text-brand-charcoal text-brand-beige px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shadow"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-brand-gold hover:text-brand-charcoal" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
