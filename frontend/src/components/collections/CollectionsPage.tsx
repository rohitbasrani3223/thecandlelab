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
    <div className="min-h-screen bg-[#140D09] text-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Collections Tab Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {collections.map((col) => {
            const isSelected = col.id === currentCollection?.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setSelectedColId(col.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-600 border-amber-500 text-stone-950 font-semibold shadow-lg scale-105'
                    : 'bg-[#1C130E] border-[#2C2018] text-stone-300 hover:border-stone-600'
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
          <div className="relative rounded-3xl overflow-hidden border border-[#2C2018] bg-[#1C130E] p-8 lg:p-14">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentCollection.badge || 'CURATED COLLECTION'}
                </span>
                <span className="text-xs font-mono text-stone-400">
                  {collectionProducts.length} Items
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#FDFBF7]">
                {currentCollection.name}
              </h1>

              <p className="text-sm text-stone-300 leading-relaxed font-light">
                {currentCollection.description || currentCollection.desc || 'Explore our bespoke thematic collection.'}
              </p>
            </div>

            {currentCollection.bannerImage && (
              <img
                src={currentCollection.bannerImage}
                alt={currentCollection.name}
                className="absolute right-0 top-0 w-full md:w-3/5 h-full object-cover opacity-20 md:opacity-40"
              />
            )}
          </div>
        )}

        {/* Collection Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 bg-[#1C130E] p-4 rounded-xl border border-[#2C2018]">
            <span className="text-xs font-mono text-stone-400">
              Curated Selection ({collectionProducts.length} Products)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-1.5 text-xs text-[#FDFBF7]"
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
            <div className="p-12 text-center bg-[#1C130E] rounded-2xl border border-[#2C2018] space-y-2">
              <p className="text-2xl">✨</p>
              <p className="font-serif text-base text-[#FDFBF7]">No products assigned to this collection yet.</p>
              <p className="text-xs text-stone-400">Assign products from the Admin Collections Manager.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
