import { useState, useMemo, useEffect } from 'react';
import { ShopHeader } from './ShopHeader';
import { FilterSidebar } from './FilterSidebar';
import type { ShopFiltersState } from './FilterSidebar';
import { ShopToolbar } from './ShopToolbar';
import { ProductGrid } from './ProductGrid';
import { ProductListItem } from './ProductListItem';
import type { ShopProduct } from './ProductListItem';
import { QuickViewModal } from './QuickViewModal';
import { ShopPagination } from './ShopPagination';

import { Drawer, EmptyState, useToast } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

const initialFilters: ShopFiltersState = {
  categories: [],
  collections: [],
  fragrances: [],
  sizes: [],
  colors: [],
  scentProfiles: [],
  priceMin: 0,
  priceMax: 10000,
  minRating: 0,
  inStockOnly: false,
};

export interface ShopPageProps {
  onSelectProduct?: (product: any) => void;
  initialCategory?: string;
  onClearCategory?: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onSelectProduct,
  initialCategory,
  onClearCategory,
}) => {
  const { products: cmsProducts, settings } = useCMS();

  const getInitialCategories = (): string[] => {
    if (initialCategory) return [initialCategory.trim()];
    const hash = window.location.hash || '';
    if (hash.includes('?')) {
      const params = new URLSearchParams(hash.split('?')[1]);
      const cat = params.get('category') || params.get('cat');
      if (cat) return [decodeURIComponent(cat).trim()];
    }
    return [];
  };

  const getInitialCollections = (): string[] => {
    const hash = window.location.hash || '';
    if (hash.includes('?')) {
      const params = new URLSearchParams(hash.split('?')[1]);
      const col = params.get('collection') || params.get('col');
      if (col) return [decodeURIComponent(col).trim()];
    }
    return [];
  };

  const [filters, setFilters] = useState<ShopFiltersState>(() => ({
    ...initialFilters,
    categories: getInitialCategories(),
    collections: getInitialCollections(),
  }));

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { toast } = useToast();

  // Sync state if initialCategory prop changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: initialCategory ? [initialCategory.trim()] : getInitialCategories(),
    }));
    setCurrentPage(1);
  }, [initialCategory]);

  // Sync state if window hash changes (e.g. back/forward or hash navigation)
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#shop')) {
        const query = hash.split('?')[1] || '';
        const params = new URLSearchParams(query);
        const cat = params.get('category') || params.get('cat');
        const col = params.get('collection') || params.get('col');
        setFilters((prev) => ({
          ...prev,
          categories: cat ? [decodeURIComponent(cat).trim()] : [],
          collections: col ? [decodeURIComponent(col).trim()] : [],
        }));
        setCurrentPage(1);
      }
    };
    window.addEventListener('hashchange', handleHashSync);
    window.addEventListener('popstate', handleHashSync);
    return () => {
      window.removeEventListener('hashchange', handleHashSync);
      window.removeEventListener('popstate', handleHashSync);
    };
  }, []);

  const toggleWishlist = (id: string, name: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((w) => w !== id));
      toast({ type: 'info', title: 'Removed from Wishlist' });
    } else {
      setWishlist([...wishlist, id]);
      toast({ type: 'luxury', title: 'Saved to Wishlist', description: name });
    }
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    if (onClearCategory) onClearCategory();
    if (window.location.hash.includes('?')) {
      window.history.replaceState({ page: 'shop' }, '', '#shop');
    }
  };

  // 100% Dynamic products source directly from live CMS / Supabase
  const activeProducts = cmsProducts;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((prod: any) => {
      if (filters.inStockOnly && !prod.inStock) return false;

      // Strict Category Matching (case-insensitive, trimmed, alphanumeric, ID and name)
      if (filters.categories.length > 0) {
        const pCatNorm = (prod.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const pMainCatId = String(prod.mainCategoryId || '').toLowerCase().trim();
        const matchesCategory = filters.categories.some((c) => {
          const filterNorm = (c || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const filterRaw = (c || '').toLowerCase().trim();
          if (!filterNorm && !filterRaw) return false;
          return (
            (pCatNorm && filterNorm && pCatNorm === filterNorm) ||
            (pMainCatId && (pMainCatId === filterRaw || pMainCatId === filterNorm))
          );
        });
        if (!matchesCategory) return false;
      }

      // Collections Match
      if (filters.collections.length > 0) {
        const pCol = (prod.collection || '').toLowerCase().trim();
        const matchesCollection = filters.collections.some((c) => {
          const filterNorm = c.toLowerCase().trim();
          return (
            pCol === filterNorm ||
            pCol.includes(filterNorm) ||
            filterNorm.includes(pCol) ||
            prod.collectionIds?.some((cid: string) => cid.toLowerCase() === filterNorm)
          );
        });
        if (!matchesCollection) return false;
      }

      if (filters.fragrances.length > 0 && !filters.fragrances.some((f: string) => prod.availableFragranceIds?.includes(f) || prod.variants?.some((v: any) => v.fragranceId === f))) return false;
      if (filters.sizes.length > 0 && !filters.sizes.some((s: string) => prod.availableSizeIds?.includes(s) || prod.variants?.some((v: any) => v.sizeId === s))) return false;
      if (filters.scentProfiles.length > 0 && !filters.scentProfiles.includes(prod.scentProfile)) return false;
      if (filters.priceMin > 0 && Number(prod.price) < filters.priceMin) return false;
      if (filters.priceMax < 10000 && Number(prod.price) > filters.priceMax) return false;
      return true;
    }).sort((a: any, b: any) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [activeProducts, filters, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const activeCategoryTitle = filters.categories.length > 0
    ? filters.categories.join(', ')
    : filters.collections.length > 0
      ? `Collection: ${filters.collections.join(', ')}`
      : 'Shop All Luxury Artisanal Fragrances';

  return (
    <div className="w-full bg-[#F8F6F0] min-h-screen">
      {/* 1. Shop Hero Header */}
      <ShopHeader
        totalProducts={filteredProducts.length}
        categoryName={activeCategoryTitle}
        freeShippingThreshold={settings?.freeShippingThreshold || 999}
      />

      {/* 2. Main Content Viewport */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
        <div className="flex gap-10">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Right Product Grid Column */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Toolbar: Category Pills & Sort By */}
            <ShopToolbar
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
              onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              totalResults={filteredProducts.length}
            />

            {/* Active Category / Filter Badge Indicator */}
            {(filters.categories.length > 0 || filters.collections.length > 0) && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-[#EADDCB] rounded-2xl shadow-xs">
                <span className="text-xs font-bold text-[#8B6F4E] uppercase tracking-wider flex items-center gap-1.5">
                  <span>Filtered:</span>
                </span>
                {filters.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 bg-[#8B6F4E] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs"
                  >
                    <span>Category: {cat}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          categories: prev.categories.filter((c) => c !== cat),
                        }));
                        if (onClearCategory) onClearCategory();
                        if (window.location.hash.includes('category=')) {
                          window.history.replaceState({ page: 'shop' }, '', '#shop');
                        }
                      }}
                      className="hover:text-amber-200 cursor-pointer font-bold ml-1 text-sm leading-none"
                      title="Clear category filter"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.collections.map((col) => (
                  <span
                    key={col}
                    className="inline-flex items-center gap-1.5 bg-[#5C5149] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs"
                  >
                    <span>Collection: {col}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          collections: prev.collections.filter((c) => c !== col),
                        }));
                      }}
                      className="hover:text-amber-200 cursor-pointer font-bold ml-1 text-sm leading-none"
                      title="Clear collection filter"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#8B6F4E] hover:underline ml-auto font-semibold cursor-pointer"
                >
                  Clear All Filters ({activeProducts.length} items)
                </button>
              </div>
            )}

            {/* Empty State vs Products */}
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No Formulations Match Filters"
                description="Try loosening your filters or resetting them to explore all our artisan soy candles."
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : viewMode === 'grid' ? (
              <ProductGrid
                products={paginatedProducts}
                onQuickView={(p) => setQuickViewProduct(p)}
                onSelectProduct={onSelectProduct}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
              />
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map((prod) => (
                  <ProductListItem
                    key={prod.id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onSelectProduct={onSelectProduct}
                    isWishlisted={wishlist.includes(prod.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <ShopPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        position="left"
        size="md"
        title="Filter Formulations"
      >
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          isMobile
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />
      </Drawer>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={toggleWishlist}
      />
    </div>
  );
};
