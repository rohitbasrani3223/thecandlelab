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

    // Helper to find matching product image
    const findProductImg = (name: string, id: string) => {
      if (!products || products.length === 0) return '/hero_candle.png';
      const nameLower = name.toLowerCase().trim();
      const curId = String(id);
      const match = products.find((p) => {
        const pCat = (p.category || '').toLowerCase().trim();
        const pCol = (p.collection || '').toLowerCase().trim();
        return (
          p.collectionIds?.some((cId) => String(cId) === curId || String(cId).toLowerCase() === nameLower) ||
          p.collections?.some((col) => String(col) === curId || String(col).toLowerCase() === nameLower) ||
          pCol === nameLower ||
          pCol === curId.toLowerCase() ||
          (p.mainCategoryId && String(p.mainCategoryId) === curId) ||
          pCat === nameLower
        );
      });
      return match?.image || match?.imageUrl || '/hero_candle.png';
    };

    // Add Collections
    (collections || []).forEach((col) => {
      const prodImg = findProductImg(col.name, col.id);
      list.push({
        id: col.id,
        rawId: col.id,
        type: 'collection',
        name: col.name,
        badge: col.badge || 'CURATED COLLECTION',
        icon: col.icon || '✨',
        description: col.description || col.desc || 'Handcrafted botanical candle curation poured in limited luxury batches.',
        imageUrl: col.imageUrl || col.bannerImage || prodImg,
        bannerImage: col.bannerImage || col.imageUrl || prodImg,
      });
    });

    // Add Categories
    (mainCategories || []).forEach((cat) => {
      const prodImg = findProductImg(cat.name, cat.id);
      list.push({
        id: `cat:${cat.name}`,
        rawId: cat.id,
        type: 'category',
        name: cat.name,
        badge: 'CATEGORY SPOTLIGHT',
        icon: cat.name.includes('Hamper') ? '🎁' : cat.name.includes('Diffuser') ? '🌿' : cat.name.includes('Sachet') ? '🌸' : '🕯️',
        description: cat.description || `Handcrafted formulations in our ${cat.name} line.`,
        imageUrl: cat.imageUrl || cat.bannerDesktop || prodImg,
        bannerImage: cat.bannerDesktop || cat.imageUrl || prodImg,
      });
    });

    return list;
  }, [collections, mainCategories, products]);

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
    <div className="min-h-screen bg-[#F8F6F0] text-[#232323] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* Curations Circular Avatar Story Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#7D6F63]">
              ✦ Select Collection or Category
            </span>
            <span className="text-xs font-mono text-[#8B6F4E] font-bold">
              {unifiedCurations.length} Curations Available
            </span>
          </div>

          <div className="w-full flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {unifiedCurations.map((cur) => {
              const isSelected = cur.id === currentCuration.id;
              return (
                <button
                  key={cur.id}
                  type="button"
                  onClick={() => handleSelectCuration(cur.id)}
                  className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group select-none text-center"
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-[#B88B38] via-[#E5C378] to-[#8B6F4E] shadow-[0_4px_16px_rgba(184,139,56,0.35)] scale-105 ring-2 ring-[#B88B38]'
                        : 'bg-white border border-[#EADDCB] hover:border-[#B88B38] hover:shadow-subtle'
                    }`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden relative bg-[#F8F6F0]">
                      {cur.imageUrl && cur.imageUrl !== '/hero_candle.png' ? (
                        <img
                          src={cur.imageUrl}
                          alt={cur.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl bg-[#FAF7F2]">
                          {cur.icon || '🕯️'}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-semibold max-w-[80px] sm:max-w-[95px] truncate transition-colors ${
                      isSelected ? 'text-[#8B6F4E] font-bold' : 'text-[#5C5149] group-hover:text-[#232323]'
                    }`}
                  >
                    {cur.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collection / Category Hero Card with Cover Photo */}
        <div className="relative rounded-3xl overflow-hidden border border-[#EADDCB] bg-white p-6 sm:p-10 lg:p-12 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="pink" size="sm" icon={<SparklesIcon size={12} />}>
                {currentCuration.badge}
              </Badge>
              <span className="text-xs font-mono text-[#7D6F63] font-semibold">
                • {curationProducts.length} Formulations
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#232323] leading-tight">
              {currentCuration.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#5C5149] leading-relaxed">
              {currentCuration.description}
            </p>
          </div>

          <div className="w-full md:w-80 h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EADDCB] shrink-0 shadow-subtle relative group">
            <img
              src={currentCuration.imageUrl || currentCuration.bannerImage || '/hero_candle.png'}
              alt={currentCuration.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141312]/50 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-[10px] uppercase tracking-wider font-bold bg-[#8B6F4E] px-2.5 py-0.5 rounded-full">
                {currentCuration.type === 'category' ? 'Category' : 'Curated Collection'}
              </span>
            </div>
          </div>
        </div>

        {/* Collection Product Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EADDCB] shadow-xs">
            <span className="text-xs font-bold text-[#232323]">
              Showing {curationProducts.length} Handcrafted Candle{curationProducts.length === 1 ? '' : 's'} in {currentCuration.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7D6F63] font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF7F2] border border-[#EADDCB] rounded-xl px-3 py-1.5 text-xs text-[#232323] font-semibold outline-none cursor-pointer"
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
            <div className="p-16 text-center bg-white rounded-3xl border border-[#EADDCB] space-y-3 shadow-xs">
              <p className="text-3xl">🕯️</p>
              <p className="font-serif text-lg font-bold text-[#232323]">No products in this curation yet.</p>
              <p className="text-xs text-[#7D6F63]">Please select another collection or view all formulations.</p>
              <button
                onClick={() => handleSelectCuration('all')}
                className="px-5 py-2 bg-[#8B6F4E] text-white text-xs font-bold rounded-full shadow-xs cursor-pointer hover:bg-[#745A3D]"
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
