import React, { useState } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { SearchOverlayModal } from '../search';
import { CartDrawerUpgrade } from '../cart';


import { MobileNav } from './MobileNav';
import { Footer } from './Footer';

export interface LayoutProps {
  children?: React.ReactNode;
  onNavigate?: (page: 'home' | 'shop' | 'collections' | 'pdp' | 'wishlist' | 'cart' | 'checkout' | 'account' | 'auth') => void;
  currentPage?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage = 'home' }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = 2;
  const wishlistCount = 4;


  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2A1E17] font-sans">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Header */}
      <Header
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={onNavigate}
        currentPage={currentPage}
        cartCount={cartCount}
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
        onNavigate={onNavigate}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      {/* 5. Upgraded Slide-out Cart Drawer */}
      <CartDrawerUpgrade
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onViewFullCart={() => onNavigate?.('cart' as any)}
      />


      {/* 6. Main Content Viewport */}
      <main className="flex-1">
        {children}
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};
