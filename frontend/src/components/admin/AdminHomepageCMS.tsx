import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export const AdminHomepageCMS: React.FC = () => {
  const { hero, updateHero, announcement, updateAnnouncement } = useCMS();
  const [heroForm, setHeroForm] = useState(hero);
  const [annForm, setAnnForm] = useState(announcement);
  const [savedMessage, setSavedMessage] = useState('');

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
    setSavedMessage('Hero Banner updated live across storefront!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleAnnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement(annForm);
    setSavedMessage('Announcement Bar updated live across storefront!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-[#EFE8DB] pb-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">STOREFRONT HOMEPAGE CMS</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Homepage & Hero Editor</h1>
          <p className="text-xs text-[#7A6B5D] mt-1">Changes made here update the homepage hero section and header announcement bar live in real-time.</p>
        </div>

        {savedMessage && (
          <span className="bg-[#2E6F40] text-white text-xs font-bold px-3 py-1.5 rounded-full animate-bounce">
            ✓ {savedMessage}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hero Section Form */}
        <div className="lg:col-span-7 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-6">
          <h3 className="font-serif font-bold text-xl text-[#2C1E16] border-b border-[#F2ECE1] pb-3">
            🎨 Hero Banner Section
          </h3>

          <form onSubmit={handleHeroSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Header Tagline</label>
              <input
                type="text"
                value={heroForm.tagline}
                onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Hero Main Heading *</label>
              <input
                type="text"
                required
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-serif text-base font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Hero Subtitle Paragraph</label>
              <textarea
                rows={3}
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={heroForm.primaryBtnText}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryBtnText: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Secondary Button Label</label>
                <input
                  type="text"
                  value={heroForm.secondaryBtnText}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnText: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Hero Background Image URL</label>
              <input
                type="url"
                value={heroForm.imageUrl}
                onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Update Hero Banner Live →
            </button>
          </form>
        </div>

        {/* Announcement Bar Form */}
        <div className="lg:col-span-5 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-6">
          <h3 className="font-serif font-bold text-xl text-[#2C1E16] border-b border-[#F2ECE1] pb-3">
            📢 Header Announcement Bar
          </h3>

          <form onSubmit={handleAnnSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Promo Message Text</label>
              <input
                type="text"
                value={annForm.text}
                onChange={(e) => setAnnForm({ ...annForm, text: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={annForm.couponCode}
                  onChange={(e) => setAnnForm({ ...annForm, couponCode: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Discount Tag</label>
                <input
                  type="text"
                  value={annForm.discountText}
                  onChange={(e) => setAnnForm({ ...annForm, discountText: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="annVisible"
                checked={annForm.visible}
                onChange={(e) => setAnnForm({ ...annForm, visible: e.target.checked })}
                className="w-4 h-4 accent-[#B88B38]"
              />
              <label htmlFor="annVisible" className="font-bold text-[#2C1E16]">Show Announcement Bar in Header</label>
            </div>

            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer w-full"
            >
              Update Announcement Bar →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
