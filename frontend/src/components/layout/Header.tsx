import React, { useState, useEffect } from 'react';
import {
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
import { useAuth } from '../../context/AuthContext';

export interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onNavigate?: (page: any) => void;
  currentPage?: string;
  cartCount?: number;
  wishlistCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileNav,
  onOpenSearch,
  onOpenCart,
  onNavigate,
  currentPage = 'home',
  cartCount = 0,
  wishlistCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'shop' | 'collections' | null>(null);
  const { toast } = useToast();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

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

  const handleNavClick = (e: React.MouseEvent, page: any) => {
    e.preventDefault();
    setActiveMegaMenu(null);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 font-sans ${isScrolled ? 'bg-[#FAF6F0]/95 backdrop-blur-md shadow-card border-b border-[#E5D9C5]/80 py-2.5' : 'bg-[#FAF6F0] border-b border-[#E5D9C5] py-3.5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between gap-6">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-6 sm:gap-10">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden text-[#2A1E17] hover:text-[#D4AF37] p-1.5 rounded-sm hover:bg-[#F4EFE6] transition-colors"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon size={24} />
          </button>

          {/* Professional Brand Logo on Left */}
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-3 shrink-0 group">
            <img
              src="/logo.jpeg"
              alt="The Candle Lab Logo"
              className="h-10 sm:h-12 w-auto object-contain rounded-xs shadow-subtle group-hover:scale-105 transition-transform duration-300"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-extrabold text-lg sm:text-xl tracking-wider text-[#2A1E17] leading-none">
                THE CANDLE LAB
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-[#8C7A6B] font-semibold mt-0.5">
                Botanical & Soy Artisans
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-widest text-[#2A1E17] ml-4">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className={`hover:text-[#D4AF37] transition-colors py-2 ${currentPage === 'home' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : ''}`}
            >
              Home
            </a>

            <div
              className="relative py-2"
              onMouseEnter={() => setActiveMegaMenu('shop')}
            >
              <a
                href="#shop"
                onClick={(e) => handleNavClick(e, 'shop')}
                className={`flex items-center gap-1 hover:text-[#D4AF37] transition-colors ${currentPage === 'shop' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : ''}`}
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
                onClick={(e) => handleNavClick(e, 'collections')}
                className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
              >
                <span>Collections</span>
                <ChevronDownIcon size={14} className={`transition-transform ${activeMegaMenu === 'collections' ? 'rotate-180 text-[#D4AF37]' : ''}`} />
              </a>
            </div>

            <a href="#scent-quiz-section" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-[#D4AF37] transition-colors py-2">
              Scent Quiz
            </a>

            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className={`hover:text-[#B88B38] transition-colors py-2 ${currentPage === 'contact' ? 'text-[#B88B38] border-b-2 border-[#B88B38]' : ''}`}>
              Contact Us
            </a>
          </nav>
        </div>

        {/* Right Side: Action Icons */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Trigger with Cmd+K Badge */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 text-[#2A1E17] hover:text-[#D4AF37] p-2 rounded-full hover:bg-[#F4EFE6] transition-colors"
            aria-label="Search products"
            title="Search (Cmd + K)"
          >
            <SearchIcon size={20} />
            <span className="hidden xl:inline-block text-[10px] font-mono font-bold bg-[#2A1E17] text-[#FAF6F0] px-1.5 py-0.5 rounded-xs">
              ⌘K
            </span>
          </button>


          {/* Wishlist Shortcut */}
          <a
            href="#wishlist"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.('wishlist' as any);
            }}
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


          {/* User Account Dropdown / Auth Trigger */}
          {isAuthenticated ? (
            <Dropdown
              trigger={
                <div className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#F4EFE6] transition-colors cursor-pointer group">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#2A1E17] text-[#FAF6F0] flex items-center justify-center text-xs font-bold font-serif">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden xl:inline text-xs font-semibold text-[#2A1E17] max-w-[100px] truncate">
                    {user?.name ? user.name.split(' ')[0] : 'Account'}
                  </span>
                </div>
              }
              align="right"
              items={[
                { key: 'profile', label: 'My Account', icon: <UserIcon size={14} />, onClick: () => onNavigate?.('account' as any) },
                { key: 'orders', label: 'Orders & Tracking', icon: <ShoppingBagIcon size={14} />, onClick: () => onNavigate?.('account' as any) },
                { key: 'wishlist', label: 'Saved Wishlist', icon: <HeartIcon size={14} />, onClick: () => onNavigate?.('wishlist' as any) },
                'divider',
                {
                  key: 'logout',
                  label: 'Sign Out',
                  danger: true,
                  onClick: () => {
                    logout();
                    toast({ type: 'info', title: 'Signed Out', description: 'You have been logged out safely.' });
                  },
                },
              ]}
            />
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold rounded-full px-4 py-2 text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              aria-label="Sign in to your account"
              title="Sign In / Register"
            >
              <UserIcon size={14} />
              <span>Login / Sign Up</span>
            </button>
          )}


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
        onNavigate={onNavigate}
      />
    </header>
  );
};
