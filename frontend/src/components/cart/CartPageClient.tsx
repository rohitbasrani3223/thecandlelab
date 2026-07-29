"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  ArrowRight,
  ChevronRight,
  Package,
  RotateCcw,
  Shield,
} from "lucide-react";
import { useCartStore } from "@/store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export function CartPageClient() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } =
    useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const couponDiscount = appliedCoupon
    ? Math.round(subtotal * (appliedCoupon.discount / 100))
    : 0;
  const total = subtotal + shipping - couponDiscount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    // Mock coupon validation
    if (couponCode.toUpperCase() === "FIRSTORDER") {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 15 });
      toast.success("Coupon applied! 15% off");
    } else if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 10 });
      toast.success("Coupon applied! 10% off");
    } else {
      toast.error("Invalid coupon code");
    }
    setCouponLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center gap-6 text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
          style={{ background: "#F5EFE4" }}
        >
          🛒
        </div>
        <div>
          <h1
            className="text-3xl font-medium text-[#1A1208] mb-3"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Your cart is empty
          </h1>
          <p className="text-[#8B7355]">
            Looks like you haven't added anything yet.
          </p>
        </div>
        <Link href="/shop" className="btn btn-gold btn-lg gap-2" id="cart-empty-shop">
          <ShoppingBag size={18} />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#8B7355] mb-8">
        <Link href="/" className="hover:text-[#A87B32]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[#1A1208]">Cart</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-medium text-[#1A1208]"
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
        >
          Your Cart
          <span className="text-lg text-[#8B7355] ml-3">
            ({items.length} items)
          </span>
        </h1>
        <button
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="text-sm text-[#8B7355] hover:text-[#B85450] transition-colors flex items-center gap-1"
          id="cart-clear-btn"
        >
          <Trash2 size={14} />
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-5 p-5 rounded-2xl"
                style={{
                  background: "#fff",
                  border: "1px solid #EDE4D4",
                  boxShadow: "0 2px 8px rgba(26,18,8,0.04)",
                }}
              >
                {/* Image */}
                <Link
                  href={`/product/${item.product.slug}`}
                  className="flex-shrink-0"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F5EFE4]">
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#A87B32] font-medium uppercase tracking-wide mb-0.5">
                    {item.product.category.name}
                  </p>
                  <Link href={`/product/${item.product.slug}`}>
                    <h3 className="font-medium text-[#1A1208] hover:text-[#A87B32] transition-colors leading-snug">
                      {item.product.name}
                    </h3>
                  </Link>
                  {item.product.size && (
                    <p className="text-xs text-[#8B7355] mt-0.5">
                      {item.product.size}
                    </p>
                  )}
                  {item.product.fragrance && (
                    <p className="text-xs text-[#8B7355] mt-0.5 line-clamp-1">
                      🌸 {item.product.fragrance}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    {/* Quantity */}
                    <div
                      className="flex items-center rounded-xl overflow-hidden"
                      style={{
                        border: "1.5px solid #E0D0B8",
                        background: "#F5EFE4",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#EDE4D4] transition-colors"
                        aria-label="Decrease"
                        id={`cart-minus-${item.id}`}
                      >
                        <Minus size={13} className="text-[#4A3728]" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[#1A1208]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#EDE4D4] transition-colors"
                        aria-label="Increase"
                        id={`cart-plus-${item.id}`}
                      >
                        <Plus size={13} className="text-[#4A3728]" />
                      </button>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[#1A1208]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#C9B99A] hover:text-[#B85450] transition-colors"
                        aria-label="Remove item"
                        id={`cart-remove-${item.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue Shopping */}
          <Link
            href="/shop"
            className="flex items-center gap-2 text-sm text-[#A87B32] hover:text-[#8B5E3C] transition-colors mt-4"
            id="cart-continue-shopping"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div
            className="p-5 rounded-2xl"
            style={{
              background: "#fff",
              border: "1px solid #EDE4D4",
            }}
          >
            <h3 className="text-sm font-semibold text-[#1A1208] mb-3 flex items-center gap-2">
              <Tag size={15} className="text-[#A87B32]" />
              Coupon Code
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(196,150,74,0.08)", border: "1px solid rgba(196,150,74,0.3)" }}>
                <div>
                  <p className="text-sm font-semibold text-[#A87B32]">{appliedCoupon.code}</p>
                  <p className="text-xs text-[#8B7355]">{appliedCoupon.discount}% discount applied</p>
                </div>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-xs text-[#B85450] hover:underline"
                  id="remove-coupon"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  id="coupon-input"
                  placeholder="Enter code (try FIRSTORDER)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  className="input flex-1 text-sm py-2.5"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="btn btn-gold btn-sm disabled:opacity-70"
                  id="apply-coupon-btn"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div
            className="p-5 rounded-2xl"
            style={{
              background: "#fff",
              border: "1px solid #EDE4D4",
            }}
          >
            <h3 className="text-base font-semibold text-[#1A1208] mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Subtotal</span>
                <span className="text-[#1A1208]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Shipping</span>
                <span
                  className={
                    shipping === 0 ? "text-green-600 font-medium" : "text-[#1A1208]"
                  }
                >
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#A87B32]">Coupon Discount</span>
                  <span className="text-[#A87B32] font-medium">
                    -{formatPrice(couponDiscount)}
                  </span>
                </div>
              )}

              <div
                className="pt-3 mt-1"
                style={{ borderTop: "1px solid #EDE4D4" }}
              >
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A1208] text-base">
                    Total
                  </span>
                  <span className="font-bold text-[#1A1208] text-xl">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-[#8B7355] mt-1">
                  Inclusive of all taxes
                </p>
              </div>
            </div>

            {shipping > 0 && (
              <div
                className="mt-3 p-2.5 rounded-lg text-xs text-center"
                style={{
                  background: "rgba(196,150,74,0.08)",
                  color: "#A87B32",
                  border: "1px solid rgba(196,150,74,0.2)",
                }}
              >
                Add {formatPrice(999 - subtotal)} more for FREE shipping
              </div>
            )}

            <Link
              href="/checkout"
              className="btn btn-gold w-full justify-center mt-4 text-base"
              id="cart-checkout-cta"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>

            {/* Trust badges */}
            <div className="flex justify-center gap-4 mt-4 pt-4"
              style={{ borderTop: "1px solid #EDE4D4" }}>
              {[
                { icon: <Package size={13} />, label: "Secure" },
                { icon: <Shield size={13} />, label: "Safe Pay" },
                { icon: <RotateCcw size={13} />, label: "7-Day Return" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1 text-[#8B7355]">
                  {b.icon}
                  <span className="text-[10px]">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
