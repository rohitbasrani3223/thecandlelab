"use client";

import React, { useState } from "react";
import { CandleProduct, useStore } from "@/context/StoreContext";
import {
  X,
  Flame,
  Clock,
  Heart,
  ShoppingBag,
  Sparkles,
  Gift,
  Check,
  Star,
  ShieldCheck,
  RotateCw,
  Award
} from "lucide-react";

interface ProductDetailModalProps {
  product: CandleProduct;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, wishlist, toggleWishlist, currency } = useStore();
  const [selectedImg, setSelectedImg] = useState(0);
  const [is360Active, setIs360Active] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const isWishlisted = wishlist.includes(product.id);

  const handleRotate = () => {
    setRotationAngle((prev) => (prev + 45) % 360);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige text-brand-charcoal z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Image & 360 View */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-brand-beige shadow-md">
              <img
                src={product.images[selectedImg] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: is360Active ? `rotate(${rotationAngle}deg)` : "none" }}
              />

              {/* 360 Rotation Simulation Controls */}
              <button
                onClick={() => {
                  setIs360Active(true);
                  handleRotate();
                }}
                className="absolute bottom-3 right-3 bg-brand-charcoal/90 text-brand-gold px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1 border border-brand-gold/40 shadow-lg hover:bg-brand-gold hover:text-brand-charcoal transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" /> 360° View
              </button>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIs360Active(false);
                    setSelectedImg(idx);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImg === idx ? "border-brand-gold scale-105 shadow" : "border-transparent opacity-60"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Specs */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-brand-charcoal text-brand-gold font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {product.waxType}
                </span>
                <span className="text-[10px] bg-brand-beige text-brand-earth font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {product.wickType}
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-brand-charcoal">{product.name}</h2>
              <p className="text-xs text-brand-earth mt-1">{product.tagline}</p>

              <div className="flex items-center gap-3 mt-3">
                <span className="font-serif text-2xl font-bold text-brand-charcoal">
                  {currency}{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {currency}{product.originalPrice}
                  </span>
                )}
                <div className="flex items-center gap-1 text-amber-600 text-xs font-bold ml-auto">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Scent Pyramid Notes (Top, Middle, Base) */}
            <div className="bg-white p-4 rounded-xl border border-brand-gold/30 space-y-2">
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-charcoal flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Fragrance Pyramid Notes
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-brand-surface p-2 rounded-lg border border-brand-beige">
                  <span className="text-[10px] text-brand-earth font-bold block">TOP</span>
                  <span className="font-medium text-brand-charcoal text-[11px]">{product.fragranceNotes.top.join(", ")}</span>
                </div>
                <div className="bg-brand-surface p-2 rounded-lg border border-brand-beige">
                  <span className="text-[10px] text-brand-earth font-bold block">MIDDLE</span>
                  <span className="font-medium text-brand-charcoal text-[11px]">{product.fragranceNotes.middle.join(", ")}</span>
                </div>
                <div className="bg-brand-surface p-2 rounded-lg border border-brand-beige">
                  <span className="text-[10px] text-brand-earth font-bold block">BASE</span>
                  <span className="font-medium text-brand-charcoal text-[11px]">{product.fragranceNotes.base.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-brand-beige">
                <Clock className="w-4 h-4 text-brand-gold" />
                <div>
                  <span className="text-[10px] text-gray-400 block">Burn Time</span>
                  <span className="font-bold text-brand-charcoal">{product.burnTimeHours} Hours</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-brand-beige">
                <Flame className="w-4 h-4 text-brand-gold" />
                <div>
                  <span className="text-[10px] text-gray-400 block">Room Size</span>
                  <span className="font-bold text-brand-charcoal">{product.roomSize}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  addToCart(product, 1, isGiftWrap, giftNote);
                  onClose();
                }}
                className="flex-1 bg-brand-charcoal text-brand-gold py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-gold hover:text-brand-charcoal transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-colors ${
                  isWishlisted ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-brand-beige text-brand-charcoal hover:bg-brand-beige"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-600" : ""}`} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
