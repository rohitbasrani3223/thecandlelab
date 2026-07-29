"use client";

import { motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore();
  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[400] bg-[#1A1208]/50 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 z-[401] flex flex-col"
            style={{
              width: "min(480px, 100vw)",
              background: "#FDFAF5",
              boxShadow: "-8px 0 48px rgba(26,18,8,0.15)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E0D0B8]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#A87B32]" strokeWidth={1.8} />
                <h2
                  className="text-xl font-medium text-[#1A1208]"
                  style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                >
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="badge badge-new">{items.length} items</span>
                )}
              </div>
              <button
                id="cart-close-btn"
                onClick={closeCart}
                className="btn btn-ghost btn-icon"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
                <div className="w-20 h-20 rounded-full bg-[#F5EFE4] flex items-center justify-center">
                  <ShoppingBag size={32} className="text-[#C9B99A]" strokeWidth={1.2} />
                </div>
                <div className="text-center">
                  <p
                    className="text-xl font-medium text-[#1A1208] mb-2"
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    Your cart is empty
                  </p>
                  <p className="text-sm text-[#8B7355]">
                    Explore our collection and find something you'll love.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="btn btn-gold btn-sm mt-2"
                >
                  Shop Now
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 p-4 bg-white rounded-xl border border-[#E0D0B8]"
                        style={{ boxShadow: "0 2px 8px rgba(26,18,8,0.04)" }}
                      >
                        {/* Image */}
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="flex-shrink-0"
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F5EFE4]">
                            <Image
                              src={item.product.thumbnail}
                              alt={item.product.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={closeCart}
                          >
                            <p className="text-sm font-medium text-[#1A1208] leading-snug line-clamp-2 hover:text-[#A87B32] transition-colors">
                              {item.product.name}
                            </p>
                          </Link>
                          {item.variant && (
                            <p className="text-xs text-[#8B7355] mt-0.5">
                              {Object.values(item.variant.attributes).join(" / ")}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-[#A87B32] mt-1.5">
                            {formatPrice(item.price)}
                          </p>

                          {/* Quantity + Remove */}
                          <div className="flex items-center gap-3 mt-2.5">
                            <div className="flex items-center gap-2 bg-[#F5EFE4] rounded-lg p-0.5">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-colors text-[#4A3728]"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-5 text-center text-sm font-medium text-[#1A1208]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-colors text-[#4A3728]"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[#C9B99A] hover:text-[#B85450] transition-colors ml-auto"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-[#E0D0B8] space-y-4 bg-[#F5EFE4]">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8B7355]">Subtotal</span>
                    <span className="text-lg font-semibold text-[#1A1208]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-[#8B7355]">
                    Shipping & taxes calculated at checkout
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="btn btn-gold w-full justify-center"
                      id="cart-checkout-btn"
                    >
                      Proceed to Checkout
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="btn btn-outline w-full justify-center"
                      id="cart-view-btn"
                    >
                      View Cart
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
