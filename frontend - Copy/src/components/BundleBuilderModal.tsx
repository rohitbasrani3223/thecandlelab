"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Gift, X, Check, Trash2, Sparkles, ShoppingBag } from "lucide-react";

interface BundleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BundleBuilderModal: React.FC<BundleBuilderModalProps> = ({ isOpen, onClose }) => {
  const { products, bundleItems, addBundleItem, removeBundleItem, clearBundle, addToCart, currency } = useStore();

  if (!isOpen) return null;

  const BUNDLE_PRICE = 1499; // Flat bundle price for any 3 candles
  const isComplete = bundleItems.length === 3;

  const handleAddBundleToBag = () => {
    if (!isComplete) return;
    // Add each bundle item with gift packaging tag
    bundleItems.forEach((item) => {
      addToCart(item, 1, true, "Curated 3-Candle Luxury Bundle Box");
    });
    clearBundle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige text-brand-charcoal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-brand-beige pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-gold border border-brand-gold">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-brand-charcoal">BUILD YOUR CANDLE BUNDLE</h3>
              <p className="text-xs text-brand-earth">Select Any 3 Full-Sized Candles for a Flat {currency}{BUNDLE_PRICE}</p>
            </div>
          </div>

          <div className="bg-brand-charcoal text-brand-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Save up to {currency}600 on this Box!
          </div>
        </div>

        {/* Selected Box Slots (3 Slots) */}
        <div className="bg-white p-4 rounded-xl border border-brand-gold/40 shadow-inner mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-brand-charcoal">
              Your Custom Box ({bundleItems.length}/3 Candles Selected)
            </span>
            {bundleItems.length > 0 && (
              <button onClick={clearBundle} className="text-xs text-red-600 hover:underline">
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((index) => {
              const item = bundleItems[index];
              return (
                <div
                  key={index}
                  className={`h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 text-center relative transition-all ${
                    item
                      ? "bg-brand-surface border-brand-gold border-solid"
                      : "border-brand-beige bg-gray-50/50 text-gray-400"
                  }`}
                >
                  {item ? (
                    <>
                      <button
                        onClick={() => removeBundleItem(item.id)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <img src={item.images[0]} alt={item.name} className="w-10 h-10 object-cover rounded mb-1" />
                      <span className="text-[11px] font-bold text-brand-charcoal line-clamp-1">{item.name}</span>
                      <span className="text-[9px] text-brand-earth">{item.waxType}</span>
                    </>
                  ) : (
                    <>
                      <Gift className="w-6 h-6 text-brand-gold/60 mb-1" />
                      <span className="text-[11px] font-medium">Slot #{index + 1} Empty</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Catalog Grid to pick from */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-3">
          Click To Add Candles to Your Box:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {products.map((p) => {
            const isSelected = bundleItems.some((b) => b.id === p.id);
            return (
              <div
                key={p.id}
                onClick={() => !isSelected && addBundleItem(p)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected
                    ? "bg-brand-beige/50 border-brand-gold opacity-60 pointer-events-none"
                    : "bg-white border-brand-beige hover:border-brand-gold hover:shadow-md"
                }`}
              >
                <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                <div className="flex-1">
                  <h5 className="font-serif text-xs font-bold text-brand-charcoal line-clamp-1">{p.name}</h5>
                  <p className="text-[10px] text-brand-earth">{p.waxType} • {p.burnTimeHours}h Burn</p>
                  <p className="text-xs font-bold text-brand-charcoal">{currency}{p.price}</p>
                </div>
                <button
                  disabled={isSelected || bundleItems.length >= 3}
                  className="p-1.5 rounded-full bg-brand-charcoal text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal disabled:opacity-40"
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <Gift className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-brand-beige flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-earth">Special Bundle Deal Total:</p>
            <p className="font-serif text-xl font-bold text-brand-charcoal">
              {currency}{BUNDLE_PRICE} <span className="text-xs text-green-700 font-sans font-bold">Free Luxury Gift Packaging</span>
            </p>
          </div>

          <button
            disabled={!isComplete}
            onClick={handleAddBundleToBag}
            className="bg-brand-charcoal text-brand-gold px-6 py-3 rounded-xl text-xs font-bold hover:bg-brand-gold hover:text-brand-charcoal transition-colors disabled:opacity-40 flex items-center gap-2 shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" />
            {isComplete ? "Add Bundle Box to Bag 🛒" : "Select 3 Candles to Continue"}
          </button>
        </div>

      </div>
    </div>
  );
};
