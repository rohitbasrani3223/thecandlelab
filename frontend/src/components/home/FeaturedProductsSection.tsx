"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS } from "@/data/mock";
import { ProductCard } from "@/components/product/ProductCard";

const CATEGORY_TABS = [
  { id: "for_you", label: "For You" },
  { id: "luxury", label: "Luxury Candles" },
  { id: "soy", label: "Soy & Beeswax" },
  { id: "gifts", label: "Gift Sets" },
  { id: "bestsellers", label: "Best Sellers" },
];

export function FeaturedProductsSection() {
  const [activeTab, setActiveTab] = useState("for_you");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeTab === "bestsellers") return p.isBestSeller;
    if (activeTab === "luxury") return p.category.slug === "luxury-collection" || p.price > 1200;
    if (activeTab === "soy") return p.waxType?.toLowerCase().includes("soy");
    if (activeTab === "gifts") return p.category.slug === "gift-collection";
    return true; // "for_you" default
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="section py-12" style={{ background: "#F5EFE4" }}>
      <div className="container">

        {/* ── Flipkart Style Category Tabs Header Bar ── */}
        <div className="flex items-center gap-6 overflow-x-auto pb-3 mb-6 border-b border-[#E0D0B8] custom-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative text-xs sm:text-sm font-semibold whitespace-nowrap pb-2 transition-colors"
                style={{
                  color: isActive ? "#1A1208" : "#8B7355",
                }}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4964A] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Section Title + Carousel Navigation ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-medium text-[#1A1208]"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              Suggested For You
            </h2>
            <p className="text-xs text-[#8B7355] mt-0.5">
              Handpicked candle recommendations based on your preferences
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full bg-white border border-[#E0D0B8] flex items-center justify-center text-[#1A1208] hover:bg-[#C4964A] hover:text-white transition-colors shadow-sm"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full bg-[#1A1208] text-white flex items-center justify-center hover:bg-[#C4964A] transition-colors shadow-sm"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Horizontal Scrollable Carousel Track ── */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin" }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="w-[260px] sm:w-[280px] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* ── View All CTA ── */}
        <div className="flex justify-center mt-8">
          <Link
            href="/shop"
            id="featured-view-all"
            className="btn btn-dark btn-sm gap-2 rounded-xl text-xs uppercase tracking-wider"
          >
            Explore All Candles
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}
