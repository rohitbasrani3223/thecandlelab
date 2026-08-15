import React, { useState, useMemo } from 'react';
import { useCMS, type CMSProduct } from '../../context/CMSContext';
import { ProductCard } from '../product/ProductCard';

interface CollectionsPageProps {
  onProductClick?: (product: CMSProduct) => void;
  onSelectProduct?: (product: CMSProduct) => void;
  onNavigateToShop?: () => void;
  initialCollectionSlug?: string;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  onProductClick,
  onSelectProduct,
  onNavigateToShop: _onNavigateToShop,
  initialCollectionSlug,
}) => {
  const { collections, products } = useCMS();

  const handleProductSelect = (p: CMSProduct) => {
    if (onSelectProduct) onSelectProduct(p);
    else if (onProductClick) onProductClick(p);
  };

  // Active Collection
  const [selectedColId, setSelectedColId] = useState<string>(() => {
    if (initialCollectionSlug) {
      const match = collections.find((c) => c.slug === initialCollectionSlug || c.name === initialCollectionSlug);
      if (match) return match.id;
    }
    return collections[0]?.id || '';
  });

  const [sortBy, setSortBy] = useState<string>('featured');

  const currentCollection = useMemo(
    () => collections.find((c) => c.id === selectedColId) || collections[0],
    [collections, selectedColId]
  );

  // Products belonging to current collection
  const collectionProducts = useMemo(() => {
    if (!currentCollection) return [];
    return products
      .filter((p) => {
        const inColIds = p.collectionIds?.includes(currentCollection.id);
        const inColName = p.collection === currentCollection.name;
        const inColArray = p.collections?.includes(currentCollection.name);
        const inColManualList = currentCollection.productIds?.includes(p.id);
        return inColIds || inColName || inColArray || inColManualList;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, currentCollection, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF6F8] text-[#1C1217] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Collections Tab Bar */}
        <div className="w-full max-w-full min-w-0 flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {collections.map((col) => {
            const isSelected = col.id === currentCollection?.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setSelectedColId(col.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E87A96] border-[#E87A96] text-white font-semibold shadow-xs scale-105'
                    : 'bg-white border-[#F5E8EE] text-[#624855] hover:border-[#F9B8CA]'
                }`}
              >
                <span className="text-base">{col.icon || '✨'}</span>
                <span>{col.name}</span>
              </button>
            );
          })}
        </div>

        {/* Collection Hero */}
        {currentCollection && (
          <div className="relative rounded-3xl overflow-hidden border border-[#F5E8EE] bg-white p-8 lg:p-14 shadow-card">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F9B8CA]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-[#FFF6F8] text-[#E87A96] border border-[#F9B8CA] font-bold">
                  {currentCollection.badge || 'CURATED COLLECTION'}
                </span>
                <span className="text-xs font-mono text-[#886C7B]">
                  {collectionProducts.length} Items
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1217]">
                {currentCollection.name}
              </h1>

              <p className="text-sm text-[#624855] leading-relaxed font-light">
                {currentCollection.description || currentCollection.desc || 'Explore our bespoke thematic collection.'}
              </p>
            </div>

            {currentCollection.bannerImage && (
              <img
                src={currentCollection.bannerImage}
                alt={currentCollection.name}
                className="absolute right-0 top-0 w-full md:w-3/5 h-full object-cover opacity-15 md:opacity-25"
              />
            )}
          </div>
        )}

        {/* Collection Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F5E8EE] shadow-xs">
            <span className="text-xs font-mono text-[#886C7B]">
              Curated Selection ({collectionProducts.length} Products)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#886C7B]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FFF6F8] border border-[#F5E8EE] rounded-xl px-3 py-1.5 text-xs text-[#1C1217] outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {collectionProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collectionProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onProductClick={handleProductSelect}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#F5E8EE] space-y-2 shadow-xs">
              <p className="text-2xl">✨</p>
              <p className="font-serif text-base text-[#1C1217]">No products assigned to this collection yet.</p>
              <p className="text-xs text-[#886C7B]">Assign products from the Admin Collections Manager.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
