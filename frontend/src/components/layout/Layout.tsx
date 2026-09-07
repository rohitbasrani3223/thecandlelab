import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { SearchOverlayModal } from '../search';
import { CartDrawerUpgrade } from '../cart';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { TrackOrderModal } from '../common/TrackOrderModal';
import { useCart } from '../../context/CartContext';

export interface LayoutProps {
  children?: React.ReactNode;
  onNavigate?: (page: any, param?: string) => void;
  currentPage?: string;
  onSelectProduct?: (product: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage = 'home' }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

  const { totalQuantity } = useCart();

  const [wishlistCount, setWishlistCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tcl_wishlist_items');
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const syncWishlist = () => {
      try {
        const wishlistSaved = localStorage.getItem('tcl_wishlist_items');
        setWishlistCount(wishlistSaved ? JSON.parse(wishlistSaved).length : 0);
      } catch {}
    };

    const handleOpenTracker = () => {
      setIsTrackOrderOpen(true);
    };

    const handleOpenCart = () => {
      setIsCartOpen(true);
    };

    syncWishlist();
    window.addEventListener('storage', syncWishlist);
    window.addEventListener('tcl-wishlist-updated', syncWishlist);
    window.addEventListener('tcl-open-track-order', handleOpenTracker);
    window.addEventListener('tcl-open-cart', handleOpenCart);

    return () => {
      window.removeEventListener('storage', syncWishlist);
      window.removeEventListener('tcl-wishlist-updated', syncWishlist);
      window.removeEventListener('tcl-open-track-order', handleOpenTracker);
      window.removeEventListener('tcl-open-cart', handleOpenCart);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] text-[#232323] font-sans">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Header */}
      <Header
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onNavigate={onNavigate}
        currentPage={currentPage}
        cartCount={totalQuantity}
        wishlistCount={wishlistCount}
      />

      {/* 3. Search Modal Overlay */}
      <SearchOverlayModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* 4. Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onNavigate={onNavigate}
        cartCount={totalQuantity}
        wishlistCount={wishlistCount}
      />

      {/* 5. Upgraded Slide-out Cart Drawer */}
      <CartDrawerUpgrade
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onViewFullCart={() => {
          setIsCartOpen(false);
          if (onNavigate) onNavigate('cart' as any);
          else window.dispatchEvent(new CustomEvent('tcl-navigate', { detail: { page: 'cart' } }));
        }}
        onCheckout={() => {
          setIsCartOpen(false);
          if (onNavigate) onNavigate('checkout' as any);
          else window.dispatchEvent(new CustomEvent('tcl-navigate', { detail: { page: 'checkout' } }));
        }}
      />

      {/* 6. Dedicated Live Order Tracker Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* 7. Main Content Viewport */}
      <main className="flex-1">
        {children}
      </main>

      {/* 8. Footer */}
      <Footer onOpenTrackOrder={() => setIsTrackOrderOpen(true)} />
    </div>
  );
};
