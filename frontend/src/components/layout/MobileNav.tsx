import { useState } from 'react';
import { Drawer, Button, ChevronDownIcon, SearchIcon, HeartIcon, ShoppingBagIcon } from '../../design-system';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onNavigate?: (page: 'home' | 'shop') => void;
  cartCount?: number;
  wishlistCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onNavigate,
  cartCount = 2,
  wishlistCount = 4,
}) => {
  const [expandedSection, setExpandedSection] = useState<'shop' | 'collections' | null>('shop');

  const toggleSection = (section: 'shop' | 'collections') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleLink = (e: React.MouseEvent, page: 'home' | 'shop') => {
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
          <Button variant="gold" fullWidth leftIcon={<ShoppingBagIcon size={16} />}>
            View Shopping Bag ({cartCount})
          </Button>
          <div className="text-center text-[11px] text-[#8C7A6B]">
            © {new Date().getFullYear()} The Candle Lab. All Rights Reserved.
          </div>
        </div>
      }
    >
      <div className="space-y-6 font-sans">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5D9C5]">
          <img src="/logo.jpeg" alt="The Candle Lab Logo" className="h-10 w-auto object-contain rounded-xs shadow-xs" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#2A1E17] tracking-wider leading-tight">THE CANDLE LAB</h3>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold">Botanical & Soy Artisans</span>
          </div>
        </div>

        {/* Search Bar Trigger */}
        <button
          onClick={() => {
            onClose();
            onOpenSearch();
          }}
          className="w-full bg-[#F4EFE6] border border-[#E5D9C5] rounded-sm p-3 flex items-center justify-between text-xs text-[#8C7A6B] hover:text-[#2A1E17] transition-colors"
        >
          <span className="flex items-center gap-2">
            <SearchIcon size={16} className="text-[#D4AF37]" />
            <span>Search candles, notes...</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Search</span>
        </button>

        {/* Navigation Links with Accordion */}
        <nav className="space-y-1">
          <a
            href="#home"
            onClick={(e) => handleLink(e, 'home')}
            className="block py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#2A1E17] border-b border-[#F4EFE6] hover:text-[#D4AF37]"
          >
            Home
          </a>

          {/* Shop Accordion */}
          <div className="border-b border-[#F4EFE6]">
            <button
              onClick={() => toggleSection('shop')}
              className="w-full flex items-center justify-between py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#2A1E17] hover:text-[#D4AF37]"
            >
              <span>Shop All Products</span>
              <ChevronDownIcon size={16} className={`transition-transform duration-200 ${expandedSection === 'shop' ? 'rotate-180 text-[#D4AF37]' : ''}`} />
            </button>
            {expandedSection === 'shop' && (
              <div className="pl-4 pb-3 space-y-2 text-xs text-[#69574A] animate-fade-in">
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#D4AF37]">Luxury Glass Jars</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#D4AF37]">Botanical Travel Tins</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#D4AF37]">Aromatherapy Pillars</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#D4AF37]">Reed Diffusers & Oils</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#D4AF37]">Gift Sets & Combos</a>
              </div>
            )}
          </div>

          {/* Collections Accordion */}
          <div className="border-b border-[#F4EFE6]">
            <button
              onClick={() => toggleSection('collections')}
              className="w-full flex items-center justify-between py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#2A1E17] hover:text-[#D4AF37]"
            >
              <span>Curated Collections</span>
              <ChevronDownIcon size={16} className={`transition-transform duration-200 ${expandedSection === 'collections' ? 'rotate-180 text-[#D4AF37]' : ''}`} />
            </button>
            {expandedSection === 'collections' && (
              <div className="pl-4 pb-3 space-y-2 text-xs text-[#69574A] animate-fade-in">
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#D4AF37]">Luxury Collection</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#D4AF37]">Signature Collection</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#D4AF37]">Seasonal Collection</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#D4AF37]">Gift Collection</a>
              </div>
            )}
          </div>

          <a
            href="#scent-quiz-section"
            onClick={(e) => handleLink(e, 'home')}
            className="block py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#2A1E17] border-b border-[#F4EFE6] hover:text-[#D4AF37]"
          >
            Scent Match Quiz
          </a>

          <a
            href="#story"
            onClick={(e) => handleLink(e, 'home')}
            className="block py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#2A1E17] border-b border-[#F4EFE6] hover:text-[#D4AF37]"
          >
            Our Story
          </a>
        </nav>

        {/* Wishlist & Account Shortcuts */}
        <div className="pt-2 flex items-center justify-around bg-[#F4EFE6] p-3 rounded-md border border-[#E5D9C5]">
          <a href="#wishlist" onClick={(e) => handleLink(e, 'shop')} className="flex items-center gap-1.5 text-xs font-semibold text-[#2A1E17]">
            <HeartIcon size={16} className="text-[#B33A3A]" />
            <span>Wishlist ({wishlistCount})</span>
          </a>
          <div className="h-4 w-px bg-[#E5D9C5]" />
          <a href="#account" onClick={onClose} className="flex items-center gap-1.5 text-xs font-semibold text-[#2A1E17]">
            <span>My Account</span>
          </a>
        </div>
      </div>
    </Drawer>
  );
};
