import React, { useState, useMemo } from 'react';
import { useCMS, type CMSProduct } from '../../context/CMSContext';
import { ProductCard } from '../product/ProductCard';

interface CategoriesPageProps {
  onProductClick?: (product: CMSProduct) => void;
  onSelectProduct?: (product: CMSProduct) => void;
  onNavigateToShop?: () => void;
  initialCategorySlug?: string;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onProductClick,
  onSelectProduct,
  onNavigateToShop: _onNavigateToShop,
  initialCategorySlug,
}) => {
  const { mainCategories, subCategories, fragrances, sizes, products } = useCMS();

  const handleProductSelect = (p: CMSProduct) => {
    if (onSelectProduct) onSelectProduct(p);
    else if (onProductClick) onProductClick(p);
  };

  // Active Main Category
  const [selectedCatId, setSelectedCatId] = useState<string>(() => {
    if (initialCategorySlug) {
      const match = mainCategories.find((c) => c.slug === initialCategorySlug || c.name === initialCategorySlug);
      if (match) return match.id;
    }
    return mainCategories[0]?.id || '';
  });

  // Active Subcategory
  const [selectedSubId, setSelectedSubId] = useState<string>('');

  // Facet Filters
  const [selectedFragrance, setSelectedFragrance] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  const currentCategory = useMemo(
    () => mainCategories.find((c) => c.id === selectedCatId) || mainCategories[0],
    [mainCategories, selectedCatId]
  );

  const availableSubs = useMemo(
    () => subCategories.filter((s) => s.mainCategoryId === currentCategory?.id),
    [subCategories, currentCategory]
  );

  // Filter Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Main Category Match
      const matchesCat = currentCategory
        ? p.mainCategoryId === currentCategory.id || p.category === currentCategory.name
        : true;

      // Subcategory Match
      const matchesSub = selectedSubId
        ? p.subCategoryId === selectedSubId || p.subCategory === availableSubs.find((s) => s.id === selectedSubId)?.name
        : true;

      // Fragrance Match
      const matchesFrag = selectedFragrance
        ? p.scentProfile?.toLowerCase().includes(selectedFragrance.toLowerCase()) ||
          p.availableFragranceIds?.includes(selectedFragrance) ||
          p.variants?.some((v) => v.fragranceId === selectedFragrance || v.fragranceName?.toLowerCase().includes(selectedFragrance.toLowerCase()))
        : true;

      // Size Match
      const matchesSize = selectedSize
        ? p.availableSizeIds?.includes(selectedSize) ||
          p.variants?.some((v) => v.sizeId === selectedSize || v.sizeName?.includes(selectedSize))
        : true;

      // Price Match
      const matchesPrice = p.price <= priceMax;

      // In Stock Match
      const matchesStock = inStockOnly ? p.inStock : true;

      return matchesCat && matchesSub && matchesFrag && matchesSize && matchesPrice && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    products,
    currentCategory,
    selectedSubId,
    availableSubs,
    selectedFragrance,
    selectedSize,
    priceMax,
    inStockOnly,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#232323] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Category Hero Banner */}
        {currentCategory && (
          <div className="relative rounded-3xl overflow-hidden border border-[#EADDCB] bg-white p-8 lg:p-12 shadow-card">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#EADDCB]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#8B6F4E] font-bold">
                Atelier Catalog
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#232323]">
                {currentCategory.name}
              </h1>
              <p className="text-sm text-[#5C5149] leading-relaxed font-light">
                {currentCategory.description || 'Explore our hand-poured olfactory creations formulated for serene spaces.'}
              </p>
            </div>
            {currentCategory.imageUrl && (
              <img
                src={currentCategory.imageUrl}
                alt={currentCategory.name}
                className="absolute right-0 top-0 w-full md:w-1/2 h-full object-cover opacity-15 md:opacity-25"
              />
            )}
          </div>
        )}

        {/* Main Categories Tab Bar (Horizontal Scrollable) */}
        <div className="w-full max-w-full min-w-0 flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 pt-1 border-b border-[#EADDCB] no-scrollbar touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {mainCategories.map((c) => {
            const isSelected = c.id === currentCategory?.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCatId(c.id);
                  setSelectedSubId('');
                }}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B6F4E] text-white font-semibold shadow-xs'
                    : 'bg-white border border-[#EADDCB] text-[#5C5149] hover:border-[#EADDCB]'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Subcategories Tabs (if available) */}
        {availableSubs.length > 0 && (
          <div className="w-full max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EADDCB] no-scrollbar touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => setSelectedSubId('')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedSubId === ''
                  ? 'bg-[#FAF7F2] text-[#8B6F4E] border border-[#EADDCB]'
                  : 'text-[#7D6F63] hover:text-[#232323]'
              }`}
            >
              All Formulations
            </button>
            {availableSubs.map((sub) => {
              const isSelected = sub.id === selectedSubId;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubId(sub.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF7F2] text-[#8B6F4E] border border-[#EADDCB]'
                      : 'text-[#7D6F63] hover:text-[#232323]'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Catalog Grid Layout with Facet Filters Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Facet Filters Sidebar */}
          <div className="bg-white p-6 rounded-3xl border border-[#EADDCB] space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EADDCB] pb-3">
              <h3 className="font-serif text-sm font-bold text-[#232323]">Filters</h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedFragrance('');
                  setSelectedSize('');
                  setPriceMax(5000);
                  setInStockOnly(false);
                }}
                className="text-[10px] font-mono text-[#8B6F4E] hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Fragrance Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-[#7D6F63]">Fragrance</label>
              <select
                value={selectedFragrance}
                onChange={(e) => setSelectedFragrance(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-xl p-2.5 text-xs text-[#232323] outline-none"
              >
                <option value="">All Fragrances</option>
                {fragrances.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-[#7D6F63]">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-xl p-2.5 text-xs text-[#232323] outline-none"
              >
                <option value="">All Sizes</option>
                {sizes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-mono uppercase text-[#7D6F63]">Max Price</span>
                <span className="font-mono text-[#8B6F4E] font-bold">₹{priceMax}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={priceMax}
                onChange={(e) => setPriceMax(parseInt(e.target.value))}
                className="w-full accent-[#8B6F4E] bg-[#FAF7F2] rounded-full"
              />
            </div>

            {/* In Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#232323]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-[#8B6F4E]"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Product Grid & Sorting */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EADDCB] shadow-xs">
              <span className="text-xs font-mono text-[#7D6F63]">
                Showing {filteredProducts.length} Creations
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7D6F63]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#EADDCB] rounded-xl px-3 py-1.5 text-xs text-[#232323] outline-none"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onProductClick={handleProductSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#EADDCB] space-y-2 shadow-xs">
                <p className="text-2xl">🕯️</p>
                <p className="font-serif text-base text-[#232323]">No creations match your filter criteria.</p>
                <p className="text-xs text-[#7D6F63]">Try adjusting your filters or search keywords.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
