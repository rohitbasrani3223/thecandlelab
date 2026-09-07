import React, { useMemo } from 'react';
import { Button, Badge, SparklesIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenu: 'shop' | 'collections' | null;
  onNavigate?: (page: any, param?: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, activeMenu, onNavigate }) => {
  const { collections, products, settings, mainCategories } = useCMS();

  // Dynamically compute real categories from live mainCategories and products
  const dynamicCategories = useMemo(() => {
    const list: { id: string; name: string; count: number }[] = [];
    const seen = new Set<string>();
    const normalize = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    (mainCategories || []).forEach((c) => {
      const clean = c.name.trim();
      const norm = normalize(clean);
      if (clean && !seen.has(norm)) {
        seen.add(norm);
        const count = products.filter((p) => {
          const pNorm = normalize(p.category || '');
          const pId = String(p.mainCategoryId || '').toLowerCase().trim();
          return (pId && pId === c.id.toLowerCase()) || (pNorm && pNorm === norm);
        }).length;
        list.push({ id: c.id, name: clean, count });
      }
    });

    products.forEach((p) => {
      const clean = (p.category || '').trim();
      const norm = normalize(clean);
      if (clean && !seen.has(norm)) {
        seen.add(norm);
        const count = products.filter((prod) => normalize(prod.category || '') === norm).length;
        list.push({ id: clean, name: clean, count });
      }
    });

    return list;
  }, [mainCategories, products]);

  // Dynamically compute real scent families
  const dynamicScents = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.scentProfile && p.scentProfile.trim()) set.add(p.scentProfile.trim());
    });
    return Array.from(set).slice(0, 5);
  }, [products]);

  if (!isOpen || !activeMenu) return null;

  const displayCollections = collections.map((col) => ({
    icon: col.icon || '✨',
    title: col.title.toUpperCase(),
    desc: col.desc || `Curated ${col.title} Collection`,
    hash: '#collections',
  }));

  const featuredProduct = products.find((p) => p.isFeatured) || products[0];

  const handleLinkClick = (e: React.MouseEvent, pageTarget: string = 'collections', param?: string) => {
    e.preventDefault();
    onClose();
    if (onNavigate) {
      onNavigate(pageTarget, param);
    } else {
      window.location.hash = param
        ? `#${pageTarget}?category=${encodeURIComponent(param)}`
        : `#${pageTarget}`;
    }
  };

  if (activeMenu === 'collections') {
    return (
      <div
        onMouseLeave={onClose}
        className="absolute top-full left-0 w-full bg-[#FFFFFF] border-b border-[#EADDCB] shadow-hover z-40 animate-fade-in font-sans"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Featured Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#8B6F4E] border-b border-[#EADDCB] pb-2">
              Signature Curations
            </h4>
            <ul className="space-y-2 text-xs text-[#232323]">
              {displayCollections.map((col, idx) => (
                <li key={idx}>
                  <a
                    href="#collections"
                    onClick={(e) => handleLinkClick(e, 'collections', col.title)}
                    className="hover:text-[#8B6F4E] transition-colors flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="text-sm">{col.icon}</span>
                    <span className="font-semibold">{col.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Spotlight Collection */}
          <div className="md:col-span-2 bg-[#FAF7F2] p-6 rounded-2xl border border-[#EADDCB] flex flex-col justify-between">
            <div className="space-y-2">
              <Badge variant="gold">Editor's Curation</Badge>
              <h3 className="font-serif text-lg font-bold text-[#232323]">
                {collections[0]?.title || 'The Heritage Royal Atelier'}
              </h3>
              <p className="text-xs text-[#5C5149] line-clamp-2">
                {collections[0]?.desc || 'Hand-poured bespoke soy creations formulated with rare organic aromatics.'}
              </p>
            </div>
            <div className="pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e: React.MouseEvent) => handleLinkClick(e, 'collections', collections[0]?.title)}
                className="text-xs"
              >
                Explore Collection
              </Button>
            </div>
          </div>

          {/* Column 3: Quick Action */}
          <div className="bg-[#8B6F4E] text-white p-6 rounded-2xl flex flex-col justify-between shadow-card">
            <div className="space-y-2">
              <SparklesIcon size={24} className="text-[#FAF7F2]" />
              <h4 className="font-serif font-bold text-base">Custom Bespoke Atelier</h4>
              <p className="text-xs text-[#FAF7F2]/80">
                Craft your bespoke signature fragrance vessel tailored for your sanctuary.
              </p>
            </div>
            <div className="pt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={(e: React.MouseEvent) => handleLinkClick(e, 'shop')}
                className="w-full text-xs"
              >
                Bespoke Studio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FFFFFF] border-b border-[#EADDCB] shadow-hover z-40 animate-fade-in font-sans"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Primary Categories */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#8B6F4E] border-b border-[#EADDCB] pb-2">
            Shop by Category
          </h4>
          {dynamicCategories.length === 0 ? (
            <p className="text-xs text-[#7D6F63]">No categories created yet.</p>
          ) : (
            <ul className="space-y-2.5 text-xs text-[#232323]">
              {dynamicCategories.map((cat, idx) => (
                <li key={idx}>
                  <a
                    href={`#shop?category=${encodeURIComponent(cat.name)}`}
                    onClick={(e) => handleLinkClick(e, 'shop', cat.name)}
                    className="hover:text-[#8B6F4E] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="font-semibold">{cat.name}</span>
                    <span className="text-[10px] text-[#7D6F63] group-hover:text-[#8B6F4E]">
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
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#8B6F4E] border-b border-[#EADDCB] pb-2">
            Scent Profiles
          </h4>
          {dynamicScents.length === 0 ? (
            <p className="text-xs text-[#7D6F63]">Add products in Admin to see scent notes.</p>
          ) : (
            <ul className="space-y-2.5 text-xs text-[#232323]">
              {dynamicScents.map((scent, idx) => (
                <li key={idx}>
                  <a
                    href="#shop"
                    onClick={(e) => handleLinkClick(e, 'shop')}
                    className="hover:text-[#8B6F4E] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#8B6F4E]"></span>
                    <span>{scent}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Column 3: Featured Product Card Banner */}
        {featuredProduct ? (
          <div className="bg-[#FAF7F2] border border-[#EADDCB] p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-xs">
            <div className="space-y-2">
              <Badge variant="pink" icon={<SparklesIcon size={12} />}>
                {featuredProduct.isFeatured ? 'FEATURED ATELIER' : 'HANDCRAFTED CANDLE'}
              </Badge>
              <h5 className="font-serif font-bold text-base text-[#232323] group-hover:text-[#8B6F4E] transition-colors">
                {featuredProduct.name}
              </h5>
              <p className="text-xs text-[#5C5149] leading-relaxed line-clamp-2">
                {featuredProduct.vesselDescription || featuredProduct.scentProfile}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#EADDCB]">
              <span className="text-xs font-bold text-[#232323]">
                {settings.currencySymbol || '₹'}{Math.round(featuredProduct.price)}
              </span>
              <Button
                variant="pink"
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
          <div className="bg-[#FAF7F2] border border-[#EADDCB] p-4 rounded-2xl flex items-center justify-center text-xs text-[#7D6F63] text-center">
            No featured product set yet.
          </div>
        )}

        {/* Column 4: Scent Quiz Banner */}
        <div className="bg-gradient-to-br from-[#232323] to-[#2C1D25] text-[#FFFFFF] p-5 rounded-2xl flex flex-col justify-between shadow-card border border-[#EADDCB]/20">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#EADDCB]">
              Live Atelier Studio
            </span>
            <h5 className="font-serif font-bold text-lg text-[#FFFFFF]">
              Find Your Signature Scent
            </h5>
            <p className="text-xs text-[#FCD5E2] leading-relaxed">
              Explore our small-batch candle formulations hand-poured with pure organic soy wax.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-[#EADDCB] text-[#EADDCB] hover:bg-[#EADDCB] hover:text-[#232323]"
            onClick={(e) => handleLinkClick(e, 'shop')}
          >
            Browse All Candles
          </Button>
        </div>
      </div>
    </div>
  );
};
