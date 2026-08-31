import { useState } from 'react';
import { Drawer, Button, ChevronDownIcon, SearchIcon, HeartIcon, ShoppingBagIcon } from '../../design-system';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenTrackOrder?: () => void;
  onNavigate?: (page: any) => void;
  cartCount?: number;
  wishlistCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenTrackOrder,
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
          <div className="text-center text-[11px] text-[#7D6F63]">
            © {new Date().getFullYear()} The Candle Lab. All Rights Reserved.
          </div>
        </div>
      }
    >
      <div className="space-y-6 font-sans">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#EADDCB]">
          <img src="/logo.jpeg" alt="The Candle Lab Logo" className="h-10 w-auto object-contain rounded-xl shadow-xs border border-[#EADDCB]" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#232323] tracking-wider leading-tight">THE CANDLE LAB</h3>
            <span className="text-[9px] uppercase tracking-widest text-[#8B6F4E] font-semibold">Botanical & Soy Artisans</span>
          </div>
        </div>

        {/* Search Bar Trigger */}
        <button
          onClick={() => {
            onClose();
            onOpenSearch();
          }}
          className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-xl p-3 flex items-center justify-between text-xs text-[#7D6F63] hover:text-[#232323] transition-colors"
        >
          <span className="flex items-center gap-2">
            <SearchIcon size={16} className="text-[#8B6F4E]" />
            <span>Search candles, notes...</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-[#8B6F4E]">Search</span>
        </button>

        {/* Navigation Links with Accordion */}
        <nav className="space-y-1">
          <a
            href="#home"
            onClick={(e) => handleLink(e, 'home')}
            className="block py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#232323] border-b border-[#FAF7F2] hover:text-[#8B6F4E]"
          >
            Home
          </a>

          {/* Shop Accordion */}
          <div className="border-b border-[#FAF7F2]">
            <button
              onClick={() => toggleSection('shop')}
              className="w-full flex items-center justify-between py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#232323] hover:text-[#8B6F4E]"
            >
              <span>Shop All Products</span>
              <ChevronDownIcon size={16} className={`transition-transform duration-200 ${expandedSection === 'shop' ? 'rotate-180 text-[#8B6F4E]' : ''}`} />
            </button>
            {expandedSection === 'shop' && (
              <div className="pl-4 pb-3 space-y-2 text-xs text-[#5C5149] animate-fade-in">
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#8B6F4E]">Luxury Glass Jars</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#8B6F4E]">Botanical Travel Tins</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#8B6F4E]">Aromatherapy Pillars</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#8B6F4E]">Reed Diffusers & Oils</a>
                <a href="#shop" onClick={(e) => handleLink(e, 'shop')} className="block py-1 hover:text-[#8B6F4E]">Gift Sets & Combos</a>
              </div>
            )}
          </div>

          {/* Collections Accordion */}
          <div className="border-b border-[#FAF7F2]">
            <button
              onClick={() => toggleSection('collections')}
              className="w-full flex items-center justify-between py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#232323] hover:text-[#8B6F4E]"
            >
              <span>Curated Collections</span>
              <ChevronDownIcon size={16} className={`transition-transform duration-200 ${expandedSection === 'collections' ? 'rotate-180 text-[#8B6F4E]' : ''}`} />
            </button>
            {expandedSection === 'collections' && (
              <div className="pl-4 pb-3 space-y-2 text-xs text-[#5C5149] animate-fade-in">
                <a href="#collections" onClick={(e) => handleLink(e, 'collections')} className="block py-1 hover:text-[#8B6F4E]">Luxury Collection</a>
                <a href="#collections" onClick={(e) => handleLink(e, 'collections')} className="block py-1 hover:text-[#8B6F4E]">Signature Collection</a>
                <a href="#collections" onClick={(e) => handleLink(e, 'collections')} className="block py-1 hover:text-[#8B6F4E]">Seasonal Collection</a>
                <a href="#collections" onClick={(e) => handleLink(e, 'collections')} className="block py-1 hover:text-[#8B6F4E]">Gift Collection</a>
              </div>
            )}
          </div>

          <a
            href="#scent-quiz-section"
            onClick={(e) => handleLink(e, 'home')}
            className="block py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#232323] border-b border-[#FAF7F2] hover:text-[#8B6F4E]"
          >
            Scent Match Quiz
          </a>

          <a
            href="#about"
            onClick={(e) => handleLink(e, 'about')}
            className="block py-3 px-2 text-sm font-bold uppercase tracking-wider text-[#232323] border-b border-[#FAF7F2] hover:text-[#8B6F4E]"
          >
            Our Story
          </a>
        </nav>

        {/* Wishlist, Account & Live Tracking Shortcuts */}
        <div className="pt-2 grid grid-cols-3 gap-2 bg-[#FAF7F2] p-3 rounded-2xl border border-[#EADDCB] text-center text-xs font-semibold text-[#232323]">
          <a href="#wishlist" onClick={(e) => handleLink(e, 'wishlist')} className="p-2 hover:bg-white rounded-xl transition-colors">
            <HeartIcon size={16} className="text-[#8B6F4E] mx-auto mb-1" />
            <span className="block text-[10px]">Wishlist ({wishlistCount})</span>
          </a>
          <button
            onClick={() => {
              onClose();
              if (onOpenTrackOrder) onOpenTrackOrder();
              else window.dispatchEvent(new Event('tcl-open-track-order'));
            }}
            className="p-2 hover:bg-white rounded-xl transition-colors cursor-pointer"
          >
            <span className="text-base block mb-0.5">📍</span>
            <span className="block text-[10px]">Track Order</span>
          </button>
          <a href="#account" onClick={(e) => handleLink(e, 'account')} className="p-2 hover:bg-white rounded-xl transition-colors">
            <span className="text-base block mb-0.5">👤</span>
            <span className="block text-[10px]">Account</span>
          </a>
        </div>
      </div>
    </Drawer>
  );
};
