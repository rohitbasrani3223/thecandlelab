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
      <div className="relative group rounded-2xl overflow-hidden bg-[#140D09] border border-[#2C2018] aspect-square flex items-center justify-center">
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
          className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-stone-200 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span>🔍</span>
          <span>Expand View</span>
        </button>
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800">
          {allImages.map((img, idx) => {
            const isSelected = img === selectedImage;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  isSelected ? 'border-amber-500 shadow-md scale-95' : 'border-[#2C2018] opacity-70 hover:opacity-100'
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
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-stone-400 hover:text-stone-100 text-2xl font-mono"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-200 flex items-center justify-center text-xl"
          >
            ‹
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={allImages[lightboxIndex]}
              alt={`${productName} fullscreen`}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-stone-800"
            />
            <p className="text-xs font-mono text-stone-400 mt-3">
              {lightboxIndex + 1} / {allImages.length}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-200 flex items-center justify-center text-xl"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};
