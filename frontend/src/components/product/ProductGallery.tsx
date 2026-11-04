import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '../../design-system';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  variantImage?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  variantImage,
}) => {
  const allImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80'];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Touch and drag swipe state
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const mouseStartXRef = useRef<number | null>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  // Sync index if variant image changes externally
  useEffect(() => {
    if (variantImage) {
      const idx = allImages.indexOf(variantImage);
      if (idx >= 0) {
        setCurrentIndex(idx);
      }
    }
  }, [variantImage, allImages]);

  // Keep index within bounds if images array changes
  useEffect(() => {
    if (currentIndex >= allImages.length) {
      setCurrentIndex(0);
    }
  }, [allImages.length, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const handleSelectIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Lock background scroll and enable keyboard navigation when Lightbox is open
  useEffect(() => {
    if (!isLightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, handleNext, handlePrev]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const threshold = 40; // minimum swipe distance in pixels

    if (diff > threshold) {
      // Swiped Left -> Next Image
      handleNext();
    } else if (diff < -threshold) {
      // Swiped Right -> Prev Image
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Mouse drag handlers for desktop swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    mouseStartXRef.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || mouseStartXRef.current === null) return;
    const diff = mouseStartXRef.current - e.clientX;
    const threshold = 50;

    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }

    isDraggingRef.current = false;
    mouseStartXRef.current = null;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    mouseStartXRef.current = null;
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Sliding Carousel Viewport */}
      <div
        className="relative group rounded-3xl overflow-hidden bg-[#FAF7F2] border border-[#EADDCB] aspect-square flex items-center justify-center shadow-card touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Sliding Images Track */}
        <div
          className="flex w-full h-full transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {allImages.map((img, idx) => (
            <div
              key={idx}
              className="min-w-full h-full relative shrink-0 aspect-square flex items-center justify-center bg-[#F8F6F0]"
            >
              <img
                src={img}
                alt={`${productName} view ${idx + 1}`}
                className="w-full h-full object-cover select-none pointer-events-auto cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
                draggable={false}
                onClick={() => setIsLightboxOpen(true)}
              />
            </div>
          ))}
        </div>

        {/* Counter Badge (e.g. 1 / 4) */}
        {allImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-[#232323]/60 hover:bg-[#232323]/80 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-full font-bold z-20 pointer-events-none transition-all shadow-subtle border border-white/10">
            {currentIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Left Navigation Arrow (Previous) */}
        {allImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#232323] shadow-card backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-[#EADDCB]"
          >
            <ChevronLeftIcon size={20} />
          </button>
        )}

        {/* Right Navigation Arrow (Next) */}
        {allImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#232323] shadow-card backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-[#EADDCB]"
          >
            <ChevronRightIcon size={20} />
          </button>
        )}

        {/* Bottom Center Indicator Dots / Pills */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-[#232323]/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-xs">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-1.5 bg-[#8B6F4E] shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}

        {/* Zoom / Fullscreen Lightbox Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-3.5 right-3.5 bg-white/90 hover:bg-white backdrop-blur-md text-[#232323] px-3 py-1.5 rounded-full text-xs font-sans font-bold flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-all shadow-subtle border border-[#EADDCB] z-20 cursor-pointer hover:scale-105"
        >
          <span>🔍</span>
          <span className="hidden sm:inline">Expand View</span>
        </button>
      </div>

      {/* Thumbnails Row with Active State and Scrolling */}
      {allImages.length > 1 && (
        <div
          ref={thumbnailScrollRef}
          className="w-full max-w-full min-w-0 flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0"
        >
          {allImages.map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectIndex(idx)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#8B6F4E] ring-2 ring-[#EADDCB] shadow-md scale-100 opacity-100'
                    : 'border-[#EADDCB] opacity-60 hover:opacity-100 hover:scale-95'
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal (Portaled directly to document.body to avoid stacking context overlaps) */}
      {isLightboxOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-[#0A0A0A]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 select-none animate-fadeIn font-sans"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar with Product Name, Index Counter, and Prominent Close Button */}
          <div
            className="w-full flex items-center justify-between text-white z-20 max-w-7xl mx-auto pt-1 sm:pt-2 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-serif font-bold text-sm sm:text-base text-stone-100 tracking-wide drop-shadow-md truncate max-w-[200px] sm:max-w-md">
                {productName}
              </span>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/10 text-stone-200 border border-white/15 backdrop-blur-md shrink-0">
                {currentIndex + 1} / {allImages.length}
              </span>
            </div>

            {/* Prominent High-Contrast Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen view"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#1C130E] flex items-center justify-center text-lg font-bold transition-all duration-200 cursor-pointer backdrop-blur-md shadow-2xl border border-white/25 hover:scale-105 active:scale-95"
            >
              ✕
            </button>
          </div>

          {/* Central Image with Prev / Next Navigation */}
          <div
            className="relative flex-1 flex items-center justify-center w-full max-w-6xl mx-auto my-auto px-2 sm:px-12"
            onClick={(e) => e.stopPropagation()}
          >
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-200 z-30 cursor-pointer backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-95"
              >
                <ChevronLeftIcon size={24} />
              </button>
            )}

            <img
              src={allImages[currentIndex]}
              alt={`${productName} fullscreen ${currentIndex + 1}`}
              className="max-w-full max-h-[72vh] sm:max-h-[76vh] object-contain rounded-2xl shadow-2xl border border-white/15 select-none"
            />

            {allImages.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-200 z-30 cursor-pointer backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-95"
              >
                <ChevronRightIcon size={24} />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Bar */}
          {allImages.length > 1 && (
            <div
              className="flex flex-col items-center gap-2 max-w-full py-2 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 overflow-x-auto max-w-full px-4 py-1 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectIndex(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-200 cursor-pointer ${
                      idx === currentIndex
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/60 scale-105 opacity-100 shadow-goldGlow'
                        : 'border-white/20 opacity-50 hover:opacity-90 hover:scale-95'
                    }`}
                  >
                    <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono text-stone-400">
                Use ← → arrows to navigate • Esc or click outside to close
              </span>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
