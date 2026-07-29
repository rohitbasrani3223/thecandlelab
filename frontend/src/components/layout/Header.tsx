import React, { useState, useEffect } from 'react';
import {
  CandleIcon,
  SearchIcon,
  HeartIcon,
  ShoppingBagIcon,
  UserIcon,
  MenuIcon,
  ChevronDownIcon,
  Dropdown,
  useToast,
} from '../../design-system';
import { MegaMenu } from './MegaMenu';

export interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  cartCount?: number;
  wishlistCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileNav,
  onOpenSearch,
  onOpenCart,
  cartCount = 2,
  wishlistCount = 4,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'shop' | 'collections' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 font-sans ${isScrolled ? 'bg-[#FAF6F0]/95 backdrop-blur-md shadow-card border-b border-[#E5D9C5]/80 py-3' : 'bg-[#FAF6F0] border-b border-[#E5D9C5] py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Hamburger & Desktop Nav */}
        <div className="flex items-center gap-6">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden text-[#2A1E17] hover:text-[#D4AF37] p-1.5 rounded-sm hover:bg-[#F4EFE6] transition-colors"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon size={24} />
          </button>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
            <a href="#home" className="hover:text-[#D4AF37] transition-colors py-2">
              Home
            </a>

            <div
              className="relative py-2"
              onMouseEnter={() => setActiveMegaMenu('shop')}
            >
              <a
                href="#shop"
                className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
              >
                <span>Shop All</span>
                <ChevronDownIcon size={14} className={`transition-transform ${activeMegaMenu === 'shop' ? 'rotate-180 text-[#D4AF37]' : ''}`} />
              </a>
            </div>

            <div
              className="relative py-2"
              onMouseEnter={() => setActiveMegaMenu('collections')}
            >
              <a
                href="#collections"
                className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
              >
                <span>Collections</span>
                <ChevronDownIcon size={14} className={`transition-transform ${activeMegaMenu === 'collections' ? 'rotate-180 text-[#D4AF37]' : ''}`} />
              </a>
            </div>

            <a href="#scent-quiz" className="hover:text-[#D4AF37] transition-colors py-2">
              Scent Quiz
            </a>

            <a href="#story" className="hover:text-[#D4AF37] transition-colors py-2">
              Our Story
            </a>
          </nav>
        </div>

        {/* Center: Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <CandleIcon size={30} className="text-[#D4AF37] transition-transform duration-300 group-hover:scale-110" />
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="font-serif font-extrabold text-xl sm:text-2xl tracking-wider text-[#2A1E17]">
              THE CANDLE LAB
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C7A6B] font-semibold">
              Botanical & Soy Artisans
            </span>
          </div>
        </a>

        {/* Right Side: Action Icons */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="text-[#2A1E17] hover:text-[#D4AF37] p-2 rounded-full hover:bg-[#F4EFE6] transition-colors"
            aria-label="Search products"
          >
            <SearchIcon size={20} />
          </button>

          {/* Wishlist Shortcut */}
          <a
            href="#wishlist"
            className="relative text-[#2A1E17] hover:text-[#D4AF37] p-2 rounded-full hover:bg-[#F4EFE6] transition-colors"
            aria-label="View Wishlist"
          >
            <HeartIcon size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#D4AF37] text-[#1C130E] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </a>

          {/* User Account Dropdown */}
          <Dropdown
            trigger={
              <div className="text-[#2A1E17] hover:text-[#D4AF37] p-2 rounded-full hover:bg-[#F4EFE6] transition-colors">
                <UserIcon size={20} />
              </div>
            }
            align="right"
            items={[
              { key: 'profile', label: 'My Account', icon: <UserIcon size={14} /> },
              { key: 'orders', label: 'Orders & Tracking', icon: <ShoppingBagIcon size={14} /> },
              { key: 'wishlist', label: 'Saved Wishlist', icon: <HeartIcon size={14} /> },
              'divider',
              { key: 'logout', label: 'Sign Out', danger: true, onClick: () => toast({ type: 'info', title: 'Signed Out' }) },
            ]}
          />

          {/* Cart Icon & Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#4A3B32] px-3.5 py-2 rounded-full flex items-center gap-2 transition-all shadow-xs"
            aria-label="Shopping Cart"
          >
            <ShoppingBagIcon size={18} className="text-[#D4AF37]" />
            <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase">Bag</span>
            <span className="bg-[#D4AF37] text-[#1C130E] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mega Menu Overlay Container */}
      <MegaMenu
        isOpen={activeMegaMenu !== null}
        onClose={() => setActiveMegaMenu(null)}
        activeMenu={activeMegaMenu}
      />
    </header>
  );
};
