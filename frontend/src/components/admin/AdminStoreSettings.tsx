import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { AdminImageUploader } from './AdminImageUploader';

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

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const [integrations, setIntegrations] = useState({
    gaMeasurementId: settings.integrations?.gaMeasurementId || 'G-X98273612',
    metaPixelId: settings.integrations?.metaPixelId || '10928374109238',
    whatsappApiToken: settings.integrations?.whatsappApiToken || '••••••••••••••••••••',
  });

  const [themeColors, setThemeColors] = useState({
    primary: settings.themeColors?.primary || '#B88B38',
    dark: settings.themeColors?.dark || '#1C130E',
    light: settings.themeColors?.light || '#FAF6F0',
    accent: settings.themeColors?.accent || '#B93829',
  });

  useEffect(() => {
    if (settings.themeColors) {
      setThemeColors({
        primary: settings.themeColors.primary || '#B88B38',
        dark: settings.themeColors.dark || '#1C130E',
        light: settings.themeColors.light || '#FAF6F0',
        accent: settings.themeColors.accent || '#B93829',
      });
    }
    if (settings.integrations) {
      setIntegrations({
        gaMeasurementId: settings.integrations.gaMeasurementId || '',
        metaPixelId: settings.integrations.metaPixelId || '',
        whatsappApiToken: settings.integrations.whatsappApiToken || '',
      });
    }
  }, [settings]);

  const SUB_TABS: { id: SettingsSubTab; label: string; icon: string }[] = [
    { id: 'logo', label: 'Store Identity & Logo', icon: '🖼️' },
    { id: 'favicon', label: 'Favicon', icon: '🌟' },
    { id: 'themecolors', label: 'Theme Colors', icon: '🎨' },
    { id: 'currency', label: 'Currency & Shipping', icon: '💱' },
    { id: 'emails', label: 'Email Templates', icon: '✉️' },
    { id: 'social', label: 'Social & Footer', icon: '🌐' },
    { id: 'integrations', label: 'API Integrations', icon: '🔌' },
  ];

  const triggerSaveNotification = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3500);
  };

  const handleGeneralSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: form.storeName,
      tagline: form.tagline,
      logoUrl: form.logoUrl,
      darkLogoUrl: form.darkLogoUrl,
      supportEmail: form.supportEmail,
      supportPhone: form.supportPhone,
      studioAddress: form.studioAddress,
    });
    triggerSaveNotification('Store identity & logo updated live!');
  };

  const handleFaviconSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ faviconUrl: form.faviconUrl });
    triggerSaveNotification('Favicon updated live!');
  };

  const handleThemeColorsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ themeColors });
    triggerSaveNotification('Store theme colors updated live!');
  };

  const handleCurrencySave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      currencySymbol: form.currencySymbol,
      freeShippingThreshold: Number(form.freeShippingThreshold) || 999,
      standardShippingFee: Number(form.standardShippingFee) || 99,
      supportEmail: form.supportEmail,
      supportPhone: form.supportPhone,
      studioAddress: form.studioAddress,
    });
    triggerSaveNotification('Currency, shipping rates & studio info saved!');
  };

  const handleSocialSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      footerText: form.footerText,
      socialLinks: form.socialLinks,
    });
    triggerSaveNotification('Social links & footer biography saved live!');
  };

  const handleIntegrationsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ integrations });
    triggerSaveNotification('Third-party API credentials saved live!');
  };

  const handleEmailsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      supportEmail: form.supportEmail,
      supportPhone: form.supportPhone,
    });
    triggerSaveNotification('Email settings saved live!');
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">SYSTEM CONFIGURATION</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Store Settings & Branding</h1>
          <p className="text-xs text-[#7A6B5D] mt-1">Configure brand assets, domain currency, shipping thresholds, and theme styling.</p>
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
        {/* TAB 1: LOGO & IDENTITY */}
        {activeSubTab === 'logo' && (
          <form onSubmit={handleGeneralSave} className="space-y-6 max-w-2xl text-xs">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Store Identity & Branding Logos</h3>
              <p className="text-[#7A6B5D] text-xs">Primary brand assets displayed across header navigation, packing slips, and customer emails.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Store Name *</label>
                <input
                  type="text"
                  required
                  value={form.storeName || ''}
                  onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                  placeholder="The Candle Lab"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Brand Tagline / Slogan</label>
                <input
                  type="text"
                  value={form.tagline || ''}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="Botanical & Soy Artisans"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>

            {/* Primary Logo Upload */}
            <div className="space-y-3 pt-2">
              <AdminImageUploader
                value={form.logoUrl || ''}
                onChange={(url) => setForm((prev) => ({ ...prev, logoUrl: url }))}
                label="Primary Store Logo (Light Header)"
                aspectRatio="auto"
                helperText="Upload transparent PNG or JPG logo. Recommended dimensions: 240x80px."
              />
            </div>

            {/* Dark Logo Upload */}
            <div className="space-y-3 pt-2 border-t border-[#F2ECE1]">
              <AdminImageUploader
                value={form.darkLogoUrl || ''}
                onChange={(url) => setForm((prev) => ({ ...prev, darkLogoUrl: url }))}
                label="Dark Background / Inverse Logo (Optional)"
                aspectRatio="auto"
                helperText="Optional: Inverse light logo for dark headers or luxury splash pages."
              />
            </div>

            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Store Identity & Logo →
            </button>
          </form>
        )}

        {/* TAB 2: FAVICON */}
        {activeSubTab === 'favicon' && (
          <form onSubmit={handleFaviconSave} className="space-y-6 max-w-xl text-xs">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Browser Tab Favicon</h3>
              <p className="text-[#7A6B5D] text-xs">Icon displayed in browser tabs and bookmarks (32x32px or 64x64px recommended).</p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
              <div className="w-12 h-12 rounded-lg bg-white border border-[#B88B38] flex items-center justify-center p-1 shadow-xs">
                {form.faviconUrl ? (
                  <img src={form.faviconUrl} alt="Favicon preview" className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-xl">🕯️</span>
                )}
              </div>
              <div>
                <strong className="text-xs text-[#2C1E16] block">Browser Favicon Icon</strong>
                <span className="text-[11px] text-[#7A6B5D]">
                  {form.faviconUrl ? 'Custom Favicon Active' : 'Default Candle Icon'}
                </span>
              </div>
            </div>

            <AdminImageUploader
              value={form.faviconUrl || ''}
              onChange={(url) => setForm((prev) => ({ ...prev, faviconUrl: url }))}
              label="Upload Favicon Image (.ico, .png, .svg)"
              aspectRatio="square"
              helperText="Square 32x32px or 64x64px transparent PNG/ICO works best."
            />

            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Favicon →
            </button>
          </form>
        )}

        {/* TAB 3: THEME COLORS */}
        {activeSubTab === 'themecolors' && (
          <form onSubmit={handleThemeColorsSave} className="space-y-6 max-w-2xl text-xs">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Luxury Brand Palette & Theme Colors</h3>
              <p className="text-[#7A6B5D] text-xs">Customize primary accents, background tones, and text highlights throughout the storefront.</p>
            </div>

            {/* Quick Presets */}
            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-2">
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#7A6B5D] block">Preset Luxury Palettes</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Warm Amber Atelier', primary: '#B88B38', dark: '#1C130E', light: '#FAF6F0', accent: '#B93829' },
                  { name: 'Noir & French Gold', primary: '#C5A059', dark: '#121212', light: '#F9F6F0', accent: '#8E2800' },
                  { name: 'Botanical Sanctuary', primary: '#8B7355', dark: '#1F2421', light: '#F5F5F0', accent: '#4A5D4E' },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setThemeColors(preset)}
                    className="px-3 py-1.5 bg-white hover:bg-[#EFE8DB] border border-[#EFE8DB] rounded-lg font-bold text-[11px] text-[#2C1E16] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: preset.primary }} />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-2">
                <label className="font-bold text-[#2C1E16] block uppercase text-[11px]">Primary Warm Gold Accent</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeColors.primary}
                    onChange={(e) => setThemeColors({ ...themeColors, primary: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[#EFE8DB]"
                  />
                  <input
                    type="text"
                    value={themeColors.primary}
                    onChange={(e) => setThemeColors({ ...themeColors, primary: e.target.value })}
                    className="w-full bg-white border border-[#EFE8DB] p-2 rounded-lg font-mono font-bold text-[#2C1E16]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-2">
                <label className="font-bold text-[#2C1E16] block uppercase text-[11px]">Dark Espresso Background</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeColors.dark}
                    onChange={(e) => setThemeColors({ ...themeColors, dark: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[#EFE8DB]"
                  />
                  <input
                    type="text"
                    value={themeColors.dark}
                    onChange={(e) => setThemeColors({ ...themeColors, dark: e.target.value })}
                    className="w-full bg-white border border-[#EFE8DB] p-2 rounded-lg font-mono font-bold text-[#2C1E16]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-2">
                <label className="font-bold text-[#2C1E16] block uppercase text-[11px]">Light Alabaster Surface</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeColors.light}
                    onChange={(e) => setThemeColors({ ...themeColors, light: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[#EFE8DB]"
                  />
                  <input
                    type="text"
                    value={themeColors.light}
                    onChange={(e) => setThemeColors({ ...themeColors, light: e.target.value })}
                    className="w-full bg-white border border-[#EFE8DB] p-2 rounded-lg font-mono font-bold text-[#2C1E16]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-2">
                <label className="font-bold text-[#2C1E16] block uppercase text-[11px]">Vibrant Accent Highlight</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeColors.accent}
                    onChange={(e) => setThemeColors({ ...themeColors, accent: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[#EFE8DB]"
                  />
                  <input
                    type="text"
                    value={themeColors.accent}
                    onChange={(e) => setThemeColors({ ...themeColors, accent: e.target.value })}
                    className="w-full bg-white border border-[#EFE8DB] p-2 rounded-lg font-mono font-bold text-[#2C1E16]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Theme Colors →
            </button>
          </form>
        )}

        {/* TAB 4: CURRENCY & SHIPPING */}
        {activeSubTab === 'currency' && (
          <form onSubmit={handleCurrencySave} className="space-y-6 max-w-2xl text-xs">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Store Currency & Fulfillment Parameters</h3>
              <p className="text-[#7A6B5D] text-xs">Configure customer billing currency and standard delivery charges.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Currency Symbol *</label>
                <input
                  type="text"
                  required
                  value={form.currencySymbol || '₹'}
                  onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                  placeholder="₹"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold text-base text-center"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Free Shipping Above (₹) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.freeShippingThreshold ?? 999}
                  onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Standard Delivery Fee (₹) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.standardShippingFee ?? 99}
                  onChange={(e) => setForm({ ...form, standardShippingFee: Number(e.target.value) })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#F2ECE1] space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#2C1E16]">Studio Location & Contact Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Customer Support Email</label>
                  <input
                    type="email"
                    value={form.supportEmail || ''}
                    onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                    placeholder="care@thecandlelab.in"
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Customer Support Phone / Helpline</label>
                  <input
                    type="tel"
                    value={form.supportPhone || ''}
                    onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Artisan Studio Address (Printed on Invoices)</label>
                <textarea
                  rows={2}
                  value={form.studioAddress || ''}
                  onChange={(e) => setForm({ ...form, studioAddress: e.target.value })}
                  placeholder="108 Artisan Avenue, Fragrance District, Mumbai, Maharashtra 400050"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Currency & Shipping Rules →
            </button>
          </form>
        )}

        {/* TAB 5: SOCIAL & FOOTER */}
        {activeSubTab === 'social' && (
          <form onSubmit={handleSocialSave} className="space-y-6 max-w-2xl text-xs">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Social Media Profiles & Footer Narrative</h3>
              <p className="text-[#7A6B5D] text-xs">Manage links shown in footer and header social icons.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">📸 Instagram Profile URL</label>
                <input
                  type="url"
                  value={form.socialLinks?.instagram || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })}
                  placeholder="https://instagram.com/thecandlelab.in"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">👤 Facebook Page URL</label>
                <input
                  type="url"
                  value={form.socialLinks?.facebook || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })}
                  placeholder="https://facebook.com/thecandlelab"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">📌 Pinterest URL</label>
                <input
                  type="url"
                  value={form.socialLinks?.pinterest || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, pinterest: e.target.value } })}
                  placeholder="https://pinterest.com/thecandlelab"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">💬 WhatsApp Concierge Direct Link</label>
                <input
                  type="text"
                  value={form.socialLinks?.whatsapp || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, whatsapp: e.target.value } })}
                  placeholder="https://wa.me/919876543210"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block mb-1">📝 Footer Brand Bio Description</label>
                <textarea
                  rows={3}
                  value={form.footerText || ''}
                  onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                  placeholder="Artisanal hand-poured soy candles crafted in small batches using 100% natural botanical oils and lead-free wicks."
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Social Links & Footer Text →
            </button>
          </form>
        )}

        {/* TAB 6: INTEGRATIONS */}
        {activeSubTab === 'integrations' && (
          <form onSubmit={handleIntegrationsSave} className="space-y-6 max-w-2xl text-xs">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Analytics & Marketing Integrations</h3>
              <p className="text-[#7A6B5D] text-xs">Connect Google Analytics 4, Meta Facebook Pixel, and WhatsApp APIs.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Google Analytics 4 Measurement ID</label>
                <input
                  type="text"
                  value={integrations.gaMeasurementId}
                  onChange={(e) => setIntegrations({ ...integrations, gaMeasurementId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Meta Facebook Pixel ID</label>
                <input
                  type="text"
                  value={integrations.metaPixelId}
                  onChange={(e) => setIntegrations({ ...integrations, metaPixelId: e.target.value })}
                  placeholder="10928374109238"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">WhatsApp Cloud API Bearer Token</label>
                <input
                  type="password"
                  value={integrations.whatsappApiToken}
                  onChange={(e) => setIntegrations({ ...integrations, whatsappApiToken: e.target.value })}
                  placeholder="EAAG..."
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save API Integrations →
            </button>
          </form>
        )}

        {/* TAB 7: EMAILS */}
        {activeSubTab === 'emails' && (
          <form onSubmit={handleEmailsSave} className="space-y-6 max-w-2xl text-xs">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Transactional Emails & Sender Config</h3>
              <p className="text-[#7A6B5D] text-xs">Configure outgoing email identity for order confirmation, invoices, and dispatch alerts.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Sender Name</label>
                <input
                  type="text"
                  value={form.storeName ? `${form.storeName} Sanctuary Concierge` : 'The Candle Lab'}
                  readOnly
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] opacity-80"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Dispatch / Reply-To Email</label>
                <input
                  type="email"
                  value={form.supportEmail || ''}
                  onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                  placeholder="orders@thecandlelab.in"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>

            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-3">
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#7A6B5D] block">Automated Dispatch Templates Active</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-white border border-[#EFE8DB] rounded-lg">
                  <div>
                    <strong className="text-xs text-[#2C1E16] block">Order Confirmation & Tax Invoice PDF</strong>
                    <span className="text-[10px] text-[#7A6B5D]">Triggered immediately on successful checkout</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#2E6F40] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white border border-[#EFE8DB] rounded-lg">
                  <div>
                    <strong className="text-xs text-[#2C1E16] block">Shipment Dispatched with Live AWB Link</strong>
                    <span className="text-[10px] text-[#7A6B5D]">Triggered when order status changes to "Shipped"</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#2E6F40] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">ACTIVE</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Email Configuration →
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
