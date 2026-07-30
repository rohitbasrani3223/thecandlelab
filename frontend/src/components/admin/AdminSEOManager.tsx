import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

type SEOSubTab = 'title' | 'description' | 'slug' | 'opengraph' | 'sitemap';

export const AdminSEOManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SEOSubTab>('title');
  const { seoSettings, updateSEO } = useCMS();
  const [savedMsg, setSavedMsg] = useState('');

  const SUB_TABS: { id: SEOSubTab; label: string; icon: string }[] = [
    { id: 'title', label: 'Meta Title', icon: '📌' },
    { id: 'description', label: 'Meta Description', icon: '📝' },
    { id: 'slug', label: 'Custom Slugs', icon: '🔗' },
    { id: 'opengraph', label: 'Open Graph (OG)', icon: '🌐' },
    { id: 'sitemap', label: 'Sitemap XML', icon: '🗺️' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">SEARCH ENGINE OPTIMIZATION</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">SEO & Open Graph Meta Controls</h1>
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

      {/* Dynamic Views */}
      {(activeSubTab === 'title' || activeSubTab === 'description') && (
        <div className="space-y-6">
          {seoSettings.map((s) => (
            <div key={s.pageKey} className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-2">
                <h3 className="font-serif font-bold text-lg text-[#2C1E16] uppercase">
                  🔍 Page: <span className="text-[#B88B38]">{s.pageKey}</span>
                </h3>
                <span className="text-[10px] font-bold bg-[#FAF6F0] text-[#7A6B5D] px-2.5 py-1 rounded-full border border-[#EFE8DB]">
                  Route: #{s.pageKey}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={s.title}
                    onChange={(e) => {
                      updateSEO(s.pageKey, { title: e.target.value });
                      setSavedMsg('Meta Title updated!');
                      setTimeout(() => setSavedMsg(''), 3000);
                    }}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={s.description}
                    onChange={(e) => {
                      updateSEO(s.pageKey, { description: e.target.value });
                      setSavedMsg('Meta Description updated!');
                      setTimeout(() => setSavedMsg(''), 3000);
                    }}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'slug' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">🔗 Custom URL Route Slugs</h3>
          <p className="text-xs text-[#7A6B5D]">Configure SEO friendly URL slugs (e.g., /collections/french-vanilla).</p>
        </div>
      )}

      {activeSubTab === 'opengraph' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">🌐 Open Graph (OG) Social Cards</h3>
          <p className="text-xs text-[#7A6B5D]">Preview social sharing cards for WhatsApp, Facebook, Twitter, and LinkedIn.</p>
        </div>
      )}

      {activeSubTab === 'sitemap' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">🗺️ XML Sitemap Status</h3>
          <p className="text-xs text-[#7A6B5D]">Auto-generated sitemap link: <code className="bg-[#FAF6F0] p-1 rounded font-mono">/sitemap.xml</code></p>
        </div>
      )}
    </div>
  );
};
