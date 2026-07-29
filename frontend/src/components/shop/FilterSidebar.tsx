import React from 'react';
import { Checkbox, Radio, Switch, Button, ChevronDownIcon, CloseIcon } from '../../design-system';

export interface ShopFiltersState {
  categories: string[];
  collections: string[];
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

  const toggleScentProfile = (scent: string) => {
    const updated = filters.scentProfiles.includes(scent)
      ? filters.scentProfiles.filter((s) => s !== scent)
      : [...filters.scentProfiles, scent];
    onFilterChange({ ...filters, scentProfiles: updated });
  };

  return (
    <div className={`space-y-6 font-sans ${isMobile ? 'p-6' : 'w-64 shrink-0'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-3">
        <h3 className="text-sm uppercase font-bold tracking-widest text-[#2A1E17]">
          Refine Selection
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
          >
            Reset
          </button>
          {isMobile && onCloseMobile && (
            <button onClick={onCloseMobile} className="text-[#8C7A6B] hover:text-[#2A1E17] p-1">
              <CloseIcon size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 1. In Stock Toggle */}
      <div className="bg-[#F4EFE6] p-3.5 rounded-md border border-[#E5D9C5]">
        <Switch
          label="In Stock Only"
          description="Exclude sold-out batch items"
          checked={filters.inStockOnly}
          onChange={(checked) => onFilterChange({ ...filters, inStockOnly: checked })}
        />
      </div>

      {/* 2. Vessel Categories */}
      <div className="space-y-3 border-b border-[#E5D9C5] pb-4">
        <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#2A1E17]">
          <span>Vessel Type</span>
          <ChevronDownIcon size={14} className="text-[#8C7A6B]" />
        </div>
        <div className="space-y-2 pt-1">
          {[
            { id: 'Glass Jars', label: 'Luxury Glass Jars (12)' },
            { id: 'Travel Tins', label: 'Botanical Travel Tins (8)' },
            { id: 'Pillars', label: 'Aromatherapy Pillars (15)' },
            { id: 'Reed Diffusers', label: 'Reed Diffusers & Oils (6)' },
            { id: 'Gift Sets', label: 'Bespoke Gift Boxes (10)' },
          ].map((item) => (
            <div key={item.id}>
              <Checkbox
                label={item.label}
                checked={filters.categories.includes(item.id)}
                onChange={() => toggleCategory(item.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Curated Collections */}
      <div className="space-y-3 border-b border-[#E5D9C5] pb-4">
        <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#2A1E17]">
          <span>Collections</span>
          <ChevronDownIcon size={14} className="text-[#8C7A6B]" />
        </div>
        <div className="space-y-2 pt-1">
          {[
            { id: 'Scented Candles', label: '🕯️ Scented Candles' },
            { id: 'Floral Collection', label: '🌸 Floral Collection' },
            { id: 'Vanilla Collection', label: '🍦 Vanilla Collection' },
            { id: 'Coffee Collection', label: '☕ Coffee Collection' },
            { id: 'Festive Collection', label: '🌲 Festive Collection' },
            { id: 'Gift Boxes', label: '🎁 Gift Boxes' },
            { id: 'Luxury Glass Jars', label: '🕯️ Luxury Glass Jars' },
            { id: 'Wax Melts', label: '⚡ Wax Melts' },
          ].map((item) => (
            <div key={item.id}>
              <Checkbox
                label={item.label}
                checked={filters.collections.includes(item.id)}
                onChange={() => toggleCollection(item.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Scent Profile */}
      <div className="space-y-3 border-b border-[#E5D9C5] pb-4">
        <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#2A1E17]">
          <span>Scent Family</span>
          <ChevronDownIcon size={14} className="text-[#8C7A6B]" />
        </div>
        <div className="space-y-2 pt-1">
          {[
            { id: 'Woody & Spiced', label: 'Woody & Spiced Oud' },
            { id: 'Fresh Citrus', label: 'Fresh Citrus & Sage' },
            { id: 'Floral Elegance', label: 'Floral Rose & Jasmine' },
            { id: 'Warm Vanilla', label: 'Warm Vanilla & Amber' },
          ].map((item) => (
            <div key={item.id}>
              <Checkbox
                label={item.label}
                checked={filters.scentProfiles.includes(item.id)}
                onChange={() => toggleScentProfile(item.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Price Range Inputs */}
      <div className="space-y-3 border-b border-[#E5D9C5] pb-4">
        <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#2A1E17]">
          <span>Price Range</span>
          <span className="text-[11px] text-[#D4AF37] font-semibold">${filters.priceMin} - ${filters.priceMax}</span>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 space-y-1">
            <span className="text-[10px] text-[#8C7A6B] uppercase">Min ($)</span>
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => onFilterChange({ ...filters, priceMin: Number(e.target.value) })}
              className="w-full bg-[#FAF6F0] border border-[#E5D9C5] rounded-xs p-2 text-xs text-[#2A1E17] outline-none"
            />
          </div>
          <span className="text-[#8C7A6B] mt-4">-</span>
          <div className="flex-1 space-y-1">
            <span className="text-[10px] text-[#8C7A6B] uppercase">Max ($)</span>
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => onFilterChange({ ...filters, priceMax: Number(e.target.value) })}
              className="w-full bg-[#FAF6F0] border border-[#E5D9C5] rounded-xs p-2 text-xs text-[#2A1E17] outline-none"
            />
          </div>
        </div>
      </div>

      {/* 6. Rating Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#2A1E17]">
          <span>Customer Rating</span>
        </div>
        <div className="space-y-2 pt-1">
          <Radio
            label="All Ratings"
            name="rating"
            checked={filters.minRating === 0}
            onChange={() => onFilterChange({ ...filters, minRating: 0 })}
          />
          <Radio
            label="4.5★ & Above"
            name="rating"
            checked={filters.minRating === 4.5}
            onChange={() => onFilterChange({ ...filters, minRating: 4.5 })}
          />
          <Radio
            label="4.0★ & Above"
            name="rating"
            checked={filters.minRating === 4.0}
            onChange={() => onFilterChange({ ...filters, minRating: 4.0 })}
          />
        </div>
      </div>

      {/* Reset Button */}
      <Button variant="outline" size="sm" fullWidth onClick={onResetFilters}>
        Clear All Filters
      </Button>
    </div>
  );
};
