"use client";

import Link from "next/link";
import { Star, ShoppingBag, Heart, Sparkles } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewsCount: number;
  fragranceNotes: string;
  inStock: boolean;
  imageBg: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card group flex flex-col justify-between h-full">
      <div>
        {/* Thumbnail Area */}
        <div className={`h-52 w-full ${product.imageBg} relative flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105`}>
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-md border border-[#DDD5C4] flex items-center justify-center shadow-md">
            <Sparkles className="w-8 h-8 text-[#C9A84C]" />
          </div>

          {/* Offer Tag */}
          {product.salePrice && (
            <span className="absolute top-3 left-3 bg-[#C0392B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              SAVE ₹{product.price - product.salePrice}
            </span>
          )}

          {/* Wishlist Icon */}
          <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-[#2C2820] hover:text-[#C0392B] transition-colors shadow-sm">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Info Area */}
        <div className="p-5 space-y-2">
          <span className="text-[10px] font-semibold text-[#8B6B47] uppercase tracking-widest">
            {product.category}
          </span>

          <Link href={`/product/${product.id}`}>
            <h4 className="font-serif-luxury font-bold text-base text-[#2C2820] group-hover:text-[#C9A84C] transition-colors line-clamp-1">
              {product.name}
            </h4>
          </Link>

          <p className="text-xs text-[#9B9591] line-clamp-1">
            Notes: {product.fragranceNotes}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex items-center text-[#C9A84C]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? "fill-[#C9A84C]" : "text-[#DDD5C4]"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-[#6B4E35] font-semibold">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-[#EDE8DF] mt-3">
        <div>
          {product.salePrice ? (
            <div>
              <span className="text-xs text-[#9B9591] line-through font-medium">
                ₹{product.price}
              </span>
              <span className="text-base font-extrabold text-[#2C2820] ml-1.5">
                ₹{product.salePrice}
              </span>
            </div>
          ) : (
            <span className="text-base font-extrabold text-[#2C2820]">
              ₹{product.price}
            </span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="btn-luxury py-2 px-3 text-xs gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
