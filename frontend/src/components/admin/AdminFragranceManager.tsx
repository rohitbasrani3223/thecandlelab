import React, { useState } from 'react';
import { useCMS, type CMSFragrance } from '../../context/CMSContext';
import { AdminImageUploader } from './AdminImageUploader';

export const AdminFragranceManager: React.FC = () => {
  const { fragrances, addFragrance, updateFragrance, deleteFragrance } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<CMSFragrance>>({
    name: '',
    slug: '',
    imageUrl: '',
    shortDescription: '',
    scentProfile: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    scentFamily: 'Floral',
    intensity: 'Medium',
    isActive: true,
    sortOrder: 0,
  });

  const scentFamilies = ['Floral', 'Woody', 'Gourmand', 'Fresh Herbal', 'Fresh Citrus', 'Woody Oriental', 'Spicy', 'Aquatic'];
  const intensityLevels = ['Light & Subtle', 'Medium', 'Rich', 'Intense', 'Continuous & Gentle'];

  const handleStartCreate = () => {
    setFormData({
      name: '',
      slug: '',
      imageUrl: '',
      shortDescription: '',
      scentProfile: '',
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      scentFamily: 'Floral',
      intensity: 'Medium',
      isActive: true,
      sortOrder: fragrances.length + 1,
    });
    setEditingId(null);
    setIsCreating(true);
  };

  const handleStartEdit = (f: CMSFragrance) => {
    setFormData(f);
    setEditingId(f.id);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Fragrance name is required.');
      return;
    }

    if (isCreating) {
      await addFragrance(formData);
    } else if (editingId) {
      await updateFragrance(editingId, formData);
    }

    handleCancel();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete fragrance "${name}"?`)) {
      await deleteFragrance(id);
    }
  };

  const filteredFragrances = fragrances.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.scentProfile && f.scentProfile.toLowerCase().includes(search.toLowerCase())) ||
      (f.scentFamily && f.scentFamily.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1C130E] p-6 rounded-xl border border-[#2C2018]">
        <div>
          <h2 className="text-xl font-serif text-[#FDFBF7] font-medium">Fragrance Olfactory Library</h2>
          <p className="text-xs text-stone-400 mt-1">
            Manage your master fragrance catalog, scent pyramids (Top, Heart, Base notes), intensities, and active availability.
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartCreate}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span>✨</span>
          <span>Add New Fragrance</span>
        </button>
      </div>

      {/* Editor Modal / Panel */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-[#1C130E] p-6 rounded-xl border border-amber-500/30 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2C2018] pb-4">
            <h3 className="font-serif text-lg text-amber-300">
              {isCreating ? 'Create New Master Fragrance' : `Edit Fragrance: ${formData.name}`}
            </h3>
            <button type="button" onClick={handleCancel} className="text-stone-400 hover:text-stone-200 text-sm">
              ✕ Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Fragrance Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Vanilla Bourbon & Toasted Tonka"
                value={formData.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name: val,
                    slug: isCreating ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
                  }));
                }}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">URL Slug</label>
              <input
                type="text"
                placeholder="e.g. vanilla-bourbon-toasted-tonka"
                value={formData.slug || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Short Description / Olfactory Mood</label>
              <input
                type="text"
                placeholder="e.g. Rich Madagascar vanilla pod infused with dark spiced rum and caramelized tonka."
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Scent Profile / Mood</label>
              <input
                type="text"
                placeholder="e.g. Warm Gourmand & Spiced Vanilla"
                value={formData.scentProfile || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, scentProfile: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <AdminImageUploader
                value={formData.imageUrl || ''}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                label="Fragrance Image / Floral Swatch"
                helperText="Upload image of ingredients, raw botanicals, or perfume bottle"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Scent Family</label>
              <select
                value={formData.scentFamily || 'Floral'}
                onChange={(e) => setFormData((prev) => ({ ...prev, scentFamily: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
              >
                {scentFamilies.map((fam) => (
                  <option key={fam} value={fam}>
                    {fam}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Intensity</label>
              <select
                value={formData.intensity || 'Medium'}
                onChange={(e) => setFormData((prev) => ({ ...prev, intensity: e.target.value }))}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
              >
                {intensityLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fragrance Pyramid Section */}
          <div className="border-t border-[#2C2018] pt-4">
            <h4 className="text-xs font-mono uppercase text-amber-400 mb-3">Fragrance Pyramid Notes</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-stone-400 mb-1">Top Notes (Initial Impression)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Madagascar Vanilla Bean, Caramelized Sugar"
                  value={formData.topNotes || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, topNotes: e.target.value }))}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-stone-400 mb-1">Heart Notes (Core Accord)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bourbon Pod, French Butter, Spiced Nutmeg"
                  value={formData.heartNotes || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heartNotes: e.target.value }))}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-stone-400 mb-1">Base Notes (Lasting Trail)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Toasted Tonka Bean, Golden Amber, Cashmere Musk"
                  value={formData.baseNotes || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, baseNotes: e.target.value }))}
                  className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-2 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#2C2018] pt-4">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded bg-[#140D09] border-[#2C2018] text-amber-500 focus:ring-0"
                />
                <span>Active for selection</span>
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

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-[#251A13] hover:bg-[#2C2018] text-stone-300 text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs rounded-lg transition-colors shadow-md"
              >
                {isCreating ? 'Create Fragrance' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search & List */}
      <div className="bg-[#1C130E] rounded-xl border border-[#2C2018] overflow-hidden">
        <div className="p-4 border-b border-[#2C2018] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search fragrances by name, notes, family..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-500"
            />
            <span className="absolute left-2.5 top-2 text-stone-500 text-xs">🔍</span>
          </div>
          <span className="text-xs font-mono text-stone-400">{filteredFragrances.length} Fragrances</span>
        </div>

        <div className="divide-y divide-[#2C2018]">
          {filteredFragrances.map((f) => (
            <div key={f.id} className="p-4 hover:bg-[#251A13] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {f.imageUrl ? (
                  <img src={f.imageUrl} alt={f.name} className="w-14 h-14 rounded-lg object-cover border border-[#2C2018] shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
                    🌸
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif text-sm font-medium text-[#FDFBF7]">{f.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#140D09] border border-[#2C2018] text-amber-400">
                      {f.scentFamily}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                      {f.intensity}
                    </span>
                    {!f.isActive && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/30 border border-red-800 text-red-300">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-1 max-w-2xl">{f.shortDescription || f.scentProfile}</p>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-stone-500 mt-2 flex-wrap">
                    {f.topNotes && <span>Top: <span className="text-stone-400">{f.topNotes}</span></span>}
                    {f.heartNotes && <span>Heart: <span className="text-stone-400">{f.heartNotes}</span></span>}
                    {f.baseNotes && <span>Base: <span className="text-stone-400">{f.baseNotes}</span></span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartEdit(f)}
                  className="px-3 py-1.5 bg-[#2C2018] hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-xs rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(f.id, f.name)}
                  className="px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs rounded border border-red-900/40 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredFragrances.length === 0 && (
            <div className="p-8 text-center text-stone-500 text-xs">No fragrances found matching your search.</div>
          )}
        </div>
      </div>
    </div>
  );
};
