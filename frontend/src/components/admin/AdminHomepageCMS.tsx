import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

type StorefrontSubTab =
  | 'homepage'
  | 'header'
  | 'footer'
  | 'megamenu'
  | 'announcement'
  | 'theme';

export const AdminHomepageCMS: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<StorefrontSubTab>('homepage');
  const { hero, updateHero, announcement, updateAnnouncement } = useCMS();
  const [heroForm, setHeroForm] = useState(hero);
  const [annForm, setAnnForm] = useState(announcement);
  const [savedMessage, setSavedMessage] = useState('');

  // Local state for layout components
  const [sections, setSections] = useState([
    { id: 'hero', name: 'Hero Banner Carousel', enabled: true },
    { id: 'categories', name: 'Category Grid', enabled: true },
    { id: 'featured', name: 'Featured Products Slider', enabled: true },
    { id: 'story', name: 'Brand Heritage & Craft Story', enabled: true },
    { id: 'testimonials', name: 'Customer Reviews Carousel', enabled: true },
  ]);

  const [headerSettings, setHeaderSettings] = useState({
    stickyHeader: true,
    showSearch: true,
    showWishlist: true,
    noticeText: 'Complimentary Pan-India Shipping on Orders ₹999+',
  });

  const [footerSettings, setFooterSettings] = useState({
    copyrightText: '© 2026 The Candle Lab India. Handcrafted Luxury Candles.',
    showPaymentIcons: true,
    showNewsletterBox: true,
  });

  const [megaMenu, _setMegaMenu] = useState([
    { id: '1', title: 'Scented Jars', items: ['French Vanilla', 'Royal Amber & Oud', 'Lavender Luxe'] },
    { id: '2', title: 'Wax Melts', items: ['Rose Petal Melts', 'Cinnamon Spice', 'Eucalyptus Mint'] },
    { id: '3', title: 'Gift Sets', items: ['Festive Trio Box', 'Romance Votive Pair', 'Luxury Artisan Set'] },
  ]);

  const [themeColors, setThemeColors] = useState({
    primary: '#B88B38',
    dark: '#1C130E',
    light: '#FAF6F0',
    accent: '#B93829',
  });

  const SUB_TABS: { id: StorefrontSubTab; label: string; icon: string }[] = [
    { id: 'homepage', label: 'Homepage Builder (Drag & Drop)', icon: '🧩' },
    { id: 'header', label: 'Header Builder', icon: '🔝' },
    { id: 'footer', label: 'Footer Builder', icon: '🔻' },
    { id: 'megamenu', label: 'Mega Menu Builder', icon: '📂' },
    { id: 'announcement', label: 'Announcement Bar', icon: '📢' },
    { id: 'theme', label: 'Theme Settings', icon: '🎨' },
  ];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
    setSavedMessage('Hero Banner updated live!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleAnnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement(annForm);
    setSavedMessage('Announcement Bar updated live!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-[#EFE8DB] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">STOREFRONT BUILDER & DESIGN</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Storefront Layout & Theme Builder</h1>
          <p className="text-xs text-[#7A6B5D] mt-1">Configure layout sections, headers, footers, mega menu, and brand colors.</p>
        </div>

        {savedMessage && (
          <span className="bg-[#2E6F40] text-white text-xs font-bold px-4 py-2 rounded-full shadow-subtle animate-bounce">
            ✓ {savedMessage}
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

      {/* Dynamic Sub-Tab Views */}
      <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 sm:p-8 shadow-subtle">
        {activeSubTab === 'homepage' && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#2C1E16]">Homepage Drag & Drop Layout Builder</h3>
            <p className="text-xs text-[#7A6B5D]">Reorder or enable/disable sections displayed on the storefront home page.</p>
            
            <div className="space-y-3 max-w-xl">
              {sections.map((sec, idx) => (
                <div key={sec.id} className="flex items-center justify-between p-3.5 bg-[#FAF6F0] border border-[#EFE8DB] rounded-xl text-xs">
                  <div className="flex items-center gap-3">
                    <span className="cursor-grab text-[#B88B38] font-bold">⋮⋮ {idx + 1}.</span>
                    <strong className="text-[#2C1E16]">{sec.name}</strong>
                  </div>
                  <input
                    type="checkbox"
                    checked={sec.enabled}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[idx].enabled = e.target.checked;
                      setSections(updated);
                    }}
                    className="w-4 h-4 accent-[#B88B38]"
                  />
                </div>
              ))}
            </div>

            {/* Hero Form */}
            <div className="pt-6 border-t border-[#EFE8DB] max-w-3xl space-y-4">
              <h4 className="font-serif font-bold text-lg text-[#2C1E16]">Hero Banner & Background Photo Content</h4>
              <form onSubmit={handleHeroSubmit} className="space-y-4 text-xs">
                {/* Layout Selector */}
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1.5">🖼️ Hero Layout Design Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${heroForm.layoutStyle === 'centered-glass' ? 'bg-[#FAF6F0] border-[#B88B38] font-bold text-[#2C1E16]' : 'bg-white border-[#EFE8DB] text-[#7A6B5D]'}`}>
                      <input
                        type="radio"
                        name="layoutStyle"
                        value="centered-glass"
                        checked={heroForm.layoutStyle === 'centered-glass' || !heroForm.layoutStyle}
                        onChange={() => setHeroForm({ ...heroForm, layoutStyle: 'centered-glass' })}
                        className="accent-[#B88B38]"
                      />
                      <span>Centered Full-Bleed (scentandchill style)</span>
                    </label>
                    <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${heroForm.layoutStyle === 'split-overlay' ? 'bg-[#FAF6F0] border-[#B88B38] font-bold text-[#2C1E16]' : 'bg-white border-[#EFE8DB] text-[#7A6B5D]'}`}>
                      <input
                        type="radio"
                        name="layoutStyle"
                        value="split-overlay"
                        checked={heroForm.layoutStyle === 'split-overlay'}
                        onChange={() => setHeroForm({ ...heroForm, layoutStyle: 'split-overlay' })}
                        className="accent-[#B88B38]"
                      />
                      <span>Split Glassmorphic Card Overlay</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#2C1E16] block uppercase mb-1">Tagline</label>
                    <input
                      type="text"
                      value={heroForm.tagline}
                      onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#2C1E16] block uppercase mb-1">Main Heading</label>
                    <input
                      type="text"
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Subtitle / Description</label>
                  <textarea
                    rows={2}
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
                    <label className="font-bold text-[#2C1E16] block uppercase mb-1">Secondary CTA Button Label</label>
                    <input
                      type="text"
                      value={heroForm.secondaryBtnText}
                      onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnText: e.target.value })}
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">📷 Upload Hero Section Background Image Photo</label>
                  <div className="flex items-center gap-3">
                    {heroForm.imageUrl && (
                      <div className="w-20 h-14 rounded-lg border border-[#EFE8DB] overflow-hidden shrink-0 bg-[#F8F3EA]">
                        <img src={heroForm.imageUrl} alt="Banner Background Preview" className="w-full h-full object-cover" />
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
                            setHeroForm({ ...heroForm, imageUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-[#2C1E16] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#B88B38] file:text-white hover:file:bg-[#A3792E] file:cursor-pointer cursor-pointer"
                    />
                  </div>
                </div>

                {/* Glass Card Overlay Featured Candle Settings */}
                <div className="pt-4 border-t border-[#EFE8DB] space-y-4">
                  <h5 className="font-serif font-bold text-sm text-[#2C1E16]">✨ Featured Glassmorphic Card (Right Side Overlay)</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[#2C1E16] block uppercase mb-1">Featured Candle Title</label>
                      <input
                        type="text"
                        value={heroForm.featuredTitle || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, featuredTitle: e.target.value })}
                        placeholder="French Vanilla & Cinnamon"
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#2C1E16] block uppercase mb-1">Featured Candle Details</label>
                      <input
                        type="text"
                        value={heroForm.featuredSubtitle || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, featuredSubtitle: e.target.value })}
                        placeholder="12 oz Heavy Italian Glass • 65 Hours"
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#2C1E16] block uppercase mb-1">📷 Featured Candle Image Photo</label>
                    <div className="flex items-center gap-3">
                      {heroForm.featuredImage && (
                        <div className="w-16 h-16 rounded-lg border border-[#EFE8DB] overflow-hidden shrink-0 bg-[#F8F3EA]">
                          <img src={heroForm.featuredImage} alt="Featured Candle Preview" className="w-full h-full object-cover" />
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
                              setHeroForm({ ...heroForm, featuredImage: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-[#2C1E16] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#B88B38] file:text-white hover:file:bg-[#A3792E] file:cursor-pointer cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#B88B38] text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer hover:bg-[#A3792E] transition-all shadow-card"
                >
                  Save Homepage Hero Changes →
                </button>
              </form>
            </div>
          </div>
        )}

        {activeSubTab === 'header' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-serif font-bold text-xl text-[#2C1E16]">Header & Top Navigation Builder</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
                <span className="font-bold text-[#2C1E16]">Sticky Header on Scroll</span>
                <input
                  type="checkbox"
                  checked={headerSettings.stickyHeader}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, stickyHeader: e.target.checked })}
                  className="w-4 h-4 accent-[#B88B38]"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
                <span className="font-bold text-[#2C1E16]">Show Live Search Icon</span>
                <input
                  type="checkbox"
                  checked={headerSettings.showSearch}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, showSearch: e.target.checked })}
                  className="w-4 h-4 accent-[#B88B38]"
                />
              </div>
              <button
                onClick={() => {
                  setSavedMessage('Header settings updated!');
                  setTimeout(() => setSavedMessage(''), 3000);
                }}
                className="bg-[#B88B38] text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
              >
                Save Header Settings →
              </button>
            </div>
          </div>
        )}

        {activeSubTab === 'footer' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-serif font-bold text-xl text-[#2C1E16]">Footer Builder</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Copyright Statement</label>
                <input
                  type="text"
                  value={footerSettings.copyrightText}
                  onChange={(e) => setFooterSettings({ ...footerSettings, copyrightText: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <button
                onClick={() => {
                  setSavedMessage('Footer settings saved!');
                  setTimeout(() => setSavedMessage(''), 3000);
                }}
                className="bg-[#B88B38] text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
              >
                Save Footer →
              </button>
            </div>
          </div>
        )}

        {activeSubTab === 'megamenu' && (
          <div className="space-y-6 max-w-3xl">
            <h3 className="font-serif font-bold text-xl text-[#2C1E16]">Mega Menu Category Builder</h3>
            <div className="space-y-3">
              {megaMenu.map((group) => (
                <div key={group.id} className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] text-xs">
                  <strong className="text-sm font-serif font-bold text-[#2C1E16] block mb-2">{group.title}</strong>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item, i) => (
                      <span key={i} className="bg-white px-2.5 py-1 rounded-lg border border-[#EFE8DB] text-[11px]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'announcement' && (
          <form onSubmit={handleAnnSubmit} className="space-y-4 max-w-2xl text-xs">
            <h3 className="font-serif font-bold text-xl text-[#2C1E16]">Header Announcement Bar Settings</h3>
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Promo Message</label>
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
            <button
              type="submit"
              className="bg-[#B88B38] text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
            >
              Update Announcement Bar →
            </button>
          </form>
        )}

        {activeSubTab === 'theme' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-serif font-bold text-xl text-[#2C1E16]">Store Theme & Color Palette</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">Primary Luxury Gold</label>
                <input
                  type="color"
                  value={themeColors.primary}
                  onChange={(e) => setThemeColors({ ...themeColors, primary: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer border border-[#EFE8DB]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">Espresso Dark Theme</label>
                <input
                  type="color"
                  value={themeColors.dark}
                  onChange={(e) => setThemeColors({ ...themeColors, dark: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer border border-[#EFE8DB]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
