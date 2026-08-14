import React, { useState } from 'react';
import { useCMS, type CMSCollection } from '../../context/CMSContext';
import { AdminImageUploader } from './AdminImageUploader';

export const AdminCollectionsManager: React.FC = () => {
  const { collections, addCollection, updateCollection, deleteCollection, assignProductsToCollection, products } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [assigningCol, setAssigningCol] = useState<CMSCollection | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CMSCollection>>({
    name: '',
    slug: '',
    description: '',
    bannerImage: '',
    imageUrl: '',
    icon: '✨',
    badge: 'ATELIER',
    collectionType: 'MANUAL',
    isFeatured: true,
    isActive: true,
    sortOrder: 0,
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const handleStartCreate = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      bannerImage: '',
      imageUrl: '',
      icon: '✨',
      badge: 'ATELIER',
      collectionType: 'MANUAL',
      isFeatured: true,
      isActive: true,
      sortOrder: collections.length + 1,
    });
    setEditingId(null);
    setIsCreating(true);
  };

  const handleStartEdit = (col: CMSCollection) => {
    setFormData(col);
    setEditingId(col.id);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (isCreating) {
      await addCollection(formData);
    } else if (editingId) {
      await updateCollection(editingId, formData);
    }
    setIsCreating(false);
    setEditingId(null);
  };

  const handleOpenAssign = (col: CMSCollection) => {
    setAssigningCol(col);
    // Find all products currently assigned
    const assigned = products
      .filter((p) => p.collectionIds?.includes(col.id) || p.collection === col.name || p.collections?.includes(col.name))
      .map((p) => p.id);
    setSelectedProductIds(col.productIds && col.productIds.length > 0 ? col.productIds : assigned);
  };

  const handleSaveAssign = async () => {
    if (!assigningCol) return;
    await assignProductsToCollection(assigningCol.id, selectedProductIds);
    setAssigningCol(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1C130E] p-6 rounded-xl border border-[#2C2018]">
        <div>
          <h2 className="text-xl font-serif text-[#FDFBF7] font-medium">Marketing Collections</h2>
          <p className="text-xs text-stone-400 mt-1">
            Create and curate promotional and thematic collections (e.g. Best Sellers, Luxury Reserve, New Arrivals, Gift Sets). Products can belong to multiple marketing collections.
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartCreate}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded-lg transition-colors flex items-center gap-2"
        >
          <span>✨</span>
          <span>Add New Collection</span>
        </button>
      </div>

      {/* Product Assignment Modal */}
      {assigningCol && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C130E] border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#2C2018] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base text-[#FDFBF7]">
                  Assign Products to <span className="text-amber-400">"{assigningCol.name}"</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Select all products that should appear in this marketing collection.</p>
              </div>
              <button onClick={() => setAssigningCol(null)} className="text-stone-400 hover:text-stone-200 text-sm">
                ✕
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto divide-y divide-[#2C2018] space-y-2">
              {products.map((p) => {
                const isSelected = selectedProductIds.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-[#251A13]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image || p.imageUrl} alt={p.name} className="w-10 h-10 rounded object-cover border border-[#2C2018]" />
                      <div>
                        <p className="text-xs font-medium text-[#FDFBF7]">{p.name}</p>
                        <p className="text-[10px] text-stone-400">{p.scentProfile || p.category} • ₹{p.price}</p>
                      </div>
                    </div>
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
                      className="rounded bg-[#140D09] border-[#2C2018] text-amber-500 focus:ring-0"
                    />
                  </label>
                );
              })}
            </div>

            <div className="p-4 border-t border-[#2C2018] bg-[#140D09] flex items-center justify-between">
              <span className="text-xs text-stone-400">{selectedProductIds.length} Products Selected</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningCol(null)}
                  className="px-4 py-2 bg-[#251A13] hover:bg-[#2C2018] text-stone-300 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssign}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded-lg"
                >
                  Save Product Assignments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Form */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-[#1C130E] p-6 rounded-xl border border-amber-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2C2018] pb-3">
            <h3 className="font-serif text-base text-amber-300">
              {isCreating ? 'New Marketing Collection' : `Edit Collection: ${formData.name}`}
            </h3>
            <button type="button" onClick={() => { setIsCreating(false); setEditingId(null); }} className="text-stone-400 hover:text-stone-200 text-sm">
              ✕ Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Collection Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Best Sellers Atelier"
                value={formData.name || ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name: v,
                    title: v,
                    slug: isCreating ? v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
                  }));
                }}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">URL Slug</label>
              <input
                type="text"
                placeholder="e.g. best-sellers"
                value={formData.slug || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Marketing Description</label>
              <textarea
                rows={2}
                placeholder="Our most beloved and iconic hand-poured olfactory signatures."
                value={formData.description || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value, desc: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
              />
            </div>

            <div className="md:col-span-2">
              <AdminImageUploader
                value={formData.bannerImage || formData.image || formData.imageUrl || ''}
                onChange={(url) => setFormData((prev) => ({ ...prev, bannerImage: url, image: url, imageUrl: url }))}
                label="Collection Hero Banner / Cover"
                aspectRatio="wide"
                helperText="Upload wide cover photo shown at the top of this collection"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Icon Symbol / Emoji</label>
              <input
                type="text"
                placeholder="✨"
                value={formData.icon || '✨'}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#2C2018] pt-4">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={formData.isFeatured ?? true}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded bg-[#140D09] border-[#2C2018] text-amber-500"
                />
                <span>Featured on Homepage</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Sort Order:</span>
                <input
                  type="number"
                  value={formData.sortOrder ?? 0}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="w-16 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded-lg transition-colors"
            >
              {isCreating ? 'Create Collection' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Collections Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((c) => {
          const assignedCount = products.filter(
            (p) => p.collectionIds?.includes(c.id) || p.collection === c.name || p.collections?.includes(c.name)
          ).length;

          return (
            <div key={c.id} className="bg-[#1C130E] border border-[#2C2018] rounded-xl p-5 hover:border-amber-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
                      {c.icon || '✨'}
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-medium text-[#FDFBF7]">{c.name}</h3>
                      <p className="text-[10px] font-mono text-amber-400">/{c.slug}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-amber-300">
                    {assignedCount} Products
                  </span>
                </div>

                <p className="text-xs text-stone-400 mt-3 line-clamp-2">{c.description || c.desc}</p>
              </div>

              <div className="flex items-center justify-between border-t border-[#2C2018] pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => handleOpenAssign(c)}
                  className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>🛍️</span>
                  <span>Assign Products</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(c)}
                    className="px-3 py-1.5 bg-[#2C2018] hover:bg-stone-700 text-stone-300 text-xs rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete collection "${c.name}"?`)) {
                        deleteCollection(c.id);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs rounded border border-red-900/40 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
