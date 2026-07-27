"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowLeft, Sparkles } from "lucide-react";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  slug: string;
  collection: string;
  inStock: boolean;
}

const demoWishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "French Vanilla & Warm Cinnamon",
    price: 899,
    originalPrice: 1199,
    image: "",
    slug: "french-vanilla-warm-cinnamon",
    collection: "Vanilla Collection",
    inStock: true,
  },
  {
    id: "2",
    name: "Jasmine & Damask Rose",
    price: 1099,
    originalPrice: 1399,
    image: "",
    slug: "jasmine-damask-rose",
    collection: "Floral Collection",
    inStock: true,
  },
  {
    id: "3",
    name: "Arabica Coffee Noir",
    price: 799,
    originalPrice: 999,
    image: "",
    slug: "arabica-coffee-noir",
    collection: "Coffee Collection",
    inStock: false,
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(demoWishlistItems);
  const [removedId, setRemovedId] = useState<string | null>(null);

  const removeItem = (id: string) => {
    setRemovedId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setRemovedId(null);
    }, 350);
  };

  const clearAll = () => setItems([]);

  return (
    <main className="min-h-screen bg-[#FFFEF9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2C2820] via-[#4A3425] to-[#2C2820] py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#C9A84C] animate-pulse" />
          <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">Your Curated Favourites</span>
          <Sparkles className="w-5 h-5 text-[#C9A84C] animate-pulse" />
        </div>
        <h1 className="text-4xl font-serif text-white font-bold tracking-wide">My Wishlist</h1>
        <p className="text-[#DDD5C4] text-sm mt-2">
          {items.length === 0 ? "Your wishlist is empty" : `${items.length} luxury candle${items.length > 1 ? "s" : ""} saved`}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back + Clear */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-[#8B6B47] hover:text-[#C9A84C] text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-[#C0392B] font-semibold hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-24 flex flex-col items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-[#F5EFE0] border border-[#DDD5C4] flex items-center justify-center">
              <Heart className="w-10 h-10 text-[#DDD5C4]" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#2C2820] mb-2">Your Wishlist is Empty</h2>
              <p className="text-[#9B9591] text-sm max-w-xs mx-auto">
                Save luxury candles you love to your wishlist and find them here anytime.
              </p>
            </div>
            <Link
              href="/shop"
              className="mt-2 inline-flex items-center gap-2 bg-[#C9A84C] text-white text-sm font-bold px-8 py-3 rounded-full hover:bg-[#A3863C] transition-colors shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Explore Candles
            </Link>
          </div>
        )}

        {/* Wishlist Items */}
        {items.length > 0 && (
          <div className="grid gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border border-[#EDE8DF] p-5 flex items-center gap-5 shadow-sm transition-all duration-300 ${
                  removedId === item.id ? "opacity-0 scale-95 translate-x-4" : "opacity-100"
                }`}
              >
                {/* Product Image Placeholder */}
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#F5EFE0] to-[#E8D5B0] flex items-center justify-center flex-shrink-0 border border-[#DDD5C4]">
                  <span className="text-3xl">🕯️</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">
                    {item.collection}
                  </span>
                  <h3 className="font-serif font-bold text-[#2C2820] text-base leading-snug mt-0.5 truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-lg font-bold text-[#2C2820]">₹{item.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-[#9B9591] line-through">₹{item.originalPrice.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] font-bold text-[#2D7A4F] bg-[#E8F5ED] px-2 py-0.5 rounded-full">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  {!item.inStock && (
                    <span className="text-[10px] font-bold text-[#C0392B] bg-[#FDECEA] px-2 py-0.5 rounded-full mt-1 inline-block">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    disabled={!item.inStock}
                    className="flex items-center gap-1.5 bg-[#C9A84C] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#A3863C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1.5 border border-[#EDE8DF] text-[#9B9591] text-xs font-semibold px-4 py-2 rounded-full hover:border-[#C0392B] hover:text-[#C0392B] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {items.length > 0 && (
          <div className="mt-10 bg-gradient-to-r from-[#FBF7EE] to-[#F5EFE0] rounded-2xl border border-[#DDD5C4] p-6 text-center">
            <p className="text-sm font-semibold text-[#4A3425] mb-4">
              💛 Move everything in your wishlist to cart in one click!
            </p>
            <button className="inline-flex items-center gap-2 bg-[#2C2820] text-[#E8C97A] text-sm font-bold px-8 py-3 rounded-full hover:bg-[#4A3425] transition-colors shadow-lg">
              <ShoppingBag className="w-4 h-4" />
              Add All to Cart
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
