"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Heart, X, Trash2, ShoppingBag, Share2, Sparkles, TrendingDown } from "lucide-react";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlist, products, toggleWishlist, addToCart, currency, showToast } = useStore();

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleShareWishlist = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast("Wishlist link copied to clipboard! Share with friends 💌");
  };

  const handleMoveAllToBag = () => {
    wishlistedProducts.forEach((p) => addToCart(p));
    showToast("Moved all wishlist items to Shopping Bag 🛒!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-surface shadow-2xl border-l border-brand-gold/30 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 md:p-6 bg-brand-charcoal text-brand-beige flex items-center justify-between border-b border-brand-gold/40">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h3 className="font-serif text-lg font-bold">MY WISHLIST ({wishlist.length})</h3>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Heart className="w-12 h-12 text-red-300 mx-auto" />
                <p className="font-serif text-base font-bold text-brand-charcoal">Your wishlist is empty</p>
                <p className="text-xs text-brand-earth">Save your favorite luxury candles to track price drop alerts.</p>
              </div>
            ) : (
              wishlistedProducts.map((p) => (
                <div key={p.id} className="bg-white p-3 rounded-xl border border-brand-beige flex gap-3 shadow-sm">
                  <img src={p.images[0]} alt={p.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-xs font-bold text-brand-charcoal line-clamp-1">{p.name}</h4>
                        <button onClick={() => toggleWishlist(p.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-brand-earth">{p.waxType} • {p.burnTimeHours}h Burn</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="font-serif text-sm font-bold text-brand-charcoal">{currency}{p.price}</span>
                      <button
                        onClick={() => {
                          addToCart(p);
                          toggleWishlist(p.id);
                        }}
                        className="bg-brand-charcoal text-brand-gold px-2.5 py-1 rounded text-xs font-bold hover:bg-brand-gold hover:text-brand-charcoal flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" /> Move to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {wishlistedProducts.length > 0 && (
            <div className="p-4 bg-white border-t border-brand-beige space-y-2">
              <button
                onClick={handleMoveAllToBag}
                className="w-full bg-brand-charcoal text-brand-gold py-3 rounded-xl text-xs font-bold hover:bg-brand-gold hover:text-brand-charcoal transition-colors shadow"
              >
                Move All Items to Bag 🛒
              </button>

              <button
                onClick={handleShareWishlist}
                className="w-full bg-brand-beige text-brand-charcoal py-2 rounded-xl text-xs font-bold hover:bg-brand-gold flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Wishlist Link 💌
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
