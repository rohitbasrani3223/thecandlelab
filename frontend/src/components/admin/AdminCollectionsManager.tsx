import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import type { CMSCollection } from '../../context/CMSContext';

export const AdminCollectionsManager: React.FC = () => {
  const { collections, updateCollection } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CMSCollection>>({});

  const startEdit = (col: CMSCollection) => {
    setEditingId(col.id);
    setEditForm(col);
  };

  const saveEdit = (id: string) => {
    updateCollection(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#EFE8DB] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">CURATED COLLECTIONS CMS</span>
        <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Manage 8 Signature Collections</h1>
        <p className="text-xs text-[#7A6B5D] mt-1">Control title, icon, descriptions, and badges across the storefront mega menu & collections page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => {
          const isEditing = editingId === col.id;
          return (
            <div key={col.id} className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
              {isEditing ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[#2C1E16] block uppercase">Collection Title</label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[#2C1E16] block uppercase">Icon</label>
                      <input
                        type="text"
                        value={editForm.icon || ''}
                        onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#2C1E16] block uppercase">Badge</label>
                      <input
                        type="text"
                        value={editForm.badge || ''}
                        onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#2C1E16] block uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={editForm.desc || ''}
                      onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2 rounded-lg text-[#2C1E16]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-xs text-[#7A6B5D]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(col.id)}
                      className="bg-[#B88B38] text-white font-bold text-xs py-1.5 px-4 rounded-lg shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{col.icon}</span>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#2C1E16]">{col.title}</h3>
                        <span className="text-[10px] text-[#B88B38] uppercase font-bold tracking-wider">{col.badge}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => startEdit(col)}
                      className="text-xs font-bold text-[#B88B38] hover:underline"
                    >
                      Edit Collection
                    </button>
                  </div>

                  <p className="text-xs text-[#7A6B5D] font-light leading-relaxed">{col.desc}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
