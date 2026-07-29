import React from 'react';
import type { ShopFiltersState } from './FilterSidebar';

export interface ShopToolbarProps {
  filters: ShopFiltersState;
  onFilterChange: (filters: ShopFiltersState) => void;
  onResetFilters: () => void;
  onOpenMobileFilters: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  totalResults: number;
}

const CATEGORY_PILLS = [
  { id: 'all', label: 'All Products' },
  { id: 'Scented Candles', label: 'Scented Candles' },
  { id: 'Luxury Jars', label: 'Luxury Jars' },
  { id: 'Wax Melts', label: 'Wax Melts' },
  { id: 'Gift Hampers', label: 'Gift Hampers' },
];

export const ShopToolbar: React.FC<ShopToolbarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  sortBy,
  onSortByChange,
}) => {
  const selectedCategory = filters.categories[0] || 'all';

  const handleCategorySelect = (catId: string) => {
    if (catId === 'all') {
      onResetFilters();
    } else {
      onFilterChange({
        ...filters,
        categories: [catId],
      });
    }
  };

  return (
    <div className="bg-white border border-[#EFE8DB] rounded-2xl p-4 shadow-subtle flex flex-col lg:flex-row items-center justify-between gap-4 font-sans max-w-7xl mx-auto mb-8">
      {/* Left: Category Pill Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto no-scrollbar py-1">
        <span className="text-xs font-bold text-[#2C1E16] flex items-center gap-1 shrink-0 mr-1">
          <svg className="w-4 h-4 text-[#B88B38]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Category:
        </span>

        {CATEGORY_PILLS.map((pill) => {
          const isSelected = (selectedCategory === 'all' && pill.id === 'all') || selectedCategory === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => handleCategorySelect(pill.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-[#B88B38] text-white'
                  : 'bg-[#F3EDE2] text-[#4A3B32] hover:bg-[#EFE8DB]'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Right: Sort By Dropdown */}
      <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto text-xs">
        <span className="font-bold text-[#2C1E16] flex items-center gap-1">
          <svg className="w-4 h-4 text-[#B88B38]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          Sort:
        </span>

        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="bg-[#F8F3EA] border border-[#EFE8DB] text-[#2C1E16] font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#B88B38] cursor-pointer"
        >
          <option value="featured">Featured Items</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest Releases</option>
        </select>
      </div>
    </div>
  );
};
