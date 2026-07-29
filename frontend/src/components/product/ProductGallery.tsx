import React, { useState } from 'react';
import { Badge, SparklesIcon } from '../../design-system';

const galleryImages = [
  { id: 1, label: 'Front Vessel', src: '/hero_candle.png', isMain: true },
  { id: 2, label: 'Unboxing Packaging', src: '/hero_candle.png' },
  { id: 3, label: 'Wick Flame Glow', src: '/hero_candle.png' },
  { id: 4, label: 'Botanical Ingredients', src: '/hero_candle.png' },
];

export const ProductGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4 font-sans">
      {/* Main Hero Preview Stage */}
      <div className="relative w-full aspect-[4/5] bg-[#2A1E17] rounded-md overflow-hidden border border-[#D4AF37]/30 shadow-card group cursor-zoom-in">
        <img
          src={selectedImage.src}
          alt={selectedImage.label}
          onClick={() => setIsZoomed(!isZoomed)}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ${isZoomed ? 'scale-150' : 'group-hover:scale-105'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/60 via-transparent to-transparent pointer-events-none" />

        {/* View Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>{selectedImage.label}</Badge>
        </div>

        {/* Zoom Cue */}
        <div className="absolute bottom-4 right-4 bg-[#1C130E]/70 text-[#FAF6F0] px-3 py-1 rounded-full text-xs backdrop-blur-xs font-semibold">
          🔍 Click to Zoom
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-4 gap-3">
        {galleryImages.map((img) => (
          <button
            key={img.id}
            onClick={() => setSelectedImage(img)}
            className={`relative aspect-[4/5] rounded-xs bg-[#2A1E17] overflow-hidden border-2 transition-all ${selectedImage.id === img.id ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 shadow-goldGlow' : 'border-[#E5D9C5] opacity-70 hover:opacity-100'}`}
          >
            <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
            <span className="absolute bottom-1 left-1 right-1 text-[9px] bg-[#1C130E]/80 text-[#FAF6F0] truncate px-1 py-0.5 rounded-xs text-center font-semibold">
              {img.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
