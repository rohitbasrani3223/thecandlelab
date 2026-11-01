import React from 'react';
import { HeroBanner } from './HeroBanner';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedCollection } from './FeaturedCollection';
import { BestSellers } from './BestSellers';
import { NewArrivalsTrending } from './NewArrivalsTrending';
import { CustomerReviews } from './CustomerReviews';
import { InstagramGallery } from './InstagramGallery';
import { useCMS } from '../../context/CMSContext';

export interface HomePageProps {
  onNavigateToShop?: (categoryId?: string) => void;
  onSelectProduct?: (product: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToShop, onSelectProduct }) => {
  const { settings } = useCMS();

  const handleCategoryClick = (categoryId?: string) => {
    if (onNavigateToShop) {
      onNavigateToShop(categoryId);
    } else {
      window.location.hash = '#categories';
    }
  };

  const isSectionEnabled = (id: string, defaultEnabled = true) => {
    if (!settings.homepageSections || settings.homepageSections.length === 0) {
      if (id === 'new_arrivals') return false; // Default New Arrivals OFF
      return defaultEnabled;
    }
    const sec = settings.homepageSections.find(
      (s) => s.id === id || (id === 'featured_collection' && s.id === 'featured') || (id === 'reviews' && s.id === 'testimonials')
    );
    if (!sec) {
      return id === 'new_arrivals' ? false : defaultEnabled;
    }
    return Boolean(sec.enabled);
  };

  return (
    <div className="w-full">
      {/* 1. Hero Banner */}
      {isSectionEnabled('hero') && (
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
      )}

      {/* 2. Unified Categories & Collections with Live Product Showcase */}
      {isSectionEnabled('categories') && (
        <CategoryGrid onNavigateToShop={handleCategoryClick} onSelectProduct={onSelectProduct} />
      )}

      {/* 3. Featured Royal Collection */}
      {isSectionEnabled('featured_collection') && (
        <FeaturedCollection onSelectProduct={onSelectProduct} />
      )}

      {/* 4. Best Sellers */}
      {isSectionEnabled('bestsellers') && (
        <BestSellers onSelectProduct={onSelectProduct} />
      )}

      {/* 5. New Arrivals & Trending (Can be toggled in Admin) */}
      {isSectionEnabled('new_arrivals', false) && (
        <NewArrivalsTrending onSelectProduct={onSelectProduct} />
      )}

      {/* 6. Authentic Customer Reviews */}
      {isSectionEnabled('reviews') && (
        <CustomerReviews />
      )}

      {/* 7. Instagram Atelier Gallery */}
      {isSectionEnabled('instagram') && (
        <InstagramGallery />
      )}
    </div>
  );
};

