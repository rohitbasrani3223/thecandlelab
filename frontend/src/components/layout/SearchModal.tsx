import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, CloseIcon, Chip, Badge, SparklesIcon } from '../../design-system';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  'Bourbon Vanilla',
  'Rose & Amber',
  'Wood Wicks',
  'Gift Sets',
  'Aromatherapy',
];

const mockResults = [
  { id: 1, title: 'Velvet Rose & Smoked Amber', category: 'Signature Glass', price: '$78.00', tag: 'Best Seller' },
  { id: 2, title: 'Mysore Sandalwood & Cedar', category: 'Botanical Tin', price: '$42.00', tag: 'Limited' },
  { id: 3, title: 'French Bourbon Vanilla Bean', category: 'Luxury 3-Wick', price: '$94.00', tag: 'Popular' },
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredResults = query
    ? mockResults.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase()))
    : mockResults;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C130E]/70 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FAF6F0] border border-[#E5D9C5] rounded-md shadow-modal z-10 overflow-hidden animate-modal-zoom">
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-[#E5D9C5] bg-[#F4EFE6] flex items-center gap-3">
          <SearchIcon size={22} className="text-[#D4AF37] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search luxury candles, notes, collections..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#2A1E17] placeholder-[#A68B75] text-base font-serif font-medium outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8C7A6B] hover:text-[#2A1E17] p-1 rounded-full hover:bg-[#E5D9C5]"
            >
              <CloseIcon size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] hover:text-[#2A1E17] px-2 py-1"
          >
            Esc
          </button>
        </div>

        {/* Popular Tags */}
        <div className="px-5 py-3 bg-[#FAF6F0] border-b border-[#E5D9C5] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7A6B] shrink-0">Popular:</span>
          {popularSearches.map((term) => (
            <Chip
              key={term}
              label={term}
              onSelect={() => setQuery(term)}
              className="text-xs py-1"
            />
          ))}
        </div>

        {/* Results Section */}
        <div className="p-5 max-h-96 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A6B]">
              {query ? `Results for "${query}"` : 'Trending Products'}
            </span>
            <span className="text-[11px] text-[#8C7A6B]">{filteredResults.length} items</span>
          </div>

          {filteredResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8C7A6B]">
              No luxury candles found matching "{query}". Try searching for "Rose" or "Vanilla".
            </div>
          ) : (
            <div className="space-y-2">
              {filteredResults.map((item) => (
                <a
                  key={item.id}
                  href={`#product-${item.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-md bg-[#F4EFE6]/50 hover:bg-[#F4EFE6] border border-transparent hover:border-[#E5D9C5] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#2A1E17] text-[#D4AF37] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                      🕯️
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors">
                        {item.title}
                      </h5>
                      <span className="text-xs text-[#8C7A6B]">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="gold" size="sm" icon={<SparklesIcon size={10} />}>{item.tag}</Badge>
                    <span className="text-xs font-bold text-[#2A1E17]">{item.price}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
