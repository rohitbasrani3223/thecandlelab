import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

type SettingsSubTab =
  | 'logo'
  | 'favicon'
  | 'themecolors'
  | 'currency'
  | 'emails'
  | 'social'
  | 'integrations';

export const AdminStoreSettings: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SettingsSubTab>('logo');
  const { settings, updateSettings } = useCMS();
  const [form, setForm] = useState(settings);
  const [savedMsg, setSavedMsg] = useState('');


  const [integrations, setIntegrations] = useState({
    gaMeasurementId: 'G-X98273612',
    metaPixelId: '10928374109238',
    whatsappApiToken: '••••••••••••••••••••',
  });

  const SUB_TABS: { id: SettingsSubTab; label: string; icon: string }[] = [
    { id: 'logo', label: 'Logo', icon: '🖼️' },
    { id: 'favicon', label: 'Favicon', icon: '🌟' },
    { id: 'themecolors', label: 'Theme Colors', icon: '🎨' },
    { id: 'currency', label: 'Currency', icon: '💱' },
    { id: 'emails', label: 'Emails', icon: '✉️' },
    { id: 'social', label: 'Social Links', icon: '🌐' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedMsg('Store settings updated live!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">SYSTEM CONFIGURATION</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Store Settings & Branding</h1>
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
      <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
        {activeSubTab === 'logo' && (
          <div className="space-y-4 max-w-md">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Storefront Branding Logo</h3>
            <div className="flex items-center gap-4 p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
              <img src="/logo.jpeg" alt="Logo" className="w-12 h-12 object-contain rounded-lg border border-[#B88B38]" />
              <div>
                <strong className="text-xs text-[#2C1E16] block">logo.jpeg</strong>
                <span className="text-[10px] text-[#7A6B5D]">Primary Header Brand Asset</span>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'favicon' && (
          <div className="space-y-4 max-w-md">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Browser Favicon</h3>
            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] text-xs">
              <strong className="text-[#2C1E16]">favicon.ico (32x32px)</strong>
            </div>
          </div>
        )}

        {activeSubTab === 'themecolors' && (
          <div className="space-y-4 max-w-md text-xs">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Luxury Candle Color Palette</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#1C130E] text-white rounded-xl font-bold">#1C130E Espresso</div>
              <div className="p-3 bg-[#B88B38] text-white rounded-xl font-bold">#B88B38 Warm Gold</div>
            </div>
          </div>
        )}

        {activeSubTab === 'currency' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-md text-xs">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Store Currency & Region</h3>
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Currency Symbol</label>
              <input
                type="text"
                value={form.currencySymbol}
                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
              />
            </div>
            <button type="submit" className="bg-[#B88B38] text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer">
              Save Currency →
            </button>
          </form>
        )}

        {activeSubTab === 'social' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateSettings({
                footerText: form.footerText,
                socialLinks: form.socialLinks,
              });
              setSavedMsg('Social links & Footer text updated live!');
              setTimeout(() => setSavedMsg(''), 3000);
            }}
            className="space-y-4 max-w-lg text-xs"
          >
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Social Media & Footer Link Buttons</h3>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">📸 Instagram Profile URL</label>
                <input
                  type="url"
                  value={form.socialLinks?.instagram || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">👤 Facebook Page URL</label>
                <input
                  type="url"
                  value={form.socialLinks?.facebook || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">📌 Pinterest URL</label>
                <input
                  type="url"
                  value={form.socialLinks?.pinterest || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, pinterest: e.target.value } })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">💬 WhatsApp Direct Contact Link</label>
                <input
                  type="text"
                  value={form.socialLinks?.whatsapp || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, whatsapp: e.target.value } })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">📝 Footer Brand Bio Description</label>
                <textarea
                  rows={3}
                  value={form.footerText || ''}
                  onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <button type="submit" className="bg-[#B88B38] text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer">
                Save Social Links & Footer Text →
              </button>
            </div>
          </form>
        )}

        {activeSubTab === 'integrations' && (
          <div className="space-y-4 max-w-lg text-xs">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Third-Party API Integrations</h3>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">Google Analytics Measurement ID</label>
                <input
                  type="text"
                  value={integrations.gaMeasurementId}
                  onChange={(e) => setIntegrations({ ...integrations, gaMeasurementId: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'emails' && (
          <div className="space-y-4 max-w-lg text-xs">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Transactional Emails</h3>
            <p className="text-[#7A6B5D]">Manage order confirmation, invoice, and tracking email notification templates.</p>
          </div>
        )}
      </div>
    </div>
  );
};
