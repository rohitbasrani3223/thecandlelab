import { useState, useMemo } from 'react';
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
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  const { products: cmsProducts } = useCMS();
  const [filters, setFilters] = useState<ShopFiltersState>(initialFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleWishlist = (id: string, name: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((w) => w !== id));
      toast({ type: 'info', title: 'Removed from Wishlist' });
    } else {
      setWishlist([...wishlist, id]);
      toast({ type: 'luxury', title: 'Saved to Wishlist', description: name });
    }
  };

  const handleResetFilters = () => setFilters(initialFilters);

  // 100% Dynamic products source directly from live CMS / Supabase
  const activeProducts = cmsProducts;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((prod: any) => {
      if (filters.inStockOnly && !prod.inStock) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(prod.category) && !filters.categories.includes(prod.mainCategoryId)) return false;
      if (filters.collections.length > 0 && !filters.collections.includes(prod.collection) && !prod.collectionIds?.some((c: string) => filters.collections.includes(c))) return false;
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

  return (
    <div className="w-full bg-[#FAF6F8] min-h-screen">
      {/* 1. Shop Hero Header */}
      <ShopHeader totalProducts={activeProducts.length} />

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
