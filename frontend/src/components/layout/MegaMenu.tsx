import React, { useMemo } from 'react';
import { Button, Badge, SparklesIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenu: 'shop' | 'collections' | null;
  onNavigate?: (page: any) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, activeMenu, onNavigate }) => {
  const { collections, products, settings } = useCMS();

  if (!isOpen || !activeMenu) return null;

  const displayCollections = collections.map((col) => ({
    icon: col.icon || '✨',
    title: col.title.toUpperCase(),
    desc: col.desc || `Curated ${col.title} Collection`,
    hash: '#collections',
  }));

  // Dynamically compute real categories from live products
  const dynamicCategories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      const cat = (p.category || '').trim();
      if (cat) {
        counts.set(cat, (counts.get(cat) || 0) + 1);
      }
    });
    return Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [products]);

  // Dynamically compute real scent families
  const dynamicScents = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.scentProfile && p.scentProfile.trim()) set.add(p.scentProfile.trim());
    });
    return Array.from(set).slice(0, 5);
  }, [products]);

  const featuredProduct = products.find((p) => p.isFeatured) || products[0];

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
        className="absolute top-full left-1/4 -translate-x-1/4 w-80 bg-white border border-[#E5DAC7] rounded-2xl shadow-card z-50 animate-fade-in font-sans p-4 mt-2"
      >
        <div className="border-b border-[#F5EEE4] pb-2 mb-3 px-2 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5983A]">
            CURATED COLLECTIONS ({displayCollections.length})
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5983A] animate-pulse"></span>
        </div>

        {displayCollections.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#847262]">
            No collections created yet.
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto no-scrollbar space-y-1.5">
            {displayCollections.map((item, idx) => (
              <a
                key={idx}
                href={item.hash}
                onClick={(e) => handleLinkClick(e, 'collections')}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#F5EEE4] text-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-[#241812] group-hover:text-[#C5983A] transition-colors tracking-wide">
                    {item.title}
                  </h5>
                  <p className="text-[10px] text-[#847262] truncate font-light">
                    {item.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FAF7F2] border-b border-[#E5DAC7] shadow-hover z-40 animate-fade-in font-sans"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Primary Categories */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#C5983A] border-b border-[#E5DAC7] pb-2">
            Shop by Category
          </h4>
          {dynamicCategories.length === 0 ? (
            <p className="text-xs text-[#847262]">No categories created yet.</p>
          ) : (
            <ul className="space-y-2.5 text-xs text-[#241812]">
              {dynamicCategories.map((cat, idx) => (
                <li key={idx}>
                  <a
                    href="#shop"
                    onClick={(e) => handleLinkClick(e, 'shop')}
                    className="hover:text-[#C5983A] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="font-semibold">{cat.name}</span>
                    <span className="text-[10px] text-[#847262] group-hover:text-[#C5983A]">
                      {cat.count} items
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Column 2: Scent Profiles */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#C5983A] border-b border-[#E5DAC7] pb-2">
            Scent Profiles
          </h4>
          {dynamicScents.length === 0 ? (
            <p className="text-xs text-[#847262]">Add products in Admin to see scent notes.</p>
          ) : (
            <ul className="space-y-2.5 text-xs text-[#241812]">
              {dynamicScents.map((scent, idx) => (
                <li key={idx}>
                  <a
                    href="#shop"
                    onClick={(e) => handleLinkClick(e, 'shop')}
                    className="hover:text-[#C5983A] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#C5983A]"></span>
                    <span>{scent}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Column 3: Featured Product Card Banner */}
        {featuredProduct ? (
          <div className="bg-[#F5EEE4] border border-[#E5DAC7] p-4 rounded-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-2">
              <Badge variant="gold" icon={<SparklesIcon size={12} />}>
                {featuredProduct.isFeatured ? 'FEATURED ATELIER' : 'HANDCRAFTED CANDLE'}
              </Badge>
              <h5 className="font-serif font-bold text-base text-[#241812] group-hover:text-[#C5983A] transition-colors">
                {featuredProduct.name}
              </h5>
              <p className="text-xs text-[#5E4E42] leading-relaxed line-clamp-2">
                {featuredProduct.vesselDescription || featuredProduct.scentProfile}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#E5DAC7]">
              <span className="text-xs font-bold text-[#241812]">
                {settings.currencySymbol || '₹'}{Math.round(featuredProduct.price)}
              </span>
              <Button
                variant="gold"
                size="sm"
                onClick={(e) => {
                  try {
                    localStorage.setItem('tcl_selected_product', JSON.stringify(featuredProduct));
                  } catch {}
                  handleLinkClick(e, 'pdp');
                }}
              >
                Explore Scent →
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-[#F5EEE4] border border-[#E5DAC7] p-4 rounded-xl flex items-center justify-center text-xs text-[#847262] text-center">
            No featured product set yet.
          </div>
        )}

        {/* Column 4: Scent Quiz Banner */}
        <div className="bg-gradient-to-br from-[#241812] to-[#180F0A] text-[#FAF7F2] p-5 rounded-xl flex flex-col justify-between shadow-card">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5983A]">
              Live Atelier Studio
            </span>
            <h5 className="font-serif font-bold text-lg text-[#FAF7F2]">
              Find Your Signature Scent
            </h5>
            <p className="text-xs text-[#D6C7AF] leading-relaxed">
              Explore our small-batch candle formulations hand-poured with pure organic soy wax.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-[#C5983A] text-[#C5983A] hover:bg-[#C5983A] hover:text-[#241812]"
            onClick={(e) => handleLinkClick(e, 'shop')}
          >
            Browse All Candles
          </Button>
        </div>
      </div>
    </div>
  );
};
