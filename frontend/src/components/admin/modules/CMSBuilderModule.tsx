"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Layout,
  Image as ImageIcon,
  Type,
  Megaphone,
  Bell,
  Layers,
  MessageSquareQuote,
  BookOpen,
  HelpCircle,
  Link,
  Globe,
  Save,
  Eye,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface CMSBuilderModuleProps {
  defaultTab?: "hero" | "announcement" | "popup" | "collections" | "testimonials" | "faqs" | "seo";
}

export const CMSBuilderModule: React.FC<CMSBuilderModuleProps> = ({ defaultTab = "hero" }) => {
  const { cmsConfig, updateCMSConfig, collections, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<"hero" | "announcement" | "popup" | "collections" | "testimonials" | "faqs" | "seo">(defaultTab);

  const [heroTitle, setHeroTitle] = useState(cmsConfig.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(cmsConfig.heroSubtitle);
  const [heroCTA, setHeroCTA] = useState(cmsConfig.heroCTA);
  const [heroImage, setHeroImage] = useState(cmsConfig.heroImage);

  const [announcementText, setAnnouncementText] = useState(cmsConfig.announcementText);
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(cmsConfig.isAnnouncementActive);

  const [popupHeadline, setPopupHeadline] = useState(cmsConfig.popupHeadline);
  const [popupDiscountCode, setPopupDiscountCode] = useState(cmsConfig.popupDiscountCode);
  const [popupEnabled, setPopupEnabled] = useState(cmsConfig.popupEnabled);

  const [globalSeoTitle, setGlobalSeoTitle] = useState(cmsConfig.globalSeoTitle);
  const [globalSeoDescription, setGlobalSeoDescription] = useState(cmsConfig.globalSeoDescription);

  const handleSaveHero = () => {
    updateCMSConfig({ heroTitle, heroSubtitle, heroCTA, heroImage });
  };

  const handleSaveAnnouncement = () => {
    updateCMSConfig({ announcementText, isAnnouncementActive });
  };

  const handleSavePopup = () => {
    updateCMSConfig({ popupHeadline, popupDiscountCode, popupEnabled });
  };

  const handleSaveSeo = () => {
    updateCMSConfig({ globalSeoTitle, globalSeoDescription });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Homepage CMS Builder & Storefront Studio</h2>
          <p className="text-xs text-slate-500 mt-0.5">Customize hero banners, announcement topbars, discount popups, blog stories & global SEO meta tags.</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Preview Live Site
          </a>
        </div>
      </div>

      {/* Builder Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold">
        {[
          { id: "hero", label: "Hero Banner", icon: Layout },
          { id: "announcement", label: "Announcement Bar", icon: Megaphone },
          { id: "popup", label: "Popup Manager", icon: Bell },
          { id: "collections", label: "Featured Collections", icon: Layers },
          { id: "testimonials", label: "Customer Reviews", icon: MessageSquareQuote },
          { id: "faqs", label: "FAQs & Support", icon: HelpCircle },
          { id: "seo", label: "Global SEO Meta", icon: Globe }
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <IconComp className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      {activeTab === "hero" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layout className="w-4 h-4 text-indigo-600" /> Hero Section Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Headline Title</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subheadline Description</label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={heroCTA}
                  onChange={(e) => setHeroCTA(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hero Background Image URL</label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={handleSaveHero}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              <Save className="w-4 h-4" /> Save Hero Configuration
            </button>
          </div>

          {/* Live Preview Box */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[300px]">
            <img src={heroImage} alt="Hero Preview" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="relative z-10 space-y-3 max-w-md">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
                LIVE PREVIEW
              </span>
              <h1 className="text-2xl font-serif font-bold text-white leading-tight">{heroTitle}</h1>
              <p className="text-xs text-slate-300">{heroSubtitle}</p>
              <button className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg mt-2">
                {heroCTA} →
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "announcement" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-indigo-600" /> Announcement Bar Customizer
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800">Enable Announcement Bar</span>
              <input
                type="checkbox"
                checked={isAnnouncementActive}
                onChange={(e) => setIsAnnouncementActive(e.target.checked)}
                className="w-4 h-4 accent-slate-900 rounded"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Announcement Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900"
              />
            </div>

            <div className="bg-slate-900 text-amber-300 p-3 rounded-xl text-center text-xs font-bold">
              Preview: {announcementText}
            </div>

            <button
              onClick={handleSaveAnnouncement}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              <Save className="w-4 h-4" /> Save Announcement Bar
            </button>
          </div>
        </div>
      )}

      {activeTab === "popup" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" /> Lead Capture & Promo Popup
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800">Enable Discount Popup</span>
              <input
                type="checkbox"
                checked={popupEnabled}
                onChange={(e) => setPopupEnabled(e.target.checked)}
                className="w-4 h-4 accent-slate-900 rounded"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Popup Headline</label>
              <input
                type="text"
                value={popupHeadline}
                onChange={(e) => setPopupHeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Promo Coupon Code</label>
              <input
                type="text"
                value={popupDiscountCode}
                onChange={(e) => setPopupDiscountCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-900"
              />
            </div>

            <button
              onClick={handleSavePopup}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              <Save className="w-4 h-4" /> Save Popup Settings
            </button>
          </div>
        </div>
      )}

      {activeTab === "seo" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" /> Global Storefront SEO
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Meta Title Tag</label>
              <input
                type="text"
                value={globalSeoTitle}
                onChange={(e) => setGlobalSeoTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={globalSeoDescription}
                onChange={(e) => setGlobalSeoDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            {/* Google Search Result Preview */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Google Snippet Preview</span>
              <p className="text-sm font-bold text-blue-800 truncate">{globalSeoTitle}</p>
              <p className="text-[11px] text-emerald-700">https://thecandlelab.com</p>
              <p className="text-xs text-slate-600 line-clamp-2">{globalSeoDescription}</p>
            </div>

            <button
              onClick={handleSaveSeo}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              <Save className="w-4 h-4" /> Save SEO Parameters
            </button>
          </div>
        </div>
      )}

      {["collections", "testimonials", "faqs"].includes(activeTab) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 capitalize border-b border-slate-100 pb-3">
            {activeTab} Content Grid
          </h3>
          <p className="text-xs text-slate-500">Manage order, items and visual assets for {activeTab}. All items are automatically synced to the live storefront.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {collections.slice(0, 6).map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.iconSymbol}</span>
                  <h4 className="font-bold text-slate-900 text-xs">{item.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
