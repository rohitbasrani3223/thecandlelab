import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import type { CMSProduct } from '../../context/CMSContext';

export const AdminProductsManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useCMS();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProd, setEditingProd] = useState<CMSProduct | null>(null);

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
      <div className="flex items-center justify-between border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">CATALOG MANAGEMENT</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Products & Formulations ({products.length})</h1>
        </div>

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
              vesselDescription: 'Hand-poured in Italian frosted glass jar.',
            });
            setShowAddModal(true);
          }}
          className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <span>+ Add New Product</span>
        </button>
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
                    <option value="Scented Candles">Scented Candles</option>
                    <option value="Luxury Glass Jars">Luxury Glass Jars</option>
                    <option value="Botanical Travel Tins">Botanical Travel Tins</option>
                    <option value="Wax Melts">Wax Melts</option>
                    <option value="Gift Boxes">Gift Boxes</option>
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
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Original Price (Strikethrough ₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Fragrance Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Vanilla Bean, Ceylon Cinnamon, Warm Amber"
                  value={formData.topNotes}
                  onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Vessel & Candle Description</label>
                <textarea
                  rows={3}
                  value={formData.vesselDescription}
                  onChange={(e) => setFormData({ ...formData, vesselDescription: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 accent-[#B88B38]"
                />
                <label htmlFor="inStock" className="font-bold text-[#2C1E16]">Product is Currently In Stock</label>
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

      {/* Products Table */}
      <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle">
        <table className="w-full text-left text-xs text-[#2C1E16]">
          <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
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
    </div>
  );
};
