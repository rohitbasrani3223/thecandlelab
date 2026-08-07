import React, { useState, useEffect } from 'react';
import { Badge, SparklesIcon } from '../../design-system';

export interface ProductGalleryProps {
  mainImage?: string;
  images?: string[]; // Extra product images from DB
  productName?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ mainImage, images, productName }) => {
  const buildGallery = () => {
    const all: { id: number; label: string; src: string }[] = [];

    if (mainImage) {
      all.push({ id: 1, label: 'Main View', src: mainImage });
    }

    if (images && images.length > 0) {
      images.forEach((img, idx) => {
        if (img && img !== mainImage) {
          all.push({ id: idx + 10, label: `Angle ${idx + 2}`, src: img });
        }
      });
    }

    if (all.length === 0) {
      all.push({
        id: 1,
        label: 'Main View',
        src: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1000&auto=format&fit=crop&q=80',
      });
    }

    return all;
  };

  const galleryImages = buildGallery();
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  // Sync selected image when mainImage prop changes (e.g. after Admin update)
  useEffect(() => {
    if (mainImage) {
      setSelectedImage({ id: 1, label: 'Main View', src: mainImage });
    }
  }, [mainImage]);

  const activeSrc = selectedImage?.src || mainImage || galleryImages[0]?.src;

  return (
    <div className="space-y-4 font-sans">
      {/* Main Hero Preview Container with Luxury Sizing */}
      <div className="relative w-full max-h-[460px] sm:max-h-[500px] h-[460px] bg-[#FAF6F0] rounded-2xl overflow-hidden border border-[#E5D9C5] shadow-md flex items-center justify-center group cursor-zoom-in">
        <img
          src={activeSrc}
          alt={productName || 'Luxury Candle'}
          onClick={() => setIsZoomed(!isZoomed)}
          className={`w-full h-full object-contain p-3 rounded-2xl transition-transform duration-500 ${
            isZoomed ? 'scale-150 object-cover' : 'group-hover:scale-105'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A1E17]/20 via-transparent to-transparent pointer-events-none rounded-2xl" />

        {/* View Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>
            {selectedImage?.label || 'ATELIER VIEW'}
          </Badge>
        </div>

        {/* Zoom Cue */}
        <div className="absolute bottom-4 right-4 bg-[#2A1E17]/80 text-[#FAF6F0] px-3 py-1.5 rounded-full text-xs backdrop-blur-md font-semibold tracking-wide border border-[#D4AF37]/30">
          🔍 Click to {isZoomed ? 'Reset' : 'Zoom'}
        </div>
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {galleryImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 h-20 shrink-0 rounded-xl bg-[#FAF6F0] overflow-hidden border-2 transition-all cursor-pointer ${
                selectedImage.id === img.id
                  ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 shadow-sm scale-105'
                  : 'border-[#E5D9C5] opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {galleryImages.length === 1 && (
        <p className="text-center text-xs text-[#8C7A6B] italic font-serif">Hand-poured in artisanal luxury glass</p>
      )}
    </div>
  );
};
