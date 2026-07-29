import React from 'react';

export type CollectionFilterTab = 'all' | 'scented' | 'floral' | 'vanilla' | 'coffee' | 'festive' | 'gifts' | 'jars' | 'melts';

export interface CollectionFiltersProps {
  activeTab: CollectionFilterTab;
  onTabChange: (tab: CollectionFilterTab) => void;
}

const COLLECTION_PILLS = [
  { key: 'all', label: 'All Collections (8)' },
  { key: 'scented', label: '🕯️ Scented Candles' },
  { key: 'floral', label: '🌸 Floral Collection' },
  { key: 'vanilla', label: '🍦 Vanilla Collection' },
  { key: 'coffee', label: '☕ Coffee Collection' },
  { key: 'festive', label: '🌲 Festive Collection' },
  { key: 'gifts', label: '🎁 Gift Boxes' },
  { key: 'jars', label: '🕯️ Luxury Jars' },
  { key: 'melts', label: '⚡ Wax Melts' },
];

export const CollectionFilters: React.FC<CollectionFiltersProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center justify-start lg:justify-center gap-2.5 overflow-x-auto pb-2 font-sans no-scrollbar">
      {COLLECTION_PILLS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key as CollectionFilterTab)}
          className={`px-4 py-2 text-xs font-bold transition-all shrink-0 rounded-full cursor-pointer shadow-xs ${
            activeTab === tab.key
              ? 'bg-[#B88B38] text-white shadow-card scale-105'
              : 'bg-[#F3EDE2] text-[#4A3B32] hover:bg-[#EFE8DB]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
