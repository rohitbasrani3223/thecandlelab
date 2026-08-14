import React, { useState, useRef } from 'react';
import { uploadImageToSupabaseStorage } from '../../config/supabaseClient';
import { useCMS } from '../../context/CMSContext';

export interface AdminGalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export const AdminGalleryUploader: React.FC<AdminGalleryUploaderProps> = ({
  images = [],
  onChange,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const multiFileInputRef = useRef<HTMLInputElement | null>(null);
  const { registerMediaAsset } = useCMS();

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setErrorMsg('Please select valid image files (PNG, JPG, WEBP).');
      return;
    }

    setErrorMsg('');
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const f = validFiles[i];
      setUploadProgress(`Uploading ${i + 1} of ${validFiles.length}...`);
      try {
        const publicUrl = await uploadImageToSupabaseStorage(f, 'product-images');
        if (publicUrl) {
          uploadedUrls.push(publicUrl);
          if (registerMediaAsset) {
            registerMediaAsset(f.name.replace(/\.[^/.]+$/, ''), publicUrl);
          }
        }
      } catch (err) {
        console.warn('File upload failed:', f.name, err);
      }
    }

    setIsUploading(false);
    setUploadProgress('');

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    } else {
      setErrorMsg('Failed to upload selected images. Please check connection.');
    }

    if (multiFileInputRef.current) {
      multiFileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!inputUrl.trim()) return;
    onChange([...images, inputUrl.trim()]);
    if (registerMediaAsset) {
      registerMediaAsset('Product Gallery Image', inputUrl.trim());
    }
    setInputUrl('');
  };

  const handleRemove = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    onChange(next);
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase text-amber-400">
          Product Images & Gallery ({images.length} Images)
        </h4>
        <span className="text-[10px] text-stone-500">First image will be the primary cover</span>
      </div>

      {/* Hidden Multi-file input */}
      <input
        ref={multiFileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg,image/svg+xml"
        onChange={handleMultipleFiles}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Action Buttons: Device Upload & Web URL */}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => multiFileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>{uploadProgress || 'Uploading...'}</span>
              </>
            ) : (
              <>
                <span>📁</span>
                <span>Upload Images from Device (Multi-Select)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-3 py-2 rounded-lg bg-[#251A13] hover:bg-[#2C2018] border border-[#2C2018] text-stone-300 hover:text-amber-300 text-xs font-medium transition-colors cursor-pointer"
          >
            {showUrlInput ? '− Hide URL Input' : '+ Add Image URL'}
          </button>
        </div>
      )}

      {/* URL Input Form */}
      {showUrlInput && !disabled && (
        <div className="flex gap-2 p-3 rounded-lg bg-[#140D09] border border-[#2C2018]">
          <input
            type="url"
            placeholder="Paste direct image link (https://...)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            className="flex-1 bg-[#1C130E] border border-[#2C2018] rounded-lg px-3 py-1.5 text-xs text-[#FDFBF7] focus:border-amber-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-1.5 bg-[#251A13] hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-xs rounded-lg transition-colors font-medium cursor-pointer"
          >
            + Add to Gallery
          </button>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-red-400 font-mono">⚠️ {errorMsg}</p>
      )}

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div
          onClick={() => {
            if (!disabled && !isUploading) {
              multiFileInputRef.current?.click();
            }
          }}
          className="border-2 border-dashed border-[#2C2018] hover:border-amber-500/40 bg-[#140D09] rounded-xl p-8 text-center cursor-pointer transition-all"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-3xl">🖼️</span>
            <p className="text-xs text-stone-300 font-medium">No Images Uploaded Yet</p>
            <p className="text-[10px] text-stone-500">Click to upload product photos from your device</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden border border-[#2C2018] aspect-square bg-[#140D09]"
            >
              <img
                src={img}
                alt={`Product Gallery ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80';
                }}
              />

              {idx === 0 ? (
                <span className="absolute top-1.5 left-1.5 bg-amber-500 text-stone-950 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                  COVER
                </span>
              ) : (
                !disabled && (
                  <button
                    type="button"
                    onClick={() => handleSetCover(idx)}
                    className="absolute top-1.5 left-1.5 bg-stone-900/80 hover:bg-amber-600 text-stone-200 hover:text-stone-950 text-[9px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    Set Cover
                  </button>
                )
              )}

              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                  title="Remove Image"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
