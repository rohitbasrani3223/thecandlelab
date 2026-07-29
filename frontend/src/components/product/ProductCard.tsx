"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, ShoppingBag, Star, Flame, Clock, Scale } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore, useWishlistStore, useCompareStore } from "@/store";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistIds, toggleItem } = useWishlistStore();
  const { toggleCompare, isCompared: checkIsCompared } = useCompareStore();

  const wishlisted = wishlistIds.includes(product.id);
  const isCompared = checkIsCompared(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, undefined, 1);
    toast.success(`Added ${product.name} to cart! ✨`, { icon: "🕯️" });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    if (!wishlisted) {
      toast.success("Saved to wishlist 🤍");
    } else {
      toast("Removed from wishlist");
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
    if (!isCompared) {
      toast.success(`Added ${product.name} to comparison ⚖️`);
    } else {
      toast("Removed from comparison");
    }
  };

  // Primary image and hover-swap image (Myntra style)
  const primaryImage =
    product.images[0] ||
    product.thumbnail ||
    "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800";

  const hoverImage =
    product.images[1] || product.images[0] || product.thumbnail || primaryImage;

  const discountPct =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="h-full flex flex-col"
    >
      <div
        className="group relative rounded-2xl overflow-hidden flex flex-col h-full bg-white transition-all duration-300"
        style={{
          border: isHovered ? "1.5px solid #C4964A" : "1.5px solid #EDE4D4",
          boxShadow: isHovered
            ? "0 16px 40px -8px rgba(26,18,8,0.13), 0 0 18px rgba(196,150,74,0.10)"
            : "0 2px 12px -4px rgba(26,18,8,0.06)",
        }}
      >
        {/* ── Image Container ── */}
        <Link href={`/product/${product.slug}`} className="block relative flex-shrink-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5EFE4]">

            {/* Primary Image */}
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-all duration-500 ease-out"
              style={{
                opacity: isHovered && hoverImage !== primaryImage ? 0 : 1,
                transform: isHovered ? "scale(1.06)" : "scale(1)",
              }}
            />

            {/* Hover / Second Image (Myntra style swap) */}
            {hoverImage !== primaryImage && (
              <Image
                src={hoverImage}
                alt={`${product.name} - alternate view`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover absolute inset-0 transition-all duration-500 ease-out"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scale(1.04)" : "scale(1.08)",
                }}
              />
            )}

            {/* Bottom gradient for CTA overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                background:
                  "linear-gradient(180deg, rgba(26,18,8,0) 55%, rgba(26,18,8,0.38) 100%)",
              }}
            />

            {/* ── Single Priority Badge (Bestseller > New Arrival > % Off) ── */}
            <div className="absolute top-2.5 left-2.5 z-10">
              {product.isBestSeller ? (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm"
                  style={{ background: "#C4964A", color: "#fff" }}
                >
                  <Flame size={9} className="fill-white" />
                  Bestseller
                </span>
              ) : product.isNewArrival ? (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm"
                  style={{ background: "#1A1208", color: "#F5EFE4" }}
                >
                  New Arrival
                </span>
              ) : discountPct > 0 ? (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm"
                  style={{
                    background: "#FEF2F2",
                    color: "#B85450",
                    border: "1px solid #FECACA",
                  }}
                >
                  {discountPct}% OFF
                </span>
              ) : null}
            </div>

            {/* ── Burn Time & Wax Pills Overlay at Bottom of Image ── */}
            {!isHovered && (
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none transition-opacity duration-300">
                <span className="bg-[#FDFAF5]/95 text-[#1A1208] text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 border border-[#EDE4D4]/90 shadow-sm">
                  <Clock className="w-3 h-3 text-[#C4964A]" /> {product.burnTime || "45h Burn"}
                </span>
                <span className="bg-[#FDFAF5]/95 text-[#A87B32] text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md border border-[#EDE4D4]/90 shadow-sm">
                  {product.waxType || "Soy Wax"}
                </span>
              </div>
            )}

            {/* ── Wishlist heart — ALWAYS VISIBLE (Myntra/Ajio style) ── */}
            <button
              suppressHydrationWarning
              onClick={handleWishlist}
              className="absolute top-2.5 right-2.5 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
              style={{
                background: wishlisted
                  ? "#C4964A"
                  : "rgba(253,250,245,0.92)",
                backdropFilter: "blur(10px)",
                border: wishlisted
                  ? "1.5px solid #A87B32"
                  : "1.5px solid rgba(224,208,184,0.6)",
              }}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              id={`wishlist-${product.id}`}
            >
              <Heart
                size={15}
                className={wishlisted ? "text-white fill-white" : "text-[#8B5E3C]"}
                fill={wishlisted ? "currentColor" : "none"}
              />
            </button>

            {/* ── Quick View — appears on hover below wishlist ── */}
            <AnimatePresence>
              {isHovered && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  suppressHydrationWarning
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/product/${product.slug}`);
                  }}
                  className="absolute top-14 right-2.5 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                  style={{
                    background: "rgba(253,250,245,0.92)",
                    backdropFilter: "blur(10px)",
                    border: "1.5px solid rgba(224,208,184,0.6)",
                  }}
                  aria-label="Quick view"
                  id={`quickview-${product.id}`}
                >
                  <Eye size={14} className="text-[#8B7355]" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Out of Stock overlay */}
            {isOutOfStock && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center"
                style={{ background: "rgba(26,18,8,0.55)" }}
              >
                <span
                  className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest"
                  style={{ background: "#EDE4D4", color: "#8B7355" }}
                >
                  Sold Out
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* ── Product Info ── */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white space-y-1.5">

          {/* Category */}
          <p className="text-[10px] font-bold text-[#A87B32] tracking-[0.16em] uppercase">
            {product.category.name}
          </p>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3
              className="text-[15px] sm:text-[17px] font-medium text-[#1A1208] leading-snug hover:text-[#A87B32] transition-colors line-clamp-2"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Fragrance notes */}
          {product.fragrance && (
            <p className="text-xs text-[#8B7355] line-clamp-1">
              🌸 {product.fragrance}
            </p>
          )}

          {/* ── Rating — brand success green ── */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold"
              style={{ background: "#4A7C59", color: "#fff" }}
            >
              {product.rating}
              <Star size={9} fill="white" className="text-white" />
            </span>
            <span className="text-[11px] text-[#8B7355]">
              ({product.reviewCount.toLocaleString("en-IN")})
            </span>
          </div>

          {/* ── Spacer ── */}
          <div className="mt-auto">
            <div
              className="pt-2"
              style={{ borderTop: "1px solid #EDE4D4" }}
            >
              {/* ── Price Row — Flipkart/Amazon inline style ── */}
              <div className="flex items-baseline gap-1.5 flex-wrap mb-1">
                <span className="text-base font-bold text-[#1A1208]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-[12px] text-[#8B7355] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-[12px] font-semibold" style={{ color: "#B85450" }}>
                      {discountPct}% off
                    </span>
                  </>
                )}
              </div>

              {/* ── Action Buttons: Compare (Left) + Add to Cart (Right) ── */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  suppressHydrationWarning
                  onClick={handleCompare}
                  className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
                  style={{
                    background: isCompared ? "#F5EFE4" : "#fff",
                    border: isCompared ? "1.5px solid #C4964A" : "1.5px solid #E0D0B8",
                    color: isCompared ? "#A87B32" : "#4A3728",
                  }}
                  id={`compare-${product.id}`}
                  aria-label={`Compare ${product.name}`}
                >
                  <Scale size={13} className="text-[#C4964A]" />
                  {isCompared ? "Compared" : "Compare"}
                </button>

                <button
                  suppressHydrationWarning
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: isOutOfStock
                      ? "#E0D0B8"
                      : "linear-gradient(135deg, #1A1208 0%, #3D2010 100%)",
                    color: isOutOfStock ? "#8B7355" : "#FDFAF5",
                    boxShadow: !isOutOfStock ? "0 3px 10px rgba(26,18,8,0.18)" : "none",
                  }}
                  id={`add-to-cart-${product.id}`}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag size={13} className={isOutOfStock ? "text-[#8B7355]" : "text-[#C4964A]"} />
                  {isOutOfStock ? "Sold Out" : "Add"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
