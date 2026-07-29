"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Grid,
  List,
  X,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { PRODUCTS } from "@/data/mock";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterCandlesSidebar } from "@/components/shop/FilterCandlesSidebar";

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function ShopClient({
  presetCategory = "",
  categoryName = "",
}: {
  presetCategory?: string;
  categoryName?: string;
}) {
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedWaxType, setSelectedWaxType] = useState("Soy Wax");
  const [selectedWickType, setSelectedWickType] = useState("All Wick Types");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter products logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Search query
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fragrance?.toLowerCase().includes(q)
      );
    }

    // Wax type
    if (selectedWaxType && selectedWaxType !== "All Wax Types") {
      result = result.filter((p) =>
        p.waxType?.toLowerCase().includes(selectedWaxType.toLowerCase())
      );
    }

    // Max price
    if (maxPrice) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // Sort order
    switch (selectedSort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [search, selectedWaxType, maxPrice, selectedSort]);

  return (
    <div className="min-h-screen pb-16" style={{ background: "#FDFAF5" }}>
      {/* Page Title Banner */}
      <div
        className="py-12 px-6 text-center"
        style={{
          background: "linear-gradient(180deg, #F5EFE4 0%, #FDFAF5 100%)",
          borderBottom: "1px solid #E0D0B8",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A87B32]">
            Explore
          </span>
          <h1
            className="mt-2 text-4xl sm:text-5xl font-light text-[#1A1208]"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            {categoryName || "Shop All"}
          </h1>
          <p className="text-sm text-[#8B7355] mt-2 font-light">
            {filteredProducts.length} luxury candles available
          </p>
        </motion.div>
      </div>

      <div className="container py-8">
        {/* Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#EDE4D4]">
          {/* Search + Mobile Filter Toggle */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7355]"
              />
              <input
                type="text"
                id="shop-search"
                placeholder="Search candles by name or scent..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-white border border-[#E0D0B8] text-[#1A1208] placeholder-[#8B7355] focus:outline-none focus:border-[#C4964A]"
              />
            </div>

            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[#C4964A] text-xs font-semibold text-[#A87B32] bg-[#F5EFE4]"
              id="mobile-filter-toggle"
            >
              <SlidersHorizontal size={15} />
              Filter Candles
            </button>
          </div>

          {/* Sort & Grid/List View Controls */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                id="shop-sort"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="appearance-none text-xs py-2.5 pl-3.5 pr-8 rounded-2xl border transition-colors cursor-pointer"
                style={{
                  background: "#fff",
                  border: "1.5px solid #E0D0B8",
                  color: "#4A3728",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] pointer-events-none"
              />
            </div>

            <div
              className="flex rounded-2xl overflow-hidden border border-[#E0D0B8]"
            >
              <button
                onClick={() => setViewMode("grid")}
                className="w-9 h-9 flex items-center justify-center transition-colors"
                style={{
                  background: viewMode === "grid" ? "#F5EFE4" : "#fff",
                  color: viewMode === "grid" ? "#A87B32" : "#8B7355",
                }}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="w-9 h-9 flex items-center justify-center transition-colors"
                style={{
                  background: viewMode === "list" ? "#F5EFE4" : "#fff",
                  color: viewMode === "list" ? "#A87B32" : "#8B7355",
                }}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Left Sidebar + Right Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar: Exact Filter Candles Sidebar */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-4">
            <FilterCandlesSidebar
              selectedCollection={selectedCollection}
              onCollectionChange={setSelectedCollection}
              selectedWaxType={selectedWaxType}
              onWaxTypeChange={setSelectedWaxType}
              selectedWickType={selectedWickType}
              onWickTypeChange={setSelectedWickType}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
            />
          </div>

          {/* Right Column: Products Grid */}
          <div className="lg:col-span-8 xl:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#EDE4D4] p-8">
                <p
                  className="text-2xl font-normal text-[#1A1208] mb-2"
                  style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                >
                  No candles match your filters
                </p>
                <p className="text-xs text-[#8B7355] mb-6">
                  Try adjusting max price or selecting another wax type.
                </p>
                <button
                  onClick={() => {
                    setSelectedWaxType("All Wax Types");
                    setSelectedWickType("All Wick Types");
                    setMaxPrice(3000);
                    setSearch("");
                  }}
                  className="btn btn-gold btn-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-[#FDFAF5] z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[#1A1208]">Filters</span>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X size={20} className="text-[#8B7355]" />
                </button>
              </div>
              <FilterCandlesSidebar
                selectedCollection={selectedCollection}
                onCollectionChange={setSelectedCollection}
                selectedWaxType={selectedWaxType}
                onWaxTypeChange={setSelectedWaxType}
                selectedWickType={selectedWickType}
                onWickTypeChange={setSelectedWickType}
                maxPrice={maxPrice}
                onMaxPriceChange={setMaxPrice}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
