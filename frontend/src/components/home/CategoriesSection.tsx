"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/mock";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function CategoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-label">Explore</span>
          <div className="gold-divider mx-auto mb-4" />
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">
            From luxurious single candles to curated gift collections — find the
            perfect fragrance for every mood and occasion.
          </p>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5"
        >
          {CATEGORIES.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/category/${category.slug}`}
                id={`category-${category.slug}`}
                className="group flex flex-col items-center gap-3"
              >
                {/* Category Image Circle */}
                <div
                  className="relative w-full aspect-square rounded-2xl overflow-hidden"
                  style={{
                    background: "#F5EFE4",
                    border: "2px solid transparent",
                    backgroundClip: "padding-box",
                    boxShadow: "0 4px 16px rgba(26,18,8,0.08)",
                    transition: "all 0.4s ease",
                  }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                  />

                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      background:
                        "linear-gradient(to top, rgba(168,123,50,0.8) 0%, rgba(168,123,50,0.2) 60%, transparent 100%)",
                    }}
                  >
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                      <span
                        className="flex items-center gap-1 text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        Shop <ArrowRight size={12} />
                      </span>
                    </div>
                  </motion.div>

                  {/* Product count badge */}
                  {category.productCount && (
                    <div
                      className="absolute top-2.5 right-2.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                      style={{
                        background: "rgba(253,250,245,0.92)",
                        backdropFilter: "blur(4px)",
                        color: "#A87B32",
                      }}
                    >
                      {category.productCount}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="text-center">
                  <p
                    className="text-sm font-medium text-[#1A1208] group-hover:text-[#A87B32] transition-colors leading-tight"
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1rem" }}
                  >
                    {category.name}
                  </p>
                  <p className="text-xs text-[#8B7355] mt-0.5">
                    {category.productCount} products
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex justify-center mt-10"
        >
          <Link
            href="/shop"
            id="categories-view-all"
            className="btn btn-outline gap-2"
          >
            View All Products
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
