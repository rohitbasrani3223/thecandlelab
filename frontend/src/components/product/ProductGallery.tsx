import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Keyboard navigation when Lightbox is open or gallery is focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'ArrowRight') handleNext();
        else if (e.key === 'ArrowLeft') handlePrev();
        else if (e.key === 'Escape') setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
        className="relative group rounded-3xl overflow-hidden bg-[#FFF6F8] border border-[#F5E8EE] aspect-square flex items-center justify-center shadow-card touch-pan-y"
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
              className="min-w-full h-full relative shrink-0 aspect-square flex items-center justify-center bg-[#FAF6F8]"
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
          <div className="absolute top-4 right-4 bg-[#1C1217]/60 hover:bg-[#1C1217]/80 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-full font-bold z-20 pointer-events-none transition-all shadow-subtle border border-white/10">
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
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1C1217] shadow-card backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-[#F5E8EE]"
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1C1217] shadow-card backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-[#F5E8EE]"
          >
            <ChevronRightIcon size={20} />
          </button>
        )}

        {/* Bottom Center Indicator Dots / Pills */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-[#1C1217]/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-xs">
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
                    ? 'w-6 h-1.5 bg-[#E87A96] shadow-xs'
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
          className="absolute bottom-3.5 right-3.5 bg-white/90 hover:bg-white backdrop-blur-md text-[#1C1217] px-3 py-1.5 rounded-full text-xs font-sans font-bold flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-all shadow-subtle border border-[#F5E8EE] z-20 cursor-pointer hover:scale-105"
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
                    ? 'border-[#E87A96] ring-2 ring-[#F9B8CA] shadow-md scale-100 opacity-100'
                    : 'border-[#F5E8EE] opacity-60 hover:opacity-100 hover:scale-95'
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

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-between p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white z-10">
            <span className="text-xs font-mono tracking-wider text-stone-300">
              {productName} • {currentIndex + 1} of {allImages.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Central Image with Prev / Next Navigation */}
          <div
            className="relative flex-1 flex items-center justify-center w-full max-w-5xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-2xl transition-all z-20 cursor-pointer backdrop-blur-md shadow-lg"
              >
                ‹
              </button>
            )}

            <img
              src={allImages[currentIndex]}
              alt={`${productName} fullscreen`}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/15 select-none"
            />

            {allImages.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-2xl transition-all z-20 cursor-pointer backdrop-blur-md shadow-lg"
              >
                ›
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Bar */}
          {allImages.length > 1 && (
            <div
              className="flex items-center gap-2 overflow-x-auto max-w-full py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'border-[#E87A96] scale-105 ring-2 ring-[#E87A96]/50'
                      : 'border-white/20 opacity-50 hover:opacity-90'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
