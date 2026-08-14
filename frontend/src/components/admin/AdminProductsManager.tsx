import React, { useState, useMemo } from 'react';
import {
  useCMS,
  type CMSProduct,
  type CMSProductVariant,
} from '../../context/CMSContext';
import { AdminGalleryUploader } from './AdminGalleryUploader';

export const AdminProductsManager: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    fragrances,
    sizes,
    colors,
    wickTypes,
    mainCategories,
    subCategories,
    collections,
  } = useCMS();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modal / Form Mode
  const [activeMode, setActiveMode] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'options' | 'variants' | 'descriptions' | 'specifications' | 'seo'>('basic');

  // Unified Product Form State
  const initialFormState: Partial<CMSProduct> = {
    name: '',
    slug: '',
    tagline: '',
    sku: '',
    price: 0,
    originalPrice: 0,
    rating: 0,
    reviewsCount: 0,
    mainCategoryId: mainCategories[0]?.id || '',
    category: mainCategories[0]?.name || '',
    subCategoryId: '',
    subCategory: '',
    collectionIds: [],
    collection: '',
    collections: [],
    scentProfile: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    burnTime: '',
    burnTimeHours: 0,
    waxType: '',
    wickType: '',
    weightGrams: 0,
    shortDescription: '',
    longDescription: '',
    productDetails: undefined,
    fragrancePyramid: undefined,
    howToUse: '',
    safetyInstructions: '',
    whatsIncluded: '',
    shippingReturns: '',
    inStock: true,
    isBestSeller: false,
    isNew: false,
    isFeatured: false,
    isTrending: false,
    isLimitedEdition: false,
    hasFragranceOption: true,
    hasSizeOption: true,
    hasColorOption: false,
    hasWickOption: true,
    hasGiftPackaging: true,
    hasCustomMessage: false,
    availableFragranceIds: fragrances.slice(0, 3).map((f) => f.id),
    availableSizeIds: sizes.slice(0, 3).map((s) => s.id),
    availableColorIds: colors.slice(0, 2).map((c) => c.id),
    availableWickTypeIds: wickTypes.map((w) => w.id),
    vesselDescription: 'Hand-poured in heavy frosted Italian glass vessel.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  };

  const [formData, setFormData] = useState<Partial<CMSProduct>>(initialFormState);

  // Start Create Flow
  const handleStartCreate = () => {
    const fresh: Partial<CMSProduct> = {
      ...initialFormState,
      sku: `TCL-${Math.floor(1000 + Math.random() * 9000)}`,
      variants: [],
    };
    setFormData(fresh);
    setEditingId(null);
    setActiveFormTab('basic');
    setActiveMode('create');
  };

  // Start Edit Flow
  const handleStartEdit = (p: CMSProduct) => {
    setFormData({ ...p });
    setEditingId(p.id);
    setActiveFormTab('basic');
    setActiveMode('edit');
  };

  // Start View Flow
  const handleStartView = (p: CMSProduct) => {
    setFormData({ ...p });
    setEditingId(p.id);
    setActiveFormTab('basic');
    setActiveMode('view');
  };

  // Cancel / Close
  const handleCloseForm = () => {
    setActiveMode('list');
    setEditingId(null);
  };

  // Quick Variant Generation
  const handleGenerateVariants = () => {
    const activeFrags = fragrances.filter((f) => formData.availableFragranceIds?.includes(f.id));
    const activeSizes = sizes.filter((s) => formData.availableSizeIds?.includes(s.id));
    const activeWicks = wickTypes.filter((w) => formData.availableWickTypeIds?.includes(w.id));

    const generated: CMSProductVariant[] = [];
    const basePrice = Number(formData.price) || 0;
    const baseOrigPrice = Number(formData.originalPrice) || basePrice;

    // If fragrances and sizes are active, generate combinations
    if (activeFrags.length > 0 && activeSizes.length > 0) {
      activeFrags.forEach((frag) => {
        activeSizes.forEach((sz, sIdx) => {
          const sizeMultiplier = sz.value > 200 ? 1.4 : sz.value < 200 ? 0.75 : 1.0;
          const varPrice = Math.round((basePrice * sizeMultiplier) / 10) * 10;
          const varOrig = Math.round((baseOrigPrice * sizeMultiplier) / 10) * 10;

          generated.push({
            id: `v-${Date.now()}-${frag.id.slice(0, 4)}-${sz.id.slice(0, 4)}`,
            productId: editingId || 'temp',
            sku: formData.sku ? `${formData.sku}-${frag.slug?.slice(0, 3).toUpperCase() || 'FR'}-${sz.slug.toUpperCase()}` : '',
            title: `${frag.name} • ${sz.name}`,
            fragranceId: frag.id,
            fragranceName: frag.name,
            sizeId: sz.id,
            sizeName: sz.name,
            wickTypeId: activeWicks[0]?.id,
            wickTypeName: activeWicks[0]?.name,
            price: varPrice,
            originalPrice: varOrig,
            stock: 0,
            isDefault: sIdx === 0 && generated.length === 0,
            status: 'ACTIVE',
          });
        });
      });
    } else {
      // No attributes selected — create a single blank variant for the admin to fill in
      generated.push({
        id: `v-${Date.now()}`,
        productId: editingId || 'temp',
        sku: formData.sku || '',
        title: formData.name || 'Default Variant',
        price: basePrice,
        originalPrice: baseOrigPrice,
        stock: 0,
        isDefault: true,
        status: 'ACTIVE',
      });
    }

    setFormData((prev) => ({ ...prev, variants: generated }));
  };

  // Add Single Empty Variant
  const handleAddSingleVariant = () => {
    const newV: CMSProductVariant = {
      id: `v-${Date.now()}`,
      productId: editingId || 'temp',
      sku: '',
      title: 'New Variant',
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || 0,
      stock: 0,
      isDefault: (formData.variants?.length || 0) === 0,
      status: 'ACTIVE',
    };
    setFormData((prev) => ({ ...prev, variants: [...(prev.variants || []), newV] }));
  };

  // Update Variant Row
  const handleUpdateVariant = (index: number, updated: Partial<CMSProductVariant>) => {
    setFormData((prev) => {
      const current = [...(prev.variants || [])];
      current[index] = { ...current[index], ...updated };
      return { ...prev, variants: current };
    });
  };

  // Delete Variant Row
  const handleDeleteVariant = (index: number) => {
    setFormData((prev) => {
      const current = [...(prev.variants || [])];
      current.splice(index, 1);
      return { ...prev, variants: current };
    });
  };

  // Save Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.price) {
      alert('Product Name and Price are required.');
      return;
    }

    const parentCat = mainCategories.find((c) => c.id === formData.mainCategoryId);
    const parentSub = subCategories.find((s) => s.id === formData.subCategoryId);

    const payload: CMSProduct = {
      ...(formData as CMSProduct),
      name: formData.name.trim(),
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: parentCat?.name || formData.category || 'Scented Soy Candles',
      subCategory: parentSub?.name || formData.subCategory || 'Luxury Glass Jar Candles',
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      image: formData.images?.[0] || formData.image || formData.imageUrl || '',
      imageUrl: formData.images?.[0] || formData.imageUrl || formData.image || '',
      inStock: formData.inStock ?? true,
    };

    if (activeMode === 'create') {
      await addProduct(payload);
    } else if (editingId) {
      await updateProduct(editingId, payload);
    }

    handleCloseForm();
  };

  // Bulk Operations
  const handleBulkToggleStatus = async (inStock: boolean) => {
    for (const id of selectedProductIds) {
      await updateProduct(id, { inStock });
    }
    setSelectedProductIds([]);
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedProductIds.length} products?`)) {
      for (const id of selectedProductIds) {
        await deleteProduct(id);
      }
      setSelectedProductIds([]);
    }
  };

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.scentProfile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter ? p.mainCategoryId === categoryFilter || p.category === categoryFilter : true;
      const matchesCol = collectionFilter ? p.collectionIds?.includes(collectionFilter) || p.collection === collectionFilter : true;
      const matchesStatus =
        statusFilter === 'in_stock'
          ? p.inStock
          : statusFilter === 'out_of_stock'
          ? !p.inStock
          : statusFilter === 'featured'
          ? p.isFeatured
          : statusFilter === 'bestseller'
          ? p.isBestSeller
          : true;

      return matchesSearch && matchesCat && matchesCol && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, collectionFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* View/Edit/Create Modal */}
      {activeMode !== 'list' && (
        <form onSubmit={handleSaveProduct} className="bg-[#1C130E] border border-amber-500/30 rounded-2xl p-6 space-y-6 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C2018] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  {activeMode === 'create' ? 'CREATE' : activeMode === 'edit' ? 'EDIT' : 'VIEW'}
                </span>
                <h3 className="font-serif text-lg text-[#FDFBF7] font-medium">
                  {activeMode === 'create' ? 'Create New Master Product' : formData.name}
                </h3>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Unified product formulation with multi-image gallery, option toggles, dynamic variant matrix, structured specs, and SEO.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 bg-[#251A13] hover:bg-[#2C2018] text-stone-300 text-xs rounded-lg transition-colors"
              >
                Close
              </button>
              {activeMode !== 'view' && (
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded-lg transition-colors shadow-md font-semibold"
                >
                  {activeMode === 'create' ? 'Publish Product' : 'Save All Changes'}
                </button>
              )}
            </div>
          </div>

          {/* Form Tabs */}
          <div className="flex items-center gap-1 border-b border-[#2C2018] pb-2 overflow-x-auto">
            {[
              { id: 'basic', label: '1. Basic Info & Categories' },
              { id: 'options', label: '2. Product Options & Flags' },
              { id: 'variants', label: `3. Variant Matrix (${formData.variants?.length || 0})` },
              { id: 'descriptions', label: '4. Descriptions & Scent Pyramid' },
              { id: 'specifications', label: '5. Technical Specs & Care' },
              { id: 'seo', label: '6. SEO & Metadata' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFormTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeFormTab === tab.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-[#251A13]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: BASIC INFO */}
          {activeFormTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    disabled={activeMode === 'view'}
                    placeholder="e.g. Vanilla Bourbon & Spiced Tonka Atelier Candle"
                    value={formData.name || ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        name: v,
                        slug: activeMode === 'create' ? v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
                      }));
                    }}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Base SKU *</label>
                  <input
                    type="text"
                    required
                    disabled={activeMode === 'view'}
                    placeholder="e.g. TCL-VNB-001"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Main Category *</label>
                  <select
                    disabled={activeMode === 'view'}
                    value={formData.mainCategoryId || ''}
                    onChange={(e) => {
                      const catId = e.target.value;
                      const catObj = mainCategories.find((c) => c.id === catId);
                      setFormData((prev) => ({ ...prev, mainCategoryId: catId, category: catObj?.name || prev.category }));
                    }}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  >
                    {mainCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Subcategory</label>
                  <select
                    disabled={activeMode === 'view'}
                    value={formData.subCategoryId || ''}
                    onChange={(e) => {
                      const subId = e.target.value;
                      const subObj = subCategories.find((s) => s.id === subId);
                      setFormData((prev) => ({ ...prev, subCategoryId: subId, subCategory: subObj?.name || prev.subCategory }));
                    }}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  >
                    <option value="">None / General</option>
                    {subCategories
                      .filter((s) => !formData.mainCategoryId || s.mainCategoryId === formData.mainCategoryId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Marketing Collections</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-[#140D09] border border-[#2C2018] rounded-lg max-h-24 overflow-y-auto">
                    {collections.map((col) => {
                      const isAssigned = formData.collectionIds?.includes(col.id);
                      return (
                        <button
                          type="button"
                          key={col.id}
                          disabled={activeMode === 'view'}
                          onClick={() => {
                            setFormData((prev) => {
                              const existing = prev.collectionIds || [];
                              const updated = isAssigned ? existing.filter((id) => id !== col.id) : [...existing, col.id];
                              return { ...prev, collectionIds: updated };
                            });
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                            isAssigned
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium'
                              : 'bg-[#1C130E] text-stone-400 border-[#2C2018] hover:text-stone-200'
                          }`}
                        >
                          {col.icon} {col.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    disabled={activeMode === 'view'}
                    value={formData.price ?? 1499}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">MRP / Compare Price (₹)</label>
                  <input
                    type="number"
                    disabled={activeMode === 'view'}
                    value={formData.originalPrice ?? 1899}
                    onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Product Tagline / Scent Mood</label>
                  <input
                    type="text"
                    disabled={activeMode === 'view'}
                    placeholder="e.g. Madagascar vanilla pod with bourbon oak"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>
              </div>

              {/* Multi-Image Gallery */}
              <div className="border-t border-[#2C2018] pt-4">
                <AdminGalleryUploader
                  images={formData.images || []}
                  onChange={(imgs) =>
                    setFormData((prev) => ({
                      ...prev,
                      images: imgs,
                      image: imgs[0] || '',
                      imageUrl: imgs[0] || '',
                    }))
                  }
                  disabled={activeMode === 'view'}
                />
              </div>
            </div>
          )}

          {/* TAB 2: OPTIONS & MERCHANDISING FLAGS */}
          {activeFormTab === 'options' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-mono uppercase text-amber-400 mb-3">Customer Product Page Option Toggles</h4>
                <p className="text-xs text-stone-400 mb-4">
                  Enable only options that apply to this product. For example, enable Fragrance and Size for candles, but disable Wick Type for diffusers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'hasFragranceOption', label: 'Fragrance Selector (Dynamic)', desc: 'Allow customer to select from fragrance library' },
                    { key: 'hasSizeOption', label: 'Generic Size Selector', desc: 'Allow customer to select size (100g, 200g, 400g, 100ml)' },
                    { key: 'hasColorOption', label: 'Color Swatch Selector', desc: 'Allow customer to pick vessel color/finish' },
                    { key: 'hasWickOption', label: 'Wick Type Selector', desc: 'Crackling wood wick vs silent cotton wick (Candles only)' },
                    { key: 'hasGiftPackaging', label: 'Gift Packaging Option', desc: 'Allow customer to add gold gift box packaging' },
                    { key: 'hasCustomMessage', label: 'Custom Gift Message', desc: 'Allow customer to write personal note for recipient' },
                  ].map((opt) => (
                    <label key={opt.key} className="flex items-start gap-3 p-3 rounded-lg bg-[#140D09] border border-[#2C2018] cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={activeMode === 'view'}
                        checked={(formData as any)[opt.key] ?? false}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [opt.key]: e.target.checked }))}
                        className="mt-0.5 rounded bg-[#1C130E] border-[#2C2018] text-amber-500 focus:ring-0"
                      />
                      <div>
                        <p className="text-xs font-medium text-[#FDFBF7]">{opt.label}</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fragrance Allowlist */}
              {formData.hasFragranceOption && (
                <div className="border-t border-[#2C2018] pt-4 space-y-2">
                  <label className="block text-xs font-mono uppercase text-amber-400">Allowed Fragrances For This Product</label>
                  <div className="flex flex-wrap gap-2">
                    {fragrances.map((f) => {
                      const isSelected = formData.availableFragranceIds?.includes(f.id);
                      return (
                        <button
                          key={f.id}
                          type="button"
                          disabled={activeMode === 'view'}
                          onClick={() => {
                            setFormData((prev) => {
                              const existing = prev.availableFragranceIds || [];
                              const updated = isSelected ? existing.filter((id) => id !== f.id) : [...existing, f.id];
                              return { ...prev, availableFragranceIds: updated };
                            });
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium'
                              : 'bg-[#140D09] text-stone-400 border-[#2C2018]'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {f.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Merchandising Badges */}
              <div className="border-t border-[#2C2018] pt-4">
                <h4 className="text-xs font-mono uppercase text-amber-400 mb-3">Merchandising Flags</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { key: 'isFeatured', label: '🌟 Featured' },
                    { key: 'isBestSeller', label: '🔥 Best Seller' },
                    { key: 'isNew', label: '✨ New Arrival' },
                    { key: 'isTrending', label: '📈 Trending' },
                    { key: 'isLimitedEdition', label: '👑 Limited Edition' },
                  ].map((flag) => (
                    <label key={flag.key} className="flex items-center gap-2 p-2.5 rounded bg-[#140D09] border border-[#2C2018] cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={activeMode === 'view'}
                        checked={(formData as any)[flag.key] ?? false}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [flag.key]: e.target.checked }))}
                        className="rounded bg-[#1C130E] border-[#2C2018] text-amber-500"
                      />
                      <span className="text-xs text-[#FDFBF7]">{flag.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC VARIANT MATRIX */}
          {activeFormTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#140D09] p-4 rounded-xl border border-[#2C2018]">
                <div>
                  <h4 className="text-xs font-mono uppercase text-amber-400">Variant Matrix</h4>
                  <p className="text-xs text-stone-400">
                    Each variant holds distinct SKU, Price, MRP, Stock Count, Low Stock threshold, and custom gallery image.
                  </p>
                </div>
                {activeMode !== 'view' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateVariants}
                      className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded text-xs transition-colors"
                    >
                      ⚡ Auto-Generate Matrix
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSingleVariant}
                      className="px-3 py-1.5 bg-[#251A13] hover:bg-[#2C2018] text-stone-300 rounded text-xs"
                    >
                      + Add Row
                    </button>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2C2018] text-[10px] font-mono uppercase text-stone-400 bg-[#140D09]">
                      <th className="p-2.5">Variant Title</th>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5">Fragrance</th>
                      <th className="p-2.5">Size</th>
                      <th className="p-2.5">Price (₹)</th>
                      <th className="p-2.5">MRP (₹)</th>
                      <th className="p-2.5">Stock</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C2018]">
                    {formData.variants?.map((v, vIdx) => (
                      <tr key={v.id || vIdx} className="hover:bg-[#251A13]/50">
                        <td className="p-2.5">
                          <input
                            type="text"
                            disabled={activeMode === 'view'}
                            value={v.title || ''}
                            onChange={(e) => handleUpdateVariant(vIdx, { title: e.target.value })}
                            className="w-40 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7]"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            disabled={activeMode === 'view'}
                            value={v.sku || ''}
                            onChange={(e) => handleUpdateVariant(vIdx, { sku: e.target.value })}
                            className="w-28 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7] font-mono"
                          />
                        </td>
                        <td className="p-2.5">
                          <select
                            disabled={activeMode === 'view'}
                            value={v.fragranceId || ''}
                            onChange={(e) => {
                              const frObj = fragrances.find((f) => f.id === e.target.value);
                              handleUpdateVariant(vIdx, { fragranceId: e.target.value, fragranceName: frObj?.name });
                            }}
                            className="w-32 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7]"
                          >
                            <option value="">None</option>
                            {fragrances.map((f) => (
                              <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2.5">
                          <select
                            disabled={activeMode === 'view'}
                            value={v.sizeId || ''}
                            onChange={(e) => {
                              const szObj = sizes.find((s) => s.id === e.target.value);
                              handleUpdateVariant(vIdx, { sizeId: e.target.value, sizeName: szObj?.name });
                            }}
                            className="w-28 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7]"
                          >
                            <option value="">None</option>
                            {sizes.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            disabled={activeMode === 'view'}
                            value={v.price}
                            onChange={(e) => handleUpdateVariant(vIdx, { price: parseFloat(e.target.value) || 0 })}
                            className="w-20 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7]"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            disabled={activeMode === 'view'}
                            value={v.originalPrice || ''}
                            onChange={(e) => handleUpdateVariant(vIdx, { originalPrice: parseFloat(e.target.value) || 0 })}
                            className="w-20 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7]"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            disabled={activeMode === 'view'}
                            value={v.stock ?? 50}
                            onChange={(e) => handleUpdateVariant(vIdx, { stock: parseInt(e.target.value) || 0 })}
                            className="w-16 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7]"
                          />
                        </td>
                        <td className="p-2.5">
                          <select
                            disabled={activeMode === 'view'}
                            value={v.status || 'ACTIVE'}
                            onChange={(e) => handleUpdateVariant(vIdx, { status: e.target.value as any })}
                            className="w-24 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7]"
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="OUT_OF_STOCK">Out of Stock</option>
                            <option value="DISCONTINUED">Discontinued</option>
                          </select>
                        </td>
                        <td className="p-2.5 text-right">
                          {activeMode !== 'view' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteVariant(vIdx)}
                              className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}

                    {(!formData.variants || formData.variants.length === 0) && (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-stone-500 text-xs">
                          No variants generated yet. Click "Auto-Generate Matrix" above to automatically create variant combinations.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DESCRIPTIONS & SCENT PYRAMID */}
          {activeFormTab === 'descriptions' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  disabled={activeMode === 'view'}
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Full Rich Description</label>
                <textarea
                  rows={4}
                  disabled={activeMode === 'view'}
                  value={formData.longDescription || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                />
              </div>

              <div className="border-t border-[#2C2018] pt-4">
                <h4 className="text-xs font-mono uppercase text-amber-400 mb-3">Fragrance Pyramid Formulation</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 mb-1">Top Notes</label>
                    <textarea
                      rows={2}
                      disabled={activeMode === 'view'}
                      value={formData.topNotes || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, topNotes: e.target.value }))}
                      className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 mb-1">Heart Notes</label>
                    <textarea
                      rows={2}
                      disabled={activeMode === 'view'}
                      value={formData.heartNotes || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, heartNotes: e.target.value }))}
                      className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 mb-1">Base Notes</label>
                    <textarea
                      rows={2}
                      disabled={activeMode === 'view'}
                      value={formData.baseNotes || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, baseNotes: e.target.value }))}
                      className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SPECIFICATIONS & CARE */}
          {activeFormTab === 'specifications' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Wax Formulation</label>
                  <input
                    type="text"
                    disabled={activeMode === 'view'}
                    value={formData.waxType || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, waxType: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Burn Time Duration</label>
                  <input
                    type="text"
                    disabled={activeMode === 'view'}
                    value={formData.burnTime || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, burnTime: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Net Weight (Grams / ML)</label>
                  <input
                    type="number"
                    disabled={activeMode === 'view'}
                    value={formData.weightGrams || 250}
                    onChange={(e) => setFormData((prev) => ({ ...prev, weightGrams: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#2C2018] pt-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">How To Use / First Burn</label>
                  <textarea
                    rows={3}
                    disabled={activeMode === 'view'}
                    value={formData.howToUse || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, howToUse: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Safety & Candle Care</label>
                  <textarea
                    rows={3}
                    disabled={activeMode === 'view'}
                    value={formData.safetyInstructions || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, safetyInstructions: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">What's Included in the Box</label>
                  <textarea
                    rows={2}
                    disabled={activeMode === 'view'}
                    value={formData.whatsIncluded || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, whatsIncluded: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Shipping & Exchange Guarantee</label>
                  <textarea
                    rows={2}
                    disabled={activeMode === 'view'}
                    value={formData.shippingReturns || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, shippingReturns: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SEO */}
          {activeFormTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Meta Title Tag</label>
                <input
                  type="text"
                  disabled={activeMode === 'view'}
                  placeholder="e.g. Vanilla Bourbon Soy Candle | The Candle Lab"
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  disabled={activeMode === 'view'}
                  placeholder="Handcrafted organic soy candle..."
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Meta Keywords</label>
                <input
                  type="text"
                  disabled={activeMode === 'view'}
                  placeholder="soy candle, vanilla bourbon, wood wick, luxury gift"
                  value={formData.metaKeywords || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaKeywords: e.target.value }))}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
                />
              </div>
            </div>
          )}
        </form>
      )}

      {/* Main Catalog View */}
      {activeMode === 'list' && (
        <div className="space-y-4">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1C130E] p-6 rounded-xl border border-[#2C2018]">
            <div>
              <h2 className="text-xl font-serif text-[#FDFBF7] font-medium">Products Master Catalog</h2>
              <p className="text-xs text-stone-400 mt-1">
                Manage luxury formulations, inventory matrices, fragrance selections, and option toggles across your store.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartCreate}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-lg"
            >
              <span>+</span>
              <span>Create Product</span>
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-[#1C130E] p-4 rounded-xl border border-[#2C2018] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products by title, SKU, fragrance, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#FDFBF7] focus:border-amber-500"
                />
                <span className="absolute left-2.5 top-2 text-stone-500 text-xs">🔍</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#140D09] border border-[#2C2018] rounded-lg px-2.5 py-1.5 text-xs text-stone-300"
              >
                <option value="">All Categories</option>
                {mainCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
                className="bg-[#140D09] border border-[#2C2018] rounded-lg px-2.5 py-1.5 text-xs text-stone-300"
              >
                <option value="">All Collections</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#140D09] border border-[#2C2018] rounded-lg px-2.5 py-1.5 text-xs text-stone-300"
              >
                <option value="">All Statuses</option>
                <option value="in_stock">In Stock Only</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="featured">Featured Only</option>
                <option value="bestseller">Best Sellers Only</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedProductIds.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-amber-300">
                {selectedProductIds.length} Products Selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkToggleStatus(true)}
                  className="px-3 py-1 bg-[#1C130E] hover:bg-stone-800 text-stone-200 rounded text-xs border border-[#2C2018]"
                >
                  Set Active
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkToggleStatus(false)}
                  className="px-3 py-1 bg-[#1C130E] hover:bg-stone-800 text-stone-200 rounded text-xs border border-[#2C2018]"
                >
                  Set Out of Stock
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded text-xs border border-red-800/40"
                >
                  Bulk Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProductIds([])}
                  className="text-stone-400 hover:text-stone-200 text-xs ml-2"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-[#1C130E] rounded-xl border border-[#2C2018] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2C2018] text-[10px] font-mono uppercase text-stone-400 bg-[#140D09]">
                    <th className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds(filteredProducts.map((p) => p.id));
                          } else {
                            setSelectedProductIds([]);
                          }
                        }}
                        className="rounded bg-[#1C130E] border-[#2C2018] text-amber-500"
                      />
                    </th>
                    <th className="p-3">Product</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Variants</th>
                    <th className="p-3">Options</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2018]">
                  {filteredProducts.map((p) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    const varCount = p.variants?.length || 0;

                    return (
                      <tr key={p.id} className={`hover:bg-[#251A13] transition-colors ${isSelected ? 'bg-amber-500/5' : ''}`}>
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds((prev) => [...prev, p.id]);
                              } else {
                                setSelectedProductIds((prev) => prev.filter((id) => id !== p.id));
                              }
                            }}
                            className="rounded bg-[#1C130E] border-[#2C2018] text-amber-500"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image || p.imageUrl}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-[#2C2018] shrink-0"
                            />
                            <div>
                              <p className="font-medium text-[#FDFBF7] line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{p.scentProfile || p.tagline}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-stone-400">{p.sku}</td>
                        <td className="p-3 text-stone-300">{p.category}</td>
                        <td className="p-3">
                          <span className="font-medium text-amber-300">₹{p.price}</span>
                          {p.originalPrice > p.price && (
                            <span className="text-[10px] text-stone-500 line-through ml-1.5">₹{p.originalPrice}</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-stone-400 bg-[#140D09] px-2 py-0.5 rounded border border-[#2C2018]">
                            {varCount}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            {p.hasFragranceOption && <span className="text-[9px] font-mono px-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">FRAG</span>}
                            {p.hasSizeOption && <span className="text-[9px] font-mono px-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">SIZE</span>}
                            {p.hasWickOption && <span className="text-[9px] font-mono px-1 rounded bg-stone-800 text-stone-300">WICK</span>}
                          </div>
                        </td>
                        <td className="p-3">
                          {p.inStock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40">
                              ● In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-stone-500 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                              ○ Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartView(p)}
                              className="px-2 py-1 text-stone-400 hover:text-stone-200 text-xs rounded hover:bg-[#2C2018]"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(p)}
                              className="px-2.5 py-1 bg-[#2C2018] hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-xs rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete product "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-950/30 text-xs rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-stone-500 text-xs">
                        No products found matching your search and filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
