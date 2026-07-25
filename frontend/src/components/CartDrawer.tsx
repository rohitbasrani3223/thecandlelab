"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { ShoppingBag, X, Trash2, Plus, Minus, Gift, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, currency } = useStore();
  const [giftNote, setGiftNote] = useState("");
  const [isGiftWrapSelected, setIsGiftWrapSelected] = useState(false);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 999;
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const shippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-surface shadow-2xl border-l border-brand-gold/30 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 md:p-6 bg-brand-charcoal text-brand-beige flex items-center justify-between border-b border-brand-gold/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              <h3 className="font-serif text-lg font-bold">YOUR SHOPPING BAG</h3>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-brand-beige/60 p-3 px-6 border-b border-brand-beige text-xs">
            {shippingRemaining > 0 ? (
              <p className="text-brand-charcoal font-medium">
                Add <span className="font-bold text-brand-gold">{currency}{shippingRemaining}</span> more for <span className="font-bold">FREE Express Delivery</span>! 🚚
              </p>
            ) : (
              <p className="text-green-800 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> You unlocked FREE Express Delivery & Wax Seal Stamp!
              </p>
            )}
            <div className="w-full bg-white h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-brand-gold h-full transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-brand-gold/40 mx-auto" />
                <p className="font-serif text-base font-bold text-brand-charcoal">Your bag is empty</p>
                <p className="text-xs text-brand-earth max-w-xs mx-auto">
                  Explore our luxury hand-poured candles and create a warm aura in your home.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="bg-white p-3 rounded-xl border border-brand-beige flex gap-3 shadow-sm">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-xs font-bold text-brand-charcoal line-clamp-1">{item.product.name}</h4>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-brand-earth mt-0.5">{item.product.waxType} • {item.product.burnTimeHours}h Burn</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-brand-beige rounded-md bg-brand-surface">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-brand-charcoal"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-brand-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-brand-charcoal"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-bold text-brand-charcoal">
                        {currency}{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Gift Personalization Section */}
            {cart.length > 0 && (
              <div className="bg-white p-3 rounded-xl border border-brand-gold/30 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-brand-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGiftWrapSelected}
                    onChange={(e) => setIsGiftWrapSelected(e.target.checked)}
                    className="rounded text-brand-gold focus:ring-brand-gold"
                  />
                  <Gift className="w-4 h-4 text-brand-gold" />
                  Add Luxury Gift Packaging & Satin Ribbon (+{currency}99)
                </label>

                {isGiftWrapSelected && (
                  <textarea
                    placeholder="Write a custom personalized gift note..."
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2 rounded-lg border border-brand-beige focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  />
                )}
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 md:p-6 bg-white border-t border-brand-beige space-y-3">
              <div className="flex justify-between items-center text-xs text-brand-earth">
                <span>Subtotal:</span>
                <span className="font-bold text-brand-charcoal">{currency}{cartTotal}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-brand-earth">
                <span>Estimated Taxes & Shipping:</span>
                <span className="text-green-700 font-bold">{shippingRemaining === 0 ? "FREE" : `${currency}70`}</span>
              </div>
              <div className="flex justify-between items-center font-serif text-lg font-bold text-brand-charcoal pt-2 border-t border-brand-beige">
                <span>Total:</span>
                <span className="text-brand-gold">{currency}{cartTotal + (isGiftWrapSelected ? 99 : 0)}</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full bg-brand-charcoal hover:bg-brand-gold hover:text-brand-charcoal text-brand-gold font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Proceed to Luxury Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-green-600" /> 256-Bit SSL Encrypted & 100% Guaranteed Safe
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
