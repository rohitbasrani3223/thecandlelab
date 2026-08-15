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
    <div className="fixed inset-0 z-50 bg-[#140B10]/70 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="bg-[#FFFFFF] border border-[#F5E8EE] rounded-3xl w-full max-w-2xl shadow-modal overflow-hidden animate-fade-in font-sans">
        {/* Search Input Box */}
        <div className="p-4 border-b border-[#F5E8EE] flex items-center gap-3 bg-[#FFF6F8]">
          <span className="text-[#E87A96] text-lg">🔍</span>
          <input
            type="text"
            autoFocus
            placeholder="Search candles, fragrances, vanilla, rose, oud, lavender..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#1C1217] placeholder-[#AC94A1] focus:outline-none font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[#886C7B] hover:text-[#1C1217] text-xs px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-[#886C7B] hover:text-[#1C1217] text-xs px-2.5 py-1 bg-[#FFFFFF] border border-[#F5E8EE] rounded-lg shadow-xs"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query.trim() ? (
            searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase text-[#886C7B] font-bold">
                  {searchResults.length} Results Found
                </p>
                <div className="divide-y divide-[#F5E8EE]">
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onProductClick(prod);
                        onClose();
                      }}
                      className="p-3 flex items-center gap-4 hover:bg-[#FFF6F8] rounded-2xl cursor-pointer transition-colors"
                    >
                      <img
                        src={prod.image || prod.imageUrl}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#F5E8EE] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-sm font-medium text-[#1C1217] truncate">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FDE8EF] text-[#C94C6D] font-bold">
                            ₹{prod.price}
                          </span>
                        </div>
                        <p className="text-xs text-[#886C7B] truncate mt-0.5">
                          {prod.scentProfile || prod.tagline || prod.category}
                        </p>
                      </div>
                      <span className="text-xs text-[#E87A96] font-mono">→</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-[#886C7B] text-xs space-y-1">
                <p className="text-2xl">🕯️</p>
                <p className="font-semibold text-[#1C1217]">No creations match "{query}".</p>
                <p className="text-[11px] text-[#AC94A1]">Try searching for "Vanilla", "Rose", "Oud", or "Lavender".</p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {/* Popular Fragrance Searches */}
              <div>
                <p className="text-[10px] font-mono uppercase text-[#886C7B] font-bold mb-2">Popular Fragrance Accords</p>
                <div className="flex flex-wrap gap-2">
                  {fragrances.slice(0, 6).map((frag) => (
                    <button
                      key={frag.id}
                      type="button"
                      onClick={() => setQuery(frag.name.split('&')[0].trim())}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#FFF6F8] border border-[#F5E8EE] text-[#624855] hover:border-[#E87A96] hover:text-[#C94C6D] hover:bg-[#FDE8EF] transition-colors"
                    >
                      🌸 {frag.name.split('&')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Quick Links */}
              <div>
                <p className="text-[10px] font-mono uppercase text-[#886C7B] font-bold mb-2">Explore Categories</p>
                <div className="flex flex-wrap gap-2">
                  {mainCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setQuery(cat.name)}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#FFF6F8] border border-[#F5E8EE] text-[#624855] hover:border-[#E87A96] hover:text-[#C94C6D] hover:bg-[#FDE8EF] transition-colors"
                    >
                      📂 {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collections Quick Links */}
              <div>
                <p className="text-[10px] font-mono uppercase text-[#886C7B] font-bold mb-2">Explore Collections</p>
                <div className="flex flex-wrap gap-2">
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setQuery(col.title)}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#FFF6F8] border border-[#F5E8EE] text-[#624855] hover:border-[#E87A96] hover:text-[#C94C6D] hover:bg-[#FDE8EF] transition-colors"
                    >
                      ✨ {col.title}
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
