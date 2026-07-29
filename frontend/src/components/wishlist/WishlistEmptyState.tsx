import React from 'react';
import { Button, EmptyState } from '../../design-system';

export interface WishlistEmptyStateProps {
  onExploreCatalog?: () => void;
}

export const WishlistEmptyState: React.FC<WishlistEmptyStateProps> = ({ onExploreCatalog }) => {
  return (
    <div className="py-16 text-center font-sans space-y-6">
      <EmptyState
        title="Your Wishlist is Empty"
        description="Curate your personal sanctuary by clicking the heart icon on any signature candle formulation."
        actionLabel="Explore Candle Catalogue →"
        onAction={onExploreCatalog}
      />

      <div className="pt-8 border-t border-[#E5D9C5] max-w-md mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">Need Inspiration?</span>
        <div className="flex justify-center gap-3">
          <Button variant="outline" size="sm" onClick={onExploreCatalog}>
            View Best Sellers
          </Button>
          <Button variant="gold" size="sm" onClick={onExploreCatalog}>
            Take Scent Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};
