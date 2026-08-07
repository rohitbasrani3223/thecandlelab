import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import type { CMSProduct } from '../../context/CMSContext';
import { uploadImageToSupabaseStorage } from '../../config/supabaseClient';
import { PRODUCT_IMAGE_PLACEHOLDER } from '../../config/placeholders';
import { MediaLibraryPicker } from './MediaLibraryPicker';

type ProductsSubTab =
  | 'products'
  | 'categories'
  | 'collections'
  | 'brands'
  | 'variants'
  | 'inventory'
  | 'pricing'
  | 'bulk';

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  collections: string[];
  productIds: string[];
}

interface CollectionItem {
  id: string;
  name: string;
  parentCategory: string;
  productIds: string[];
}

export const AdminProductsManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<ProductsSubTab>('products');
  const { products, addProduct, updateProduct, deleteProduct, mediaItems, registerMediaAsset } = useCMS();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProd, setEditingProd] = useState<CMSProduct | null>(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Categories & Collections state with cross-mapping
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([
    { id: 'cat-1', name: 'Scented Candles', icon: '🕯️', collections: ['French Vanilla Collection', 'Royal Amber & Oud'], productIds: [] },
    { id: 'cat-2', name: 'Luxury Glass Jars', icon: '🍷', collections: ['Royal Amber & Oud'], productIds: [] },
    { id: 'cat-3', name: 'Botanical Travel Tins', icon: '✨', collections: ['Botanical Gardens'], productIds: [] },
    { id: 'cat-4', name: 'Reed Diffusers & Oils', icon: '💧', collections: ['Festive Joy'], productIds: [] },
    { id: 'cat-5', name: 'Gift Boxes & Combos', icon: '🎁', collections: ['Festive Joy'], productIds: [] },
  ]);

  const [collectionsList, setCollectionsList] = useState<CollectionItem[]>([
    { id: 'col-1', name: 'French Vanilla Collection', parentCategory: 'Scented Candles', productIds: [] },
    { id: 'col-2', name: 'Royal Amber & Oud', parentCategory: 'Luxury Glass Jars', productIds: [] },
    { id: 'col-3', name: 'Botanical Gardens', parentCategory: 'Botanical Travel Tins', productIds: [] },
    { id: 'col-4', name: 'Festive Joy', parentCategory: 'Gift Boxes & Combos', productIds: [] },
  ]);

  // Form states for adding Category/Collection
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🕯️');
  const [selectedCatCollections, setSelectedCatCollections] = useState<string[]>([]);
  const [newColName, setNewColName] = useState('');
  const [newColParentCat, setNewColParentCat] = useState('Scented Candles');

  const brands = ['The Candle Lab Reserve', 'Artisan Studio', 'Heritage Line'];

  const [formData, setFormData] = useState<CMSProduct>({
    id: '',
    name: '',
    category: 'Scented Candles',
    collection: 'French Vanilla Collection',
    scentProfile: 'Warm Vanilla',
    price: 1499,
    originalPrice: 1799,
    rating: 4.9,
    reviewsCount: 12,
    topNotes: 'Vanilla Bean, Amber',
    heartNotes: 'Bourbon Pod',
    baseNotes: 'Musk',
    burnTime: '65 Hours',
    inStock: true,
    vesselDescription: 'Hand-poured in Italian frosted glass jar.',
    image: '',
    imageUrl: '',
  });

  const SUB_TABS: { id: ProductsSubTab; label: string; icon: string }[] = [
    { id: 'products', label: 'Products', icon: '🕯️' },
    { id: 'categories', label: 'Categories & Mapping', icon: '🏷️' },
    { id: 'collections', label: 'Collections & Products', icon: '✨' },
    { id: 'brands', label: 'Brands', icon: '🏢' },
    { id: 'variants', label: 'Variants', icon: '⚖️' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'pricing', label: 'Pricing', icon: '🏷️' },
    { id: 'bulk', label: 'Bulk Import/Export', icon: '📂' },
  ];

  const applyProductImage = (url: string, label: string) => {
    setFormData((prev) => ({ ...prev, image: url, imageUrl: url }));
    if (url && !url.startsWith('data:')) {
      registerMediaAsset(label, url);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingImage) {
      setSavedMsg('Image upload finishing, try again in a second...');
      setTimeout(() => setSavedMsg(''), 3000);
      return;
    }

    if (editingProd) {
      await updateProduct(editingProd.id, formData);
      setEditingProd(null);
      setSavedMsg(`Product "${formData.name}" updated!`);
    } else {
      const newProd: CMSProduct = {
        ...formData,
        id: `p-${Date.now()}`,
      };
      await addProduct(newProd);
      setSavedMsg(`New product "${formData.name}" created!`);
    }
    setShowAddModal(false);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const startEdit = (prod: CMSProduct) => {
    setEditingProd(prod);
    const imgUrl = prod.image || prod.imageUrl || '';
    setFormData({
      ...prod,
      image: imgUrl,
      imageUrl: imgUrl,
      images: prod.images || [],
    });
    setShowAddModal(true);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      icon: newCatIcon,
      collections: selectedCatCollections,
      productIds: [],
    };
    setCategoriesList([...categoriesList, newCat]);
    setNewCatName('');
    setSelectedCatCollections([]);
    setSavedMsg(`Category "${newCatName}" added!`);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName) return;
    const newCol: CollectionItem = {
      id: `col-${Date.now()}`,
      name: newColName,
      parentCategory: newColParentCat,
      productIds: [],
    };
    setCollectionsList([...collectionsList, newCol]);

    // Also associate with parent category
    setCategoriesList((prev) =>
      prev.map((cat) => {
        if (cat.name === newColParentCat && !cat.collections.includes(newColName)) {
          return { ...cat, collections: [...cat.collections, newColName] };
        }
        return cat;
      })
    );

    setNewColName('');
    setSavedMsg(`Collection "${newColName}" added under ${newColParentCat}!`);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const toggleProductInCategory = (catId: string, prodId: string) => {
    setCategoriesList((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          const exists = cat.productIds.includes(prodId);
          const updated = exists
            ? cat.productIds.filter((id) => id !== prodId)
            : [...cat.productIds, prodId];
          return { ...cat, productIds: updated };
        }
        return cat;
      })
    );
  };

  const toggleProductInCollection = (colId: string, prodId: string) => {
    setCollectionsList((prev) =>
      prev.map((col) => {
        if (col.id === colId) {
          const exists = col.productIds.includes(prodId);
          const updated = exists
            ? col.productIds.filter((id) => id !== prodId)
            : [...col.productIds, prodId];
          return { ...col, productIds: updated };
        }
        return col;
      })
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#2C1E16]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">
            CATALOG & INVENTORY MANAGEMENT
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">
            Products, Categories & Collections ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="bg-[#2E6F40] text-white text-xs font-bold px-4 py-2 rounded-full shadow-subtle animate-bounce">
              ✓ {savedMsg}
            </span>
          )}
          <button
            onClick={() => {
              setEditingProd(null);
              setFormData({
                id: '',
                name: '',
                category: categoriesList[0]?.name || 'Scented Candles',
                collection: collectionsList[0]?.name || 'French Vanilla Collection',
                scentProfile: '',
                price: 999,
                originalPrice: 1299,
                rating: 4.9,
                reviewsCount: 0,
                topNotes: '',
                heartNotes: '',
                baseNotes: '',
                burnTime: '60 Hours',
                inStock: true,
                vesselDescription: '',
              });
              setShowAddModal(true);
            }}
            className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-card transition-all cursor-pointer flex items-center gap-2"
          >
            <span>+ Create New Product</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EFE8DB] scrollbar-none">
        {SUB_TABS.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#B88B38] text-white shadow-card'
                  : 'bg-white text-[#7A6B5D] border border-[#EFE8DB] hover:bg-[#F8F3EA] hover:text-[#2C1E16]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#EFE8DB] rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-modal">
            <div className="flex items-center justify-between border-b border-[#EFE8DB] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">
                {editingProd ? 'Edit Product formulation' : 'Create New Product Formulation'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Velvet Rose & Smoked Amber"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Assigned Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selectedCat = e.target.value;
                      const matchedCatObj = categoriesList.find((c) => c.name === selectedCat);
                      const availableCols = matchedCatObj?.collections || collectionsList.map((c) => c.name);
                      setFormData({
                        ...formData,
                        category: selectedCat,
                        collection: availableCols[0] || collectionsList[0]?.name || '',
                      });
                    }}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-semibold"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Assigned Collection *</label>
                  <select
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-semibold"
                  >
                    {collectionsList
                      .filter((col) => !formData.category || col.parentCategory === formData.category || true)
                      .map((col) => (
                        <option key={col.id} value={col.name}>
                          ✨ {col.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>
              </div>

              {/* Product Primary Image Upload & Live Preview */}
              <div className="space-y-3">
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Main Cover Image *</label>

                <MediaLibraryPicker
                  mediaItems={mediaItems}
                  selectedUrl={formData.image || formData.imageUrl}
                  onSelect={(url, assetName) => applyProductImage(url, assetName)}
                />

                {(formData.image || formData.imageUrl) ? (
                  <div className="flex items-center gap-4 p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
                    <img
                      src={formData.image || formData.imageUrl}
                      alt="Product Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-[#EFE8DB] shadow-xs"
                    />
                    <div className="flex-1 space-y-1">
                      <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${isUploadingImage ? 'bg-[#B88B38]/15 text-[#B88B38]' : 'bg-[#2E6F40]/15 text-[#2E6F40]'}`}>
                        {isUploadingImage ? '⏳ Uploading to Supabase Cloud...' : '✓ Cover Image Attached'}
                      </span>
                      <p className="text-[11px] text-[#7A6B5D] truncate max-w-xs">
                        {(formData.image || formData.imageUrl || '').startsWith('data:') ? 'Local Image File (Uploaded)' : (formData.image || formData.imageUrl)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '', imageUrl: '' })}
                      className="text-xs font-bold text-[#B93829] hover:underline cursor-pointer px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIsUploadingImage(true);
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const localPreview = reader.result as string;
                            setFormData((prev) => ({ ...prev, image: localPreview, imageUrl: localPreview }));
                            try {
                              const uploadedUrl = await uploadImageToSupabaseStorage(file, 'product-images');
                              applyProductImage(uploadedUrl, file.name);
                            } catch (err) {
                              console.warn('Cloud upload failed, using local preview:', err);
                            } finally {
                              setIsUploadingImage(false);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-[#2C1E16] file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#B88B38] file:text-white hover:file:bg-[#A3792E] cursor-pointer"
                    />
                    <div className="relative flex items-center justify-center my-2">
                      <span className="bg-white px-2 text-[10px] font-bold text-[#8C7A6B] uppercase">or paste image URL</span>
                    </div>
                    <input
                      type="text"
                      placeholder="https://your-cdn.com/product.jpg"
                      value={formData.image || formData.imageUrl || ''}
                      onChange={(e) => applyProductImage(e.target.value, formData.name || 'Product image')}
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16] text-xs"
                    />
                  </div>
                )}
              </div>

              {/* 📸 Additional Gallery Photos (Multiple Image Upload) */}
              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#2C1E16] flex items-center gap-1.5">
                    <span>🖼️</span> Additional Gallery Photos (Multiple Images)
                  </h4>
                  <span className="text-[10px] font-bold text-[#B88B38] bg-white border border-[#EFE8DB] px-2 py-0.5 rounded-md">
                    {(formData.images || []).length} Extra Photos
                  </span>
                </div>

                {/* Multiple Files Upload Selector */}
                <div>
                  <label className="text-[11px] font-bold text-[#7A6B5D] block mb-1">
                    Select Multiple Photos (Choose 2, 3, 4+ photos at once):
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;

                      setIsUploadingImage(true);
                      Promise.all(
                        files.map(
                          (file) =>
                            new Promise<void>((resolve) => {
                              const reader = new FileReader();
                              reader.onloadend = async () => {
                                const localPreview = reader.result as string;
                                setFormData((prev) => ({
                                  ...prev,
                                  images: [...(prev.images || []), localPreview],
                                }));

                                try {
                                  const uploadedUrl = await uploadImageToSupabaseStorage(file, 'product-images');
                                  setFormData((prev) => ({
                                    ...prev,
                                    images: (prev.images || []).map((img) => (img === localPreview ? uploadedUrl : img)),
                                  }));
                                } catch (err) {
                                  console.warn('Gallery image upload note:', err);
                                } finally {
                                  resolve();
                                }
                              };
                              reader.readAsDataURL(file);
                            })
                        )
                      ).finally(() => setIsUploadingImage(false));
                    }}
                    className="w-full text-xs text-[#2C1E16] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#2C1E16] file:text-white hover:file:bg-[#3D2C22] cursor-pointer"
                  />
                </div>

                {/* Gallery Images Grid Preview */}
                {(formData.images || []).length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {(formData.images || []).map((imgUrl, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-[#EFE8DB] bg-white shadow-xs">
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              images: (formData.images || []).filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
                          title="Remove Photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scent Architecture & Notes */}
              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#2C1E16] flex items-center gap-1.5">
                  <span>🌿</span> Fragrance Pyramid & Scent Architecture
                </h4>

                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Scent Profile / Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Warm Madagascar Vanilla & Smoked Oud"
                    value={formData.scentProfile || ''}
                    onChange={(e) => setFormData({ ...formData, scentProfile: e.target.value })}
                    className="w-full bg-white border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-[#2C1E16] block uppercase mb-1">Top Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Bergamot, Citrus"
                      value={formData.topNotes || ''}
                      onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                      className="w-full bg-white border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#2C1E16] block uppercase mb-1">Heart Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Damask Rose"
                      value={formData.heartNotes || ''}
                      onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                      className="w-full bg-white border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#2C1E16] block uppercase mb-1">Base Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Sandalwood, Musk"
                      value={formData.baseNotes || ''}
                      onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                      className="w-full bg-white border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#2C1E16] block uppercase mb-1">Burn Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 65 Hours"
                      value={formData.burnTime || ''}
                      onChange={(e) => setFormData({ ...formData, burnTime: e.target.value })}
                      className="w-full bg-white border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#2C1E16] block uppercase mb-1">Vessel / Product Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Italian Frosted Glass with Wooden Lid"
                      value={formData.vesselDescription || ''}
                      onChange={(e) => setFormData({ ...formData, vesselDescription: e.target.value })}
                      className="w-full bg-white border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16]"
                    />
                  </div>
                </div>
              </div>

              {/* Storefront Placements */}
              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#2C1E16]">
                  📍 Storefront Placement Options
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="accent-[#B88B38]"
                    />
                    <span>Available In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller || false}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="accent-[#B88B38]"
                    />
                    <span>🔥 Show in Best Sellers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew || false}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="accent-[#B88B38]"
                    />
                    <span>🌟 Show in New Arrivals</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured || false}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-[#B88B38]"
                    />
                    <span>✨ Show in Featured Royal</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#EFE8DB]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-[#7A6B5D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold py-2.5 px-6 rounded-xl shadow-xs"
                >
                  {isUploadingImage ? 'Uploading Image...' : editingProd ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeSubTab === 'products' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle">
          <table className="w-full text-left text-xs text-[#2C1E16]">
            <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] text-[#7A6B5D]">
              <tr>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category & Collection</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#FAF6F0] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image || prod.imageUrl || PRODUCT_IMAGE_PLACEHOLDER}
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded-lg border border-[#EFE8DB]"
                      />
                      <div>
                        <strong className="block text-[#2C1E16]">{prod.name}</strong>
                        <span className="text-[10px] text-[#7A6B5D]">{prod.scentProfile || 'Botanical Blend'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-[#B88B38] block">{prod.category}</span>
                    <span className="text-[10px] text-[#7A6B5D]">{prod.collection}</span>
                  </td>
                  <td className="p-4 font-mono font-bold">₹{prod.price}</td>
                  <td className="p-4">
                    <button
                      onClick={() => updateProduct(prod.id, { inStock: !prod.inStock })}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                        prod.inStock ? 'bg-[#2E6F40]/10 text-[#2E6F40]' : 'bg-[#B93829]/10 text-[#B93829]'
                      }`}
                    >
                      {prod.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => startEdit(prod)} className="text-[#B88B38] font-bold hover:underline">
                      Edit
                    </button>
                    <button onClick={() => deleteProduct(prod.id)} className="text-[#B93829] font-bold hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CATEGORIES & MAPPING TAB */}
      {activeSubTab === 'categories' && (
        <div className="space-y-6">
          {/* Add Category Form */}
          <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">🏷️ Add New Category & Link Collections</h3>
            <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs items-end">
              <div className="sm:col-span-4">
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aromatherapy Pillars"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Symbol Icon</label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] text-center text-lg"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Link Collections</label>
                <select
                  multiple
                  value={selectedCatCollections}
                  onChange={(e) =>
                    setSelectedCatCollections(Array.from(e.target.selectedOptions, (o) => o.value))
                  }
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16] h-12 text-xs"
                >
                  {collectionsList.map((col) => (
                    <option key={col.id} value={col.name}>
                      ✨ {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold py-2.5 px-4 rounded-xl shadow-xs cursor-pointer"
                >
                  + Add Category
                </button>
              </div>
            </form>
          </div>

          {/* Categories Grid & Product Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoriesList.map((cat) => {
              const matchedProducts = products.filter(
                (p) => p.category === cat.name || cat.productIds.includes(p.id)
              );

              return (
                <div key={cat.id} className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EFE8DB] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <h4 className="font-serif font-bold text-base text-[#2C1E16]">{cat.name}</h4>
                    </div>
                    <span className="bg-[#B88B38]/15 text-[#B88B38] font-mono font-bold text-xs px-2.5 py-1 rounded-full">
                      {matchedProducts.length} Products
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#7A6B5D] block mb-1.5">Linked Collections:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.collections.map((colName, idx) => (
                        <span key={idx} className="bg-[#F8F3EA] border border-[#EFE8DB] text-[#2C1E16] text-[11px] font-semibold px-2.5 py-0.5 rounded-lg">
                          ✨ {colName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-[#F2ECE1] pt-3">
                    <span className="text-[10px] font-bold uppercase text-[#7A6B5D] block">Select Products to Display under Category:</span>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2">
                      {products.map((p) => {
                        const isChecked = p.category === cat.name || cat.productIds.includes(p.id);
                        return (
                          <label key={p.id} className="flex items-center justify-between p-2 bg-[#FAF6F0] rounded-lg text-xs cursor-pointer hover:bg-[#F4EFE6]">
                            <span className="font-semibold text-[#2C1E16]">{p.name} (₹{p.price})</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleProductInCategory(cat.id, p.id)}
                              className="accent-[#B88B38]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* COLLECTIONS & PRODUCTS TAB */}
      {activeSubTab === 'collections' && (
        <div className="space-y-6">
          {/* Add Collection Form */}
          <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">✨ Add New Collection & Assign Category</h3>
            <form onSubmit={handleAddCollection} className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs items-end">
              <div className="sm:col-span-5">
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn Woodfire Reserve"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Parent Category *</label>
                <select
                  value={newColParentCat}
                  onChange={(e) => setNewColParentCat(e.target.value)}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-semibold"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold py-2.5 px-4 rounded-xl shadow-xs cursor-pointer"
                >
                  + Add Collection
                </button>
              </div>
            </form>
          </div>

          {/* Collections Grid & Product Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collectionsList.map((col) => {
              const matchedProducts = products.filter(
                (p) => p.collection === col.name || col.productIds.includes(p.id)
              );

              return (
                <div key={col.id} className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EFE8DB] pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#B88B38]">Category: {col.parentCategory}</span>
                      <h4 className="font-serif font-bold text-base text-[#2C1E16] flex items-center gap-1.5">
                        <span>✨</span> {col.name}
                      </h4>
                    </div>
                    <span className="bg-[#2E6F40]/15 text-[#2E6F40] font-mono font-bold text-xs px-2.5 py-1 rounded-full">
                      {matchedProducts.length} Items
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-[#F2ECE1] pt-3">
                    <span className="text-[10px] font-bold uppercase text-[#7A6B5D] block">Select Products to Include in Collection:</span>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2">
                      {products.map((p) => {
                        const isChecked = p.collection === col.name || col.productIds.includes(p.id);
                        return (
                          <label key={p.id} className="flex items-center justify-between p-2 bg-[#FAF6F0] rounded-lg text-xs cursor-pointer hover:bg-[#F4EFE6]">
                            <span className="font-semibold text-[#2C1E16]">{p.name} (₹{p.price})</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleProductInCollection(col.id, p.id)}
                              className="accent-[#B88B38]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BRANDS TAB */}
      {activeSubTab === 'brands' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">🏢 House Brands & Atelier Lines</h3>
          <div className="space-y-3 text-xs">
            {brands.map((b, i) => (
              <div key={i} className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] flex items-center justify-between">
                <strong className="text-[#2C1E16] font-semibold">{b}</strong>
                <span className="text-[#7A6B5D] text-[10px] bg-white border border-[#EFE8DB] px-2 py-0.5 rounded-md">Primary Brand</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BULK IMAGE UPLOAD TAB */}
      {activeSubTab === 'bulk' && (
        <BulkImageUploadTab products={products} updateProduct={updateProduct} />
      )}
    </div>
  );
};

// ─── Bulk Image Upload Component ─────────────────────────────────────────────

interface BulkUploadResult {
  fileName: string;
  matchedProduct: string | null;
  status: 'pending' | 'uploading' | 'done' | 'error' | 'no_match';
  uploadedUrl?: string;
  error?: string;
}

const BulkImageUploadTab: React.FC<{
  products: import('../../context/CMSContext').CMSProduct[];
  updateProduct: (id: string, updated: Partial<import('../../context/CMSContext').CMSProduct>) => void;
}> = ({ products, updateProduct }) => {
  const [results, setResults] = useState<BulkUploadResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]/g, '');

  const findMatchingProduct = (fileName: string) => {
    const base = normalize(fileName.replace(/\.[^.]+$/, ''));
    return products.find((p) => {
      const pName = normalize(p.name);
      return pName.includes(base) || base.includes(pName) || base.includes(normalize(p.id));
    }) || null;
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setSelectedFiles(arr);
    setResults(
      arr.map((f) => ({
        fileName: f.name,
        matchedProduct: findMatchingProduct(f.name)?.name || null,
        status: 'pending',
      }))
    );
  };

  const handleUploadAll = async () => {
    if (selectedFiles.length === 0) return;
    setIsRunning(true);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const matched = findMatchingProduct(file.name);

      setResults((prev) =>
        prev.map((r, idx) =>
          idx === i ? { ...r, status: matched ? 'uploading' : 'no_match' } : r
        )
      );

      if (!matched) continue;

      try {
        // Upload to Supabase Storage
        const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
        const uploadUrl = `https://anaqrvrzbqhpgwjfpacx.supabase.co/storage/v1/object/product-images/${cleanName}`;
        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuYXFydnJ6YnFocGd3amZwYWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMzMzMzIsImV4cCI6MjEwMDgwOTMzMn0.NDzAvxZDP_TSlq1sXm1AID9xL8AzYl3QCA2LwH0TAhs';

        let imageUrl: string;

        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'apikey': ANON_KEY,
            'Authorization': `Bearer ${ANON_KEY}`,
            'Content-Type': file.type,
          },
          body: file,
        });

        if (res.ok) {
          imageUrl = `https://anaqrvrzbqhpgwjfpacx.supabase.co/storage/v1/object/public/product-images/${cleanName}`;
        } else {
          // Fallback: use base64 data URL
          imageUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

        // Update product in CMS state so image shows immediately
        await updateProduct(matched.id, { image: imageUrl, imageUrl });

        // Save to product_images table (upsert primary image)
        await fetch(`https://anaqrvrzbqhpgwjfpacx.supabase.co/rest/v1/product_images`, {
          method: 'POST',
          headers: {
            'apikey': ANON_KEY,
            'Authorization': `Bearer ${ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            product_id: matched.id,
            image_url: imageUrl,
            is_primary: true,
            sort_order: 0,
          }),
        });

        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: 'done', uploadedUrl: imageUrl, matchedProduct: matched.name } : r
          )
        );
      } catch (err: any) {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: 'error', error: err?.message || 'Upload failed' } : r
          )
        );
      }
    }
    setIsRunning(false);
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-[#7A6B5D]/10 text-[#7A6B5D]',
    uploading: 'bg-[#B88B38]/10 text-[#B88B38]',
    done: 'bg-[#2E6F40]/15 text-[#2E6F40]',
    error: 'bg-red-100 text-red-700',
    no_match: 'bg-orange-100 text-orange-700',
  };

  const statusIcon: Record<string, string> = {
    pending: '⏳',
    uploading: '🔄',
    done: '✅',
    error: '❌',
    no_match: '⚠️',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle">
        <h3 className="font-serif font-bold text-xl text-[#2C1E16] mb-1">📷 Bulk Image Upload</h3>
        <p className="text-xs text-[#7A6B5D]">
          Multiple product images ek saath upload karo. File naam se product auto-match hoga aur Supabase Storage + DB mein save ho jaayega.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
          isDragging ? 'border-[#B88B38] bg-[#FFF8EC]' : 'border-[#D4C4A8] bg-[#FAF6F0] hover:border-[#B88B38] hover:bg-[#FFF8EC]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFilesSelected(e.dataTransfer.files); }}
        onClick={() => document.getElementById('bulk-image-input')?.click()}
      >
        <input
          id="bulk-image-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />
        <div className="space-y-3">
          <span className="text-5xl">📸</span>
          <p className="font-bold text-[#2C1E16] text-base">Click ya Drag & Drop karo multiple images</p>
          <p className="text-xs text-[#8C7A6B]">
            File naming tip: Product name se match karo (e.g., <code className="bg-[#EFE8DB] px-1 rounded">bouquet.jpg</code>, <code className="bg-[#EFE8DB] px-1 rounded">bloom-jar-candle.png</code>)
          </p>
        </div>
      </div>

      {/* Product Name Reference List */}
      <div className="bg-white border border-[#EFE8DB] rounded-2xl p-5 shadow-subtle">
        <h4 className="font-bold text-sm text-[#2C1E16] mb-3">📦 Products in Database ({products.length}) — File names yahan se match hongi:</h4>
        <div className="flex flex-wrap gap-2">
          {products.map((p) => (
            <span key={p.id} className="text-[10px] font-mono bg-[#FAF6F0] border border-[#EFE8DB] px-2 py-1 rounded-md text-[#7A6B5D]">
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Selected Files Preview Table */}
      {results.length > 0 && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-[#EFE8DB] flex items-center justify-between">
            <h4 className="font-bold text-sm text-[#2C1E16]">
              {results.length} Files Selected
              <span className="ml-2 text-[10px] text-[#7A6B5D] font-normal">
                ({results.filter((r) => r.matchedProduct).length} matched, {results.filter((r) => !r.matchedProduct).length} unmatched)
              </span>
            </h4>
            <button
              onClick={handleUploadAll}
              disabled={isRunning}
              className="bg-[#B88B38] text-white text-xs font-bold px-5 py-2 rounded-xl hover:bg-[#9A7230] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {isRunning ? '⏳ Uploading...' : `🚀 Upload All ${results.length} Images`}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#FAF6F0] border-b border-[#EFE8DB]">
                <tr>
                  <th className="text-left py-3 px-4 font-bold text-[#7A6B5D] uppercase tracking-wide">File Name</th>
                  <th className="text-left py-3 px-4 font-bold text-[#7A6B5D] uppercase tracking-wide">Matched Product</th>
                  <th className="text-left py-3 px-4 font-bold text-[#7A6B5D] uppercase tracking-wide">Status</th>
                  <th className="text-left py-3 px-4 font-bold text-[#7A6B5D] uppercase tracking-wide">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {results.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF6F0]">
                    <td className="py-3 px-4 font-mono text-[#2C1E16]">{r.fileName}</td>
                    <td className="py-3 px-4">
                      {r.matchedProduct ? (
                        <span className="font-semibold text-[#2C1E16]">✅ {r.matchedProduct}</span>
                      ) : (
                        <span className="text-orange-600 font-semibold">⚠️ No Match</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${statusColor[r.status]}`}>
                        {statusIcon[r.status]} {r.status.toUpperCase().replace('_', ' ')}
                      </span>
                      {r.error && <p className="text-red-600 text-[10px] mt-0.5">{r.error}</p>}
                    </td>
                    <td className="py-3 px-4">
                      {r.uploadedUrl && (
                        <img
                          src={r.uploadedUrl}
                          alt={r.fileName}
                          className="w-12 h-12 object-cover rounded-lg border border-[#EFE8DB]"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Done Summary */}
      {!isRunning && results.some((r) => r.status === 'done') && (
        <div className="bg-[#2E6F40]/10 border border-[#2E6F40]/30 rounded-2xl p-5 text-center">
          <p className="font-bold text-[#2E6F40] text-base">
            🎉 {results.filter((r) => r.status === 'done').length} Images Successfully Uploaded!
          </p>
          <p className="text-xs text-[#4A7C59] mt-1">
            Sabhi products ki images Supabase Storage + Database mein save ho gayi hain. Page refresh karo to dekhein.
          </p>
        </div>
      )}
    </div>
  );
};
