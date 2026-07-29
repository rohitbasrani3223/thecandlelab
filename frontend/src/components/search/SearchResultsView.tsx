import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, StarIcon, SparklesIcon, Select, useToast } from '../../design-system';

export interface SearchProductItem {
  id: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  rating: number;
  reviews: number;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  tag: string;
}

const mockSearchCatalogue: SearchProductItem[] = [
  {
    id: 's-1',
    name: 'Velvet Rose & Smoked Amber',
    category: 'Glass Jars',
    collection: 'Royal Gold',
    price: 78.0,
    rating: 4.95,
    reviews: 142,
    topNotes: 'Calabrian Bergamot',
    heartNotes: 'Damask Rose',
    baseNotes: 'Smoked Amber',
    tag: 'Best Seller',
  },
  {
    id: 's-2',
    name: 'French Bourbon Vanilla Bean',
    category: 'Glass Jars',
    collection: 'Royal Gold',
    price: 94.0,
    rating: 4.94,
    reviews: 98,
    topNotes: 'Crushed Tonka',
    heartNotes: 'Bourbon Vanilla',
    baseNotes: 'White Amber',
    tag: 'Popular',
  },
  {
    id: 's-3',
    name: 'Mysore Sandalwood & Cedar',
    category: 'Travel Tins',
    collection: 'Signature',
    price: 42.0,
    rating: 4.85,
    reviews: 76,
    topNotes: 'Golden Cedar',
    heartNotes: 'Mysore Sandalwood',
    baseNotes: 'Smoked Vetiver',
    tag: 'Compact',
  },
  {
    id: 's-4',
    name: 'Bergamot & White Jasmine Bloom',
    category: 'Glass Jars',
    collection: 'Signature',
    price: 68.0,
    rating: 4.88,
    reviews: 114,
    topNotes: 'Italian Citrus',
    heartNotes: 'White Jasmine',
    baseNotes: 'Cashmere Wood',
    tag: 'Calming',
  },
  {
    id: 's-5',
    name: 'Smoked Leather & Tobacco Oud',
    category: 'Glass Jars',
    collection: 'Autumn Woodfire',
    price: 86.0,
    rating: 4.98,
    reviews: 312,
    topNotes: 'Cardamom',
    heartNotes: 'Smoked Tobacco Leaf',
    baseNotes: 'Rich Leather Oud',
    tag: 'Autumn Reserve',
  },
  {
    id: 's-6',
    name: 'Wild Lavender & Bergamot Bloom',
    category: 'Aromatherapy',
    collection: 'Aromatherapy Series',
    price: 72.0,
    rating: 4.89,
    reviews: 168,
    topNotes: 'Calabrian Bergamot',
    heartNotes: 'French Lavender',
    baseNotes: 'White Sage',
    tag: 'Therapeutic',
  },
];

export interface SearchResultsViewProps {
  query: string;
  onSelectProduct?: (product: SearchProductItem) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ query, onSelectProduct }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const { toast } = useToast();

  const filteredCatalogue = useMemo(() => {
    const q = query.toLowerCase().trim();
    return mockSearchCatalogue.filter((item) => {
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.topNotes.toLowerCase().includes(q) ||
        item.heartNotes.toLowerCase().includes(q) ||
        item.baseNotes.toLowerCase().includes(q);

      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      return matchQuery && matchCat;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [query, activeCategory, sortBy]);

  return (
    <div className="space-y-6 font-sans">
      {/* Search Filter & Sorting Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5D9C5] pb-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Glass Jars', 'Travel Tins', 'Aromatherapy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all shrink-0 ${activeCategory === cat ? 'bg-[#2A1E17] text-[#FAF6F0]' : 'bg-[#F4EFE6] text-[#4A3B32] hover:bg-[#E5D9C5]'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="w-44 shrink-0">
          <Select
            options={[
              { value: 'relevance', label: 'Sort: Relevance' },
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
              { value: 'rating', label: 'Highest Rated' },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-1 text-xs"
          />
        </div>
      </div>

      {/* Matching Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCatalogue.map((item) => (
          <Card
            key={item.id}
            variant="bordered"
            padding="none"
            onClick={() => onSelectProduct?.(item)}
            className="bg-[#FAF6F0] group cursor-pointer flex flex-col justify-between overflow-hidden hover:shadow-card transition-all"
          >
            <div className="h-44 bg-[#2A1E17] flex items-center justify-center relative overflow-hidden">
              <div className="text-5xl group-hover:scale-110 transition-transform">🕯️</div>
              <div className="absolute top-2 left-2">
                <Badge variant="gold" size="sm" icon={<SparklesIcon size={10} />}>{item.tag}</Badge>
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8C7A6B] font-medium">{item.category}</span>
                  <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                    <StarIcon size={12} className="fill-current text-[#D4AF37]" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <h4 className="text-base font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {item.name}
                </h4>

                <p className="text-[11px] text-[#69574A] italic font-accent-luxury truncate">
                  Notes: {item.topNotes}, {item.heartNotes}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-between">
                <span className="text-base font-bold text-[#2A1E17]">${item.price.toFixed(2)}</span>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast({ type: 'luxury', title: 'Added to Bag', description: item.name });
                  }}
                >
                  Add to Bag
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
