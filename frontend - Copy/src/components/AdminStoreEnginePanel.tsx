"use client";

import React, { useState } from "react";
import { useStoreConfig } from "@/context/StoreConfigContext";
import { Palette, ShoppingCart, Globe, Search, RefreshCw, CheckCircle, Sliders, ShieldCheck } from "lucide-react";

export const AdminStoreEnginePanel: React.FC = () => {
  const {
    site,
    theme,
    checkout,
    search,
    updateSiteSettings,
    updateThemeSettings,
    updateCheckoutSettings,
    updateSearchConfig,
    refreshConfig,
    isLoading
  } = useStoreConfig();

  const [activeTab, setActiveTab] = useState<"site" | "theme" | "checkout" | "search" | "integration">("theme");
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSave = async (type: string, action: () => Promise<void>) => {
    await action();
    setSaveSuccess(`${type} updated and synced with live Frontend!`);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-beige p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-beige pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> ZERO-HARDCODE ENGINE
          </span>
          <h2 className="font-serif text-xl font-bold text-brand-charcoal">
            Dynamic Frontend Store Engine & 4-Tier Control
          </h2>
          <p className="text-xs text-brand-earth mt-0.5">
            Every setting changed here updates the website frontend in real-time without code changes.
          </p>
        </div>

        <button
          onClick={refreshConfig}
          disabled={isLoading}
          className="bg-brand-surface border border-brand-beige text-brand-charcoal px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-brand-beige flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Sync Frontend APIs
        </button>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" /> {saveSuccess}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-brand-beige gap-4 text-xs font-serif font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("theme")}
          className={`pb-2 flex items-center gap-1.5 whitespace-nowrap ${activeTab === "theme" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"}`}
        >
          <Palette className="w-3.5 h-3.5 text-amber-600" /> 🎨 Theme & Dynamic Colors
        </button>
        <button
          onClick={() => setActiveTab("checkout")}
          className={`pb-2 flex items-center gap-1.5 whitespace-nowrap ${activeTab === "checkout" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"}`}
        >
          <ShoppingCart className="w-3.5 h-3.5 text-blue-600" /> 🛒 Cart & Checkout Rules
        </button>
        <button
          onClick={() => setActiveTab("site")}
          className={`pb-2 flex items-center gap-1.5 whitespace-nowrap ${activeTab === "site" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"}`}
        >
          <Globe className="w-3.5 h-3.5 text-green-600" /> 🏢 Site Info & Branding
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`pb-2 flex items-center gap-1.5 whitespace-nowrap ${activeTab === "search" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"}`}
        >
          <Search className="w-3.5 h-3.5 text-purple-600" /> 🔍 Search Tuning & Synonyms
        </button>
        <button
          onClick={() => setActiveTab("integration")}
          className={`pb-2 flex items-center gap-1.5 whitespace-nowrap ${activeTab === "integration" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-yellow-600" /> ⚡ 4-Level Management Model
        </button>
      </div>

      {/* Theme Settings */}
      {activeTab === "theme" && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Primary Accent Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={theme.primary_color}
                  onChange={(e) => updateThemeSettings({ primary_color: e.target.value })}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.primary_color}
                  onChange={(e) => updateThemeSettings({ primary_color: e.target.value })}
                  className="p-2 border border-brand-beige rounded-xl w-full font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Secondary Brand Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={theme.secondary_color}
                  onChange={(e) => updateThemeSettings({ secondary_color: e.target.value })}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.secondary_color}
                  onChange={(e) => updateThemeSettings({ secondary_color: e.target.value })}
                  className="p-2 border border-brand-beige rounded-xl w-full font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Glow Accent Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={theme.accent_color}
                  onChange={(e) => updateThemeSettings({ accent_color: e.target.value })}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.accent_color}
                  onChange={(e) => updateThemeSettings({ accent_color: e.target.value })}
                  className="p-2 border border-brand-beige rounded-xl w-full font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Border Radius</label>
              <input
                type="text"
                value={theme.border_radius}
                onChange={(e) => updateThemeSettings({ border_radius: e.target.value })}
                className="p-2 border border-brand-beige rounded-xl w-full"
                placeholder="e.g. 12px or 1rem"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Font Family</label>
              <input
                type="text"
                value={theme.font_family}
                onChange={(e) => updateThemeSettings({ font_family: e.target.value })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Dark Mode Preference</label>
              <select
                value={theme.dark_mode_enabled ? "true" : "false"}
                onChange={(e) => updateThemeSettings({ dark_mode_enabled: e.target.value === "true" })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              >
                <option value="true">Enabled (Dark Luxury Atelier)</option>
                <option value="false">Disabled (Light Crisp Clean)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleSave("Theme Settings", async () => updateThemeSettings({}))}
              className="bg-brand-gold text-brand-charcoal px-4 py-2 rounded-xl font-bold hover:bg-brand-goldLight transition-colors"
            >
              Save Theme Configuration
            </button>
          </div>
        </div>
      )}

      {/* Checkout Settings */}
      {activeTab === "checkout" && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Minimum Order Amount (₹)</label>
              <input
                type="number"
                value={checkout.min_order_amount}
                onChange={(e) => updateCheckoutSettings({ min_order_amount: Number(e.target.value) })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={checkout.free_shipping_threshold}
                onChange={(e) => updateCheckoutSettings({ free_shipping_threshold: Number(e.target.value) })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={checkout.standard_shipping_charge}
                onChange={(e) => updateCheckoutSettings({ standard_shipping_charge: Number(e.target.value) })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">COD Convenience Fee (₹)</label>
              <input
                type="number"
                value={checkout.cod_charge}
                onChange={(e) => updateCheckoutSettings({ cod_charge: Number(e.target.value) })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Enable COD Payment</label>
              <select
                value={checkout.cod_enabled ? "true" : "false"}
                onChange={(e) => updateCheckoutSettings({ cod_enabled: e.target.value === "true" })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              >
                <option value="true">Allowed</option>
                <option value="false">Prepaid Only</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Guest Checkout</label>
              <select
                value={checkout.guest_checkout_enabled ? "true" : "false"}
                onChange={(e) => updateCheckoutSettings({ guest_checkout_enabled: e.target.value === "true" })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              >
                <option value="true">Enabled (No login required)</option>
                <option value="false">Mandatory Login</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleSave("Checkout Rules", async () => updateCheckoutSettings({}))}
              className="bg-brand-gold text-brand-charcoal px-4 py-2 rounded-xl font-bold hover:bg-brand-goldLight transition-colors"
            >
              Save Checkout Rules
            </button>
          </div>
        </div>
      )}

      {/* Site Info */}
      {activeTab === "site" && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Store Name</label>
              <input
                type="text"
                value={site.site_name}
                onChange={(e) => updateSiteSettings({ site_name: e.target.value })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Tagline</label>
              <input
                type="text"
                value={site.tagline}
                onChange={(e) => updateSiteSettings({ tagline: e.target.value })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Support Email</label>
              <input
                type="email"
                value={site.support_email}
                onChange={(e) => updateSiteSettings({ support_email: e.target.value })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-charcoal mb-1">Support Phone</label>
              <input
                type="text"
                value={site.support_phone}
                onChange={(e) => updateSiteSettings({ support_phone: e.target.value })}
                className="p-2 border border-brand-beige rounded-xl w-full"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleSave("Site Information", async () => updateSiteSettings({}))}
              className="bg-brand-gold text-brand-charcoal px-4 py-2 rounded-xl font-bold hover:bg-brand-goldLight transition-colors"
            >
              Save Branding & Info
            </button>
          </div>
        </div>
      )}

      {/* Search Config */}
      {activeTab === "search" && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-brand-charcoal mb-1">Popular Search Tags (Comma separated)</label>
            <input
              type="text"
              value={search.popular_searches}
              onChange={(e) => updateSearchConfig({ popular_searches: e.target.value })}
              className="p-2 border border-brand-beige rounded-xl w-full"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-charcoal mb-1">Trending Search Tags</label>
            <input
              type="text"
              value={search.trending_searches}
              onChange={(e) => updateSearchConfig({ trending_searches: e.target.value })}
              className="p-2 border border-brand-beige rounded-xl w-full"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleSave("Search Configuration", async () => updateSearchConfig({}))}
              className="bg-brand-gold text-brand-charcoal px-4 py-2 rounded-xl font-bold hover:bg-brand-goldLight transition-colors"
            >
              Save Search Tuning
            </button>
          </div>
        </div>
      )}

      {/* 4-Level Management Model */}
      {activeTab === "integration" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-brand-surface p-4 rounded-xl border border-brand-beige space-y-2">
            <span className="font-serif font-bold text-brand-gold uppercase tracking-wider text-[10px]">
              Level 1: Business Configuration
            </span>
            <h4 className="font-bold text-brand-charcoal">Toggles, Thresholds & Rules</h4>
            <p className="text-gray-600">
              Min/Max order constraints, free shipping calculators, tax rates, and COD logic dynamically consumed by Cart and Checkout.
            </p>
          </div>

          <div className="bg-brand-surface p-4 rounded-xl border border-brand-beige space-y-2">
            <span className="font-serif font-bold text-brand-gold uppercase tracking-wider text-[10px]">
              Level 2: Dynamic Content
            </span>
            <h4 className="font-bold text-brand-charcoal">Banners, Media & Descriptions</h4>
            <p className="text-gray-600">
              Hero slides, popups, announcement text, FAQ entries, and blog articles managed with zero hardcoded static text.
            </p>
          </div>

          <div className="bg-brand-surface p-4 rounded-xl border border-brand-beige space-y-2">
            <span className="font-serif font-bold text-brand-gold uppercase tracking-wider text-[10px]">
              Level 3: Scheduling & Audience
            </span>
            <h4 className="font-bold text-brand-charcoal">Flash Sales & Schedulers</h4>
            <p className="text-gray-600">
              Start/End dates for sales, customer group visibility, and conditional popups triggered automatically.
            </p>
          </div>

          <div className="bg-brand-surface p-4 rounded-xl border border-brand-beige space-y-2">
            <span className="font-serif font-bold text-brand-gold uppercase tracking-wider text-[10px]">
              Level 4: Real-time Integration
            </span>
            <h4 className="font-bold text-brand-charcoal">API State Hydration & CSS Variables</h4>
            <p className="text-gray-600">
              `StoreConfigContext` fetches live settings and injects `--primary-color`, `--border-radius`, etc. directly into `:root`.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
