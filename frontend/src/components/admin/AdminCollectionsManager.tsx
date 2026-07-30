import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import type { CMSCollection } from '../../context/CMSContext';

type ContentSubTab =
  | 'heroslider'
  | 'featured'
  | 'bestsellers'
  | 'newarrivals'
  | 'testimonials'
  | 'story'
  | 'video'
  | 'instagram'
  | 'newsletter'
  | 'faqs';

export const AdminCollectionsManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<ContentSubTab>('featured');
  const { collections, updateCollection } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CMSCollection>>({});
  const [savedMsg, setSavedMsg] = useState('');

  const [testimonials, setTestimonials] = useState([
    { id: '1', name: 'Rohan Malhotra', rating: 5, quote: 'The Vanilla Bourbon candle fills the entire penthouse with a sophisticated, rich aroma!' },
    { id: '2', name: 'Simran Kaur', rating: 5, quote: 'Packaging was elegant and the soy wax burns incredibly clean.' },
  ]);

  const [faqs, setFaqs] = useState([
    { id: '1', question: 'What type of wax is used in candles?', answer: 'We use 100% natural soy wax infused with pure botanical essential oils.' },
    { id: '2', question: 'How long do the 250g candles burn?', answer: 'Our 250g glass jars provide up to 65 hours of clean burn time.' },
  ]);

  const SUB_TABS: { id: ContentSubTab; label: string; icon: string }[] = [
    { id: 'heroslider', label: 'Hero Slider', icon: '🖼️' },
    { id: 'featured', label: 'Featured Collections', icon: '✨' },
    { id: 'bestsellers', label: 'Best Sellers', icon: '🔥' },
    { id: 'newarrivals', label: 'New Arrivals', icon: '🌟' },
    { id: 'testimonials', label: 'Testimonials', icon: '💬' },
    { id: 'story', label: 'Brand Story', icon: '📖' },
    { id: 'video', label: 'Video Sections', icon: '🎥' },
    { id: 'instagram', label: 'Instagram Feed', icon: '📸' },
    { id: 'newsletter', label: 'Newsletter', icon: '✉️' },
    { id: 'faqs', label: 'FAQs', icon: '❓' },
  ];

  const startEdit = (col: CMSCollection) => {
    setEditingId(col.id);
    setEditForm(col);
  };

  const saveEdit = (id: string) => {
    updateCollection(id, editForm);
    setEditingId(null);
    setSavedMsg('Collection updated live!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">STOREFRONT CONTENT & EDITORIAL</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Content Management System</h1>
        </div>

        {savedMsg && (
          <span className="bg-[#2E6F40] text-white text-xs font-bold px-4 py-2 rounded-full shadow-subtle animate-bounce">
            ✓ {savedMsg}
          </span>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
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
      {activeSubTab === 'featured' && (
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
                    <div>
                      <label className="font-bold text-[#2C1E16] block uppercase">📷 Upload Collection Banner Image</label>
                      <div className="flex items-center gap-3 mt-1">
                        {editForm.image && (
                          <div className="w-14 h-10 rounded-lg border border-[#EFE8DB] overflow-hidden shrink-0 bg-[#F8F3EA]">
                            <img src={editForm.image} alt="Collection Banner" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditForm({ ...editForm, image: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs text-[#2C1E16] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#B88B38] file:text-white hover:file:bg-[#A3792E] file:cursor-pointer cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs text-[#7A6B5D]">Cancel</button>
                      <button onClick={() => saveEdit(col.id)} className="bg-[#B88B38] text-white font-bold text-xs py-1.5 px-4 rounded-lg shadow-xs">Save</button>
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
                      <button onClick={() => startEdit(col)} className="text-xs font-bold text-[#B88B38] hover:underline">Edit</button>
                    </div>
                    <p className="text-xs text-[#7A6B5D] font-light leading-relaxed">{col.desc}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeSubTab === 'testimonials' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">💬 Customer Testimonials & Reviews</h3>
            <button
              onClick={() => {
                setTestimonials([...testimonials, { id: Date.now().toString(), name: 'Aarav Gupta', rating: 5, quote: 'Top tier quality fragrance!' }]);
                setSavedMsg('Testimonial added!');
                setTimeout(() => setSavedMsg(''), 3000);
              }}
              className="bg-[#B88B38] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
            >
              + Add Testimonial
            </button>
          </div>
          <div className="space-y-3 text-xs">
            {testimonials.map((t) => (
              <div key={t.id} className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
                <strong className="text-[#2C1E16] block">{t.name} ({'★'.repeat(t.rating)})</strong>
                <p className="text-[#7A6B5D] mt-1">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'faqs' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">❓ Frequently Asked Questions</h3>
          <div className="space-y-3 text-xs">
            {faqs.map((f) => (
              <div key={f.id} className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
                <strong className="text-[#2C1E16] block text-sm">{f.question}</strong>
                <p className="text-[#7A6B5D] mt-1">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeSubTab === 'heroslider' || activeSubTab === 'bestsellers' || activeSubTab === 'newarrivals' || activeSubTab === 'story' || activeSubTab === 'video' || activeSubTab === 'instagram' || activeSubTab === 'newsletter') && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16] capitalize">{activeSubTab} Section Manager</h3>
          <p className="text-xs text-[#7A6B5D]">Configure layout items, promotional text, and images for this section.</p>
        </div>
      )}
    </div>
  );
};
