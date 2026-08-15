import { useState } from 'react';
import { Drawer, Button, ChevronDownIcon, SearchIcon, HeartIcon, ShoppingBagIcon } from '../../design-system';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onNavigate?: (page: any) => void;
  cartCount?: number;
  wishlistCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onNavigate,
  cartCount = 0,
  wishlistCount = 0,
}) => {
  const [expandedSection, setExpandedSection] = useState<'shop' | 'collections' | null>('shop');

  const toggleSection = (section: 'shop' | 'collections') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleLink = (e: React.MouseEvent, page: any) => {
    e.preventDefault();
    onClose();
    if (onNavigate) onNavigate(page);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      size="md"
      title=""
      footer={
        <div className="space-y-3">
          <Button
            variant="pink"
            fullWidth
            leftIcon={<ShoppingBagIcon size={16} />}
            onClick={() => {
              onClose();
              onNavigate?.('cart');
            }}
          >
            View Shopping Bag ({cartCount})
          </Button>
          <div className="text-center text-[11px] text-[#886C7B]">
            © {new Date().getFullYear()} The Candle Lab. All Rights Reserved.
          </div>
        </div>
      }
    >
      <div className="space-y-6 font-sans">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#F5E8EE]">
          <img src="/logo.jpeg" alt="The Candle Lab Logo" className="h-10 w-auto object-contain rounded-xl shadow-xs border border-[#F5E8EE]" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#1C1217] tracking-wider leading-tight">THE CANDLE LAB</h3>
            <span className="text-[9px] uppercase tracking-widest text-[#E87A96] font-semibold">Botanical & Soy Artisans</span>
          </div>
        </div>

        {/* Search Bar Trigger */}
        <button
          onClick={() => {
            onClose();
            onOpenSearch();
          }}
          className="w-full bg-[#FFF6F8] border border-[#F5E8EE] rounded-xl p-3 flex items-center justify-between text-xs text-[#886C7B] hover:text-[#1C1217] transition-colors"
        >
          <span className="flex items-center gap-2">
            <SearchIcon size={16} className="text-[#E87A96]" />
            <span>Search candles, notes...</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-[#E87A96]">Search</span>
        </button>

        {/* Navigation Links with Accordion */}
        <nav className="space-y-1">
          <a
            href="#home"
            onClick={(e) => handleLink(e, 'home')}
            className="block py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#1C1217] border-b border-[#FFF6F8] hover:text-[#E87A96]"
          >
            Home
          </a>

          {/* Shop Accordion */}
          <div className="border-b border-[#FFF6F8]">
            <button
              onClick={() => toggleSection('shop')}
              className="w-full flex items-center justify-between py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#1C1217] hover:text-[#E87A96]"
            >
              <span>Shop All Products</span>
              <ChevronDownIcon size={16} className={`transition-transform duration-200 ${expandedSection === 'shop' ? 'rotate-180 text-[#E87A96]' : ''}`} />
            </button>
            {expandedSection === 'shop' && (
              <div className="pl-4 pb-3 space-y-2 text-xs text-[#624855] animate-fade-in">
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#E87A96]">Luxury Glass Jars</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#E87A96]">Botanical Travel Tins</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#E87A96]">Aromatherapy Pillars</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#E87A96]">Reed Diffusers & Oils</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#E87A96]">Gift Sets & Combos</a>
              </div>
            )}
          </div>

          {/* Collections Accordion */}
          <div className="border-b border-[#FFF6F8]">
            <button
              onClick={() => toggleSection('collections')}
              className="w-full flex items-center justify-between py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#1C1217] hover:text-[#E87A96]"
            >
              <span>Curated Collections</span>
              <ChevronDownIcon size={16} className={`transition-transform duration-200 ${expandedSection === 'collections' ? 'rotate-180 text-[#E87A96]' : ''}`} />
            </button>
            {expandedSection === 'collections' && (
              <div className="pl-4 pb-3 space-y-2 text-xs text-[#624855] animate-fade-in">
                <a href="#collections" onClick={(e) => handleLink(e, 'collections')} className="block py-1 hover:text-[#E87A96]">Luxury Collection</a>
                <a href="#collections" onClick={(e) => handleLink(e, 'collections')} className="block py-1 hover:text-[#E87A96]">Signature Collection</a>
                <a href="#collections" onClick={(e) => handleLink(e, 'collections')} className="block py-1 hover:text-[#E87A96]">Seasonal Collection</a>
                <a href="#collections" onClick={(e) => handleLink(e, 'collections')} className="block py-1 hover:text-[#E87A96]">Gift Collection</a>
              </div>
            )}
          </div>

          <a
            href="#scent-quiz-section"
            onClick={(e) => handleLink(e, 'home')}
            className="block py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#1C1217] border-b border-[#FFF6F8] hover:text-[#E87A96]"
          >
            Scent Match Quiz
          </a>

          <a
            href="#about"
            onClick={(e) => handleLink(e, 'about')}
            className="block py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#1C1217] border-b border-[#FFF6F8] hover:text-[#E87A96]"
          >
            Our Story
          </a>
        </nav>

        {/* Wishlist & Account Shortcuts */}
        <div className="pt-2 flex items-center justify-around bg-[#FFF6F8] p-3 rounded-xl border border-[#F5E8EE]">
          <a href="#wishlist" onClick={(e) => handleLink(e, 'wishlist')} className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1217]">
            <HeartIcon size={16} className="text-[#E87A96]" />
            <span>Wishlist ({wishlistCount})</span>
          </a>
          <div className="h-4 w-px bg-[#F5E8EE]" />
          <a href="#account" onClick={(e) => handleLink(e, 'account')} className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1217]">
            <span>My Account</span>
          </a>
        </div>
      </div>
    </Drawer>
  );
};
