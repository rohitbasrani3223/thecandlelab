import { useState } from 'react';
import { SearchIcon, CloseIcon } from '../../design-system';
import { SearchResultsView } from './SearchResultsView';
import type { SearchProductItem } from './SearchResultsView';



export interface SearchPageProps {
  initialQuery?: string;
  onSelectProduct?: (product: SearchProductItem) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = 'Rose',
  onSelectProduct,
}) => {
  const [query, setQuery] = useState(initialQuery);

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans">
      {/* Full Search Page Header */}
      <div className="bg-gradient-to-b from-[#F4EFE6] via-[#FAF6F0] to-[#FAF6F0] border-b border-[#E5D9C5] py-12 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-[#8C7A6B]">
            <a href="#home" className="hover:text-[#D4AF37] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#2A1E17] font-semibold">Global Search Results</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1E17]">
            Search Our Catalogue
          </h1>

          {/* Search Bar Input */}
          <div className="relative max-w-xl mx-auto">
            <div className="relative flex items-center bg-[#FAF6F0] border-2 border-[#D4AF37] rounded-md shadow-card">
              <div className="pl-4 text-[#D4AF37]">
                <SearchIcon size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by scent note, vessel, or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-[#2A1E17] placeholder-[#A68B75] text-sm px-4 py-3 bg-transparent outline-none font-serif"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="pr-4 text-[#8C7A6B] hover:text-[#2A1E17]"
                >
                  <CloseIcon size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
        <SearchResultsView query={query} onSelectProduct={onSelectProduct} />
      </div>
    </div>
  );
};
