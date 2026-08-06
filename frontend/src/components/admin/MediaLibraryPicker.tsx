import React from 'react';
import type { CMSMediaItem } from '../../context/CMSContext';
import { CheckIcon } from '../../design-system';

interface MediaLibraryPickerProps {
  mediaItems: CMSMediaItem[];
  selectedUrl?: string;
  onSelect: (url: string, name: string) => void;
}

export const MediaLibraryPicker: React.FC<MediaLibraryPickerProps> = ({
  mediaItems,
  selectedUrl,
  onSelect,
}) => {
  const images = mediaItems.filter((m) => m.type === 'image' || !m.type);

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E5D9C5] bg-[#FAF6F0]/80 px-4 py-3">
        <p className="text-sm text-[#7A6B5D]">
          No library images yet — upload below or add them in{' '}
          <span className="font-medium text-[#2C1E16]">Media Library</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#2C1E16]">From library</p>
        <span className="text-xs text-[#7A6B5D]">{images.length} available</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin snap-x snap-mandatory">
        {images.map((m) => {
          const isSelected = selectedUrl === m.url;
          return (
            <button
              key={m.id}
              type="button"
              title={m.name}
              onClick={() => onSelect(m.url, m.name)}
              className={`relative shrink-0 snap-start w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-xl overflow-hidden transition-all cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-[#B88B38] ring-offset-2 ring-offset-white scale-105'
                  : 'ring-1 ring-[#EFE8DB] hover:ring-[#B88B38]/50 hover:scale-[1.02]'
              }`}
            >
              <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
              {isSelected && (
                <span className="absolute inset-0 bg-[#B88B38]/25 flex items-center justify-center">
                  <span className="w-6 h-6 rounded-full bg-[#B88B38] text-white flex items-center justify-center shadow-sm">
                    <CheckIcon size={14} />
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
