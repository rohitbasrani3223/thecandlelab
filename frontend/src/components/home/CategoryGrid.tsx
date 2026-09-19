import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface CategoryGridProps {
  onNavigateToShop?: (categoryId?: string) => void;
  onSelectProduct?: (product: any) => void;
}

interface LiveCategoryCard {
  id: string;
  rawId?: string;
  name: string;
  subtitle: string;
  count: number;
  image: string;
  tag: string;
  price?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onNavigateToShop,
  onSelectProduct: _onSelectProduct,
}) => {
  const { products, mainCategories, settings } = useCMS();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag-to-scroll state for desktop & smooth interaction
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStartX, setScrollStartX] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Helper to match live products for a given category
  const getMatchingProducts = (name: string, id: string) => {
    if (!products || products.length === 0) return [];
    const nameLower = name.toLowerCase().trim();
    const curId = String(id).trim();

    return products.filter((p) => {
      const pCat = (p.category || '').toLowerCase().trim();
      if (p.mainCategoryId && String(p.mainCategoryId) === curId) return true;
      if (pCat === nameLower) return true;

      const pCatClean = pCat.replace(/[^a-z0-9]/g, '');
      const nameClean = nameLower.replace(/[^a-z0-9]/g, '');
      if (pCatClean && nameClean && pCatClean === nameClean) return true;

      return false;
    });
  };

  // ONLY real LIVE Categories with products
  const liveCategories = useMemo<LiveCategoryCard[]>(() => {
    if (mainCategories && mainCategories.length > 0) {
      return mainCategories
        .filter((c) => c.isActive !== false)
        .map((cat) => {
          const cleanName = cat.name.trim();
          const matching = getMatchingProducts(cleanName, cat.id);
          const count = matching.length;
          // Pick live product image if category image is not explicitly set
          const fallbackProductImg = matching.find((p) => p.image || p.imageUrl);
          const image =
            cat.imageUrl ||
            cat.bannerDesktop ||
            fallbackProductImg?.image ||
            fallbackProductImg?.imageUrl ||
            '/hero_candle.png';

          return {
            id: `cat:${cleanName}`,
            rawId: cat.id,
            name: cleanName,
            subtitle: cat.description || `${count} hand-poured formulation${count === 1 ? '' : 's'}`,
            count,
            price: `From ${settings.currencySymbol || '₹'}999`,
            image,
            tag: cleanName.toLowerCase().includes('bestseller') ? 'Bestseller' : 'Category',
          };
        })
        .filter((c) => c.count > 0);
    }

    // Fallback if mainCategories table isn't populated: derive strictly from live products
    if (products && products.length > 0) {
      const uniqueCats = Array.from(
        new Set(products.map((p) => (p.category || '').trim()).filter(Boolean))
      );
      return uniqueCats
        .map((catName) => {
          const matching = getMatchingProducts(catName, catName);
          const count = matching.length;
          const fallbackProductImg = matching.find((p) => p.image || p.imageUrl);
          const image = fallbackProductImg?.image || fallbackProductImg?.imageUrl || '/hero_candle.png';

          return {
            id: `cat:${catName}`,
            name: catName,
            subtitle: `${count} hand-poured formulation${count === 1 ? '' : 's'}`,
            count,
            price: `From ${settings.currencySymbol || '₹'}999`,
            image,
            tag: 'Category',
          };
        })
        .filter((c) => c.count > 0);
    }

    return [];
  }, [mainCategories, products, settings.currencySymbol]);

  // Chunk categories into sets of 4 (so 4 categories are visible per slide responsively)
  const categoryPages = useMemo<LiveCategoryCard[][]>(() => {
    const pages: LiveCategoryCard[][] = [];
    const pageSize = 4;
    for (let i = 0; i < liveCategories.length; i += pageSize) {
      pages.push(liveCategories.slice(i, i + pageSize));
    }
    return pages;
  }, [liveCategories]);

  // Update scroll boundaries & active dot indicator
  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Calculate active slide / page index
    const pageIndex = Math.round(scrollLeft / (clientWidth || 1));
    setActiveIndex(Math.max(0, Math.min(categoryPages.length - 1, pageIndex)));
  }, [categoryPages.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // Scroll smoothly by 1 full page (4 items)
  const handleScroll = (direction: 'left' | 'right') => {
    const el = sliderRef.current;
    if (!el) return;

    const pageWidth = el.clientWidth;
    el.scrollBy({
      left: direction === 'left' ? -pageWidth : pageWidth,
      behavior: 'smooth',
    });
  };

  // Scroll to a specific page index from dots
  const handleScrollToIndex = (index: number) => {
    const el = sliderRef.current;
    if (!el) return;

    const targetLeft = index * el.clientWidth;
    el.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollStartX(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 8) {
      setHasDragged(true);
    }
    sliderRef.current.scrollLeft = scrollStartX - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Do not render empty section if no categories exist
  if (liveCategories.length === 0) {
    return null;
  }

  const handleOpenCategory = (item: LiveCategoryCard) => {
    // If user was dragging, ignore accidental click
    if (hasDragged) return;

    const cleanCategoryName = item.name.trim();
    if (onNavigateToShop) {
      onNavigateToShop(cleanCategoryName);
    } else {
      window.location.hash = `#shop?category=${encodeURIComponent(cleanCategoryName)}`;
    }
  };

  return (
    <section id="categories" className="py-14 sm:py-20 lg:py-24 bg-[#FAF7F2] border-b border-[#EADDCB] font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-10">
        
        {/* Section Header with Responsive Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EADDCB]/60 pb-5">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EADDCB] shadow-xs">
              <SparklesIcon size={12} className="text-[#B88B38]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#7D6F63] font-bold">
                Live Atelier Catalog • {liveCategories.length} Categories • 4 Per View
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#232323] tracking-tight">
                Shop by Category
              </h2>

              {/* Mobile controls next to heading */}
              <div className="flex sm:hidden items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous categories"
                  className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#EADDCB] text-[#232323] flex items-center justify-center hover:border-[#B88B38] hover:text-[#B88B38] transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-xs"
                >
                  <ChevronLeftIcon size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Next categories"
                  className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#EADDCB] text-[#232323] flex items-center justify-center hover:border-[#B88B38] hover:text-[#B88B38] transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-xs"
                >
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5C5149] leading-relaxed">
              Explore our artisanal hand-poured soy formulations, therapeutic botanical notes, and bespoke luxury gift ateliers.
            </p>
          </div>

          {/* Slider Controls in Header for Desktop & Tablet */}
          <div className="hidden sm:flex items-center gap-3 self-end flex-shrink-0">
            <span className="text-[11px] uppercase tracking-widest text-[#8B6F4E] font-bold">
              Slide 4 by 4
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous categories"
                className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#EADDCB] text-[#232323] flex items-center justify-center hover:border-[#B88B38] hover:text-[#B88B38] hover:shadow-card transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-xs"
              >
                <ChevronLeftIcon size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Next categories"
                className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#EADDCB] text-[#232323] flex items-center justify-center hover:border-[#B88B38] hover:text-[#B88B38] hover:shadow-card transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-xs"
              >
                <ChevronRightIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Responsive 4-Category Sliding Carousel */}
        <div className="relative group/carousel">
          {/* Floating Left Arrow (Desktop / Tablet) */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="hidden lg:flex absolute -left-5 xl:-left-7 top-[90px] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-[#EADDCB] text-[#232323] items-center justify-center shadow-[0_4px_16px_rgba(28,19,14,0.12)] hover:border-[#B88B38] hover:text-[#B88B38] hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeftIcon size={20} />
          </button>

          {/* Floating Right Arrow (Desktop / Tablet) */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="hidden lg:flex absolute -right-5 xl:-right-7 top-[90px] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-[#EADDCB] text-[#232323] items-center justify-center shadow-[0_4px_16px_rgba(28,19,14,0.12)] hover:border-[#B88B38] hover:text-[#B88B38] hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronRightIcon size={20} />
          </button>

          {/* Horizontal Track: Slides page-by-page with 4 items per page */}
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 pt-2 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {categoryPages.map((page, pageIdx) => (
              <div
                key={pageIdx}
                className="w-full flex-shrink-0 snap-start snap-always px-1"
              >
                {/* 
                  Responsive 4-Item Grid:
                  - Mobile: 2x2 grid (2 columns, 2 rows = 4 categories visible at a time, spacious and un-squeezed!)
                  - Desktop/Tablet (md+): 4x1 grid (4 categories side-by-side in 1 single horizontal row)
                */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-6 sm:gap-y-10 justify-items-center">
                  {page.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenCategory(item)}
                      className="group flex flex-col items-center cursor-pointer text-center select-none w-full max-w-[200px] sm:max-w-none"
                    >
                      {/* Concentric Circular Image Frame with Luxury Gold Bezel */}
                      <div className="relative w-28 h-28 min-[380px]:w-32 min-[380px]:h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 mx-auto">
                        {/* Outer Ring with Champagne Gold Gradient on Hover */}
                        <div className="w-full h-full rounded-full p-1.5 sm:p-2 bg-gradient-to-b from-[#EADDCB] via-[#FFFFFF] to-[#EADDCB] border border-[#EADDCB]/80 group-hover:from-[#B88B38] group-hover:via-[#E5C378] group-hover:to-[#8B6F4E] shadow-[0_6px_20px_rgba(28,19,14,0.06)] group-hover:shadow-[0_16px_36px_rgba(184,139,56,0.28)] group-hover:-translate-y-1.5 transition-all duration-500 ease-out">
                          {/* Inner Masked Circle */}
                          <div className="w-full h-full rounded-full overflow-hidden relative bg-[#F8F6F0] ring-1 ring-black/5">
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              draggable={false}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/hero_candle.png';
                              }}
                              className="w-full h-full object-cover object-center group-hover:scale-115 transition-transform duration-700 ease-out pointer-events-none"
                            />

                            {/* Subtle Dark Gradient Vignette for Depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500" />

                            {/* Subtle Bottom Badge / Count Pill */}
                            {item.count > 0 && (
                              <div className="absolute bottom-1.5 sm:bottom-2 inset-x-0 flex justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                                <span className="bg-[#1C130E]/85 backdrop-blur-xs text-[#FAF7F2] text-[8px] sm:text-[9px] md:text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/20 shadow-xs">
                                  {item.count} {item.count === 1 ? 'Item' : 'Items'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Corner Mini Tag Badge */}
                        {item.tag && (
                          <div className="absolute top-0 right-0 z-10">
                            <span className="bg-[#FFFFFF]/95 backdrop-blur-xs text-[#8B6F4E] text-[7.5px] sm:text-[8.5px] md:text-[9px] font-extrabold uppercase px-1.5 sm:px-2 py-0.5 rounded-full border border-[#EADDCB] shadow-xs group-hover:border-[#B88B38] transition-colors">
                              {item.tag}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Typography Details Below Circle */}
                      <div className="mt-3 sm:mt-4 space-y-1 w-full px-1">
                        <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-[#232323] group-hover:text-[#8B6F4E] transition-colors line-clamp-2 leading-snug">
                          {item.name}
                        </h3>

                        {item.subtitle && (
                          <p className="text-[10px] sm:text-xs text-[#7D6F63] font-medium line-clamp-1">
                            {item.subtitle}
                          </p>
                        )}

                        {/* Subtle Hover Action Link */}
                        <div className="pt-0.5 flex items-center justify-center">
                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#8B6F4E] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">
                            <span>Explore</span>
                            <ChevronRightIcon size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicator Dots (Mobile & Desktop) */}
          <div className="flex items-center justify-center gap-2 pt-4 sm:pt-6">
            {categoryPages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleScrollToIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? 'w-6 bg-[#B88B38]'
                    : 'w-2 bg-[#EADDCB] hover:bg-[#8B6F4E]/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All Categories Bottom CTA */}
        <div className="text-center pt-2 sm:pt-4 border-t border-[#EADDCB]/60">
          <button
            type="button"
            onClick={() => {
              if (onNavigateToShop) {
                onNavigateToShop();
              } else {
                window.location.hash = '#shop';
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#FFFFFF] text-[#232323] border border-[#EADDCB] hover:border-[#8B6F4E] hover:text-[#8B6F4E] hover:shadow-card transition-all cursor-pointer group"
          >
            <span>Browse Complete Atelier Catalogue</span>
            <ChevronRightIcon size={14} className="group-hover:translate-x-1 transition-transform text-[#8B6F4E]" />
          </button>
        </div>
      </div>
    </section>
  );
};

