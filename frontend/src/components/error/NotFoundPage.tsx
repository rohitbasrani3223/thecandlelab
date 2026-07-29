import React from 'react';
import { Badge, SparklesIcon, Button } from '../../design-system';

export interface NotFoundPageProps {
  onReturnHome?: () => void;
  onNavigateToShop?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome, onNavigateToShop }) => {
  const handleHomeClick = () => {
    if (onReturnHome) {
      onReturnHome();
    } else {
      window.location.hash = '#home';
    }
  };

  const handleShopClick = () => {
    if (onNavigateToShop) {
      onNavigateToShop();
    } else {
      window.location.hash = '#shop';
    }
  };

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans flex items-center justify-center py-20 px-6">
      <div className="max-w-2xl mx-auto text-center space-y-6 bg-white border border-[#EFE8DB] rounded-2xl p-10 sm:p-16 shadow-card">
        <div className="w-20 h-20 rounded-full bg-[#F8F3EA] text-[#B88B38] flex items-center justify-center mx-auto text-4xl shadow-xs border border-[#EFE8DB]">
          🕯️
        </div>

        <Badge variant="gold" icon={<SparklesIcon size={12} />}>ERROR 404 — PAGE VANISHED</Badge>

        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#2C1E16]">
          This Flame Has Faded
        </h1>

        <p className="text-sm sm:text-base text-[#7A6B5D] font-light leading-relaxed max-w-md mx-auto">
          The sanctuary page or fragrance editorial you are searching for does not exist or has been relocated to our private vault.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="gold"
            size="lg"
            className="w-full sm:w-auto bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold"
            onClick={handleHomeClick}
          >
            Return to Sanctuary Home →
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-[#B88B38] text-[#B88B38] hover:bg-[#B88B38] hover:text-white"
            onClick={handleShopClick}
          >
            Explore Candle Catalog
          </Button>
        </div>
      </div>
    </div>
  );
};
