import React from 'react';
import { Button, Chip, StarIcon, useToast } from '../../design-system';

const fallbackSuggestions = ['Damask Rose', 'Bourbon Vanilla', 'Smoked Oud', 'Wood Wicks', 'Gift Boxes'];

const recommendedCandles = [
  { id: 'rec-1', name: 'Velvet Rose & Smoked Amber', price: '$78.00', rating: 4.95 },
  { id: 'rec-2', name: 'French Bourbon Vanilla Bean', price: '$94.00', rating: 4.94 },
  { id: 'rec-3', name: 'Mysore Sandalwood & Cedar', price: '$42.00', rating: 4.85 },
];

export interface SearchNoResultsProps {
  query: string;
  onSuggestionClick: (term: string) => void;
  onClose?: () => void;
}

export const SearchNoResults: React.FC<SearchNoResultsProps> = ({
  query,
  onSuggestionClick,
  onClose,
}) => {
  const { toast } = useToast();

  return (
    <div className="py-10 px-4 text-center font-sans space-y-8 max-w-xl mx-auto">
      {/* No Results Icon & Heading */}
      <div className="space-y-3">
        <div className="w-14 h-14 rounded-full bg-[#F4EFE6] text-[#D4AF37] flex items-center justify-center text-2xl mx-auto shadow-subtle">
          🔍
        </div>
        <h3 className="text-xl font-serif font-bold text-[#2A1E17]">
          No Fragrances Found for "{query}"
        </h3>
        <p className="text-xs text-[#8C7A6B] leading-relaxed">
          We couldn't find any candles matching your search. Try searching for fragrance notes like <span className="text-[#2A1E17] font-semibold">"Rose"</span>, <span className="text-[#2A1E17] font-semibold">"Vanilla"</span>, or <span className="text-[#2A1E17] font-semibold">"Oud"</span>.
        </p>
      </div>

      {/* Smart Keyword Suggestions */}
      <div className="space-y-2 pt-2 border-t border-[#E5D9C5]">
        <span className="text-[11px] uppercase font-bold tracking-wider text-[#8C7A6B] block">
          Try Searching For:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {fallbackSuggestions.map((term) => (
            <Chip
              key={term}
              label={term}
              onSelect={() => onSuggestionClick(term)}
              className="text-xs py-1"
            />
          ))}
        </div>
      </div>

      {/* Recommended Best Sellers */}
      <div className="space-y-4 pt-4 border-t border-[#E5D9C5] text-left">
        <span className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] block text-center">
          Popular Connoisseur Favorites
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recommendedCandles.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                toast({ type: 'luxury', title: 'Added to Bag', description: c.name });
                if (onClose) onClose();
              }}
              className="p-3 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md text-xs space-y-1.5 cursor-pointer hover:border-[#D4AF37] hover:shadow-card transition-all group"
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex text-[#D4AF37] items-center gap-0.5">
                  <StarIcon size={12} className="fill-current text-[#D4AF37]" />
                  <span className="font-bold">{c.rating}</span>
                </div>
                <span className="font-bold text-[#2A1E17]">{c.price}</span>
              </div>
              <h5 className="font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors truncate">
                {c.name}
              </h5>
              <Button variant="gold" size="sm" fullWidth>
                Add to Bag
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
