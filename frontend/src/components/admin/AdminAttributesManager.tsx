import React, { useState } from 'react';
import { useCMS, type CMSSize, type CMSColor, type CMSWickType } from '../../context/CMSContext';

export const AdminAttributesManager: React.FC = () => {
  const {
    sizes,
    addSize,
    updateSize,
    deleteSize,
    colors,
    addColor,
    updateColor,
    deleteColor,
    wickTypes,
    addWickType,
    updateWickType,
    deleteWickType,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<'sizes' | 'colors' | 'wicks'>('sizes');

  // Sizes Form State
  const [sizeForm, setSizeForm] = useState<Partial<CMSSize>>({ name: '', slug: '', unit: 'g', value: 200, isActive: true, sortOrder: 0 });
  const [editingSizeId, setEditingSizeId] = useState<string | null>(null);

  // Colors Form State
  const [colorForm, setColorForm] = useState<Partial<CMSColor>>({ name: '', hexCode: '#FAF6F0', swatchImage: '', isActive: true, sortOrder: 0 });
  const [editingColorId, setEditingColorId] = useState<string | null>(null);

  // Wick Types Form State
  const [wickForm, setWickForm] = useState<Partial<CMSWickType>>({ name: '', description: '', additionalPrice: 0, isActive: true, sortOrder: 0 });
  const [editingWickId, setEditingWickId] = useState<string | null>(null);

  // Size Actions
  const handleSaveSize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sizeForm.name?.trim()) return;
    if (editingSizeId) {
      await updateSize(editingSizeId, sizeForm);
    } else {
      await addSize(sizeForm);
    }
    setSizeForm({ name: '', slug: '', unit: 'g', value: 200, isActive: true, sortOrder: 0 });
    setEditingSizeId(null);
  };

  // Color Actions
  const handleSaveColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorForm.name?.trim() || !colorForm.hexCode) return;
    if (editingColorId) {
      await updateColor(editingColorId, colorForm);
    } else {
      await addColor(colorForm);
    }
    setColorForm({ name: '', hexCode: '#FAF6F0', swatchImage: '', isActive: true, sortOrder: 0 });
    setEditingColorId(null);
  };

  // Wick Actions
  const handleSaveWick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wickForm.name?.trim()) return;
    if (editingWickId) {
      await updateWickType(editingWickId, wickForm);
    } else {
      await addWickType(wickForm);
    }
    setWickForm({ name: '', description: '', additionalPrice: 0, isActive: true, sortOrder: 0 });
    setEditingWickId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1C130E] p-6 rounded-xl border border-[#2C2018]">
        <div>
          <h2 className="text-xl font-serif text-[#FDFBF7] font-medium">Attribute Master Directory</h2>
          <p className="text-xs text-stone-400 mt-1">
            Manage reusable product options: Generic Sizes (grams / ml), Color swatches, and Candle Wick types.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('sizes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'sizes' ? 'bg-amber-600 text-stone-950 font-semibold' : 'bg-[#251A13] text-stone-300 hover:bg-[#2C2018]'
            }`}
          >
            Sizes ({sizes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'colors' ? 'bg-amber-600 text-stone-950 font-semibold' : 'bg-[#251A13] text-stone-300 hover:bg-[#2C2018]'
            }`}
          >
            Colors ({colors.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('wicks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'wicks' ? 'bg-amber-600 text-stone-950 font-semibold' : 'bg-[#251A13] text-stone-300 hover:bg-[#2C2018]'
            }`}
          >
            Wick Types ({wickTypes.length})
          </button>
        </div>
      </div>

      {/* SIZES TAB */}
      {activeTab === 'sizes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <form onSubmit={handleSaveSize} className="bg-[#1C130E] p-5 rounded-xl border border-amber-500/20 space-y-4 h-fit">
            <h3 className="font-serif text-sm text-amber-300 font-medium">
              {editingSizeId ? 'Edit Product Size' : 'Add New Generic Size'}
            </h3>
            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Display Label *</label>
              <input
                type="text"
                required
                placeholder="e.g. 200g Classic Atelier"
                value={sizeForm.name || ''}
                onChange={(e) => setSizeForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded px-3 py-1.5 text-xs text-[#FDFBF7]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Numeric Value</label>
                <input
                  type="number"
                  placeholder="200"
                  value={sizeForm.value || ''}
                  onChange={(e) => setSizeForm((p) => ({ ...p, value: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded px-3 py-1.5 text-xs text-[#FDFBF7]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Unit</label>
                <select
                  value={sizeForm.unit || 'g'}
                  onChange={(e) => setSizeForm((p) => ({ ...p, unit: e.target.value }))}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded px-3 py-1.5 text-xs text-[#FDFBF7]"
                >
                  <option value="g">grams (g)</option>
                  <option value="ml">milliliters (ml)</option>
                  <option value="oz">ounces (oz)</option>
                  <option value="pcs">pieces (pcs)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={sizeForm.isActive ?? true}
                  onChange={(e) => setSizeForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="rounded bg-[#140D09] border-[#2C2018] text-amber-500"
                />
                <span>Active</span>
              </label>
              <div className="flex gap-2">
                {editingSizeId && (
                  <button
                    type="button"
                    onClick={() => { setEditingSizeId(null); setSizeForm({ name: '', slug: '', unit: 'g', value: 200, isActive: true, sortOrder: 0 }); }}
                    className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded">
                  {editingSizeId ? 'Update Size' : 'Add Size'}
                </button>
              </div>
            </div>
          </form>

          {/* List */}
          <div className="lg:col-span-2 bg-[#1C130E] rounded-xl border border-[#2C2018] divide-y divide-[#2C2018]">
            {sizes.map((s) => (
              <div key={s.id} className="p-3.5 flex items-center justify-between hover:bg-[#251A13] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-300 font-mono text-xs flex items-center justify-center border border-amber-500/20">
                    {s.value}{s.unit}
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-[#FDFBF7]">{s.name}</h4>
                    <p className="text-[10px] font-mono text-stone-500">Unit: {s.unit} • Value: {s.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingSizeId(s.id); setSizeForm(s); }}
                    className="px-2.5 py-1 bg-[#2C2018] hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-xs rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSize(s.id)}
                    className="px-2.5 py-1 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs rounded border border-red-900/40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COLORS TAB */}
      {activeTab === 'colors' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveColor} className="bg-[#1C130E] p-5 rounded-xl border border-amber-500/20 space-y-4 h-fit">
            <h3 className="font-serif text-sm text-amber-300 font-medium">
              {editingColorId ? 'Edit Product Color' : 'Add New Product Color'}
            </h3>
            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Color Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Matte Obsidian Black"
                value={colorForm.name || ''}
                onChange={(e) => setColorForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded px-3 py-1.5 text-xs text-[#FDFBF7]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Hex Color Code *</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorForm.hexCode || '#FAF6F0'}
                  onChange={(e) => setColorForm((p) => ({ ...p, hexCode: e.target.value }))}
                  className="w-9 h-9 rounded bg-[#140D09] border border-[#2C2018] cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  required
                  placeholder="#FAF6F0"
                  value={colorForm.hexCode || ''}
                  onChange={(e) => setColorForm((p) => ({ ...p, hexCode: e.target.value }))}
                  className="flex-1 bg-[#140D09] border border-[#2C2018] rounded px-3 py-1.5 text-xs text-[#FDFBF7] font-mono"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={colorForm.isActive ?? true}
                  onChange={(e) => setColorForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="rounded bg-[#140D09] border-[#2C2018] text-amber-500"
                />
                <span>Active</span>
              </label>
              <div className="flex gap-2">
                {editingColorId && (
                  <button
                    type="button"
                    onClick={() => { setEditingColorId(null); setColorForm({ name: '', hexCode: '#FAF6F0', swatchImage: '', isActive: true, sortOrder: 0 }); }}
                    className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded">
                  {editingColorId ? 'Update Color' : 'Add Color'}
                </button>
              </div>
            </div>
          </form>

          <div className="lg:col-span-2 bg-[#1C130E] rounded-xl border border-[#2C2018] divide-y divide-[#2C2018]">
            {colors.map((c) => (
              <div key={c.id} className="p-3.5 flex items-center justify-between hover:bg-[#251A13] transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full border border-stone-600 shadow-inner shrink-0"
                    style={{ backgroundColor: c.hexCode }}
                  />
                  <div>
                    <h4 className="text-xs font-medium text-[#FDFBF7]">{c.name}</h4>
                    <p className="text-[10px] font-mono text-stone-500">{c.hexCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingColorId(c.id); setColorForm(c); }}
                    className="px-2.5 py-1 bg-[#2C2018] hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-xs rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteColor(c.id)}
                    className="px-2.5 py-1 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs rounded border border-red-900/40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WICK TYPES TAB */}
      {activeTab === 'wicks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveWick} className="bg-[#1C130E] p-5 rounded-xl border border-amber-500/20 space-y-4 h-fit">
            <h3 className="font-serif text-sm text-amber-300 font-medium">
              {editingWickId ? 'Edit Wick Option' : 'Add New Wick Option'}
            </h3>
            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Wick Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Wood Wick (Crackling)"
                value={wickForm.name || ''}
                onChange={(e) => setWickForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded px-3 py-1.5 text-xs text-[#FDFBF7]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Description / Burn Note</label>
              <textarea
                rows={2}
                placeholder="Sustainably sourced FSC wood that emits a soothing fireside crackle."
                value={wickForm.description || ''}
                onChange={(e) => setWickForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded px-3 py-1.5 text-xs text-[#FDFBF7]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Additional Price (₹)</label>
              <input
                type="number"
                value={wickForm.additionalPrice ?? 0}
                onChange={(e) => setWickForm((p) => ({ ...p, additionalPrice: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded px-3 py-1.5 text-xs text-[#FDFBF7]"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={wickForm.isActive ?? true}
                  onChange={(e) => setWickForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="rounded bg-[#140D09] border-[#2C2018] text-amber-500"
                />
                <span>Active</span>
              </label>
              <div className="flex gap-2">
                {editingWickId && (
                  <button
                    type="button"
                    onClick={() => { setEditingWickId(null); setWickForm({ name: '', description: '', additionalPrice: 0, isActive: true, sortOrder: 0 }); }}
                    className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded">
                  {editingWickId ? 'Update Wick' : 'Add Wick'}
                </button>
              </div>
            </div>
          </form>

          <div className="lg:col-span-2 bg-[#1C130E] rounded-xl border border-[#2C2018] divide-y divide-[#2C2018]">
            {wickTypes.map((w) => (
              <div key={w.id} className="p-3.5 flex items-center justify-between hover:bg-[#251A13] transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-medium text-[#FDFBF7]">{w.name}</h4>
                    {w.additionalPrice > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        +₹{w.additionalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">{w.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingWickId(w.id); setWickForm(w); }}
                    className="px-2.5 py-1 bg-[#2C2018] hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-xs rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteWickType(w.id)}
                    className="px-2.5 py-1 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs rounded border border-red-900/40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
