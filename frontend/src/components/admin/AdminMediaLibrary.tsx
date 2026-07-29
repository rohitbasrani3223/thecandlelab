import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export const AdminMediaLibrary: React.FC = () => {
  const { mediaItems, addMediaItem, deleteMediaItem } = useCMS();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !name) return;
    addMediaItem({
      id: `m-${Date.now()}`,
      name,
      url,
      type: 'image',
      size: '1.4 MB',
    });
    setUrl('');
    setName('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#EFE8DB] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">CENTRAL ASSET MANAGEMENT</span>
        <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Media Library ({mediaItems.length})</h1>
        <p className="text-xs text-[#7A6B5D] mt-1">Upload and reuse image assets across products, homepage banners, and blog editorials.</p>
      </div>

      {/* Add Media Form */}
      <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4 max-w-xl">
        <h3 className="font-serif font-bold text-lg text-[#2C1E16] border-b border-[#F2ECE1] pb-2">
          📷 Add Asset to Media Library
        </h3>

        <form onSubmit={handleUpload} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[#2C1E16] block uppercase mb-1">Asset Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. vanilla_candle_hero.jpg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
            />
          </div>

          <div>
            <label className="font-bold text-[#2C1E16] block uppercase mb-1">Image / Asset URL *</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/photo-..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            + Add Asset to Library
          </button>
        </form>
      </div>

      {/* Media Assets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaItems.map((m) => (
          <div key={m.id} className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle group space-y-2 p-3">
            <div className="relative aspect-4/3 bg-[#F8F3EA] rounded-xl overflow-hidden">
              <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-bold text-[#2C1E16] truncate text-[11px] max-w-[120px]">{m.name}</span>
              <button
                onClick={() => deleteMediaItem(m.id)}
                className="text-[#B93829] font-bold text-[10px] hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
