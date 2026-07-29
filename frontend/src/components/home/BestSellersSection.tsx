"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Star, Flame, ShoppingBag } from "lucide-react";
import { PRODUCTS } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";

export function BestSellersSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { addItem } = useCartStore();
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section ref={ref} className="section">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          {/* Left: Header */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:w-72 flex-shrink-0"
          >
            <span className="section-label">Fan Favourites</span>
            <div className="gold-divider mb-5" />
            <h2
              className="text-[#1A1208] mb-5 leading-tight"
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: "clamp(2.2rem, 4vw, 3rem)",
                fontWeight: 400,
              }}
            >
              Our Best Sellers
            </h2>
            <p className="text-[#8B7355] leading-relaxed mb-8">
              The candles that our customers keep coming back for. Tried, tested,
              and truly loved.
            </p>
            <Link href="/shop?filter=bestsellers" className="btn btn-dark gap-2" id="bestsellers-view-all">
              Shop Best Sellers <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Right: Products */}
          <div className="flex-1 space-y-6 sm:space-y-8">
            {bestSellers.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 32 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.12, duration: 0.6 }}
              >
                <div
                  className="flex gap-4 p-4 rounded-2xl group transition-all hover:shadow-md"
                  style={{
                    background: "#fff",
                    border: "1px solid #EDE4D4",
                    cursor: "pointer",
                  }}
                >
                  {/* Rank */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: index === 0 ? "#C4964A" : "#F5EFE4",
                      color: index === 0 ? "#fff" : "#8B7355",
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Image */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F5EFE4]">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product.slug}`}>
                      <p className="font-medium text-[#1A1208] hover:text-[#A87B32] transition-colors leading-snug line-clamp-1">
                        {product.name}
                      </p>
                    </Link>
                    {product.fragrance && (
                      <p className="text-xs text-[#8B7355] mt-0.5 line-clamp-1">
                        {product.fragrance}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={
                              s <= Math.floor(product.rating)
                                ? "text-[#C4964A] fill-[#C4964A]"
                                : "text-[#E0D0B8]"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#8B7355]">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-base font-semibold text-[#1A1208]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-[#8B7355] line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      {product.burnTime && (
                        <span className="hidden sm:flex items-center gap-1 text-xs text-[#A87B32]">
                          <Flame size={10} />
                          {product.burnTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to cart */}
                  <div className="flex-shrink-0 flex items-center">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        addItem(product);
                        toast.success("Added to cart!");
                      }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                      suppressHydrationWarning
                      style={{
                        background: "linear-gradient(135deg, #A87B32, #C4964A)",
                        color: "#fff",
                        boxShadow: "0 4px 12px rgba(196,150,74,0.3)",
                      }}
                      id={`bestseller-add-${product.id}`}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingBag size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
