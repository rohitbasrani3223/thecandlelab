import React, { useState, useRef } from 'react';
import { uploadImageToSupabaseStorage } from '../../config/supabaseClient';
import { useCMS } from '../../context/CMSContext';

export interface AdminImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  bucket?: string;
  aspectRatio?: 'square' | 'wide' | 'banner' | 'auto';
  disabled?: boolean;
}

export const AdminImageUploader: React.FC<AdminImageUploaderProps> = ({
  value,
  onChange,
  label,
  helperText,
  bucket = 'product-images',
  aspectRatio = 'square',
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { registerMediaAsset } = useCMS();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image size must be under 10MB.');
      return;
    }

    setErrorMsg('');
    setIsUploading(true);

    try {
      const publicUrl = await uploadImageToSupabaseStorage(file, bucket);
      if (publicUrl) {
        onChange(publicUrl);
        if (registerMediaAsset) {
          registerMediaAsset(file.name.replace(/\.[^/.]+$/, ''), publicUrl);
        }
      } else {
        setErrorMsg('Failed to upload image. Please try again or paste a direct URL.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Upload error occurred.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (!inputUrl.trim()) return;
    onChange(inputUrl.trim());
    if (registerMediaAsset) {
      registerMediaAsset('Image Asset', inputUrl.trim());
    }
    setInputUrl('');
    setShowUrlInput(false);
  };

  const handleRemove = () => {
    onChange('');
    setInputUrl('');
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-w-[200px]'
      : aspectRatio === 'wide'
      ? 'aspect-[16/9] max-w-[320px]'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9] max-w-[420px]'
      : 'min-h-[140px]';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-mono uppercase tracking-wider text-amber-400">
          {label}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg,image/svg+xml"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Image Preview & Upload Controls */}
      {value ? (
        <div className="space-y-2">
          <div
            className={`relative group rounded-xl overflow-hidden border border-[#2C2018] bg-[#140D09] ${aspectClass}`}
          >
            <img
              src={value}
              alt="Asset Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80';
              }}
            />

            {!disabled && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-semibold rounded-lg shadow cursor-pointer transition-colors"
                >
                  Change File
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg shadow cursor-pointer transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-stone-400">
            <span className="truncate max-w-[280px] font-mono">{value}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-amber-400 hover:underline cursor-pointer ml-auto"
            >
              Upload New
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Dropzone / Upload Box */}
          <div
            onClick={() => {
              if (!disabled && !isUploading) {
                fileInputRef.current?.click();
              }
            }}
            className={`border-2 border-dashed border-[#2C2018] hover:border-amber-500/50 bg-[#140D09] hover:bg-[#1C130E] rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all ${
              isUploading ? 'opacity-60 pointer-events-none' : ''
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-amber-300 font-mono">Uploading to Supabase Storage...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg">
                  📸
                </div>
                <div>
                  <p className="text-xs font-medium text-[#FDFBF7]">
                    Click to Upload Image from Device
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Supports PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Option to toggle direct URL paste */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-stone-400 hover:text-amber-300 transition-colors"
            >
              {showUrlInput ? '− Hide URL Input' : '+ Or Paste Web Image URL'}
            </button>
          </div>

          {showUrlInput && (
            <div className="flex gap-2 pt-1">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
                className="flex-1 bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-1.5 text-xs text-[#FDFBF7] focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3 py-1.5 bg-[#251A13] hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-xs rounded-lg transition-colors font-medium cursor-pointer"
              >
                Apply URL
              </button>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-red-400 font-mono mt-1">⚠️ {errorMsg}</p>
      )}

      {helperText && (
        <p className="text-[10px] text-stone-500">{helperText}</p>
      )}
    </div>
  );
};
