"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { COLLECTIONS } from "@/data/mock";

interface FilterCandlesSidebarProps {
  selectedCollection?: string;
  onCollectionChange?: (col: string) => void;
  selectedWaxType?: string;
  onWaxTypeChange?: (wax: string) => void;
  selectedWickType?: string;
  onWickTypeChange?: (wick: string) => void;
  maxPrice?: number;
  onMaxPriceChange?: (price: number) => void;
  onResetFilters?: () => void;
}

export function FilterCandlesSidebar({
  selectedCollection = "",
  onCollectionChange,
  selectedWaxType = "Soy Wax",
  onWaxTypeChange,
  selectedWickType = "All Wick Types",
  onWickTypeChange,
  maxPrice = 2500,
  onMaxPriceChange,
  onResetFilters,
}: FilterCandlesSidebarProps) {
  const [collection, setCollection] = useState(selectedCollection);
  const [wax, setWax] = useState(selectedWaxType);
  const [wick, setWick] = useState(selectedWickType);
  const [price, setPrice] = useState(maxPrice);

  const handleWaxSelect = (val: string) => {
    setWax(val);
    if (onWaxTypeChange) onWaxTypeChange(val);
  };

  const handleWickSelect = (val: string) => {
    setWick(val);
    if (onWickTypeChange) onWickTypeChange(val);
  };

  const handleCollectionSelect = (val: string) => {
    setCollection(val);
    if (onCollectionChange) onCollectionChange(val);
  };

  const handlePriceChange = (val: number) => {
    setPrice(val);
    if (onMaxPriceChange) onMaxPriceChange(val);
  };

  return (
    <aside
      className="w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-lg border transition-all duration-300"
      style={{
        background: "#FDFAF5",
        borderColor: "#EDE4D4",
        boxShadow: "0 10px 30px rgba(26,18,8,0.04)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#EDE4D4]">
        <SlidersHorizontal size={18} className="text-[#C4964A]" />
        <h3
          className="text-2xl font-normal text-[#1A1208]"
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
        >
          Filter Candles
        </h3>
      </div>

      <div className="space-y-6">
        {/* 1. COLLECTION */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.18em] text-[#C4964A] mb-2.5">
            COLLECTION
          </label>
          <div className="relative">
            <select
              value={collection}
              onChange={(e) => handleCollectionSelect(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm appearance-none cursor-pointer transition-all pr-10"
              style={{
                background: "#F5EFE4",
                border: "1.5px solid #E0D0B8",
                color: "#1A1208",
                fontFamily: "Inter, sans-serif",
              }}
              id="filter-sidebar-collection"
            >
              <option value="">All Collections (8)</option>
              {COLLECTIONS.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7355] pointer-events-none"
            />
          </div>
        </div>

        {/* 2. WAX TYPE */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.18em] text-[#C4964A] mb-3">
            WAX TYPE
          </label>
          <div className="space-y-2.5">
            {[
              "All Wax Types",
              "Soy Wax",
              "Beeswax",
              "Coconut Wax",
              "Paraffin Blend",
            ].map((option) => {
              const isSelected = wax === option;
              return (
                <label
                  key={option}
                  onClick={() => handleWaxSelect(option)}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                    style={{
                      borderColor: isSelected ? "#C4964A" : "#C9B99A",
                      background: "#FDFAF5",
                    }}
                  >
                    {isSelected && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#C4964A" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-sm transition-colors"
                    style={{
                      color: isSelected ? "#C4964A" : "#4A3728",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. WICK TYPE */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.18em] text-[#C4964A] mb-3">
            WICK TYPE
          </label>
          <div className="space-y-2.5">
            {[
              "All Wick Types",
              "Wooden Crackling Wick",
              "Cotton Wick",
            ].map((option) => {
              const isSelected = wick === option;
              return (
                <label
                  key={option}
                  onClick={() => handleWickSelect(option)}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                    style={{
                      borderColor: isSelected ? "#C4964A" : "#C9B99A",
                      background: "#FDFAF5",
                    }}
                  >
                    {isSelected && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#C4964A" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-sm transition-colors"
                    style={{
                      color: isSelected ? "#C4964A" : "#4A3728",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 4. MAX PRICE SLIDER */}
        <div className="pt-2 border-t border-[#EDE4D4]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#1A1208]">Max Price:</span>
            <span
              className="text-lg font-bold text-[#C4964A]"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              INR{price}
            </span>
          </div>

          <input
            type="range"
            min="500"
            max="3000"
            step="100"
            value={price}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full accent-[#C4964A] cursor-pointer"
            style={{
              height: "6px",
              borderRadius: "3px",
              background: `linear-gradient(to right, #C4964A 0%, #C4964A ${
                ((price - 500) / (3000 - 500)) * 100
              }%, #E0D0B8 ${((price - 500) / (3000 - 500)) * 100}%, #E0D0B8 100%)`,
            }}
            id="filter-sidebar-price-slider"
          />
        </div>
      </div>
    </aside>
  );
}
