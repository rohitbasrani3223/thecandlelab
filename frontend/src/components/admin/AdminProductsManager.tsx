import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import type { CMSProduct } from '../../context/CMSContext';
import { uploadImageToSupabaseStorage } from '../../config/supabaseClient';

type ProductsSubTab =
  | 'products'
  | 'categories'
  | 'collections'
  | 'brands'
  | 'variants'
  | 'inventory'
  | 'pricing'
  | 'bulk';

export const AdminProductsManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<ProductsSubTab>('products');
  const { products, addProduct, updateProduct, deleteProduct } = useCMS();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProd, setEditingProd] = useState<CMSProduct | null>(null);
  const [savedMsg, setSavedMsg] = useState('');

  const [formData, setFormData] = useState<CMSProduct>({
    id: '',
    name: '',
    category: 'Scented Candles',
    collection: 'Vanilla Collection',
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
  });

  const categories = ['Scented Candles', 'Luxury Glass Jars', 'Botanical Travel Tins', 'Wax Melts', 'Gift Boxes'];
  const collections = ['French Vanilla Collection', 'Royal Amber & Oud', 'Botanical Gardens', 'Festive Joy'];
  const brands = ['The Candle Lab Reserve', 'Artisan Studio', 'Heritage Line'];

  const SUB_TABS: { id: ProductsSubTab; label: string; icon: string }[] = [
    { id: 'products', label: 'Products', icon: '🕯️' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'collections', label: 'Collections', icon: '✨' },
    { id: 'brands', label: 'Brands', icon: '🏢' },
    { id: 'variants', label: 'Variants', icon: '⚖️' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'pricing', label: 'Pricing', icon: '🏷️' },
    { id: 'bulk', label: 'Bulk Import/Export', icon: '📂' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProd) {
      updateProduct(editingProd.id, formData);
      setEditingProd(null);
    } else {
      const newId = `sp-${Date.now()}`;
      addProduct({ ...formData, id: newId });
    }
    setShowAddModal(false);
  };

  const startEdit = (prod: CMSProduct) => {
    setEditingProd(prod);
    setFormData(prod);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">CATALOG & INVENTORY MANAGEMENT</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Products & Formulations ({products.length})</h1>
        </div>

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
              category: 'Scented Candles',
              collection: 'Vanilla Collection',
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
              isBestSeller: false,
              isNew: true,
              isFeatured: false,
              vesselDescription: 'Hand-poured in Italian frosted glass jar.',
            });
            setShowAddModal(true);
          }}
          className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
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
        <div className="fixed inset-0 z-50 bg-[#1C130E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EFE8DB] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
              <h3 className="font-serif font-bold text-xl text-[#2C1E16]">
                {editingProd ? 'Edit Product Formulation' : 'Create New Product'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8C7A6B] hover:text-[#2C1E16]">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Image File Upload */}
              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-dashed border-[#B88B38]/40 space-y-2">
                <label className="font-bold text-[#2C1E16] block uppercase text-xs">
                  📷 Upload Product Image File (Select photo from your device)
                </label>
                <div className="flex items-center gap-4">
                  {formData.imageUrl ? (
                    <div className="w-16 h-16 rounded-xl border border-[#EFE8DB] overflow-hidden shrink-0 bg-white shadow-xs">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-[#EFE8DB] flex items-center justify-center text-xs text-[#7A6B5D] bg-white shrink-0">
                      No Photo
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const uploadedUrl = await uploadImageToSupabaseStorage(file, 'product-images');
                        setFormData({ ...formData, imageUrl: uploadedUrl });
                      }
                    }}
                    className="w-full text-xs text-[#2C1E16] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#B88B38] file:text-white hover:file:bg-[#A3792E] file:cursor-pointer cursor-pointer"
                  />
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

              {/* Storefront Display Placement Options */}
              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-3">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2C1E16] flex items-center gap-1.5">
                    <span>📍</span> Storefront Display Placement (Tick where to display on site)
                  </h4>
                  <p className="text-[11px] text-[#7A6B5D]">Selected options will immediately place this product into the corresponding sections on the website.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-[#EFE8DB]">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-4 h-4 accent-[#B88B38] cursor-pointer"
                    />
                    <label htmlFor="inStock" className="font-bold text-[#2C1E16] text-xs cursor-pointer">
                      ✓ Available In Stock
                    </label>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-[#EFE8DB]">
                    <input
                      type="checkbox"
                      id="isBestSeller"
                      checked={formData.isBestSeller || false}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="w-4 h-4 accent-[#B88B38] cursor-pointer"
                    />
                    <label htmlFor="isBestSeller" className="font-bold text-[#2C1E16] text-xs cursor-pointer">
                      🔥 Show in "Best Sellers" Section
                    </label>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-[#EFE8DB]">
                    <input
                      type="checkbox"
                      id="isNew"
                      checked={formData.isNew || false}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 accent-[#B88B38] cursor-pointer"
                    />
                    <label htmlFor="isNew" className="font-bold text-[#2C1E16] text-xs cursor-pointer">
                      🌟 Show in "New Arrivals" Section
                    </label>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-[#EFE8DB]">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured || false}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#B88B38] cursor-pointer"
                    />
                    <label htmlFor="isFeatured" className="font-bold text-[#2C1E16] text-xs cursor-pointer">
                      ✨ Show in "Featured Royal" Section
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#7A6B5D] hover:text-[#2C1E16]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2 px-5 rounded-xl shadow-xs"
                >
                  Save Product →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-Tab View Content */}
      {activeSubTab === 'products' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle">
          <table className="w-full text-left text-xs text-[#2C1E16]">
            <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Badges & Flags</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#FAF6F0] transition-colors">
                  <td className="p-4">
                    <strong className="block text-sm font-serif font-bold text-[#2C1E16]">{prod.name}</strong>
                    <span className="text-[10px] text-[#7A6B5D] italic">Notes: {prod.topNotes}</span>
                  </td>
                  <td className="p-4 font-semibold text-[#B88B38]">{prod.category}</td>
                  <td className="p-4 font-bold text-[#2C1E16]">₹{prod.price.toLocaleString('en-IN')}.00</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {prod.isBestSeller && (
                        <span className="bg-[#B88B38]/15 text-[#B88B38] font-bold text-[9px] px-2 py-0.5 rounded-full">
                          🔥 Best Seller
                        </span>
                      )}
                      {prod.isNew && (
                        <span className="bg-blue-500/15 text-blue-700 font-bold text-[9px] px-2 py-0.5 rounded-full">
                          🌟 New Arrival
                        </span>
                      )}
                      {prod.isFeatured && (
                        <span className="bg-purple-500/15 text-purple-700 font-bold text-[9px] px-2 py-0.5 rounded-full">
                          ✨ Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => updateProduct(prod.id, { inStock: !prod.inStock })}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        prod.inStock ? 'bg-[#2E6F40]/10 text-[#2E6F40]' : 'bg-[#B93829]/10 text-[#B93829]'
                      }`}
                    >
                      {prod.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => startEdit(prod)}
                      className="text-[#B88B38] font-bold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="text-[#B93829] font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'categories' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">🏷️ Categories Manager</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {categories.map((cat, i) => (
              <div key={i} className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] flex items-center justify-between">
                <span className="font-bold text-[#2C1E16]">{cat}</span>
                <span className="text-[10px] text-[#B88B38] font-semibold">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'collections' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">✨ Curated Fragrance Collections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {collections.map((col, i) => (
              <div key={i} className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] flex items-center justify-between">
                <span className="font-bold text-[#2C1E16]">{col}</span>
                <span className="bg-[#2E6F40]/10 text-[#2E6F40] text-[10px] font-bold px-2 py-0.5 rounded-full">Curated</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'brands' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">🏢 House Brands & Lines</h3>
          <div className="space-y-3 text-xs">
            {brands.map((b, i) => (
              <div key={i} className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] flex items-center justify-between">
                <strong className="text-[#2C1E16]">{b}</strong>
                <span className="text-[#7A6B5D] text-[10px]">Primary Brand</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'variants' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">⚖️ Weight & Vessel Variant Matrix</h3>
          <p className="text-xs text-[#7A6B5D]">Configure weights (100g, 250g, 500g) and vessel finishes (Frosted Amber, Matte Black, Clear Glass).</p>
          <div className="flex flex-wrap gap-3 text-xs">
            {['100g Travel Votive', '250g Classic Jar', '500g Grand Three-Wick Jar'].map((v, i) => (
              <span key={i} className="bg-[#F8F3EA] border border-[#EFE8DB] px-3 py-1.5 rounded-xl font-bold text-[#2C1E16]">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'inventory' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">📦 Batch Inventory Counts</h3>
          <table className="w-full text-left text-xs text-[#2C1E16]">
            <thead className="bg-[#F8F3EA] uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3">Units in Stock</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-[#EFE8DB]">
                  <td className="p-3 font-bold">{p.name}</td>
                  <td className="p-3">{p.inStock ? '45 Units' : '0 Units (Low Stock)'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => updateProduct(p.id, { inStock: true })}
                      className="text-[#B88B38] font-bold hover:underline"
                    >
                      + Restock Batch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'pricing' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">🏷️ Pricing & Tax Rules</h3>
          <p className="text-xs text-[#7A6B5D]">Adjust base prices and sale discounts across catalog items.</p>
        </div>
      )}

      {activeSubTab === 'bulk' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">📂 Bulk Import & Export</h3>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setSavedMsg('Exporting products CSV file...');
                setTimeout(() => setSavedMsg(''), 3000);
              }}
              className="bg-[#B88B38] text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
            >
              📥 Export Products CSV
            </button>
            <button
              onClick={() => {
                setSavedMsg('Bulk import ready for CSV drop!');
                setTimeout(() => setSavedMsg(''), 3000);
              }}
              className="bg-[#2A1E17] text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
            >
              📤 Import Products CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
