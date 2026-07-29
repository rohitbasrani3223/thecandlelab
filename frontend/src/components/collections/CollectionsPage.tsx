import { useState } from 'react';
import { CollectionBanner } from './CollectionBanner';
import { CollectionFilters } from './CollectionFilters';
import type { CollectionFilterTab } from './CollectionFilters';


import { FeaturedCollections } from './FeaturedCollections';
import { StorySection } from './StorySection';
import { ShopByMood } from './ShopByMood';
import { ShopByOccasion } from './ShopByOccasion';
import { CategoryCards } from './CategoryCards';
import { CollectionGrid } from './CollectionGrid';

export interface CollectionsPageProps {
  onNavigateToShop?: () => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onNavigateToShop }) => {
  const [activeTab, setActiveTab] = useState<CollectionFilterTab>('all');

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans">
      {/* 1. High-Fashion Zara/COS Style Collection Banner */}
      <CollectionBanner onExploreClick={onNavigateToShop} />

      {/* 2. Collection Filter Selector */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 border-b border-[#E5D9C5]">
        <CollectionFilters activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 3. Featured Collections Spotlight */}
      <FeaturedCollections onSelectCollection={onNavigateToShop} />

      {/* 4. Story Section */}
      <StorySection />

      {/* 5. Shop By Mood */}
      <ShopByMood onSelectMood={onNavigateToShop} />

      {/* 6. Shop By Occasion */}
      <ShopByOccasion onSelectOccasion={onNavigateToShop} />

      {/* 7. Category Cards */}
      <CategoryCards onSelectCategory={onNavigateToShop} />

      {/* 8. Filtered Collection Grid Catalogue */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="border-b border-[#E5D9C5] pb-4">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2A1E17]">
            Collection Catalogue
          </h2>
        </div>
        <CollectionGrid activeTab={activeTab} />
      </section>
    </div>
  );
};
