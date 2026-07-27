"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, ShieldCheck } from "lucide-react";
import { Product } from "./ProductCard";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => {
    const price = curr.product.salePrice || curr.product.price;
    return acc + price * curr.quantity;
  }, 0);

  const discount = appliedCoupon === "LUXURY20" ? Math.round(subtotal * 0.2) : 0;
  const freeShippingThreshold = 1499;
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "LUXURY20") {
      setAppliedCoupon("LUXURY20");
    } else {
      alert("Invalid promo code. Try 'LUXURY20'");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#EDE8DF] flex items-center justify-between bg-[#FDFAF5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C9A84C]" />
              <h3 className="font-serif-luxury font-bold text-lg text-[#2C2820]">
                Your Shopping Cart ({items.reduce((a, b) => a + b.quantity, 0)})
              </h3>
            </div>
            <button onClick={onClose} className="p-2 text-[#9B9591] hover:text-[#2C2820]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-[#F5EFE0] px-5 py-3 border-b border-[#DDD5C4] text-xs">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-[#2D7A4F] font-bold text-center">
                🎉 Congratulations! You unlocked FREE Luxury Shipping!
              </p>
            ) : (
              <div>
                <p className="text-[#6B4E35] font-medium mb-1.5 text-center">
                  Add <strong className="text-[#2C2820]">₹{freeShippingThreshold - subtotal}</strong> more for Free Shipping!
                </p>
                <div className="w-full h-1.5 bg-[#DDD5C4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A84C] transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center text-[#9B9591] space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto opacity-30" />
                <p className="text-sm font-medium">Your shopping cart is currently empty.</p>
                <button onClick={onClose} className="btn-luxury text-xs py-2">
                  Explore Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-[#EDE8DF] bg-[#FAF8F4]"
                >
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#DDD5C4] flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-6 h-6 text-[#C9A84C]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-[#2C2820] truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-[11px] text-[#8B6B47] font-semibold">
                      ₹{item.product.salePrice || item.product.price}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded-md bg-white border border-[#DDD5C4] flex items-center justify-center text-xs text-[#2C2820]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#2C2820] px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded-md bg-white border border-[#DDD5C4] flex items-center justify-center text-xs text-[#2C2820]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-[#9B9591] hover:text-[#C0392B]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#EDE8DF] bg-[#FAF8F4] space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-[#9B9591] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (LUXURY20)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DDD5C4] text-xs uppercase focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <button type="submit" className="btn-luxury-outline py-2 text-xs">
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="text-xs text-[#2D7A4F] font-semibold bg-[#EDFAF4] p-2 rounded-lg flex items-center justify-between">
                  <span>Coupon {appliedCoupon} applied!</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-[#4A4540]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#2D7A4F]">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#2C2820] pt-2 border-t border-[#DDD5C4]">
                  <span>Total Amount</span>
                  <span className="text-[#2D7A4F]">₹{total}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="btn-luxury w-full py-3 gap-2 text-sm justify-center"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-[#9B9591] text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D7A4F]" /> Guaranteed 256-Bit Encrypted Secure Checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
