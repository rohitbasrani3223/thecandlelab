import React, { useState } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { SearchModal } from './SearchModal';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { Drawer, Button, useToast } from '../../design-system';


export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount] = useState(4);
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2A1E17] font-sans">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Header */}
      <Header
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      {/* 3. Search Modal Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* 4. Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      {/* 5. Slide-out Cart Drawer */}
      <Drawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        position="right"
        size="md"
        title={`Your Shopping Bag (${cartCount})`}
        footer={
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-[#2A1E17]">
              <span>Subtotal</span>
              <span className="text-[#D4AF37]">$172.00</span>
            </div>
            <p className="text-[11px] text-[#8C7A6B]">Taxes and shipping calculated at checkout.</p>
            <Button
              variant="gold"
              fullWidth
              onClick={() => {
                setIsCartOpen(false);
                toast({ type: 'luxury', title: 'Proceeding to Checkout...' });
              }}
            >
              Checkout Now →
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-[#F4EFE6] border border-[#E5D9C5] rounded-sm text-xs text-[#2A1E17] flex items-center justify-between">
            <span>🎉 You qualify for Free Gold Gift Packaging!</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md">
              <div className="w-12 h-12 bg-[#2A1E17] text-[#D4AF37] rounded-xs flex items-center justify-center font-serif text-lg">
                🕯️
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-[#2A1E17]">Velvet Rose & Smoked Amber</h5>
                <span className="text-[11px] text-[#8C7A6B]">Size: 12 oz Glass</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-[#D4AF37]">$78.00</span>
                  <button
                    onClick={() => {
                      setCartCount((c) => Math.max(0, c - 1));
                      toast({ type: 'info', title: 'Item Removed' });
                    }}
                    className="text-[10px] uppercase font-bold text-[#B33A3A] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md">
              <div className="w-12 h-12 bg-[#2A1E17] text-[#D4AF37] rounded-xs flex items-center justify-center font-serif text-lg">
                🕯️
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-[#2A1E17]">French Bourbon Vanilla 3-Wick</h5>
                <span className="text-[11px] text-[#8C7A6B]">Size: 16 oz Jar</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-[#D4AF37]">$94.00</span>
                  <button
                    onClick={() => {
                      setCartCount((c) => Math.max(0, c - 1));
                      toast({ type: 'info', title: 'Item Removed' });
                    }}
                    className="text-[10px] uppercase font-bold text-[#B33A3A] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* 6. Main Content Viewport */}
      <main className="flex-1">
        {children}
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};
