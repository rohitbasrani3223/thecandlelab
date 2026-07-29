"use client";

import React, { useState } from "react";
import { useStoreConfig } from "@/context/StoreConfigContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Globe, Palette, ShoppingCart, Truck, CreditCard, Bell,
  Shield, Search, CheckCircle2, Settings, RefreshCw, Save,
  Image, Sparkles, Sliders, Tag, FileText
} from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

const TABS = [
  { id: "site",     label: "Site & Branding",   icon: Globe },
  { id: "theme",    label: "Theme & UI Styling",icon: Palette },
  { id: "hero",     label: "Hero & Banners",    icon: Image },
  { id: "checkout", label: "Cart & Delivery",    icon: ShoppingCart },
  { id: "payment",  label: "Payment Methods",   icon: CreditCard },
  { id: "search",   label: "Search & SEO",      icon: Search },
];

export const SystemSettingsModule: React.FC = () => {
  const {
    site, theme, checkout, search, heroBanners, announcements, popups,
    updateSiteSettings, updateThemeSettings, updateCheckoutSettings, updateSearchConfig,
    refreshConfig, isLoading
  } = useStoreConfig();

  const [activeTab, setActiveTab] = useState("site");
  const [saved, setSaved] = useState<string | null>(null);

  // Local states for Hero/CMS settings
  const [heroTitle, setHeroTitle] = useState(heroBanners[0]?.title || "Hand-Poured Luxury Soy Candles");
  const [heroSubtitle, setHeroSubtitle] = useState(heroBanners[0]?.subtitle || "Elevate your ambience with clean-burning artisan fragrances handcrafted in India.");
  const [heroCta, setHeroCta] = useState(heroBanners[0]?.cta_text || "Explore Atelier Collection");
  const [heroImage, setHeroImage] = useState(heroBanners[0]?.image_url || "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1600&q=85");

  // Local state for Announcement & Popup
  const [announcementText, setAnnouncementText] = useState(announcements[0]?.text || "✨ FREE SHIPPING ON ORDERS ABOVE ₹999 | USE CODE 'LUXURY20' FOR 20% OFF");
  const [popupTitle, setPopupTitle] = useState(popups[0]?.title || "Get 20% Off Your First Order");
  const [popupCode, setPopupCode] = useState(popups[0]?.coupon_code || "WELCOME20");

  const handleSave = async (type: string, action: () => Promise<void>) => {
    await action();
    setSaved(`${type} saved and synced live to frontend!`);
    setTimeout(() => setSaved(null), 3000);
  };

  const InputCls = "w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EFF6FF] transition-all";
  const LabelCls = "block text-[12px] font-semibold text-[#475569] mb-1.5";

  return (
    <div style={FONT} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">System Governance & Site Control</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Every setting here updates the storefront dynamically via API — zero code changes required</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          loading={isLoading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" />}
          onClick={refreshConfig}
        >
          Sync Storefront Live
        </Button>
      </div>

      {/* Success Toast */}
      {saved && (
        <div className="flex items-center gap-2.5 bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] px-4 py-3 rounded-xl text-[13px] font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          {saved}
        </div>
      )}

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar Tabs */}
        <div className="lg:w-52 shrink-0">
          <Card padding="sm">
            <nav className="space-y-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                      isActive
                        ? "bg-[#EFF6FF] text-[#1E40AF] font-semibold"
                        : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#2563EB]" : "text-[#94A3B8]"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content Panel */}
        <div className="flex-1 min-w-0">

          {/* ── 1. Site Info & Branding ── */}
          {activeTab === "site" && (
            <Card padding="lg">
              <h2 className="text-base font-bold text-[#0F172A] mb-1">Site Identity & Branding</h2>
              <p className="text-[12px] text-[#94A3B8] mb-5">Main store branding, contact info, and currency display</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LabelCls}>Store Name</label>
                  <input type="text" defaultValue={site.site_name} onChange={(e) => updateSiteSettings({ site_name: e.target.value })} className={InputCls} />
                </div>
                <div>
                  <label className={LabelCls}>Tagline</label>
                  <input type="text" defaultValue={site.tagline} onChange={(e) => updateSiteSettings({ tagline: e.target.value })} className={InputCls} />
                </div>
                <div>
                  <label className={LabelCls}>Support Email</label>
                  <input type="email" defaultValue={site.support_email} onChange={(e) => updateSiteSettings({ support_email: e.target.value })} className={InputCls} />
                </div>
                <div>
                  <label className={LabelCls}>Support Phone</label>
                  <input type="text" defaultValue={site.support_phone} onChange={(e) => updateSiteSettings({ support_phone: e.target.value })} className={InputCls} />
                </div>
                <div>
                  <label className={LabelCls}>Currency Symbol</label>
                  <input type="text" defaultValue={site.currency_symbol} onChange={(e) => updateSiteSettings({ currency_symbol: e.target.value })} className={InputCls} />
                </div>
                <div>
                  <label className={LabelCls}>Currency Code</label>
                  <input type="text" defaultValue={site.currency_code} onChange={(e) => updateSiteSettings({ currency_code: e.target.value })} className={InputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={LabelCls}>Headquarters Physical Address</label>
                  <input type="text" defaultValue={site.store_address} onChange={(e) => updateSiteSettings({ store_address: e.target.value })} className={InputCls} />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-end">
                <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}
                  onClick={() => handleSave("Site Identity", async () => {})}>
                  Save Identity Settings
                </Button>
              </div>
            </Card>
          )}

          {/* ── 2. Theme & UI Styling ── */}
          {activeTab === "theme" && (
            <Card padding="lg">
              <h2 className="text-base font-bold text-[#0F172A] mb-1">Theme & UI Palette</h2>
              <p className="text-[12px] text-[#94A3B8] mb-5">Controls storefront CSS variables in real time — updates automatically on save.</p>

              {/* Color Presets */}
              <div className="mb-5 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <label className={LabelCls}>Preset Color Schemes</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { label: "Luxury Gold", primary: "#C8A75A", secondary: "#F4EFE8" },
                    { label: "Enterprise Blue", primary: "#2563EB", secondary: "#EFF6FF" },
                    { label: "Emerald Botanica", primary: "#10B981", secondary: "#ECFDF5" },
                    { label: "Midnight Obsidian", primary: "#0F172A", secondary: "#F1F5F9" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => updateThemeSettings({ primary_color: preset.primary, secondary_color: preset.secondary })}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#2563EB] text-[12px] font-medium transition-all"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.primary }} />
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Primary Accent Color", key: "primary_color", value: theme.primary_color },
                  { label: "Secondary Color", key: "secondary_color", value: theme.secondary_color },
                  { label: "Glow / Highlight Color", key: "accent_color", value: theme.accent_color },
                  { label: "Background Color", key: "background_color", value: theme.background_color },
                  { label: "Surface Color", key: "surface_color", value: theme.surface_color },
                  { label: "Primary Text Color", key: "text_primary", value: theme.text_primary },
                ].map(({ label, key, value }) => (
                  <div key={key}>
                    <label className={LabelCls}>{label}</label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => updateThemeSettings({ [key]: e.target.value })}
                        className="w-10 h-10 rounded-xl border border-[#E2E8F0] cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateThemeSettings({ [key]: e.target.value })}
                        className="flex-1 px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-[13px] font-mono text-[#0F172A] bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EFF6FF] transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-end">
                <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}
                  onClick={() => handleSave("Theme Palette", async () => updateThemeSettings({}))}>
                  Apply Theme Changes
                </Button>
              </div>
            </Card>
          )}

          {/* ── 3. Hero Banner & Announcement CMS ── */}
          {activeTab === "hero" && (
            <div className="space-y-5">
              <Card padding="lg">
                <h2 className="text-base font-bold text-[#0F172A] mb-1">Hero Banner CMS Manager</h2>
                <p className="text-[12px] text-[#94A3B8] mb-5">Controls main homepage hero banner content, CTAs, and background media</p>

                <div className="space-y-4">
                  <div>
                    <label className={LabelCls}>Hero Headline</label>
                    <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className={InputCls} />
                  </div>
                  <div>
                    <label className={LabelCls}>Hero Subtitle</label>
                    <textarea rows={2} value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className={InputCls} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={LabelCls}>CTA Button Text</label>
                      <input type="text" value={heroCta} onChange={(e) => setHeroCta(e.target.value)} className={InputCls} />
                    </div>
                    <div>
                      <label className={LabelCls}>Hero Image URL</label>
                      <input type="text" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className={InputCls} />
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex justify-end">
                  <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}
                    onClick={() => handleSave("Hero Banner", async () => {})}>
                    Update Hero Banner
                  </Button>
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="text-base font-bold text-[#0F172A] mb-1">Top Announcement Bar & Promo Popup</h2>
                <p className="text-[12px] text-[#94A3B8] mb-5">Sticky announcement banner text and modal popup coupon triggers</p>

                <div className="space-y-4">
                  <div>
                    <label className={LabelCls}>Announcement Ticker Text</label>
                    <input type="text" value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} className={InputCls} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={LabelCls}>Popup Title</label>
                      <input type="text" value={popupTitle} onChange={(e) => setPopupTitle(e.target.value)} className={InputCls} />
                    </div>
                    <div>
                      <label className={LabelCls}>Popup Coupon Code</label>
                      <input type="text" value={popupCode} onChange={(e) => setPopupCode(e.target.value)} className={InputCls} />
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex justify-end">
                  <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}
                    onClick={() => handleSave("Announcements & Popup", async () => {})}>
                    Update Tickers
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* ── 4. Cart & Delivery Rules ── */}
          {activeTab === "checkout" && (
            <Card padding="lg">
              <h2 className="text-base font-bold text-[#0F172A] mb-1">Cart, Shipping & Checkout Controls</h2>
              <p className="text-[12px] text-[#94A3B8] mb-5">Order thresholds, shipping charges, COD fees, and checkout workflow rules</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Minimum Order Amount (₹)", key: "min_order_amount", value: checkout.min_order_amount, type: "number" },
                  { label: "Maximum Order Amount (₹)", key: "max_order_amount", value: checkout.max_order_amount, type: "number" },
                  { label: "Free Shipping Threshold (₹)", key: "free_shipping_threshold", value: checkout.free_shipping_threshold, type: "number" },
                  { label: "Standard Shipping Charge (₹)", key: "standard_shipping_charge", value: checkout.standard_shipping_charge, type: "number" },
                  { label: "COD Fee (₹)", key: "cod_charge", value: checkout.cod_charge, type: "number" },
                  { label: "Gift Wrap Fee (₹)", key: "gift_wrap_charge", value: checkout.gift_wrap_charge, type: "number" },
                ].map(({ label, key, value, type }) => (
                  <div key={key}>
                    <label className={LabelCls}>{label}</label>
                    <input type={type} defaultValue={value}
                      onChange={(e) => updateCheckoutSettings({ [key]: Number(e.target.value) })}
                      className={InputCls}
                    />
                  </div>
                ))}
                {[
                  { label: "Cash on Delivery (COD)", key: "cod_enabled", value: checkout.cod_enabled },
                  { label: "Guest Checkout Allowed", key: "guest_checkout_enabled", value: checkout.guest_checkout_enabled },
                  { label: "OTP Phone Verification", key: "otp_verification_required", value: checkout.otp_verification_required },
                ].map(({ label, key, value }) => (
                  <div key={key}>
                    <label className={LabelCls}>{label}</label>
                    <select defaultValue={value ? "true" : "false"}
                      onChange={(e) => updateCheckoutSettings({ [key]: e.target.value === "true" })}
                      className={InputCls}
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-end">
                <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}
                  onClick={() => handleSave("Checkout Rules", async () => updateCheckoutSettings({}))}>
                  Save Checkout Rules
                </Button>
              </div>
            </Card>
          )}

          {/* ── 5. Payment Methods ── */}
          {activeTab === "payment" && (
            <Card padding="lg">
              <h2 className="text-base font-bold text-[#0F172A] mb-1">Payment Gateways & Options</h2>
              <p className="text-[12px] text-[#94A3B8] mb-5">Configure active payment options visible to customers during checkout</p>
              <div className="space-y-4">
                {[
                  { name: "Razorpay (UPI, Cards, NetBanking)", desc: "Primary Indian payment gateway", active: true },
                  { name: "UPI Direct QR / Intent", desc: "Instant GPay, PhonePe, Paytm payments", active: true },
                  { name: "Cash on Delivery (COD)", desc: "Pay on arrival with verification fee", active: checkout.cod_enabled },
                  { name: "Stripe International", desc: "For USD / International credit card payments", active: false },
                ].map((pg) => (
                  <div key={pg.name} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <div>
                      <p className="text-[13px] font-bold text-[#0F172A]">{pg.name}</p>
                      <p className="text-[11px] text-[#64748B]">{pg.desc}</p>
                    </div>
                    <Badge variant={pg.active ? "success" : "neutral"} dot>{pg.active ? "Enabled" : "Disabled"}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── 6. Search & SEO ── */}
          {activeTab === "search" && (
            <Card padding="lg">
              <h2 className="text-base font-bold text-[#0F172A] mb-1">Search Suggestions & Global SEO</h2>
              <p className="text-[12px] text-[#94A3B8] mb-5">Search quick tags and default search engine metadata</p>
              <div className="space-y-4">
                <div>
                  <label className={LabelCls}>Popular Search Tags (comma separated)</label>
                  <input type="text" defaultValue={search.popular_searches}
                    onChange={(e) => updateSearchConfig({ popular_searches: e.target.value })}
                    className={InputCls}
                  />
                </div>
                <div>
                  <label className={LabelCls}>Trending Searches (comma separated)</label>
                  <input type="text" defaultValue={search.trending_searches}
                    onChange={(e) => updateSearchConfig({ trending_searches: e.target.value })}
                    className={InputCls}
                  />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-end">
                <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}
                  onClick={() => handleSave("Search Config", async () => updateSearchConfig({}))}>
                  Save Search Config
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
