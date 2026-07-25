"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Tag,
  Gift,
  Zap,
  Percent,
  Share2,
  Mail,
  Bell,
  MessageCircle,
  Clock,
  Plus,
  X,
  CheckCircle2,
  Send,
  Sparkles
} from "lucide-react";

export const MarketingModule: React.FC = () => {
  const { coupons, addCoupon, campaigns, addCampaign, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<"coupons" | "giftcards" | "flashsales" | "bogo" | "campaigns">("coupons");

  // New Coupon Form
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState<"Percentage" | "Fixed">("Percentage");
  const [discountValue, setDiscountValue] = useState(20);
  const [minSpend, setMinSpend] = useState(1499);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // New Campaign Form
  const [campTitle, setCampTitle] = useState("");
  const [campChannel, setCampChannel] = useState<"Email" | "Push" | "WhatsApp">("Email");
  const [campAudience, setCampAudience] = useState("All Active Customers");
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    addCoupon({
      code: couponCode.toUpperCase(),
      discountType,
      value: discountValue,
      minSpend,
      usageLimit: 500,
      timesUsed: 0,
      status: "Active",
      expiryDate: "2026-12-31"
    });
    setCouponCode("");
    setIsCouponModalOpen(false);
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle) return;
    addCampaign({
      title: campTitle,
      channel: campChannel,
      targetAudience: campAudience,
      status: "Sent",
      sentCount: 1250,
      openRate: "58.4%",
      clickRate: "14.2%"
    });
    setCampTitle("");
    setIsCampModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Growth, Marketing & Omni-Channel Campaigns</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage promo coupons, gift cards, flash sales, BOGO discount rules, referral programs & WhatsApp campaigns.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCampModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            <Send className="w-3.5 h-3.5" /> Launch Campaign
          </button>
          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Create Coupon
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold">
        {[
          { id: "coupons", label: "Coupons & Discounts", icon: Tag },
          { id: "campaigns", label: "Multi-Channel Campaigns", icon: Send },
          { id: "flashsales", label: "Flash Sales & Countdown", icon: Zap },
          { id: "giftcards", label: "Digital Gift Cards", icon: Gift },
          { id: "bogo", label: "BOGO & Referral Rules", icon: Share2 }
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

      {/* Coupons Tab */}
      {activeTab === "coupons" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Min Spend</th>
                  <th className="p-4">Usage Count</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Expiry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600 text-sm">{c.code}</td>
                    <td className="p-4 font-bold text-slate-900">
                      {c.discountType === "Percentage" ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                    </td>
                    <td className="p-4 text-slate-600">₹{c.minSpend}</td>
                    <td className="p-4 text-slate-800 font-bold">{c.timesUsed} / {c.usageLimit}</td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{c.expiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Target Audience</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Sent Volume</th>
                  <th className="p-4">Open Rate</th>
                  <th className="p-4">Click Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{camp.title}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {camp.channel === "Email" ? <Mail className="w-3 h-3 mr-1 text-indigo-600" /> : camp.channel === "WhatsApp" ? <MessageCircle className="w-3 h-3 mr-1 text-emerald-600" /> : <Bell className="w-3 h-3 mr-1 text-amber-600" />}
                        {camp.channel}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{camp.targetAudience}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {camp.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{camp.sentCount}</td>
                    <td className="p-4 text-emerald-600 font-bold">{camp.openRate}</td>
                    <td className="p-4 text-indigo-600 font-bold">{camp.clickRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {["flashsales", "giftcards", "bogo"].includes(activeTab) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-slate-900 capitalize border-b border-slate-100 pb-3">
            {activeTab} Management Rules
          </h3>
          <p className="text-xs text-slate-500">Configure automated trigger rules, time duration counters and customer eligibility for {activeTab}.</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-emerald-700 block">Rule Status: ACTIVE</span>
            <p className="text-slate-700">Automated discounts are applied at checkout when conditions are satisfied.</p>
          </div>
        </div>
      )}

      {/* New Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" /> Create Promo Coupon Code
              </h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AUTUMN25"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono uppercase font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Minimum Order Spend (₹)</label>
                <input
                  type="number"
                  required
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 font-semibold">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow transition-colors"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {isCampModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" /> Launch Marketing Campaign
              </h3>
              <button onClick={() => setIsCampModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLaunchCampaign} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Candle Fragrance Drop"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Channel</label>
                <select
                  value={campChannel}
                  onChange={(e) => setCampChannel(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900"
                >
                  <option value="Email">Email Blast</option>
                  <option value="WhatsApp">WhatsApp Business API</option>
                  <option value="Push">Browser Mobile Push</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Audience Segment</label>
                <input
                  type="text"
                  value={campAudience}
                  onChange={(e) => setCampAudience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 font-semibold">
                <button
                  type="button"
                  onClick={() => setIsCampModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow transition-colors"
                >
                  Broadcast Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
