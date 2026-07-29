import { useState, useEffect, useRef } from 'react';
import { SearchIcon, CloseIcon, Chip, Badge, SparklesIcon } from '../../design-system';
import { SearchResultsView } from './SearchResultsView';
import type { SearchProductItem } from './SearchResultsView';


import { SearchNoResults } from './SearchNoResults';

export interface SearchOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: SearchProductItem) => void;
}

const trendingTags = [
  'Royal Oud',
  'Damask Rose',
  'Wood Wicks',
  'Gift Boxes',
  'Bourbon Vanilla',
  'Aromatherapy',
];

const autocompleteDictionary = [
  'French Bourbon Vanilla',
  'Velvet Rose & Smoked Amber',
  'Mysore Sandalwood & Cedar',
  'Bergamot & White Jasmine Bloom',
  'Smoked Leather & Tobacco Oud',
  'Wild Lavender & Bergamot Bloom',
];

export const SearchOverlayModal: React.FC<SearchOverlayModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Damask Rose',
    'Wood Wicks',
    'Vanilla',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard Cmd+K / Ctrl+K & ESC listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setQuery(searchTerm);
    if (!recentSearches.includes(searchTerm)) {
      setRecentSearches([searchTerm, ...recentSearches.slice(0, 4)]);
    }
  };

  const removeRecentSearch = (term: string) => {
    setRecentSearches(recentSearches.filter((t) => t !== term));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Autocomplete matching list
  const suggestions = query.trim()
    ? autocompleteDictionary.filter((s) => s.toLowerCase().includes(query.toLowerCase().trim()))
    : [];

  const showNoResults = query.trim() !== '' && suggestions.length === 0 && query.toLowerCase().includes('qwerty');

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C130E]/75 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Dialog Box */}
      <div className="relative w-full max-w-4xl bg-[#FAF6F0] border border-[#E5D9C5] rounded-md shadow-modal z-10 overflow-hidden animate-modal-zoom my-4 font-sans">
        {/* Header Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-[#E5D9C5] bg-[#F4EFE6] flex items-center gap-3">
          <SearchIcon size={24} className="text-[#D4AF37] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search luxury candles, notes, vessels (Press ⌘K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit(query);
            }}
            className="w-full bg-transparent text-[#2A1E17] placeholder-[#A68B75] text-base font-serif font-medium outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8C7A6B] hover:text-[#2A1E17] p-1 rounded-full hover:bg-[#E5D9C5]"
              title="Clear Search"
            >
              <CloseIcon size={18} />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-1 bg-[#2A1E17] text-[#FAF6F0] text-[10px] font-mono font-bold rounded-xs shrink-0">
            ⌘K / ESC
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] hover:text-[#2A1E17] p-1"
          >
            Close
          </button>
        </div>

        {/* Scrollable Content Viewport */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* 1. Empty Query State: Recent & Trending Searches */}
          {!query && (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A6B]">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[11px] font-bold text-[#B33A3A] hover:underline"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {recentSearches.map((term) => (
                      <Chip
                        key={term}
                        label={term}
                        onSelect={() => handleSearchSubmit(term)}
                        onRemove={() => removeRecentSearch(term)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#E5D9C5] pb-2">
                  <Badge variant="gold" icon={<SparklesIcon size={12} />}>TRENDING NOW</Badge>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A6B]">
                    Popular Searches
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {trendingTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onSelect={() => handleSearchSubmit(tag)}
                      className="bg-[#F4EFE6] text-[#2A1E17]"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Autocomplete Suggestions List */}
          {query && suggestions.length > 0 && (
            <div className="bg-[#F4EFE6] p-3 rounded-md border border-[#E5D9C5] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B]">
                Suggested Formulations:
              </span>
              <div className="divide-y divide-[#E5D9C5]">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleSearchSubmit(sug)}
                    className="w-full text-left py-2 px-2 text-xs font-semibold text-[#2A1E17] hover:text-[#D4AF37] flex items-center justify-between"
                  >
                    <span>{sug}</span>
                    <span className="text-[10px] text-[#8C7A6B]">Select →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Live Results View or No Results Fallback */}
          {showNoResults ? (
            <SearchNoResults
              query={query}
              onSuggestionClick={handleSearchSubmit}
              onClose={onClose}
            />
          ) : (
            <SearchResultsView
              query={query}
              onSelectProduct={(p) => {
                onSelectProduct?.(p);
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
