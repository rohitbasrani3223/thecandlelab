"use client";

import { useState } from "react";
import { Sparkles, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPopupBannersPage() {
  const [enabled, setEnabled] = useState(true);
  const [headline, setHeadline] = useState("Unlock 15% Off Your First Luxury Candle Order");
  const [subtext, setSubtext] = useState("Subscribe to receive secret scent drops & priority access to limited editions.");
  const [couponCode, setCouponCode] = useState("FIRSTORDER");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Popup banner settings saved!");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
          Promotional Popup Banner
        </h1>
        <p className="text-xs text-[#8B7355] mt-1">Configure entry popups, exit-intent modals, and newsletter lead generation.</p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-[#2A1D13] space-y-5" style={{ background: "#140D07" }}>
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#1F140B] border border-[#3A281A]">
          <div>
            <p className="text-xs font-semibold text-[#F5EFE4]">Enable Popup Banner</p>
            <p className="text-[10px] text-[#8B7355]">Display overlay modal to first-time visitors after 5 seconds</p>
          </div>
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-[#C4964A] w-4 h-4" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#A08060] mb-1">Headline Text</label>
          <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4]" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#A08060] mb-1">Subtext Description</label>
          <textarea rows={3} value={subtext} onChange={(e) => setSubtext(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4]" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#A08060] mb-1">Promo Coupon Code</label>
          <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#C4964A] font-mono font-bold" />
        </div>

        <button type="submit" className="btn btn-gold gap-2">
          <Save size={16} /> Save Popup Configuration
        </button>
      </form>
    </div>
  );
}
