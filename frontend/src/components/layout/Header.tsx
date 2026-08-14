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
  const { user, isAuthenticated, logout } = useAuth();

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
      className={`sticky top-0 z-30 w-full transition-all duration-300 font-sans ${isScrolled ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-card border-b border-[#E5DAC7]/90 py-2.5' : 'bg-[#FAF7F2] border-b border-[#E5DAC7] py-3.5'}`}
    >
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-12 flex items-center justify-between gap-1 sm:gap-6 min-w-0">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-2 sm:gap-10 min-w-0">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden text-[#241812] hover:text-[#C5983A] p-2 rounded-lg hover:bg-[#F5EEE4] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon size={22} />
          </button>

          {/* Professional Brand Logo on Left */}
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-2 sm:gap-3 shrink-0 group min-w-0">
            <img
              src="/logo.jpeg"
              alt="The Candle Lab Logo"
              className="h-8 sm:h-12 w-auto object-contain rounded-md shadow-subtle group-hover:scale-105 transition-transform duration-300"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-extrabold text-base sm:text-xl tracking-wider text-[#241812] leading-none">
                THE CANDLE LAB
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-[#847262] font-semibold mt-0.5">
                Botanical & Soy Artisans
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-widest text-[#241812] ml-4">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className={`hover:text-[#C5983A] transition-colors py-2 ${currentPage === 'home' ? 'text-[#C5983A] border-b-2 border-[#C5983A]' : ''}`}
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
                className={`flex items-center gap-1 hover:text-[#C5983A] transition-colors ${currentPage === 'shop' ? 'text-[#C5983A] border-b-2 border-[#C5983A]' : ''}`}
              >
                <span>Shop All</span>
                <ChevronDownIcon size={14} className={`transition-transform ${activeMegaMenu === 'shop' ? 'rotate-180 text-[#C5983A]' : ''}`} />
              </a>
            </div>

            <div
              className="relative py-2"
              onMouseEnter={() => setActiveMegaMenu('collections')}
            >
              <a
                href="#collections"
                onClick={(e) => handleNavClick(e, 'collections')}
                className={`flex items-center gap-1 hover:text-[#C5983A] transition-colors ${currentPage === 'collections' ? 'text-[#C5983A] border-b-2 border-[#C5983A]' : ''}`}
              >
                <span>Collections</span>
                <ChevronDownIcon size={14} className={`transition-transform ${activeMegaMenu === 'collections' ? 'rotate-180 text-[#C5983A]' : ''}`} />
              </a>
            </div>

            <a href="#scent-quiz-section" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-[#C5983A] transition-colors py-2">
              Scent Quiz
            </a>

            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className={`hover:text-[#C5983A] transition-colors py-2 ${currentPage === 'contact' ? 'text-[#C5983A] border-b-2 border-[#C5983A]' : ''}`}>
              Contact Us
            </a>
          </nav>
        </div>

        {/* Right Side: Action Icons */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-3">
          {/* Search Trigger with Cmd+K Badge */}
          <button
            onClick={onOpenSearch}
            className="flex items-center justify-center text-[#241812] hover:text-[#C5983A] p-2 rounded-full hover:bg-[#F5EEE4] transition-colors min-h-[40px] min-w-[40px]"
            aria-label="Search products"
            title="Search (Cmd + K)"
          >
            <SearchIcon size={19} />
            <span className="hidden xl:inline-block text-[10px] font-mono font-bold bg-[#241812] text-[#FAF6F0] px-1.5 py-0.5 rounded-xs ml-1">
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
            className="relative text-[#241812] hover:text-[#C5983A] p-2 rounded-full hover:bg-[#F5EEE4] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="View Wishlist"
          >
            <HeartIcon size={19} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#C5983A] text-[#180F0A] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </a>

          {/* User Account Dropdown / Auth Trigger */}
          {isAuthenticated ? (
            <Dropdown
              trigger={
                <div className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full hover:bg-[#F5EEE4] transition-colors cursor-pointer group min-h-[40px] min-w-[40px] justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#C5983A]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#241812] text-[#FAF6F0] flex items-center justify-center text-xs font-bold font-serif">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden xl:inline text-xs font-semibold text-[#241812] max-w-[100px] truncate">
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
              onClick={() => {
                if (onNavigate) {
                  onNavigate('auth' as any);
                } else {
                  window.location.hash = '#auth';
                }
              }}
              className="bg-[#241812] hover:bg-[#3E3027] text-[#FAF7F2] font-bold rounded-full p-2 sm:px-3.5 sm:py-2 text-xs flex items-center justify-center gap-1.5 shadow-subtle border border-[#C5983A]/30 transition-all cursor-pointer active:scale-95 min-h-[40px] min-w-[40px] sm:min-w-0"
              aria-label="Sign in to your account"
              title="Sign In / Register"
            >
              <UserIcon size={15} className="text-[#C5983A]" />
              <span className="hidden md:inline">Sign In</span>
            </button>
          )}

          {/* Cart Icon & Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative bg-[#241812] text-[#FAF7F2] hover:bg-[#3E3027] px-2.5 sm:px-3.5 py-2 rounded-full flex items-center gap-1.5 sm:gap-2 transition-all shadow-subtle border border-[#C5983A]/20 min-h-[40px]"
            aria-label="Shopping Cart"
          >
            <ShoppingBagIcon size={17} className="text-[#C5983A]" />
            <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase">Bag</span>
            <span className="bg-[#C5983A] text-[#180F0A] text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
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
