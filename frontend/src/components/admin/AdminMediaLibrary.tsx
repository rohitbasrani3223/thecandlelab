import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

type MediaSubTab = 'images' | 'videos' | 'icons' | 'documents';

export const AdminMediaLibrary: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<MediaSubTab>('images');
  const { mediaItems, addMediaItem, deleteMediaItem } = useCMS();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const SUB_TABS: { id: MediaSubTab; label: string; icon: string }[] = [
    { id: 'images', label: 'Images', icon: '🖼️' },
    { id: 'videos', label: 'Videos', icon: '🎥' },
    { id: 'icons', label: 'Icons', icon: '🎨' },
    { id: 'documents', label: 'Documents', icon: '📄' },
  ];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !name) return;
    addMediaItem({
      id: `m-${Date.now()}`,
      name,
      url,
      type: activeSubTab === 'videos' ? 'video' : 'image',
      size: '1.4 MB',
    });
    setUrl('');
    setName('');
    setSavedMsg('Media asset added to library!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">CENTRAL ASSET MANAGEMENT</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Media Library ({mediaItems.length})</h1>
        </div>

        {savedMsg && (
          <span className="bg-[#2E6F40] text-white text-xs font-bold px-4 py-2 rounded-full shadow-subtle animate-bounce">
            ✓ {savedMsg}
          </span>
        )}
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

      {/* Upload Media Form */}
      <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4 max-w-xl">
        <h3 className="font-serif font-bold text-lg text-[#2C1E16] border-b border-[#F2ECE1] pb-2">
          📷 Add {activeSubTab.toUpperCase()} Asset to Media Library
        </h3>

        <form onSubmit={handleUpload} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[#2C1E16] block uppercase mb-1">Asset Title / Name *</label>
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
            <label className="font-bold text-[#2C1E16] block uppercase mb-1">📁 Upload Media File from Device *</label>
            <div className="flex items-center gap-3">
              {url && (
                <div className="w-14 h-14 rounded-xl border border-[#EFE8DB] overflow-hidden shrink-0 bg-[#F8F3EA]">
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*,video/*"
                required={!url}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (!name) setName(file.name);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-xs text-[#2C1E16] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#B88B38] file:text-white hover:file:bg-[#A3792E] file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            + Upload Asset to Library
          </button>
        </form>
      </div>

      {/* Media Assets Grid */}
      {activeSubTab === 'images' && (
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
                  className="text-[#B93829] font-bold text-[10px] hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeSubTab === 'videos' || activeSubTab === 'icons' || activeSubTab === 'documents') && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-3">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16] capitalize">{activeSubTab} Media Vault</h3>
          <p className="text-xs text-[#7A6B5D]">Manage uploaded {activeSubTab} resources for video headers, icons, and PDF certificates.</p>
        </div>
      )}
    </div>
  );
};
