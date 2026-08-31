import React, { useState, useMemo, useEffect } from 'react';
import { useCMS, type CMSProduct } from '../../context/CMSContext';
import { ProductCard } from '../product/ProductCard';
import { Badge, SparklesIcon } from '../../design-system';

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
  const { collections, mainCategories, products } = useCMS();

  const handleProductSelect = (p: CMSProduct) => {
    if (onSelectProduct) onSelectProduct(p);
    else if (onProductClick) onProductClick(p);
  };

  // Helper to extract id or category from window.location.hash
  const getInitialSelectedId = () => {
    const hash = window.location.hash || '';
    if (hash.includes('?')) {
      const query = hash.split('?')[1] || '';
      const params = new URLSearchParams(query);
      const id = params.get('id') || params.get('cat') || params.get('collection');
      if (id) return decodeURIComponent(id);
    }
    if (initialCollectionSlug) return initialCollectionSlug;
    return 'all';
  };

  const [selectedId, setSelectedId] = useState<string>(getInitialSelectedId);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Listen for hash changes while on the page
  useEffect(() => {
    const handleHashChange = () => {
      setSelectedId(getInitialSelectedId());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Build unified list of Curations (Collections + Main Categories)
  const unifiedCurations = useMemo(() => {
    const list: any[] = [
      {
        id: 'all',
        type: 'all',
        name: 'All Formulations',
        badge: 'COMPLETE SANCTUARY',
        icon: '🌟',
        description: 'Explore our complete spectrum of hand-poured botanical soy candles, diffusers, and luxury gift hampers.',
        imageUrl: '/hero_candle.png',
        bannerImage: '/hero_candle.png',
      },
    ];

    // Add Collections
    (collections || []).forEach((col) => {
      list.push({
        id: col.id,
        rawId: col.id,
        type: 'collection',
        name: col.name,
        badge: col.badge || 'CURATED COLLECTION',
        icon: col.icon || '✨',
        description: col.description || col.desc || 'Handcrafted botanical candle curation poured in limited luxury batches.',
        imageUrl: col.imageUrl || col.bannerImage || '/hero_candle.png',
        bannerImage: col.bannerImage || col.imageUrl || '/hero_candle.png',
      });
    });

    // Add Categories
    (mainCategories || []).forEach((cat) => {
      list.push({
        id: `cat:${cat.name}`,
        rawId: cat.id,
        type: 'category',
        name: cat.name,
        badge: 'CATEGORY SPOTLIGHT',
        icon: cat.name.includes('Hamper') ? '🎁' : cat.name.includes('Diffuser') ? '🌿' : cat.name.includes('Sachet') ? '🌸' : '🕯️',
        description: cat.description || `Handcrafted formulations in our ${cat.name} line.`,
        imageUrl: cat.imageUrl || cat.bannerDesktop || '/hero_candle.png',
        bannerImage: cat.bannerDesktop || cat.imageUrl || '/hero_candle.png',
      });
    });

    return list;
  }, [collections, mainCategories]);

  // Current active curation item
  const currentCuration = useMemo(() => {
    if (selectedId === 'all') return unifiedCurations[0];
    const match = unifiedCurations.find(
      (c) =>
        c.id === selectedId ||
        c.rawId === selectedId ||
        c.name.toLowerCase() === selectedId.toLowerCase() ||
        c.id === `cat:${selectedId}`
    );
    return match || unifiedCurations[0];
  }, [unifiedCurations, selectedId]);

  // Filter products for active curation
  const curationProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (currentCuration.id === 'all') {
      return [...products].sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
    }

    const curNameLower = currentCuration.name.toLowerCase().trim();
    const curId = String(currentCuration.rawId || currentCuration.id);

    const filtered = products.filter((p) => {
      const pCat = (p.category || '').toLowerCase().trim();
      const pCollection = (p.collection || '').toLowerCase().trim();

      // 1. Collection ID or raw ID match in product's collectionIds or collections array
      if (
        p.collectionIds?.some((id) => String(id) === curId || String(id).toLowerCase() === curNameLower) ||
        p.collections?.some((col) => String(col) === curId || String(col).toLowerCase() === curNameLower)
      ) {
        return true;
      }

      // 2. Collection name match on product.collection
      if (pCollection === curNameLower || pCollection === curId.toLowerCase()) {
        return true;
      }

      // 3. Collection productIds array match (assigned in Admin -> Collections)
      if ((currentCuration as any).productIds?.includes(p.id)) {
        return true;
      }

      // 4. Category match if curation is a Category or has category ID
      if (p.mainCategoryId && String(p.mainCategoryId) === curId) {
        return true;
      }
      if (pCat === curNameLower) {
        return true;
      }

      // 5. Cleaned comparison (handling emojis, extra spaces, slashes e.g. "Cake /Dessert Candles 🧁" vs "Cake / Dessert Candles")
      const pCatClean = pCat.replace(/[^a-z0-9]/g, '');
      const curNameClean = curNameLower.replace(/[^a-z0-9]/g, '');
      if (pCatClean && curNameClean && pCatClean === curNameClean) {
        return true;
      }

      const pColClean = pCollection.replace(/[^a-z0-9]/g, '');
      if (pColClean && curNameClean && pColClean === curNameClean) {
        return true;
      }

      return false;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, currentCuration, sortBy]);

  const handleSelectCuration = (curId: string) => {
    setSelectedId(curId);
    window.location.hash = `#collections?id=${encodeURIComponent(curId)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF6F8] text-[#1C1217] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* Curations Tab Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#886C7B]">
              Select Collection or Category
            </span>
            <span className="text-xs font-mono text-[#E87A96] font-bold">
              {unifiedCurations.length} Curations Available
            </span>
          </div>

          <div className="w-full flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {unifiedCurations.map((cur) => {
              const isSelected = cur.id === currentCuration.id;
              return (
                <button
                  key={cur.id}
                  type="button"
                  onClick={() => handleSelectCuration(cur.id)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-[#E87A96] border-[#E87A96] text-white shadow-card scale-105 ring-2 ring-[#F9B8CA]'
                      : 'bg-white border-[#F5E8EE] text-[#624855] hover:border-[#F9B8CA] hover:bg-[#FFF6F8]'
                  }`}
                >
                  <span className="text-base">{cur.icon}</span>
                  <span>{cur.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collection / Category Hero Card with Cover Photo */}
        <div className="relative rounded-3xl overflow-hidden border border-[#F5E8EE] bg-white p-6 sm:p-10 lg:p-12 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="pink" size="sm" icon={<SparklesIcon size={12} />}>
                {currentCuration.badge}
              </Badge>
              <span className="text-xs font-mono text-[#886C7B] font-semibold">
                • {curationProducts.length} Formulations
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1217] leading-tight">
              {currentCuration.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#624855] leading-relaxed">
              {currentCuration.description}
            </p>
          </div>

          <div className="w-full md:w-80 h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#FFF6F8] border border-[#F5E8EE] shrink-0 shadow-subtle relative group">
            <img
              src={currentCuration.imageUrl || currentCuration.bannerImage || '/hero_candle.png'}
              alt={currentCuration.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140B10]/50 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-[10px] uppercase tracking-wider font-bold bg-[#E87A96] px-2.5 py-0.5 rounded-full">
                {currentCuration.type === 'category' ? 'Category' : 'Curated Collection'}
              </span>
            </div>
          </div>
        </div>

        {/* Collection Product Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F5E8EE] shadow-xs">
            <span className="text-xs font-bold text-[#1C1217]">
              Showing {curationProducts.length} Handcrafted Candle{curationProducts.length === 1 ? '' : 's'} in {currentCuration.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#886C7B] font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FFF6F8] border border-[#F5E8EE] rounded-xl px-3 py-1.5 text-xs text-[#1C1217] font-semibold outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {curationProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {curationProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onProductClick={handleProductSelect}
                />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-white rounded-3xl border border-[#F5E8EE] space-y-3 shadow-xs">
              <p className="text-3xl">🕯️</p>
              <p className="font-serif text-lg font-bold text-[#1C1217]">No products in this curation yet.</p>
              <p className="text-xs text-[#886C7B]">Please select another collection or view all formulations.</p>
              <button
                onClick={() => handleSelectCuration('all')}
                className="px-5 py-2 bg-[#E87A96] text-white text-xs font-bold rounded-full shadow-xs cursor-pointer hover:bg-[#D45D7D]"
              >
                View All Formulations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
