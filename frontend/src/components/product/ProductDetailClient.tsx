"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Flame,
  Package,
  RotateCcw,
  Shield,
  ChevronRight,
  Share2,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";
import { Product } from "@/types";
import { useCartStore, useWishlistStore } from "@/store";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { REVIEWS } from "@/data/mock";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

const TABS = ["Description", "Details", "Reviews", "Shipping"];

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [isZoomed, setIsZoomed] = useState(false);

  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const wishlisted = isWishlisted(product.id);
  const discount =
    product.originalPrice > product.price
      ? calculateDiscount(product.originalPrice, product.price)
      : 0;

  const productReviews = REVIEWS.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addItem(product, undefined, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addItem(product, undefined, quantity);
    window.location.href = "/checkout";
  };

  return (
    <div style={{ background: "#FDFAF5" }}>
      {/* Breadcrumb */}
      <div
        className="container py-4"
        style={{ borderBottom: "1px solid #EDE4D4" }}
      >
        <div className="flex items-center gap-2 text-xs text-[#8B7355]">
          <Link href="/" className="hover:text-[#A87B32] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link
            href="/shop"
            className="hover:text-[#A87B32] transition-colors"
          >
            Shop
          </Link>
          <ChevronRight size={12} />
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-[#A87B32] transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#1A1208] line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* ---- LEFT: Images ---- */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="relative aspect-square rounded-3xl overflow-hidden cursor-zoom-in"
              style={{
                background: "#F5EFE4",
                border: "1px solid #EDE4D4",
              }}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[selectedImage] || product.thumbnail}
                    alt={`${product.name} - image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="badge badge-sale text-sm px-3 py-1">
                    -{discount}%
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="badge badge-new">New</span>
                )}
                {product.isBestSeller && (
                  <span className="badge badge-bestseller">🔥 Bestseller</span>
                )}
              </div>

              {/* Share button */}
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: "rgba(253,250,245,0.9)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(224,208,184,0.6)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                aria-label="Share"
              >
                <Share2 size={16} className="text-[#8B5E3C]" />
              </button>
            </motion.div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all"
                    style={{
                      border:
                        i === selectedImage
                          ? "2px solid #C4964A"
                          : "2px solid #EDE4D4",
                      boxShadow:
                        i === selectedImage
                          ? "0 0 0 2px rgba(196,150,74,0.3)"
                          : "none",
                    }}
                    id={`thumb-${i}`}
                  >
                    <Image
                      src={img}
                      alt={`View ${i + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---- RIGHT: Product Info ---- */}
          <div className="flex flex-col gap-6">
            {/* Category + Name */}
            <div>
              <Link
                href={`/category/${product.category.slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-[#A87B32] hover:text-[#C4964A] transition-colors"
              >
                {product.category.name}
              </Link>
              <h1
                className="mt-2 leading-tight"
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                  fontWeight: 400,
                  color: "#1A1208",
                }}
              >
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={
                      s <= Math.floor(product.rating)
                        ? "text-[#C4964A] fill-[#C4964A]"
                        : "text-[#E0D0B8]"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-[#1A1208]">
                {product.rating}
              </span>
              <span className="text-sm text-[#8B7355]">
                ({product.reviewCount} reviews)
              </span>
              {product.isNewArrival && (
                <span className="text-xs text-[#8B7355]">·</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span
                className="text-3xl font-semibold text-[#1A1208]"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-[#8B7355] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-sm font-semibold"
                    style={{ background: "#FDECEA", color: "#B85450" }}
                  >
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-[#8B7355] leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Product Details Pills */}
            <div className="flex flex-wrap gap-2">
              {product.size && (
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: "#F5EFE4",
                    color: "#6B4226",
                    border: "1px solid #EDE4D4",
                  }}
                >
                  📦 {product.size}
                </span>
              )}
              {product.burnTime && (
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: "#F5EFE4",
                    color: "#6B4226",
                    border: "1px solid #EDE4D4",
                  }}
                >
                  🕯️ {product.burnTime}
                </span>
              )}
              {product.waxType && (
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: "#F5EFE4",
                    color: "#6B4226",
                    border: "1px solid #EDE4D4",
                  }}
                >
                  ✨ {product.waxType}
                </span>
              )}
              {product.fragrance && (
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: "#F5EFE4",
                    color: "#6B4226",
                    border: "1px solid #EDE4D4",
                  }}
                >
                  🌸 {product.fragrance}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-700 font-medium">
                    {product.stock <= 5
                      ? `Only ${product.stock} left!`
                      : "In Stock"}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-red-600 font-medium">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="space-y-3">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#4A3728]">
                  Quantity
                </span>
                <div
                  className="flex items-center rounded-xl overflow-hidden"
                  style={{ border: "1.5px solid #E0D0B8", background: "#fff" }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#F5EFE4] transition-colors text-[#4A3728]"
                    id="qty-minus"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-base font-semibold text-[#1A1208]">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#F5EFE4] transition-colors text-[#4A3728]"
                    id="qty-plus"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn btn-gold flex-1 justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  id="product-add-to-cart"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="btn btn-dark flex-1 justify-center text-base disabled:opacity-50"
                  id="product-buy-now"
                >
                  Buy Now
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    toggleItem(product.id);
                    toast.success(
                      wishlisted
                        ? "Removed from wishlist"
                        : "Added to wishlist!"
                    );
                  }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                  style={{
                    background: wishlisted ? "#C4964A" : "#fff",
                    border: `1.5px solid ${wishlisted ? "#C4964A" : "#E0D0B8"}`,
                    boxShadow: wishlisted
                      ? "0 4px 12px rgba(196,150,74,0.3)"
                      : "none",
                  }}
                  id="product-wishlist"
                  aria-label="Wishlist"
                >
                  <Heart
                    size={20}
                    className={wishlisted ? "text-white" : "text-[#8B5E3C]"}
                    fill={wishlisted ? "currentColor" : "none"}
                  />
                </motion.button>
              </div>
            </div>

            {/* Trust Badges */}
            <div
              className="grid grid-cols-3 gap-3 pt-2"
              style={{ borderTop: "1px solid #EDE4D4" }}
            >
              {[
                { icon: <Package size={16} />, label: "Free Shipping", sub: "Above ₹999" },
                { icon: <RotateCcw size={16} />, label: "7-Day Returns", sub: "Easy returns" },
                { icon: <Shield size={16} />, label: "100% Authentic", sub: "Guaranteed" },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center text-center gap-1">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: "#F5EFE4", color: "#A87B32" }}
                  >
                    {badge.icon}
                  </div>
                  <span className="text-xs font-semibold text-[#1A1208]">
                    {badge.label}
                  </span>
                  <span className="text-[10px] text-[#8B7355]">
                    {badge.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div style={{ borderTop: "1px solid #EDE4D4", background: "#F5EFE4" }}>
        <div className="container">
          {/* Tab Headers */}
          <div className="flex gap-1 pt-6 pb-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-3 text-sm font-medium rounded-t-xl transition-all relative whitespace-nowrap"
                style={{
                  background: activeTab === tab ? "#FDFAF5" : "transparent",
                  color: activeTab === tab ? "#A87B32" : "#8B7355",
                  borderBottom:
                    activeTab === tab ? "none" : "2px solid transparent",
                }}
                id={`tab-${tab.toLowerCase()}`}
              >
                {tab}
                {tab === "Reviews" && productReviews.length > 0 && (
                  <span
                    className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "#C4964A", color: "#fff" }}
                  >
                    {productReviews.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FDFAF5] rounded-b-2xl rounded-tr-2xl p-6 lg:p-8"
            >
              {activeTab === "Description" && (
                <div className="prose max-w-none">
                  <p className="text-[#4A3728] leading-relaxed text-base">
                    {product.description}
                  </p>
                  {product.fragrance && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-[#1A1208] mb-2">
                        Fragrance Notes
                      </h4>
                      <p className="text-[#8B7355]">{product.fragrance}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Details" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "SKU", value: product.sku },
                    { label: "Wax Type", value: product.waxType },
                    { label: "Size / Weight", value: product.size || `${product.weight}g` },
                    { label: "Burn Time", value: product.burnTime },
                    { label: "Fragrance", value: product.fragrance },
                    { label: "Stock", value: `${product.stock} units` },
                  ]
                    .filter((d) => d.value)
                    .map((detail) => (
                      <div
                        key={detail.label}
                        className="flex justify-between py-3"
                        style={{ borderBottom: "1px solid #EDE4D4" }}
                      >
                        <span className="text-sm text-[#8B7355]">
                          {detail.label}
                        </span>
                        <span className="text-sm font-medium text-[#1A1208]">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === "Reviews" && (
                <div className="space-y-4">
                  {productReviews.length === 0 ? (
                    <p className="text-[#8B7355] text-center py-8">
                      No reviews yet. Be the first to review this product!
                    </p>
                  ) : (
                    productReviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-5 rounded-xl"
                        style={{
                          background: "#fff",
                          border: "1px solid #EDE4D4",
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex gap-0.5 mb-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={13}
                                  className={
                                    s <= review.rating
                                      ? "text-[#C4964A] fill-[#C4964A]"
                                      : "text-[#E0D0B8]"
                                  }
                                />
                              ))}
                            </div>
                            <p className="font-semibold text-sm text-[#1A1208]">
                              "{review.title}"
                            </p>
                          </div>
                          <span className="text-xs text-[#8B7355]">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-IN",
                              { month: "short", year: "numeric" }
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-[#8B7355] leading-relaxed">
                          {review.body}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: "linear-gradient(135deg, #A87B32, #D4A96A)" }}
                          >
                            {review.userName.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-[#4A3728]">
                            {review.userName}
                          </span>
                          {review.isVerified && (
                            <span className="flex items-center gap-1 text-[10px] text-[#A87B32] font-semibold">
                              <CheckCircle2 size={11} />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "Shipping" && (
                <div className="space-y-4">
                  {[
                    {
                      icon: <Package size={18} />,
                      title: "Standard Shipping",
                      desc: "4-7 business days • Free on orders above ₹999",
                    },
                    {
                      icon: <Clock size={18} />,
                      title: "Express Shipping",
                      desc: "2-3 business days • ₹99 additional charge",
                    },
                    {
                      icon: <RotateCcw size={18} />,
                      title: "Easy Returns",
                      desc: "7-day hassle-free return on unused products",
                    },
                    {
                      icon: <Award size={18} />,
                      title: "Secure Packaging",
                      desc: "Every order is carefully packed to prevent damage",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-4 p-4 rounded-xl"
                      style={{ background: "#fff", border: "1px solid #EDE4D4" }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "#F5EFE4", color: "#A87B32" }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#1A1208]">
                          {item.title}
                        </p>
                        <p className="text-sm text-[#8B7355] mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container section">
          <div className="section-header">
            <span className="section-label">You May Also Like</span>
            <div className="gold-divider mx-auto mb-4" />
            <h2 className="section-title">Related Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
