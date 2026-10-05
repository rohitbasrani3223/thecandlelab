import React from 'react';
import { HeroBanner } from './HeroBanner';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedCollection } from './FeaturedCollection';
import { BestSellers } from './BestSellers';
import { NewArrivalsTrending } from './NewArrivalsTrending';
import { InstagramGallery } from './InstagramGallery';

export interface HomePageProps {
  onNavigateToShop?: (categoryId?: string) => void;
  onSelectProduct?: (product: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToShop, onSelectProduct }) => {
  const handleCategoryClick = (categoryId?: string) => {
    if (onNavigateToShop) {
      onNavigateToShop(categoryId);
    } else {
      window.location.hash = '#categories';
    }
  };

  return (
    <div className="w-full">
      {/* 1. Hero Banner */}
      <HeroBanner
        onNavigateToShop={() => {
          if (onNavigateToShop) onNavigateToShop();
          else window.location.hash = '#shop';
        }}
        onNavigateToCollections={() => {
          if (onNavigateToShop) onNavigateToShop('collections');
          else window.location.hash = '#collections';
        }}
      />

      {/* 2. Unified Categories & Collections with Live Product Showcase */}
      <CategoryGrid onNavigateToShop={handleCategoryClick} onSelectProduct={onSelectProduct} />

      {/* 3. Featured Royal Collection */}
      <FeaturedCollection onSelectProduct={onSelectProduct} />

      {/* 4. Best Sellers */}
      <BestSellers onSelectProduct={onSelectProduct} />

      {/* 5. New Arrivals & Trending */}
      <NewArrivalsTrending onSelectProduct={onSelectProduct} />

      {/* 6. Instagram Gallery */}
      <InstagramGallery />
    </div>
  );
};

