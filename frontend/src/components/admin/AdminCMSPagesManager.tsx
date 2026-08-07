import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

type CMSSubTab =
  | 'about'
  | 'contact'
  | 'privacy'
  | 'shipping'
  | 'refund'
  | 'terms'
  | 'blog'
  | 'careers';

export const AdminCMSPagesManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<CMSSubTab>('about');
  const { pagesContent, updatePagesContent } = useCMS();
  const [pagesForm, setPagesForm] = useState(pagesContent);
  const [savedMsg, setSavedMsg] = useState('');

  // Extended page states mapped into pagesContent
  const [contactData, setContactData] = useState({
    email: (pagesForm as any).contactEmail || 'care@thecandlelab.in',
    phone: (pagesForm as any).contactPhone || '+91 98765 43210',
    address: (pagesForm as any).contactAddress || '108 Artisan Avenue, Fragrance District, New Delhi, India 110001',
    hours: (pagesForm as any).contactHours || 'Mon - Sat: 10:00 AM - 7:00 PM IST',
  });

  const [termsText, setTermsText] = useState(
    pagesForm.termsConditions ||
      'Welcome to The Candle Lab. By browsing or purchasing from our storefront, you agree to comply with our Terms & Conditions...'
  );

  const [blogPosts, setBlogPosts] = useState(
    (pagesForm as any).blogPosts || [
      {
        id: '1',
        title: 'The Art of Candle Care: Trimming Wicks & Tunneling Prevention',
        author: 'Master Chandlers',
        date: '2026-07-15',
        status: 'Published',
        excerpt: 'Discover essential candle maintenance tips to ensure an even burn and maximum scent throw.',
      },
      {
        id: '2',
        title: 'Aromatherapy & Mood: Selecting the Right Fragrance Notes',
        author: 'Scent Specialist',
        date: '2026-07-20',
        status: 'Published',
        excerpt: 'How French Lavender and Madagascar Vanilla influence relaxation and productivity.',
      },
    ]
  );

  const [careers, setCareers] = useState(
    (pagesForm as any).careers || [
      { id: '1', role: 'Senior Fragrance Formulator', department: 'R&D', location: 'New Delhi', type: 'Full-Time' },
      { id: '2', role: 'E-Commerce Growth Manager', department: 'Marketing', location: 'Remote / New Delhi', type: 'Full-Time' },
    ]
  );

  const saveAllCMSPages = (extraUpdates: Record<string, any> = {}) => {
    const updatedPayload = {
      ...pagesForm,
      termsConditions: termsText,
      contactEmail: contactData.email,
      contactPhone: contactData.phone,
      contactAddress: contactData.address,
      contactHours: contactData.hours,
      blogPosts,
      careers,
      ...extraUpdates,
    };
    setPagesForm(updatedPayload as any);
    updatePagesContent(updatedPayload as any);
    setSavedMsg('CMS Content updated & published live!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllCMSPages();
  };

  const SUB_TABS: { id: CMSSubTab; label: string; icon: string }[] = [
    { id: 'about', label: 'About Us', icon: '📖' },
    { id: 'contact', label: 'Contact Details', icon: '📞' },
    { id: 'privacy', label: 'Privacy Policy', icon: '🔒' },
    { id: 'shipping', label: 'Shipping Policy', icon: '🚚' },
    { id: 'refund', label: 'Refund Policy', icon: '↩️' },
    { id: 'terms', label: 'Terms of Service', icon: '📋' },
    { id: 'blog', label: 'Blog & Articles', icon: '✍️' },
    { id: 'careers', label: 'Careers', icon: '💼' },
  ];

  return (
    <div className="space-y-6 font-sans max-w-6xl">
      {/* Top Header */}
      <div className="border-b border-[#EFE8DB] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">📄 CMS CONTENT MANAGEMENT</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Store Policies & Editorial CMS</h1>
          <p className="text-xs text-[#7A6B5D] mt-1">Manage static pages, legal policies, blog posts, contact details, and career openings.</p>
        </div>

        {savedMsg && (
          <span className="bg-[#2E6F40] text-white text-xs font-bold px-4 py-2 rounded-full shadow-subtle animate-bounce">
            ✓ {savedMsg}
          </span>
        )}
      </div>

      {/* Sub-Navigation Tabs Bar */}
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

      {/* Tab Contents */}
      <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 sm:p-8 shadow-subtle">
        {activeSubTab === 'about' && (
          <form onSubmit={handleSaveForm} className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">About Us Editorial Story</h3>
            <p className="text-xs text-[#7A6B5D]">Displayed on the About Us page detailing our artisanal origins and hand-pouring craft.</p>
            <textarea
              rows={8}
              value={pagesForm.aboutUs || ''}
              onChange={(e) => setPagesForm({ ...pagesForm, aboutUs: e.target.value })}
              className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-3.5 rounded-xl text-xs text-[#2C1E16] focus:outline-none focus:border-[#B88B38]"
            />
            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save About Us Content →
            </button>
          </form>
        )}

        {activeSubTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Contact Us Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">Customer Care Email</label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">Helpline Phone Number</label>
                <input
                  type="text"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold text-[#2C1E16] block mb-1">Flagship Studio Address</label>
                <input
                  type="text"
                  value={contactData.address}
                  onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold text-[#2C1E16] block mb-1">Support Operational Hours</label>
                <input
                  type="text"
                  value={contactData.hours}
                  onChange={(e) => setContactData({ ...contactData, hours: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>
            <button
              onClick={() => saveAllCMSPages()}
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Update Contact Details →
            </button>
          </div>
        )}

        {activeSubTab === 'privacy' && (
          <form onSubmit={handleSaveForm} className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Privacy Policy Overview</h3>
            <textarea
              rows={8}
              value={pagesForm.privacyPolicy || ''}
              onChange={(e) => setPagesForm({ ...pagesForm, privacyPolicy: e.target.value })}
              className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-3.5 rounded-xl text-xs text-[#2C1E16] focus:outline-none focus:border-[#B88B38]"
            />
            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Privacy Policy →
            </button>
          </form>
        )}

        {activeSubTab === 'shipping' && (
          <form onSubmit={handleSaveForm} className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Shipping & Delivery Policy</h3>
            <textarea
              rows={8}
              value={pagesForm.shippingPolicy || ''}
              onChange={(e) => setPagesForm({ ...pagesForm, shippingPolicy: e.target.value })}
              className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-3.5 rounded-xl text-xs text-[#2C1E16] focus:outline-none focus:border-[#B88B38]"
            />
            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Shipping Policy →
            </button>
          </form>
        )}

        {activeSubTab === 'refund' && (
          <form onSubmit={handleSaveForm} className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Refund & Return Policy</h3>
            <textarea
              rows={8}
              value={pagesForm.refundPolicy || ''}
              onChange={(e) => setPagesForm({ ...pagesForm, refundPolicy: e.target.value })}
              className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-3.5 rounded-xl text-xs text-[#2C1E16] focus:outline-none focus:border-[#B88B38]"
            />
            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Refund Policy →
            </button>
          </form>
        )}

        {activeSubTab === 'terms' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Terms of Service</h3>
            <textarea
              rows={8}
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
              className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-3.5 rounded-xl text-xs text-[#2C1E16] focus:outline-none focus:border-[#B88B38]"
            />
            <button
              onClick={() => saveAllCMSPages()}
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Update Terms of Service →
            </button>
          </div>
        )}

        {activeSubTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Artisanal Journal & Blog Posts</h3>
                <p className="text-xs text-[#7A6B5D]">Manage articles published on the storefront Blog.</p>
              </div>
              <button
                onClick={() => {
                  const newPost = {
                    id: Date.now().toString(),
                    title: 'New Scent Notes Guide 2026',
                    author: 'Editorial Team',
                    date: new Date().toISOString().split('T')[0],
                    status: 'Published',
                    excerpt: 'Exploring the rich fragrance profiles of our autumn candle releases.',
                  };
                  const updatedBlog = [...blogPosts, newPost];
                  setBlogPosts(updatedBlog);
                  saveAllCMSPages({ blogPosts: updatedBlog });
                }}
                className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
              >
                + Write New Article
              </button>
            </div>

            <div className="space-y-3">
              {blogPosts.map((post: any) => (
                <div key={post.id} className="p-4 bg-[#FAF6F0] border border-[#EFE8DB] rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-[#2C1E16] text-sm">{post.title}</h4>
                    <p className="text-[#7A6B5D] text-[11px] mt-0.5">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-[10px] text-[#A39282] mt-2">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>Published {post.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#2E6F40]/10 text-[#2E6F40] font-bold text-[10px] px-2.5 py-1 rounded-full">
                      {post.status}
                    </span>
                    <button
                      onClick={() => {
                        const updated = blogPosts.filter((b: any) => b.id !== post.id);
                        setBlogPosts(updated);
                        saveAllCMSPages({ blogPosts: updated });
                      }}
                      className="text-[#B93829] hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'careers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Careers & Job Openings</h3>
                <p className="text-xs text-[#7A6B5D]">Manage open positions at The Candle Lab studio and headquarters.</p>
              </div>
              <button
                onClick={() => {
                  const newRole = {
                    id: Date.now().toString(),
                    role: 'Production Chandler Assistant',
                    department: 'Operations',
                    location: 'New Delhi',
                    type: 'Full-Time',
                  };
                  const updatedCareers = [...careers, newRole];
                  setCareers(updatedCareers);
                  saveAllCMSPages({ careers: updatedCareers });
                }}
                className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
              >
                + Add Open Position
              </button>
            </div>

            <div className="space-y-3">
              {careers.map((job: any) => (
                <div key={job.id} className="p-4 bg-[#FAF6F0] border border-[#EFE8DB] rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-[#2C1E16] text-sm">{job.role}</h4>
                    <span className="text-[#7A6B5D] text-[11px] block mt-0.5">{job.department} • {job.location} ({job.type})</span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = careers.filter((c: any) => c.id !== job.id);
                      setCareers(updated);
                      saveAllCMSPages({ careers: updated });
                    }}
                    className="text-[#B93829] hover:underline font-bold text-[11px] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
