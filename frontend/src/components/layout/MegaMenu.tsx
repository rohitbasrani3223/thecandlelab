import React from 'react';
import { Button, Badge, SparklesIcon } from '../../design-system';

export interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenu: 'shop' | 'collections' | null;
  onNavigate?: (page: any) => void;
}

const COLLECTIONS_LIST = [
  {
    icon: '🕯️',
    title: 'SCENTED CANDLES',
    desc: 'Aromatherapy Infused Luxury Soy',
    hash: '#collections',
  },
  {
    icon: '🌸',
    title: 'FLORAL COLLECTION',
    desc: 'Hand-Poured Floral Bouquets of Rose & Lavender',
    hash: '#collections',
  },
  {
    icon: '🍦',
    title: 'VANILLA COLLECTION',
    desc: 'Warm Madagascar Vanilla Bean & Bourbon',
    hash: '#collections',
  },
  {
    icon: '☕',
    title: 'COFFEE COLLECTION',
    desc: 'Rich Roasted Arabica & Dark Cacao',
    hash: '#collections',
  },
  {
    icon: '🌲',
    title: 'FESTIVE COLLECTION',
    desc: 'Spiced Cinnamon, Glowing Amber & Pine',
    hash: '#collections',
  },
  {
    icon: '🎁',
    title: 'GIFT BOXES',
    desc: 'Curated Candle & Wick Trimmer Sets',
    hash: '#collections',
  },
  {
    icon: '🕯️',
    title: 'LUXURY JARS',
    desc: 'Heavy Italian Frosted Glass Vessels',
    hash: '#collections',
  },
  {
    icon: '⚡',
    title: 'WAX MELTS',
    desc: 'Flame-Free Ambient Fragrance Melts',
    hash: '#collections',
  },
];

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, activeMenu, onNavigate }) => {
  if (!isOpen || !activeMenu) return null;

  const handleLinkClick = (e: React.MouseEvent, pageTarget: string = 'collections') => {
    e.preventDefault();
    onClose();
    if (onNavigate) {
      onNavigate(pageTarget);
    } else {
      window.location.hash = `#${pageTarget}`;
    }
  };

  if (activeMenu === 'collections') {
    return (
      <div
        onMouseLeave={onClose}
        className="absolute top-full left-1/4 -translate-x-1/4 w-80 bg-white border border-[#EFE8DB] rounded-2xl shadow-card z-50 animate-fade-in font-sans p-4 mt-2"
      >
        <div className="border-b border-[#F2ECE1] pb-2 mb-3 px-2 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B88B38]">
            CURATED COLLECTIONS ({COLLECTIONS_LIST.length})
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B88B38] animate-pulse"></span>
        </div>

        <div className="max-h-96 overflow-y-auto no-scrollbar space-y-1.5">
          {COLLECTIONS_LIST.map((item, idx) => (
            <a
              key={idx}
              href={item.hash}
              onClick={(e) => handleLinkClick(e, 'collections')}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F3EA] transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#F4EFE6] text-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#2C1E16] group-hover:text-[#B88B38] transition-colors tracking-wide">
                  {item.title}
                </h5>
                <p className="text-[10px] text-[#7A6B5D] truncate font-light">
                  {item.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FAF6F0] border-b border-[#E5D9C5] shadow-hover z-40 animate-fade-in font-sans"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Primary Categories */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#B88B38] border-b border-[#E5D9C5] pb-2">
            Shop by Vessel
          </h4>
          <ul className="space-y-2.5 text-xs text-[#4A3B32]">
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-[#B88B38] transition-colors flex items-center justify-between group">
                <span className="font-semibold">Luxury Glass Jars</span>
                <span className="text-[10px] text-[#8C7A6B] group-hover:text-[#B88B38]">12 items</span>
              </a>
            </li>
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-[#B88B38] transition-colors flex items-center justify-between group">
                <span className="font-semibold">Botanical Travel Tins</span>
                <span className="text-[10px] text-[#8C7A6B] group-hover:text-[#B88B38]">8 items</span>
              </a>
            </li>
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-[#B88B38] transition-colors flex items-center justify-between group">
                <span className="font-semibold">Aromatherapy Pillars</span>
                <Badge variant="gold" size="sm">Hot</Badge>
              </a>
            </li>
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-[#B88B38] transition-colors flex items-center justify-between group">
                <span className="font-semibold">Reed Diffusers & Oils</span>
                <span className="text-[10px] text-[#8C7A6B] group-hover:text-[#B88B38]">6 items</span>
              </a>
            </li>
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-[#B88B38] transition-colors flex items-center justify-between group">
                <span className="font-semibold">Bespoke Gift Boxes</span>
                <Badge variant="espresso" size="sm">New</Badge>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: Scent Profiles */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#B88B38] border-b border-[#E5D9C5] pb-2">
            Scent Profiles
          </h4>
          <ul className="space-y-2.5 text-xs text-[#4A3B32]">
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-[#B88B38] transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#69574A]"></span>
                <span>Woody & Spiced Oud</span>
              </a>
            </li>
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-[#B88B38] transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8C7A6B]"></span>
                <span>Fresh Citrus & Bergamot</span>
              </a>
            </li>
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-[#B88B38] transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C2AE90]"></span>
                <span>Floral Rose & Lavender</span>
              </a>
            </li>
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-[#B88B38] transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                <span>Warm Bourbon Vanilla</span>
              </a>
            </li>
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-[#B88B38] transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4A3B32]"></span>
                <span>Smokey Tobacco & Leather</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Featured Product Card Banner */}
        <div className="bg-[#F4EFE6] border border-[#E5D9C5] p-4 rounded-md flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>SEASONAL EXCLUSIVE</Badge>
            <h5 className="font-serif font-bold text-base text-[#2A1E17] group-hover:text-[#B88B38] transition-colors">
              Royal Oud & Smoked Vanilla
            </h5>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              Hand-poured 3-wick soy candle in custom frosted gold glass.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#E5D9C5]">
            <span className="text-xs font-bold text-[#2A1E17]">₹1,899.00</span>
            <Button variant="gold" size="sm" onClick={(e) => handleLinkClick(e, 'pdp')}>Explore Scent</Button>
          </div>
        </div>

        {/* Column 4: Scent Quiz Banner */}
        <div className="bg-gradient-to-br from-[#2A1E17] to-[#1C130E] text-[#FAF6F0] p-5 rounded-md flex flex-col justify-between shadow-card">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B88B38]">Not sure what you like?</span>
            <h5 className="font-serif font-bold text-lg text-[#FAF6F0]">Find Your Signature Scent</h5>
            <p className="text-xs text-[#E5D9C5] leading-relaxed">
              Take our 2-minute scent match quiz to discover personalized candle formulations.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-[#B88B38] text-[#B88B38] hover:bg-[#B88B38] hover:text-[#1C130E]"
            onClick={(e) => handleLinkClick(e, 'shop')}
          >
            Start Quiz →
          </Button>
        </div>
      </div>
    </div>
  );
};
