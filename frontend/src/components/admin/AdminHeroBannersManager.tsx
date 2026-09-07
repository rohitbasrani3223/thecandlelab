import React, { useState, useMemo } from 'react';
import { useCMS, type CMSHeroBannerSlide } from '../../context/CMSContext';
import { uploadImageToSupabaseStorage } from '../../config/supabaseClient';

export const AdminHeroBannersManager: React.FC = () => {
  const { heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide, toggleHeroSlideStatus } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CMSHeroBannerSlide | null>(null);

  // Form State for Create/Edit Modal
  const [formData, setFormData] = useState({
    name: '',
    priority: 1,
    deeplink: '',
    imageUrl: '',
    mobileImageUrl: '',
    isActive: true,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showDirectUrlInput, setShowDirectUrlInput] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [isMobileUploading, setIsMobileUploading] = useState(false);
  const [mobileUploadError, setMobileUploadError] = useState('');
  const [showMobileDirectUrlInput, setShowMobileDirectUrlInput] = useState(false);
  const mobileFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Filtered and sorted slides
  const filteredSlides = useMemo(() => {
    return [...heroSlides]
      .filter((slide) => {
        const matchesSearch = slide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (slide.deeplink && slide.deeplink.toLowerCase().includes(searchQuery.toLowerCase()));
        if (!matchesSearch) return false;
        if (statusFilter === 'active') return slide.isActive;
        if (statusFilter === 'inactive') return !slide.isActive;
        return true;
      })
      .sort((a, b) => a.priority - b.priority);
  }, [heroSlides, searchQuery, statusFilter]);

  const activeCount = useMemo(() => heroSlides.filter((s) => s.isActive).length, [heroSlides]);
  const inactiveCount = useMemo(() => heroSlides.filter((s) => !s.isActive).length, [heroSlides]);

  const handleOpenCreateModal = () => {
    const nextPriority = heroSlides.length > 0 ? Math.max(...heroSlides.map((s) => s.priority)) + 1 : 1;
    setEditingSlide(null);
    setFormData({
      name: '',
      priority: nextPriority,
      deeplink: '',
      imageUrl: '',
      mobileImageUrl: '',
      isActive: true,
    });
    setUploadError('');
    setMobileUploadError('');
    setShowDirectUrlInput(false);
    setShowMobileDirectUrlInput(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: CMSHeroBannerSlide) => {
    setEditingSlide(slide);
    setFormData({
      name: slide.name,
      priority: slide.priority,
      deeplink: slide.deeplink || '',
      imageUrl: slide.imageUrl,
      mobileImageUrl: slide.mobileImageUrl || '',
      isActive: slide.isActive,
    });
    setUploadError('');
    setMobileUploadError('');
    setShowDirectUrlInput(false);
    setShowMobileDirectUrlInput(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlide(null);
    setUploadError('');
    setMobileUploadError('');
    setShowDirectUrlInput(false);
    setShowMobileDirectUrlInput(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP, GIF, SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit. Please upload an image under 10MB.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const publicUrl = await uploadImageToSupabaseStorage(file, 'product-images');
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Error uploading image. Please try entering direct URL.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleMobileFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMobileUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP, GIF, SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMobileUploadError('Image size exceeds 10MB limit. Please upload an image under 10MB.');
      return;
    }

    setMobileUploadError('');
    setIsMobileUploading(true);

    try {
      const publicUrl = await uploadImageToSupabaseStorage(file, 'product-images');
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, mobileImageUrl: publicUrl }));
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setFormData((prev) => ({ ...prev, mobileImageUrl: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setMobileUploadError(err?.message || 'Error uploading mobile image. Please try entering direct URL.');
    } finally {
      setIsMobileUploading(false);
      if (mobileFileInputRef.current) {
        mobileFileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a banner name.');
      return;
    }
    if (!formData.imageUrl.trim()) {
      alert('Please upload or provide a banner image (21:9 ratio).');
      return;
    }

    if (editingSlide) {
      updateHeroSlide(editingSlide.id, {
        name: formData.name.trim(),
        priority: Number(formData.priority) || 1,
        deeplink: formData.deeplink.trim(),
        imageUrl: formData.imageUrl.trim(),
        mobileImageUrl: formData.mobileImageUrl.trim() || undefined,
        isActive: formData.isActive,
      });
    } else {
      addHeroSlide({
        name: formData.name.trim(),
        priority: Number(formData.priority) || 1,
        deeplink: formData.deeplink.trim(),
        imageUrl: formData.imageUrl.trim(),
        mobileImageUrl: formData.mobileImageUrl.trim() || undefined,
        isActive: formData.isActive,
      });
    }

    handleCloseModal();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete banner "${name}"?`)) {
      deleteHeroSlide(id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#8B6F4E] via-[#6B5339] to-[#3B2C1E] text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🖼️
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide">Hero Banner Desktop</h1>
            <p className="text-xs sm:text-sm text-stone-200 mt-1">
              Manage desktop hero banners for your homepage. Upload 21:9 banners to auto-slide on storefront.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-white text-[#4A3728] hover:bg-stone-100 active:scale-95 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <span className="text-base font-bold">+</span>
          <span>Create New Hero Banner Desktop</span>
        </button>
      </div>

      {/* 2. Search & Status Filter Bar */}
      <div className="bg-white border border-[#EFE8DB] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search desktop hero banners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#FAF6F0] border border-[#EFE8DB] rounded-xl text-xs sm:text-sm text-[#2C1E16] placeholder:text-stone-400 focus:outline-none focus:border-[#8B6F4E]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#8B6F4E] text-white shadow-xs'
                : 'bg-[#FAF6F0] text-stone-600 hover:bg-stone-200'
            }`}
          >
            All ({heroSlides.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'bg-[#FAF6F0] text-stone-600 hover:bg-stone-200'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-[#6B7280] text-white shadow-xs'
                : 'bg-[#FAF6F0] text-stone-600 hover:bg-stone-200'
            }`}
          >
            Inactive ({inactiveCount})
          </button>
        </div>
      </div>

      {/* 3. Banner Cards Grid */}
      {filteredSlides.length === 0 ? (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-12 text-center shadow-sm">
          <div className="text-4xl mb-3">🖼️</div>
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">No Hero Banners Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
            {searchQuery
              ? 'No banners match your search. Try clearing the search term.'
              : 'Add 21:9 hero banners to create an automatic slideshow for your storefront homepage.'}
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 bg-[#8B6F4E] hover:bg-[#735A3D] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer"
          >
            <span>+ Create New Hero Banner Desktop</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Card Image Preview with 21:9 Aspect Ratio */}
              <div className="relative aspect-[21/9] w-full bg-[#1C130E] overflow-hidden">
                <img
                  src={slide.imageUrl}
                  alt={slide.name}
                  className="w-full h-full object-cover sm:object-contain object-center group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/hero_candle.png';
                  }}
                />

                {/* Status Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md text-white ${
                      slide.isActive ? 'bg-[#10B981]' : 'bg-[#6B7280]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {slide.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Priority & Mobile Tags */}
                <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
                  <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-mono font-bold">
                    Priority: {slide.priority}
                  </span>
                  {slide.mobileImageUrl && (
                    <span className="bg-blue-900/80 backdrop-blur-md text-blue-200 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
                      📱 Mobile Ready
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#2C1E16] uppercase tracking-wide truncate">
                    {slide.name}
                  </h3>
                  {slide.deeplink ? (
                    <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 truncate font-mono">
                      <span className="text-[#8B6F4E]">🔗</span>
                      <span className="truncate">{slide.deeplink}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-stone-400 italic mt-1">No deeplink (defaults to store)</p>
                  )}
                </div>

                {/* Card Action Buttons (Set Inactive / Edit / Delete) */}
                <div className="pt-3 border-t border-[#F2EDE4] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleHeroSlideStatus(slide.id)}
                    className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border text-center ${
                      slide.isActive
                        ? 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {slide.isActive ? 'Set Inactive' : 'Set Active'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(slide)}
                    className="flex-1 py-2 px-2.5 rounded-lg text-xs font-bold bg-[#FAF6F0] hover:bg-[#F2ECE1] text-[#8B6F4E] border border-[#EADDCB] transition-colors cursor-pointer text-center"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(slide.id, slide.name)}
                    className="py-2 px-3 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer text-center"
                    title="Delete Banner"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Create / Edit Hero Banner Desktop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-stone-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B6F4E]/10 border border-[#8B6F4E]/30 flex items-center justify-center text-xl shrink-0 text-[#8B6F4E]">
                  🖼️
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#2C1E16]">
                    {editingSlide ? 'Edit Hero Banner Desktop' : 'Create New Hero Banner Desktop'}
                  </h2>
                  <p className="text-[11px] text-stone-500">21:9 Ultrawide Banner for Homepage Slider</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg hover:bg-stone-200 flex items-center justify-center text-stone-500 font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Banner Name */}
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase tracking-wider mb-1">
                  Banner Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HERO or Summer Botanical Candle Drop"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF6F0] border border-[#EFE8DB] p-2.5 rounded-xl text-[#2C1E16] text-xs sm:text-sm focus:outline-none focus:border-[#8B6F4E]"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase tracking-wider mb-1">
                  Priority <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) || 1 })}
                  className="w-full bg-[#FAF6F0] border border-[#EFE8DB] p-2.5 rounded-xl text-[#2C1E16] text-xs sm:text-sm focus:outline-none focus:border-[#8B6F4E]"
                />
                <p className="text-[10px] text-stone-500 mt-1">Lower numbers appear first (e.g. 1 is first slide, 2 is second)</p>
              </div>

              {/* Deeplink */}
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase tracking-wider mb-1">
                  Deeplink
                </label>
                <input
                  type="text"
                  placeholder="e.g., /products?category=scented-candles or #collections"
                  value={formData.deeplink}
                  onChange={(e) => setFormData({ ...formData, deeplink: e.target.value })}
                  className="w-full bg-[#FAF6F0] border border-[#EFE8DB] p-2.5 rounded-xl text-[#2C1E16] text-xs sm:text-sm focus:outline-none focus:border-[#8B6F4E]"
                />
                <p className="text-[10px] text-stone-500 mt-1">URL or section hash to redirect when banner is clicked</p>
              </div>

              {/* Banner Image Upload Section */}
              <div className="space-y-2">
                <label className="font-bold text-[#2C1E16] block uppercase tracking-wider">
                  Banner Image <span className="text-rose-500">*</span>
                </label>

                {/* 📐 Recommended Dimensions Guidance Box */}
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-3.5 rounded-xl text-xs text-[#1E40AF] space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <span>📐 Recommended Dimensions:</span>
                    <span className="text-[#1D4ED8]">2100 × 900 pixels (21:9 ratio) for best display</span>
                  </div>
                  <p className="text-[11px] text-[#3B82F6]">
                    Minimum: 1260 × 540px | Maximum: 10MB
                  </p>
                  <p className="text-[11px] text-[#2563EB] font-medium">
                    Storefront par 4:3 (mobile), 16:10 (tablet), aur 21:9 (desktop) responsive display setup hai.
                  </p>
                </div>

                {/* Existing Image Preview */}
                {formData.imageUrl && (
                  <div className="space-y-2">
                    <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-stone-300 bg-stone-900 shadow-inner">
                      <img
                        src={formData.imageUrl}
                        alt="Banner Preview"
                        className="w-full h-full object-cover sm:object-contain object-center"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/hero_candle.png';
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="truncate max-w-[320px] font-mono">{formData.imageUrl}</span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                        className="text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}

                {/* Drag & Drop Upload Dropzone */}
                {!formData.imageUrl && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#CBD5E1] hover:border-[#8B6F4E] bg-[#F8FAFC] hover:bg-[#FAF6F0] p-6 rounded-2xl flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                      ☁️
                    </div>
                    <div>
                      <p className="font-bold text-[#1E293B] text-xs sm:text-sm">
                        {isUploading ? 'Uploading Image...' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        PNG, JPG, JPEG, GIF, WebP, SVG (MAX. 10MB)
                      </p>
                      <p className="text-[10px] text-blue-600 font-bold mt-1">
                        Recommended: 2100 × 900 pixels (21:9)
                      </p>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <p className="text-rose-600 text-[11px] font-semibold">{uploadError}</p>
                )}

                {/* Direct URL Input Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowDirectUrlInput(!showDirectUrlInput)}
                    className="text-[#8B6F4E] hover:underline text-[11px] font-semibold cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{showDirectUrlInput ? '▾ Hide direct URL' : '▸ Or paste direct image URL'}</span>
                  </button>
                  {showDirectUrlInput && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/banner-2100x900.webp"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="flex-1 bg-[#FAF6F0] border border-[#EFE8DB] p-2 rounded-lg text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Mobile Banner Image Section */}
              <div className="space-y-2 pt-2 border-t border-[#EFE8DB]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#2C1E16] block uppercase tracking-wider">
                    Mobile Banner Image <span className="text-stone-400 font-normal text-[10px]">(Optional)</span>
                  </label>
                  {formData.mobileImageUrl && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      📱 Configured
                    </span>
                  )}
                </div>

                <div className="bg-[#FAF5EE] border border-[#E9DFD0] p-3 rounded-xl text-[11px] text-[#785C3A]">
                  <p>
                    <span className="font-bold">📱 Mobile Guidance:</span> Recommended 4:5 ratio (e.g. 1080×1350px) or 9:16 for smartphones. If not provided, the desktop banner will scale automatically.
                  </p>
                </div>

                {/* Existing Mobile Image Preview */}
                {formData.mobileImageUrl && (
                  <div className="space-y-2">
                    <div className="relative max-h-48 max-w-xs mx-auto aspect-[4/5] rounded-xl overflow-hidden border border-stone-300 bg-stone-900 shadow-inner">
                      <img
                        src={formData.mobileImageUrl}
                        alt="Mobile Banner Preview"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/hero_candle.png';
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="truncate max-w-[280px] font-mono">{formData.mobileImageUrl}</span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, mobileImageUrl: '' }))}
                        className="text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        Remove Mobile Image
                      </button>
                    </div>
                  </div>
                )}

                {/* Drag & Drop Mobile Upload Dropzone */}
                {!formData.mobileImageUrl && (
                  <div
                    onClick={() => mobileFileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#CBD5E1] hover:border-[#8B6F4E] bg-[#F8FAFC] hover:bg-[#FAF6F0] p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={mobileFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                      onChange={handleMobileFileChange}
                      disabled={isMobileUploading}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-full bg-amber-50 text-[#8B6F4E] flex items-center justify-center text-lg">
                      📱
                    </div>
                    <div>
                      <p className="font-bold text-[#1E293B] text-xs">
                        {isMobileUploading ? 'Uploading Mobile Banner...' : 'Upload Mobile Banner Image'}
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        PNG, JPG, JPEG, WebP (Optional 4:5 or 9:16 vertical)
                      </p>
                    </div>
                  </div>
                )}

                {mobileUploadError && (
                  <p className="text-rose-600 text-[11px] font-semibold">{mobileUploadError}</p>
                )}

                {/* Direct Mobile URL Input Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowMobileDirectUrlInput(!showMobileDirectUrlInput)}
                    className="text-[#8B6F4E] hover:underline text-[11px] font-semibold cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{showMobileDirectUrlInput ? '▾ Hide mobile URL' : '▸ Or paste direct mobile image URL'}</span>
                  </button>
                  {showMobileDirectUrlInput && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/mobile-banner-1080x1350.webp"
                        value={formData.mobileImageUrl}
                        onChange={(e) => setFormData({ ...formData, mobileImageUrl: e.target.value })}
                        className="flex-1 bg-[#FAF6F0] border border-[#EFE8DB] p-2 rounded-lg text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Active Checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="banner-active-checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#8B6F4E] accent-[#8B6F4E] cursor-pointer"
                />
                <label htmlFor="banner-active-checkbox" className="font-bold text-xs text-[#2C1E16] cursor-pointer">
                  Active (Display this banner in homepage hero slider)
                </label>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {editingSlide ? 'Update Hero Banner Desktop' : 'Create Hero Banner Desktop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
