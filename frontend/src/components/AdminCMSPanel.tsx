"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Sliders, Plus, Edit3, Trash2, Check, Sparkles, Image as ImageIcon, Flame, Megaphone, HelpCircle } from "lucide-react";

export const AdminCMSPanel: React.FC = () => {
  const { showToast } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<"banners" | "announcements" | "faqs">("banners");

  const [banners, setBanners] = useState([
    { id: "b-1", title: "HANDCRAFTED TO GLOW", subtitle: "Premium candles that bring warmth, fragrance, and elegance to your space.", ctaText: "Shop Now", isActive: true },
    { id: "b-2", title: "ROYAL FESTIVE GLOW", subtitle: "Hand-poured spiced cinnamon and amber festive gift hampers.", ctaText: "Explore Gifts", isActive: false }
  ]);

  const [announcementText, setAnnouncementText] = useState("Complimentary Handcrafted Wax Seal & Gift Box on Orders Above ₹1,499");
  const [faqs, setFaqs] = useState([
    { id: "faq-1", question: "What type of wax is used in Candle Lab candles?", answer: "We use 100% natural, eco-friendly Soy Wax, Coconut Wax, and pure Beeswax. No paraffin toxic petroleum." },
    { id: "faq-2", question: "How long is the burn time?", answer: "Our standard 250g candles burn cleanly for 50-60 hours when wicks are trimmed properly." }
  ]);

  const [editingBanner, setEditingBanner] = useState<any>(null);

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    setBanners((prev) => prev.map((b) => (b.id === editingBanner.id ? editingBanner : b)));
    setEditingBanner(null);
    showToast("Hero Banner updated live on Storefront CMS! 🖥️✨");
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6 shadow-sm">
      
      <div className="flex items-center justify-between border-b border-brand-beige pb-4">
        <div>
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> NO-CODE CMS ENGINE
          </span>
          <h3 className="font-serif text-xl font-bold text-brand-charcoal">Storefront Content Management</h3>
        </div>

        <div className="flex gap-2 text-xs font-bold font-serif">
          <button
            onClick={() => setActiveSubTab("banners")}
            className={`px-3 py-1.5 rounded-lg ${activeSubTab === "banners" ? "bg-brand-charcoal text-brand-gold" : "bg-brand-beige text-brand-earth"}`}
          >
            Hero Banners
          </button>
          <button
            onClick={() => setActiveSubTab("announcements")}
            className={`px-3 py-1.5 rounded-lg ${activeSubTab === "announcements" ? "bg-brand-charcoal text-brand-gold" : "bg-brand-beige text-brand-earth"}`}
          >
            Announcement Bar
          </button>
          <button
            onClick={() => setActiveSubTab("faqs")}
            className={`px-3 py-1.5 rounded-lg ${activeSubTab === "faqs" ? "bg-brand-charcoal text-brand-gold" : "bg-brand-beige text-brand-earth"}`}
          >
            FAQs
          </button>
        </div>
      </div>

      {/* Hero Banners Manager */}
      {activeSubTab === "banners" && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h4 className="font-bold uppercase tracking-wider text-brand-charcoal">Homepage Hero Banners ({banners.length})</h4>
          </div>

          <div className="space-y-3">
            {banners.map((b) => (
              <div key={b.id} className="bg-brand-surface p-4 rounded-xl border border-brand-beige flex items-center justify-between">
                <div>
                  <h5 className="font-serif text-sm font-bold text-brand-charcoal">{b.title}</h5>
                  <p className="text-[11px] text-brand-earth mt-0.5">{b.subtitle}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold ${b.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                    {b.isActive ? "LIVE ON STOREFRONT" : "DRAFT"}
                  </span>
                </div>

                <button
                  onClick={() => setEditingBanner(b)}
                  className="bg-brand-charcoal text-brand-gold px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-gold hover:text-brand-charcoal"
                >
                  Edit Banner
                </button>
              </div>
            ))}
          </div>

          {editingBanner && (
            <form onSubmit={handleSaveBanner} className="bg-white p-4 rounded-xl border border-brand-gold/40 space-y-3 text-xs">
              <h5 className="font-bold text-brand-charcoal">Editing Hero Banner Content</h5>
              <div>
                <label className="text-[10px] text-gray-500 font-bold block">Headline Title</label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full p-2 rounded border border-brand-beige"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold block">Subheadline Description</label>
                <textarea
                  rows={2}
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full p-2 rounded border border-brand-beige"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditingBanner(null)} className="text-gray-500 underline">Cancel</button>
                <button type="submit" className="bg-brand-gold text-brand-charcoal px-4 py-1.5 rounded font-bold">Save Live CMS Changes</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Announcement Bar Manager */}
      {activeSubTab === "announcements" && (
        <div className="space-y-4 text-xs">
          <h4 className="font-bold uppercase tracking-wider text-brand-charcoal">Top Announcement Bar Text</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-brand-beige"
            />
            <button
              onClick={() => showToast("Announcement text updated live! 📢")}
              className="bg-brand-charcoal text-brand-gold px-4 py-2 rounded-xl font-bold"
            >
              Update Bar
            </button>
          </div>
        </div>
      )}

      {/* FAQs Manager */}
      {activeSubTab === "faqs" && (
        <div className="space-y-4 text-xs">
          <h4 className="font-bold uppercase tracking-wider text-brand-charcoal">Manage Frequently Asked Questions</h4>
          {faqs.map((f) => (
            <div key={f.id} className="bg-brand-surface p-3 rounded-xl border border-brand-beige space-y-1">
              <p className="font-bold text-brand-charcoal">Q: {f.question}</p>
              <p className="text-brand-earth">A: {f.answer}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
