import React from 'react';
import { HeroBanner } from './HeroBanner';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedCollection } from './FeaturedCollection';
import { BestSellers } from './BestSellers';
import { NewArrivalsTrending } from './NewArrivalsTrending';
import { ScentNotesCareSection } from './ScentNotesCareSection';
import { CustomerReviews } from './CustomerReviews';
import { InstagramGallery } from './InstagramGallery';
import { FaqSection } from './FAQSection';
import { NewsletterSection } from './NewsletterSection';

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
      <HeroBanner />

      {/* 2. Unified Categories & Collections with Live Product Showcase */}
      <CategoryGrid onNavigateToShop={handleCategoryClick} onSelectProduct={onSelectProduct} />

      {/* 3. Featured Royal Collection */}
      <FeaturedCollection onSelectProduct={onSelectProduct} />

      {/* 4. Best Sellers */}
      <BestSellers onSelectProduct={onSelectProduct} />

      {/* 6. New Arrivals & Trending */}
      <NewArrivalsTrending onSelectProduct={onSelectProduct} />

      {/* 7. Scent Notes & Candle Care Guide */}
      <ScentNotesCareSection />

      {/* 8. Customer Reviews & Community Love */}
      <CustomerReviews />

      {/* 9. Instagram Gallery */}
      <InstagramGallery />

      {/* 10. FAQs */}
      <FaqSection />

      {/* 11. VIP Newsletter */}
      <NewsletterSection />
    </div>
  );
};
