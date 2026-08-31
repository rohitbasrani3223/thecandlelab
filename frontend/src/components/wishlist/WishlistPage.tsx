import { useState } from 'react';
import { WishlistHeader } from './WishlistHeader';
import { LoginPromptBanner } from './LoginPromptBanner';
import { WishlistGrid } from './WishlistGrid';
import type { WishlistItem } from './WishlistGrid';

import { WishlistEmptyState } from './WishlistEmptyState';
import { useToast } from '../../design-system';

export interface WishlistPageProps {
  onNavigateToShop?: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigateToShop }) => {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_wishlist_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const { toast } = useToast();

  const syncWishlistStorage = (newItems: WishlistItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('tcl_wishlist_items', JSON.stringify(newItems));
      window.dispatchEvent(new Event('tcl-wishlist-updated'));
    } catch {}
  };

  const handleMoveToCart = (item: WishlistItem) => {
    const updated = items.filter((i) => i.id !== item.id);
    syncWishlistStorage(updated);
    toast({
      type: 'luxury',
      title: 'Transferred to Shopping Bag',
      description: `${item.name} (₹${item.price.toFixed(0)}) moved to bag.`,
    });
  };

  const handleRemoveItem = (id: string, name: string) => {
    const updated = items.filter((i) => i.id !== id);
    syncWishlistStorage(updated);
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
    <div className="w-full bg-[#F8F6F0] min-h-screen font-sans">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-[#EADDCB] py-3.5 px-6 sm:px-12 text-xs text-[#7D6F63]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#home" className="hover:text-[#8B6F4E] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#232323] font-bold">My Saved Wishlist</span>
          </div>

          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="text-xs font-bold uppercase tracking-wider text-[#8B6F4E] hover:underline cursor-pointer"
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
