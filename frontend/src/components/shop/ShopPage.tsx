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

const allProductsMock: ShopProduct[] = [
  {
    id: 'sp-1',
    name: 'Velvet Rose & Smoked Amber',
    category: 'Glass Jars',
    collection: 'Royal Gold',
    scentProfile: 'Floral Elegance',
    price: 78.0,
    originalPrice: 90.0,
    rating: 4.9,
    reviewsCount: 142,
    topNotes: 'Calabrian Bergamot, Pink Pepper',
    heartNotes: 'Damask Rose, Clove Bud',
    baseNotes: 'Smoked Amber, Oud Wood',
    burnTime: '65 Hours',
    inStock: true,
    isBestSeller: true,
    vesselDescription: 'Hand-poured in heavy Italian frosted glass with 24K gold foil branding.',
  },
  {
    id: 'sp-2',
    name: 'French Bourbon Vanilla Bean',
    category: 'Glass Jars',
    collection: 'Royal Gold',
    scentProfile: 'Warm Vanilla',
    price: 94.0,
    originalPrice: 110.0,
    rating: 4.95,
    reviewsCount: 98,
    topNotes: 'Crushed Tonka, Sweet Almond',
    heartNotes: 'Bourbon Vanilla Pod',
    baseNotes: 'White Amber, Brown Sugar',
    burnTime: '80 Hours',
    inStock: true,
    isBestSeller: true,
    vesselDescription: 'Luxury 3-wick champagne gold vessel engineered for rich room diffusion.',
  },
  {
    id: 'sp-3',
    name: 'Mysore Sandalwood & Cedar',
    category: 'Travel Tins',
    collection: 'Signature',
    scentProfile: 'Woody & Spiced',
    price: 42.0,
    originalPrice: 50.0,
    rating: 4.85,
    reviewsCount: 76,
    topNotes: 'Golden Cedar, Cypress',
    heartNotes: 'Mysore Sandalwood',
    baseNotes: 'Smoked Vetiver, Oakmoss',
    burnTime: '45 Hours',
    inStock: true,
    isNew: true,
    vesselDescription: 'Seamless brass travel tin with airtight botanical lid.',
  },
  {
    id: 'sp-4',
    name: 'Bergamot & White Jasmine Bloom',
    category: 'Glass Jars',
    collection: 'Signature',
    scentProfile: 'Fresh Citrus',
    price: 68.0,
    rating: 4.88,
    reviewsCount: 114,
    topNotes: 'Italian Citrus, Bergamot',
    heartNotes: 'White Jasmine, Neroli',
    baseNotes: 'Cashmere Wood, Musk',
    burnTime: '60 Hours',
    inStock: true,
    vesselDescription: 'Translucent ivory glass vessel with natural wood lid.',
  },
  {
    id: 'sp-5',
    name: 'Smoked Leather & Tobacco Oud',
    category: 'Glass Jars',
    collection: 'Autumn Woodfire',
    scentProfile: 'Woody & Spiced',
    price: 86.0,
    rating: 4.98,
    reviewsCount: 312,
    topNotes: 'Cardamom, Cinnamon Bark',
    heartNotes: 'Smoked Tobacco Leaf',
    baseNotes: 'Rich Leather, Oud Wood',
    burnTime: '65 Hours',
    inStock: true,
    isBestSeller: true,
    vesselDescription: 'Obsidian matte black jar formulated for deep evening relaxation.',
  },
  {
    id: 'sp-6',
    name: 'Wild Lavender & Bergamot Bloom',
    category: 'Pillars',
    collection: 'Aromatherapy Series',
    scentProfile: 'Fresh Citrus',
    price: 72.0,
    rating: 4.89,
    reviewsCount: 168,
    topNotes: 'Bergamot, Eucalyptus',
    heartNotes: 'French Lavender',
    baseNotes: 'White Sage, Cedar',
    burnTime: '70 Hours',
    inStock: true,
    vesselDescription: 'Pure beeswax aromatherapy pillar candle.',
  },
  {
    id: 'sp-7',
    name: 'Midnight Fig & Honeyed Amber',
    category: 'Glass Jars',
    collection: 'Signature',
    scentProfile: 'Warm Vanilla',
    price: 74.0,
    rating: 5.0,
    reviewsCount: 24,
    topNotes: 'Wild Fig, Plum Bloom',
    heartNotes: 'Honeyed Amber',
    baseNotes: 'Dark Cedar, Vanilla',
    burnTime: '60 Hours',
    inStock: true,
    isNew: true,
    vesselDescription: 'Obsidian matte jar with crackling wood wick.',
  },
  {
    id: 'sp-8',
    name: 'Santorini Cypress & Salted Sage',
    category: 'Travel Tins',
    collection: 'Signature',
    scentProfile: 'Fresh Citrus',
    price: 44.0,
    rating: 4.92,
    reviewsCount: 18,
    topNotes: 'Coastal Cypress, Sea Salt',
    heartNotes: 'Sage Leaf, Juniper',
    baseNotes: 'Driftwood, White Musk',
    burnTime: '45 Hours',
    inStock: true,
    vesselDescription: 'Coastal seafoam brass tin formulation.',
  },
];

const initialFilters: ShopFiltersState = {
  categories: [],
  collections: [],
  scentProfiles: [],
  priceMin: 20,
  priceMax: 150,
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
  const [wishlist, setWishlist] = useState<string[]>(['sp-1']);
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

  // Dynamic products source directly from CMSContext / Admin Panel
  const activeProducts = useMemo(() => {
    return cmsProducts.length > 0 ? cmsProducts : (allProductsMock as any);
  }, [cmsProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((prod: any) => {
      if (filters.inStockOnly && !prod.inStock) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(prod.category)) return false;
      if (filters.collections.length > 0 && !filters.collections.includes(prod.collection)) return false;
      if (filters.scentProfiles.length > 0 && !filters.scentProfiles.includes(prod.scentProfile)) return false;
      return true;
    }).sort((a: any, b: any) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
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
    <div className="w-full bg-[#FAF6F0] min-h-screen">
      {/* 1. Shop Hero Header */}
      <ShopHeader totalProducts={allProductsMock.length} />

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

          {/* Main Product Column */}
          <div className="flex-1 space-y-6">
            {/* Toolbar */}
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

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No Candles Found"
                description="No luxury fragrances match your selected filter criteria. Try adjusting your price range or scent family."
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : viewMode === 'grid' ? (
              <ProductGrid
                products={paginatedProducts}
                onQuickView={setQuickViewProduct}
                onSelectProduct={onSelectProduct}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
              />
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map((prod: any) => (
                  <ProductListItem
                    key={prod.id}
                    product={prod}
                    onQuickView={setQuickViewProduct}
                    onSelectProduct={onSelectProduct}
                    isWishlisted={wishlist.includes(prod.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
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

      {/* Mobile Filter Drawer */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        position="left"
        size="md"
        title="Refine Selection"
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
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={toggleWishlist}
      />
    </div>
  );
};
