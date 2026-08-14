import React, { useState, useMemo } from 'react';
import { useCMS, type CMSProduct } from '../../context/CMSContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: CMSProduct) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onProductClick,
}) => {
  const { products, fragrances, mainCategories, collections } = useCMS();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      const matchSub = p.subCategory?.toLowerCase().includes(q);
      const matchCol = p.collection?.toLowerCase().includes(q) || p.collections?.some((c) => c.toLowerCase().includes(q));
      const matchFrag = p.scentProfile?.toLowerCase().includes(q) || p.topNotes?.toLowerCase().includes(q) || p.heartNotes?.toLowerCase().includes(q);
      const matchDesc = p.shortDescription?.toLowerCase().includes(q) || p.longDescription?.toLowerCase().includes(q);

      return matchName || matchSku || matchCat || matchSub || matchCol || matchFrag || matchDesc;
    });
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="bg-[#1C130E] border border-amber-500/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Search Input Box */}
        <div className="p-4 border-b border-[#2C2018] flex items-center gap-3">
          <span className="text-stone-400 text-lg">🔍</span>
          <input
            type="text"
            autoFocus
            placeholder="Search candles, fragrances, vanilla, oud, lavender, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#FDFBF7] placeholder-stone-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-200 text-xs px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 text-xs px-2 py-1 bg-[#140D09] border border-[#2C2018] rounded"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query.trim() ? (
            searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase text-stone-500">
                  {searchResults.length} Results Found
                </p>
                <div className="divide-y divide-[#2C2018]">
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onProductClick(prod);
                        onClose();
                      }}
                      className="p-3 flex items-center gap-4 hover:bg-[#251A13] rounded-xl cursor-pointer transition-colors"
                    >
                      <img
                        src={prod.image || prod.imageUrl}
                        alt={prod.name}
                        className="w-12 h-12 rounded-lg object-cover border border-[#2C2018] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-sm font-medium text-[#FDFBF7] truncate">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#140D09] text-amber-400">
                            ₹{prod.price}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 truncate mt-0.5">
                          {prod.scentProfile || prod.tagline || prod.category}
                        </p>
                      </div>
                      <span className="text-xs text-amber-500 font-mono">→</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-stone-500 text-xs space-y-1">
                <p className="text-base">🕯️</p>
                <p>No creations match "{query}".</p>
                <p className="text-[11px] text-stone-600">Try searching for "Vanilla", "Rose", "Oud", or "Lavender".</p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {/* Popular Fragrance Searches */}
              <div>
                <p className="text-[10px] font-mono uppercase text-stone-500 mb-2">Popular Fragrance Accords</p>
                <div className="flex flex-wrap gap-2">
                  {fragrances.slice(0, 6).map((frag) => (
                    <button
                      key={frag.id}
                      type="button"
                      onClick={() => setQuery(frag.name.split('&')[0].trim())}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#140D09] border border-[#2C2018] text-stone-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                    >
                      🌸 {frag.name.split('&')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Quick Links */}
              <div>
                <p className="text-[10px] font-mono uppercase text-stone-500 mb-2">Explore Categories</p>
                <div className="flex flex-wrap gap-2">
                  {mainCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setQuery(cat.name)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#140D09] border border-[#2C2018] text-stone-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                    >
                      📂 {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collections Quick Links */}
              <div>
                <p className="text-[10px] font-mono uppercase text-stone-500 mb-2">Explore Collections</p>
                <div className="flex flex-wrap gap-2">
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setQuery(col.name)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#140D09] border border-[#2C2018] text-stone-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                    >
                      {col.icon} {col.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
