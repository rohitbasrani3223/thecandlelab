import React from 'react';
import { useCMS } from '../../context/CMSContext';

export const AdminSEOManager: React.FC = () => {
  const { seoSettings, updateSEO } = useCMS();

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#EFE8DB] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">SEARCH ENGINE OPTIMIZATION</span>
        <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">SEO Meta Titles & Page Metadata</h1>
        <p className="text-xs text-[#7A6B5D] mt-1">Configure search engine titles, meta descriptions, and keywords per storefront page.</p>
      </div>

      <div className="space-y-6">
        {seoSettings.map((s) => (
          <div key={s.pageKey} className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-2">
              <h3 className="font-serif font-bold text-lg text-[#2C1E16] uppercase">
                🔍 Page: <span className="text-[#B88B38]">{s.pageKey}</span>
              </h3>
              <span className="text-[10px] font-bold bg-[#FAF6F0] text-[#7A6B5D] px-2.5 py-1 rounded-full border border-[#EFE8DB]">
                Page Route: #{s.pageKey}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Meta Title</label>
                <input
                  type="text"
                  value={s.title}
                  onChange={(e) => updateSEO(s.pageKey, { title: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={s.description}
                  onChange={(e) => updateSEO(s.pageKey, { description: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Keywords</label>
                <input
                  type="text"
                  value={s.keywords}
                  onChange={(e) => updateSEO(s.pageKey, { keywords: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
