import React, { useState } from 'react';
import { ShippingProgressBar } from './ShippingProgressBar';
import { CartItemRow } from './CartItemRow';
import type { CartItem } from './CartItemRow';
import { SaveForLaterSection } from './SaveForLaterSection';
import { GiftWrapToggle } from './GiftWrapToggle';
import { CouponCodeBox } from './CouponCodeBox';
import { OrderSummaryCard } from './OrderSummaryCard';
import { CartAddonsSection } from './CartAddonsSection';
import { RecentlyViewedSection } from './RecentlyViewedSection';
import { EmptyState, useToast } from '../../design-system';
import { useCart } from '../../context/CartContext';

export interface FullCartPageProps {
  onNavigateToShop?: () => void;
  onNavigateToCheckout?: () => void;
}

export const FullCartPage: React.FC<FullCartPageProps> = ({ onNavigateToShop, onNavigateToCheckout }) => {
  const { cartItems: items, updateQuantity, removeFromCart, addToCart, subtotal } = useCart();
  const [savedItems, setSavedItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_saved_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isGiftWrap, setIsGiftWrap] = useState<boolean>(false);
  const [giftMsg, setGiftMsg] = useState<string>('');
  const { toast } = useToast();

  const handleUpdateQty = (id: string, delta: number) => {
    updateQuantity(id, delta);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast({ type: 'info', title: 'Item Removed from Bag' });
  };

  const handleSaveForLater = (item: CartItem) => {
    removeFromCart(item.id);
    const updated = [...savedItems, item];
    setSavedItems(updated);
    try {
      localStorage.setItem('tcl_saved_items', JSON.stringify(updated));
    } catch {}
    toast({ type: 'luxury', title: 'Moved to Saved for Later', description: item.name });
  };

  const handleMoveBackToBag = (item: CartItem) => {
    const updated = savedItems.filter((i) => i.id !== item.id);
    setSavedItems(updated);
    try {
      localStorage.setItem('tcl_saved_items', JSON.stringify(updated));
    } catch {}
    addToCart(item, { openDrawer: false });
    toast({ type: 'luxury', title: 'Restored to Shopping Bag', description: item.name });
  };

  const handleRemoveSaved = (id: string) => {
    const updated = savedItems.filter((i) => i.id !== id);
    setSavedItems(updated);
    try {
      localStorage.setItem('tcl_saved_items', JSON.stringify(updated));
    } catch {}
  };

  const handleAddAddon = (name: string, price: number) => {
    addToCart({
      id: `addon-${Date.now()}`,
      name,
      price,
      quantity: 1,
    }, { openDrawer: false, silent: true });
    toast({ type: 'luxury', title: 'Added to Bag', description: name });
  };

  const discountAmount = appliedCoupon ? subtotal * (discountPercent / 100) : 0;
  const isFreeShipping = subtotal >= 999.0;

  return (
    <div className="w-full bg-[#F8F6F0] min-h-screen font-sans">
      {/* Breadcrumb Header */}
      <div className="bg-[#FFFFFF] border-b border-[#EADDCB] py-3.5 px-6 sm:px-12 text-xs text-[#7D6F63]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#home" className="hover:text-[#8B6F4E] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#232323] font-bold">Shopping Bag & Order Summary</span>
          </div>

          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="text-xs font-bold uppercase tracking-wider text-[#8B6F4E] hover:underline"
            >
              ← Continue Shopping
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
        <div className="border-b border-[#EADDCB] pb-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B6F4E]">
              LUXURY SANCTUARY CHECKOUT
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323] mt-1">
              Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h1>
          </div>

          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="text-xs font-bold uppercase tracking-wider text-[#232323] hover:text-[#8B6F4E] underline"
            >
              Add More Candles
            </button>
          )}
        </div>

        {items.length === 0 && savedItems.length === 0 ? (
          <div className="py-16 text-center">
            <EmptyState
              title="Your Bag is Currently Empty"
              description="Explore our hand-poured soy candle formulations and elevate your sanctuary."
              actionLabel="Explore Candle Catalogue →"
              onAction={onNavigateToShop}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Items, Shipping Bar, Gift Wrap, Addons */}
            <div className="lg:col-span-7 space-y-6">
              {/* Shipping Progress Bar */}
              <ShippingProgressBar currentSubtotal={subtotal} />

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQty}
                    onRemove={handleRemoveItem}
                    onSaveForLater={handleSaveForLater}
                  />
                ))}
              </div>

              {/* Gift Wrap Toggle */}
              <GiftWrapToggle
                isGiftWrapSelected={isGiftWrap}
                onToggleGiftWrap={setIsGiftWrap}
                giftMessage={giftMsg}
                onGiftMessageChange={setGiftMsg}
              />

              {/* Cart Accessories Add-ons */}
              <CartAddonsSection onAddAddon={handleAddAddon} />

              {/* Save for Later Section */}
              <SaveForLaterSection
                savedItems={savedItems}
                onMoveToBag={handleMoveBackToBag}
                onRemoveSaved={handleRemoveSaved}
              />

              {/* Recently Viewed Formulations */}
              <RecentlyViewedSection />
            </div>

            {/* Right Column: Order Summary & Coupon Box */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <OrderSummaryCard
                subtotal={subtotal}
                discountAmount={discountAmount}
                isFreeShipping={isFreeShipping}
                onProceedToCheckout={() => {
                  if (onNavigateToCheckout) {
                    onNavigateToCheckout();
                  } else {
                    window.dispatchEvent(new CustomEvent('tcl-navigate', { detail: { page: 'checkout' } }));
                  }
                }}
              />

              <CouponCodeBox
                appliedCoupon={appliedCoupon}
                onApplyCoupon={(code) => {
                  setAppliedCoupon(code);
                  setDiscountPercent(10);
                }}
                onRemoveCoupon={() => setAppliedCoupon(null)}
                discountPercentage={discountPercent}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
