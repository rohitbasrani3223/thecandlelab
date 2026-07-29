import { useState } from 'react';
import { WishlistHeader } from './WishlistHeader';
import { LoginPromptBanner } from './LoginPromptBanner';
import { WishlistGrid } from './WishlistGrid';
import type { WishlistItem } from './WishlistGrid';


import { WishlistEmptyState } from './WishlistEmptyState';
import { useToast } from '../../design-system';

const initialWishlistItems: WishlistItem[] = [
  {
    id: 'w-1',
    name: 'Velvet Rose & Smoked Amber',
    category: 'Glass Jars',
    collection: 'Royal Gold',
    price: 78.0,
    rating: 4.95,
    reviews: 142,
    stockStatus: 'In Stock • ⚡ 4 Left in Batch #18',
    notes: 'Bergamot, Damask Rose, Smoked Oud',
  },
  {
    id: 'w-2',
    name: 'French Bourbon Vanilla Bean',
    category: 'Glass Jars',
    collection: 'Royal Gold',
    price: 94.0,
    rating: 4.94,
    reviews: 98,
    stockStatus: 'In Stock',
    notes: 'Tonka, Bourbon Vanilla, Amber',
  },
  {
    id: 'w-3',
    name: 'Mysore Sandalwood & Cedar',
    category: 'Travel Tins',
    collection: 'Signature',
    price: 42.0,
    rating: 4.85,
    reviews: 76,
    stockStatus: 'In Stock',
    notes: 'Cedar, Sandalwood, Vetiver',
  },
  {
    id: 'w-4',
    name: 'Smoked Leather & Tobacco Oud',
    category: 'Glass Jars',
    collection: 'Autumn Woodfire',
    price: 86.0,
    rating: 4.98,
    reviews: 312,
    stockStatus: 'In Stock • Low Batch',
    notes: 'Cardamom, Tobacco, Leather',
  },
];

export interface WishlistPageProps {
  onNavigateToShop?: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigateToShop }) => {
  const [items, setItems] = useState<WishlistItem[]>(initialWishlistItems);
  const { toast } = useToast();

  const handleMoveToCart = (item: WishlistItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    toast({
      type: 'luxury',
      title: 'Transferred to Shopping Bag',
      description: `${item.name} ($${item.price.toFixed(2)}) moved to bag.`,
    });
  };

  const handleRemoveItem = (id: string, name: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({
      type: 'info',
      title: 'Removed from Wishlist',
      description: name,
    });
  };

  const handleMoveAllToCart = () => {
    const count = items.length;
    setItems([]);
    toast({
      type: 'luxury',
      title: 'All Formulations Moved to Bag!',
      description: `${count} items added to your shopping bag.`,
    });
  };

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans">
      {/* Breadcrumb Header */}
      <div className="bg-[#F4EFE6] border-b border-[#E5D9C5] py-3.5 px-6 sm:px-12 text-xs text-[#8C7A6B]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#home" className="hover:text-[#D4AF37] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#2A1E17] font-bold">My Saved Wishlist</span>
          </div>

          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
            >
              ← Continue Shopping
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 space-y-8">
        {/* Wishlist Title & Actions Header */}
        <WishlistHeader
          itemCount={items.length}
          onMoveAllToCart={handleMoveAllToCart}
        />

        {/* Login Account Sync Banner */}
        <LoginPromptBanner />

        {/* Wishlist Grid or Empty State */}
        {items.length === 0 ? (
          <WishlistEmptyState onExploreCatalog={onNavigateToShop} />
        ) : (
          <WishlistGrid
            items={items}
            onMoveToCart={handleMoveToCart}
            onRemoveItem={handleRemoveItem}
          />
        )}
      </div>
    </div>
  );
};
