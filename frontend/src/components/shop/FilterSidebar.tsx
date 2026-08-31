import React from 'react';
import { ChevronDownIcon, CloseIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface ShopFiltersState {
  categories: string[];
  collections: string[];
  fragrances: string[];
  sizes: string[];
  colors: string[];
  scentProfiles: string[];
  priceMin: number;
  priceMax: number;
  minRating: number;
  inStockOnly: boolean;
}

export interface FilterSidebarProps {
  filters: ShopFiltersState;
  onFilterChange: (filters: ShopFiltersState) => void;
  onResetFilters: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isMobile = false,
  onCloseMobile,
}) => {
  const { collections: cmsCollections, mainCategories, fragrances, sizes } = useCMS();

  const toggleCategory = (cat: string) => {
    const updated = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: updated });
  };

  const toggleCollection = (col: string) => {
    const updated = filters.collections.includes(col)
      ? filters.collections.filter((c) => c !== col)
      : [...filters.collections, col];
    onFilterChange({ ...filters, collections: updated });
  };

  const toggleFragrance = (frag: string) => {
    const current = filters.fragrances || [];
    const updated = current.includes(frag)
      ? current.filter((f) => f !== frag)
      : [...current, frag];
    onFilterChange({ ...filters, fragrances: updated });
  };

  const toggleSize = (sz: string) => {
    const current = filters.sizes || [];
    const updated = current.includes(sz)
      ? current.filter((s) => s !== sz)
      : [...current, sz];
    onFilterChange({ ...filters, sizes: updated });
  };

  return (
    <div className={`space-y-6 font-sans ${isMobile ? 'p-6 bg-white' : 'w-64 shrink-0'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-3">
        <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-[#232323]">
          Refine Selection
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="text-[10px] font-mono uppercase tracking-wider text-[#8B6F4E] hover:underline cursor-pointer"
          >
            Reset
          </button>
          {isMobile && onCloseMobile && (
            <button onClick={onCloseMobile} className="text-[#7D6F63] hover:text-[#232323] p-1 cursor-pointer">
              <CloseIcon size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 1. In Stock Toggle */}
      <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#EADDCB] shadow-xs">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs text-[#232323] font-medium">In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
            className="rounded text-[#8B6F4E]"
          />
        </label>
      </div>

      {/* 2. Main Categories */}
      {mainCategories.length > 0 && (
        <div className="space-y-3 border-b border-[#EADDCB] pb-4">
          <div className="flex items-center justify-between font-bold text-xs uppercase font-mono tracking-wider text-[#232323]">
            <span>Categories</span>
            <ChevronDownIcon size={14} className="text-[#7D6F63]" />
          </div>
          <div className="space-y-2 pt-1">
            {mainCategories.map((item) => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer text-xs text-[#5C5149] hover:text-[#232323]">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(item.id) || filters.categories.includes(item.name)}
                  onChange={() => toggleCategory(item.id)}
                  className="rounded text-[#8B6F4E]"
                />
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 3. Curated Collections */}
      {cmsCollections.length > 0 && (
        <div className="space-y-3 border-b border-[#EADDCB] pb-4">
          <div className="flex items-center justify-between font-bold text-xs uppercase font-mono tracking-wider text-[#232323]">
            <span>Collections</span>
            <ChevronDownIcon size={14} className="text-[#7D6F63]" />
          </div>
          <div className="space-y-2 pt-1">
            {cmsCollections.map((item) => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer text-xs text-[#5C5149] hover:text-[#232323]">
                <input
                  type="checkbox"
                  checked={filters.collections.includes(item.id) || filters.collections.includes(item.name)}
                  onChange={() => toggleCollection(item.id)}
                  className="rounded text-[#8B6F4E]"
                />
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 4. Fragrance Selector Facet */}
      {fragrances.length > 0 && (
        <div className="space-y-3 border-b border-[#EADDCB] pb-4">
          <div className="flex items-center justify-between font-bold text-xs uppercase font-mono tracking-wider text-[#232323]">
            <span>Fragrance Accord</span>
            <ChevronDownIcon size={14} className="text-[#7D6F63]" />
          </div>
          <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-1 scrollbar-none">
            {fragrances.map((item) => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer text-xs text-[#5C5149] hover:text-[#232323]">
                <input
                  type="checkbox"
                  checked={(filters.fragrances || []).includes(item.id)}
                  onChange={() => toggleFragrance(item.id)}
                  className="rounded text-[#8B6F4E]"
                />
                <span className="truncate">{item.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 5. Generic Sizes Facet */}
      {sizes.length > 0 && (
        <div className="space-y-3 border-b border-[#EADDCB] pb-4">
          <div className="flex items-center justify-between font-bold text-xs uppercase font-mono tracking-wider text-[#232323]">
            <span>Product Size</span>
            <ChevronDownIcon size={14} className="text-[#7D6F63]" />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {sizes.map((sz) => {
              const isSelected = (filters.sizes || []).includes(sz.id);
              return (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => toggleSize(sz.id)}
                  className={`text-[10px] font-mono px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF7F2] text-[#8B6F4E] border-[#EADDCB] font-semibold'
                      : 'bg-white text-[#5C5149] border-[#EADDCB] hover:text-[#232323]'
                  }`}
                >
                  {sz.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Price Range Inputs */}
      <div className="space-y-3 border-b border-[#EADDCB] pb-4">
        <div className="flex items-center justify-between font-bold text-xs uppercase font-mono tracking-wider text-[#232323]">
          <span>Price Range</span>
          <span className="text-[11px] text-[#8B6F4E] font-mono">
            ₹{filters.priceMin} - ₹{filters.priceMax}
          </span>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-mono text-[#7D6F63] uppercase">Min</span>
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => onFilterChange({ ...filters, priceMin: Number(e.target.value) || 0 })}
              className="w-full bg-[#FFFFFF] border border-[#EADDCB] rounded-xl p-2 text-xs text-[#232323] outline-none focus:border-[#8B6F4E]"
            />
          </div>
          <span className="text-[#7D6F63] mt-4">-</span>
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-mono text-[#7D6F63] uppercase">Max</span>
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => onFilterChange({ ...filters, priceMax: Number(e.target.value) || 5000 })}
              className="w-full bg-[#FFFFFF] border border-[#EADDCB] rounded-xl p-2 text-xs text-[#232323] outline-none focus:border-[#8B6F4E]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
