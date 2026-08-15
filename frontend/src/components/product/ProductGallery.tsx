import React, { useState, useEffect } from 'react';

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
  const allImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80'];
  const [selectedImage, setSelectedImage] = useState<string>(variantImage || allImages[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // If variant image changes externally, update active image
  useEffect(() => {
    if (variantImage) {
      setSelectedImage(variantImage);
    }
  }, [variantImage]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Feature Image Container */}
      <div className="relative group rounded-3xl overflow-hidden bg-[#FFF6F8] border border-[#F5E8EE] aspect-square flex items-center justify-center shadow-xs">
        <img
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
          onClick={() => {
            const idx = allImages.indexOf(selectedImage);
            handleOpenLightbox(idx >= 0 ? idx : 0);
          }}
        />

        {/* Zoom Overlay Prompt */}
        <button
          type="button"
          onClick={() => {
            const idx = allImages.indexOf(selectedImage);
            handleOpenLightbox(idx >= 0 ? idx : 0);
          }}
          className="absolute bottom-4 right-4 bg-white/80 hover:bg-white backdrop-blur-sm text-[#1C1217] px-3 py-1.5 rounded-full text-xs font-sans font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-subtle border border-[#F5E8EE]"
        >
          <span>🔍</span>
          <span>Expand View</span>
        </button>
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="w-full max-w-full min-w-0 flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
          {allImages.map((img, idx) => {
            const isSelected = img === selectedImage;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                  isSelected ? 'border-[#E87A96] shadow-md scale-95' : 'border-[#F5E8EE] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${productName} thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#F9B8CA] text-2xl font-mono"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-xl"
          >
            ‹
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={allImages[lightboxIndex]}
              alt={`${productName} fullscreen`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            <p className="text-xs font-mono text-stone-200 mt-3">
              {lightboxIndex + 1} / {allImages.length}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-xl"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};
