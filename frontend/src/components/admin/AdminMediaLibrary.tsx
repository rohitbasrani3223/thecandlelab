import React, { useRef, useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { uploadImageToSupabaseStorage } from '../../config/supabaseClient';
import { formatFileSize } from '../../config/placeholders';
import { Button, Card, EmptyState, Input, CheckIcon, PlusIcon, TrashIcon } from '../../design-system';

type MediaSubTab = 'images' | 'videos' | 'icons' | 'documents';

const TABS: { id: MediaSubTab; label: string }[] = [
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Videos' },
  { id: 'icons', label: 'Icons' },
  { id: 'documents', label: 'Docs' },
];

const UploadCloudIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const AdminMediaLibrary: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<MediaSubTab>('images');
  const { mediaItems, addMediaItem, deleteMediaItem } = useCMS();
  const [name, setName] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const resetForm = () => {
    setName('');
    setExternalUrl('');
    setPreviewUrl('');
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Only image files are supported right now.', 'error');
      return;
    }
    setPendingFile(file);
    if (!name) setName(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSubTab !== 'images') {
      showToast('Only image uploads are supported right now.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      let finalUrl = externalUrl.trim();
      let sizeLabel = 'URL';

      if (pendingFile) {
        finalUrl = await uploadImageToSupabaseStorage(pendingFile, 'product-images');
        sizeLabel = formatFileSize(pendingFile.size);
      }

      if (!finalUrl) {
        showToast('Drop a file or paste an image URL.', 'error');
        return;
      }

      if (!name.trim()) {
        showToast('Give this asset a name first.', 'error');
        return;
      }

      addMediaItem({
        id: `m-${Date.now()}`,
        name: name.trim(),
        url: finalUrl,
        type: 'image',
        size: sizeLabel,
      });

      resetForm();
      showToast('Saved to library — pick it in Products → Edit.');
    } catch (err) {
      console.warn('Media upload failed:', err);
      showToast('Upload failed. Try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const imageItems = mediaItems.filter((m) => m.type === 'image' || !m.type);

  return (
    <div className="space-y-8 font-sans max-w-6xl">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium shadow-[0_8px_30px_rgba(42,30,23,0.12)] backdrop-blur-md border transition-all ${
            toast.type === 'success'
              ? 'bg-white/95 border-[#2E6F40]/20 text-[#2E6F40]'
              : 'bg-white/95 border-[#B93829]/20 text-[#B93829]'
          }`}
        >
          {toast.type === 'success' ? <CheckIcon size={16} /> : null}
          {toast.msg}
        </div>
      )}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-[#B88B38] font-medium">Assets</p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1E16] tracking-tight">
            Media library
          </h1>
          <p className="text-sm text-[#7A6B5D] max-w-md">
            Upload once, reuse everywhere — product covers, banners, and more.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full bg-white/80 border border-[#EFE8DB] text-sm text-[#2C1E16] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#2E6F40] animate-pulse" />
          {imageItems.length} {imageItems.length === 1 ? 'file' : 'files'}
        </div>
      </header>

      <div className="flex gap-1 p-1 rounded-2xl bg-[#F4EFE6]/80 border border-[#EFE8DB] w-fit">
        {TABS.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#2C1E16] shadow-sm'
                  : 'text-[#7A6B5D] hover:text-[#2C1E16]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeSubTab === 'images' && (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-8">
          <Card variant="elevated" padding="lg" className="rounded-2xl">
            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#2C1E16]">Add new asset</h2>
                <p className="text-sm text-[#7A6B5D] mt-0.5">Drag & drop or browse from your device.</p>
              </div>

              <div
                ref={dropZoneRef}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-[200px] ${
                  isDragging
                    ? 'border-[#B88B38] bg-[#B88B38]/5 scale-[1.01]'
                    : previewUrl
                      ? 'border-[#2E6F40]/40 bg-[#2E6F40]/5'
                      : 'border-[#E5D9C5] bg-[#FAF6F0]/50 hover:border-[#B88B38]/50 hover:bg-[#F8F3EA]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {previewUrl ? (
                  <>
                    <div className="w-24 h-24 rounded-xl overflow-hidden ring-2 ring-white shadow-md">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm font-medium text-[#2C1E16]">{pendingFile?.name || 'External URL'}</p>
                    {pendingFile && (
                      <p className="text-xs text-[#7A6B5D]">{formatFileSize(pendingFile.size)}</p>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetForm();
                      }}
                      className="text-xs text-[#B93829] font-medium hover:underline"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#B88B38] shadow-sm">
                      <UploadCloudIcon />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[#2C1E16]">Drop image here</p>
                      <p className="text-xs text-[#7A6B5D] mt-1">PNG, JPG, WebP — or click to browse</p>
                    </div>
                  </>
                )}

                {isUploading && (
                  <div className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#2C1E16]">
                      <svg className="animate-spin h-5 w-5 text-[#B88B38]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading to cloud…
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Asset name"
                placeholder="vanilla-jar-front"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Or paste URL"
                type="url"
                placeholder="https://..."
                value={externalUrl}
                leftIcon={<LinkIcon />}
                onChange={(e) => {
                  setExternalUrl(e.target.value);
                  if (e.target.value) setPreviewUrl(e.target.value);
                }}
              />

              <Button
                type="submit"
                variant="gold"
                size="md"
                fullWidth
                isLoading={isUploading}
                leftIcon={<PlusIcon size={16} />}
              >
                Save to library
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-[#2C1E16]">Your files</h2>
            </div>

            {imageItems.length === 0 ? (
              <EmptyState
                title="No assets yet"
                description="Upload your first product photo — it'll show up here and in the product editor."
                actionLabel="Upload above"
                onAction={() => dropZoneRef.current?.click()}
                className="rounded-2xl max-w-none my-0 py-16"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {imageItems.map((m) => (
                  <article
                    key={m.id}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F8F3EA] ring-1 ring-[#EFE8DB] hover:ring-[#B88B38]/40 hover:shadow-[0_12px_40px_rgba(42,30,23,0.1)] transition-all duration-300"
                  >
                    <img
                      src={m.url}
                      alt={m.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/90 via-[#1C130E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      <button
                        type="button"
                        title="Copy URL"
                        onClick={() => {
                          navigator.clipboard.writeText(m.url);
                          showToast('URL copied');
                        }}
                        className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-[#2C1E16] hover:bg-white shadow-sm cursor-pointer"
                      >
                        <CopyIcon />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => {
                          deleteMediaItem(m.id);
                          showToast('Asset removed');
                        }}
                        className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-[#B93829] hover:bg-red-50 shadow-sm cursor-pointer"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#1C130E]/80 to-transparent">
                      <p className="text-xs font-medium text-white truncate">{m.name}</p>
                      <p className="text-[10px] text-white/70">{m.size}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab !== 'images' && (
        <Card variant="bordered" padding="lg" className="rounded-2xl text-center py-16">
          <p className="text-lg font-serif font-bold text-[#2C1E16] capitalize">{activeSubTab}</p>
          <p className="text-sm text-[#7A6B5D] mt-2">Coming soon — use Images for product photos.</p>
        </Card>
      )}
    </div>
  );
};
