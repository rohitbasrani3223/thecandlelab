import React from 'react';
import { Badge, SparklesIcon, Button, useToast } from '../../design-system';

export interface WishlistHeaderProps {
  itemCount: number;
  onMoveAllToCart?: () => void;
}

export const WishlistHeader: React.FC<WishlistHeaderProps> = ({ itemCount, onMoveAllToCart }) => {
  const { toast } = useToast();

  const handleShareWishlist = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast({
      type: 'luxury',
      title: 'Wishlist Link Copied!',
      description: 'Your curated candle wishlist link is ready to share.',
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#EADDCB] pb-6 font-sans">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>PERSONAL SANCTUARY</Badge>
          <span className="text-xs font-semibold text-[#7D6F63]">
            {itemCount} {itemCount === 1 ? 'Formulation' : 'Formulations'} Saved
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323]">
          My Saved Wishlist
        </h1>
      </div>

      {itemCount > 0 && (
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            onClick={handleShareWishlist}
            className="flex-1 sm:flex-initial"
          >
            🔗 Share Wishlist
          </Button>

          <Button
            variant="pink"
            size="md"
            onClick={onMoveAllToCart}
            className="flex-1 sm:flex-initial"
          >
            Move All to Bag ({itemCount})
          </Button>
        </div>
      )}
    </div>
  );
};
