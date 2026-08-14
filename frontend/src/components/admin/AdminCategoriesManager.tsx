import React, { useState } from 'react';
import {
  useCMS,
  type CMSMainCategory,
  type CMSSubCategory,
} from '../../context/CMSContext';
import { AdminImageUploader } from './AdminImageUploader';

export const AdminCategoriesManager: React.FC = () => {
  const {
    mainCategories,
    addMainCategory,
    updateMainCategory,
    deleteMainCategory,
    subCategories,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    products,
  } = useCMS();

  const [activeSubTab, setActiveSubTab] = useState<'main' | 'sub'>('main');

  // Main Category Form State
  const [editingMainId, setEditingMainId] = useState<string | null>(null);
  const [isCreatingMain, setIsCreatingMain] = useState(false);
  const [mainForm, setMainForm] = useState<Partial<CMSMainCategory>>({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    bannerDesktop: '',
    bannerMobile: '',
    sortOrder: 0,
    isActive: true,
  });

  // Sub Category Form State
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [isCreatingSub, setIsCreatingSub] = useState(false);
  const [subForm, setSubForm] = useState<Partial<CMSSubCategory>>({
    mainCategoryId: '',
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    bannerDesktop: '',
    bannerMobile: '',
    sortOrder: 0,
    isActive: true,
  });

  // Main Category Handlers
  const handleStartCreateMain = () => {
    setMainForm({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      bannerDesktop: '',
      bannerMobile: '',
      sortOrder: mainCategories.length + 1,
      isActive: true,
    });
    setEditingMainId(null);
    setIsCreatingMain(true);
  };

  const handleStartEditMain = (c: CMSMainCategory) => {
    setMainForm(c);
    setEditingMainId(c.id);
    setIsCreatingMain(false);
  };

  const handleSaveMain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainForm.name?.trim()) return;

    if (isCreatingMain) {
      await addMainCategory(mainForm);
    } else if (editingMainId) {
      await updateMainCategory(editingMainId, mainForm);
    }
    setIsCreatingMain(false);
    setEditingMainId(null);
  };

  const handleDeleteMain = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    const res = await deleteMainCategory(id);
    if (!res.success) {
      alert(res.message);
    }
  };

  // Sub Category Handlers
  const handleStartCreateSub = () => {
    setSubForm({
      mainCategoryId: mainCategories[0]?.id || '',
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      bannerDesktop: '',
      bannerMobile: '',
      sortOrder: subCategories.length + 1,
      isActive: true,
    });
    setEditingSubId(null);
    setIsCreatingSub(true);
  };

  const handleStartEditSub = (s: CMSSubCategory) => {
    setSubForm(s);
    setEditingSubId(s.id);
    setIsCreatingSub(false);
  };

  const handleSaveSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.name?.trim()) return;

    if (isCreatingSub) {
      await addSubCategory(subForm);
    } else if (editingSubId) {
      await updateSubCategory(editingSubId, subForm);
    }
    setIsCreatingSub(false);
    setEditingSubId(null);
  };

  const handleDeleteSub = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete subcategory "${name}"?`)) return;
    const res = await deleteSubCategory(id);
    if (!res.success) {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1C130E] p-6 rounded-xl border border-[#2C2018]">
        <div>
          <h2 className="text-xl font-serif text-[#FDFBF7] font-medium">Category Architecture</h2>
          <p className="text-xs text-stone-400 mt-1">
            Configure parent Main Categories and nested Subcategories. Categories describe product classification, independent of marketing collections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('main')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSubTab === 'main' ? 'bg-amber-600 text-stone-950 font-semibold' : 'bg-[#251A13] text-stone-300 hover:bg-[#2C2018]'
            }`}
          >
            Main Categories ({mainCategories.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('sub')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSubTab === 'sub' ? 'bg-amber-600 text-stone-950 font-semibold' : 'bg-[#251A13] text-stone-300 hover:bg-[#2C2018]'
            }`}
          >
            Subcategories ({subCategories.length})
          </button>
        </div>
      </div>

      {/* Main Categories Tab */}
      {activeSubTab === 'main' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleStartCreateMain}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <span>+</span>
              <span>Create Main Category</span>
            </button>
          </div>

          {(isCreatingMain || editingMainId) && (
            <form onSubmit={handleSaveMain} className="bg-[#1C130E] p-6 rounded-xl border border-amber-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2C2018] pb-3">
                <h3 className="font-serif text-base text-amber-300">
                  {isCreatingMain ? 'New Main Category' : `Edit Main Category: ${mainForm.name}`}
                </h3>
                <button type="button" onClick={() => { setIsCreatingMain(false); setEditingMainId(null); }} className="text-stone-400 hover:text-stone-200 text-sm">
                  ✕ Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scented Soy Candles"
                    value={mainForm.name || ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setMainForm((prev) => ({
                        ...prev,
                        name: v,
                        slug: isCreatingMain ? v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
                      }));
                    }}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. scented-soy-candles"
                    value={mainForm.slug || ''}
                    onChange={(e) => setMainForm((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Hand-poured pure soy wax candle creations infused with botanical fragrance oils."
                    value={mainForm.description || ''}
                    onChange={(e) => setMainForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AdminImageUploader
                    value={mainForm.imageUrl || ''}
                    onChange={(url) => setMainForm((prev) => ({ ...prev, imageUrl: url }))}
                    label="Thumbnail / Card Image"
                    helperText="Square image shown on category grid"
                  />
                  <AdminImageUploader
                    value={mainForm.bannerDesktop || ''}
                    onChange={(url) => setMainForm((prev) => ({ ...prev, bannerDesktop: url }))}
                    label="Desktop Storefront Banner"
                    aspectRatio="wide"
                    helperText="Landscape banner shown at top of catalog"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#2C2018] pt-4">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                    <input
                      type="checkbox"
                      checked={mainForm.isActive ?? true}
                      onChange={(e) => setMainForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded bg-[#140D09] border-[#2C2018] text-amber-500 focus:ring-0"
                    />
                    <span>Active</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Sort Order:</span>
                    <input
                      type="number"
                      value={mainForm.sortOrder ?? 0}
                      onChange={(e) => setMainForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      className="w-16 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded-lg transition-colors"
                >
                  {isCreatingMain ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Main Categories List */}
          <div className="bg-[#1C130E] rounded-xl border border-[#2C2018] divide-y divide-[#2C2018]">
            {mainCategories.map((c) => {
              const count = products.filter((p) => p.mainCategoryId === c.id).length;
              const childSubs = subCategories.filter((s) => s.mainCategoryId === c.id);

              return (
                <div key={c.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#251A13] transition-colors">
                  <div className="flex items-start gap-4">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt={c.name} className="w-12 h-12 rounded-lg object-cover border border-[#2C2018] shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg shrink-0">
                        📂
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-sm font-medium text-[#FDFBF7]">{c.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#140D09] text-amber-400 border border-[#2C2018]">
                          {count} Products
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                          {childSubs.length} Subcategories
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">{c.description}</p>
                      {childSubs.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="text-[10px] text-stone-500">Subs:</span>
                          {childSubs.map((s) => (
                            <span key={s.id} className="text-[10px] bg-[#140D09] px-1.5 py-0.5 rounded border border-[#2C2018] text-stone-300">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleStartEditMain(c)}
                      className="px-3 py-1.5 bg-[#2C2018] hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-xs rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMain(c.id, c.name)}
                      className="px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs rounded border border-red-900/40 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub Categories Tab */}
      {activeSubTab === 'sub' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleStartCreateSub}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <span>+</span>
              <span>Create Subcategory</span>
            </button>
          </div>

          {(isCreatingSub || editingSubId) && (
            <form onSubmit={handleSaveSub} className="bg-[#1C130E] p-6 rounded-xl border border-amber-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2C2018] pb-3">
                <h3 className="font-serif text-base text-amber-300">
                  {isCreatingSub ? 'New Subcategory' : `Edit Subcategory: ${subForm.name}`}
                </h3>
                <button type="button" onClick={() => { setIsCreatingSub(false); setEditingSubId(null); }} className="text-stone-400 hover:text-stone-200 text-sm">
                  ✕ Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Parent Main Category *</label>
                  <select
                    required
                    value={subForm.mainCategoryId || ''}
                    onChange={(e) => setSubForm((prev) => ({ ...prev, mainCategoryId: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                  >
                    {mainCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Subcategory Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Luxury Glass Jar Candles"
                    value={subForm.name || ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSubForm((prev) => ({
                        ...prev,
                        name: v,
                        slug: isCreatingSub ? v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
                      }));
                    }}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. luxury-glass-jar-candles"
                    value={subForm.slug || ''}
                    onChange={(e) => setSubForm((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <AdminImageUploader
                    value={subForm.imageUrl || ''}
                    onChange={(url) => setSubForm((prev) => ({ ...prev, imageUrl: url }))}
                    label="Subcategory Thumbnail / Card Image"
                    helperText="Shown on subcategory filter cards"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Handcrafted in heavy frosted Italian glass vessels with timber dust covers."
                    value={subForm.description || ''}
                    onChange={(e) => setSubForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#2C2018] pt-4">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                    <input
                      type="checkbox"
                      checked={subForm.isActive ?? true}
                      onChange={(e) => setSubForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded bg-[#140D09] border-[#2C2018] text-amber-500 focus:ring-0"
                    />
                    <span>Active</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Sort Order:</span>
                    <input
                      type="number"
                      value={subForm.sortOrder ?? 0}
                      onChange={(e) => setSubForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      className="w-16 bg-[#140D09] border border-[#2C2018] rounded px-2 py-1 text-xs text-[#FDFBF7]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded-lg transition-colors"
                >
                  {isCreatingSub ? 'Create Subcategory' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Subcategories List */}
          <div className="bg-[#1C130E] rounded-xl border border-[#2C2018] divide-y divide-[#2C2018]">
            {subCategories.map((s) => {
              const parent = mainCategories.find((c) => c.id === s.mainCategoryId);
              const count = products.filter((p) => p.subCategoryId === s.id).length;

              return (
                <div key={s.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#251A13] transition-colors">
                  <div className="flex items-start gap-4">
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt={s.name} className="w-12 h-12 rounded-lg object-cover border border-[#2C2018] shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg shrink-0">
                        📑
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-sm font-medium text-[#FDFBF7]">{s.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          Parent: {parent?.name || 'Unassigned'}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#140D09] text-stone-400 border border-[#2C2018]">
                          {count} Products
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">{s.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleStartEditSub(s)}
                      className="px-3 py-1.5 bg-[#2C2018] hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-xs rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSub(s.id, s.name)}
                      className="px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs rounded border border-red-900/40 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
