"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Tag, Gift, Zap, Percent, Mail, Bell, MessageCircle,
  Plus, X, CheckCircle2, Send, Sparkles, Clock, Copy
} from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

const TABS = [
  { id: "coupons",    label: "Coupons",       icon: Tag },
  { id: "flashsales", label: "Flash Sales",   icon: Zap },
  { id: "giftcards",  label: "Gift Cards",    icon: Gift },
  { id: "campaigns",  label: "Campaigns",     icon: Send },
];

interface MarketingModuleProps {
  defaultTab?: string;
}

export const MarketingModule: React.FC<MarketingModuleProps> = ({ defaultTab = "coupons" }) => {
  const { coupons, addCoupon, campaigns, addCampaign, showToast } = useStore();
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState<"Percentage" | "Fixed">("Percentage");
  const [discountValue, setDiscountValue] = useState(20);
  const [minSpend, setMinSpend] = useState(1499);
  const [isCouponModal, setIsCouponModal] = useState(false);

  const [campTitle, setCampTitle] = useState("");
  const [campChannel, setCampChannel] = useState<"Email" | "Push" | "WhatsApp">("Email");
  const [campAudience, setCampAudience] = useState("All Active Customers");
  const [isCampModal, setIsCampModal] = useState(false);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    addCoupon({ code: couponCode.toUpperCase(), discountType, value: discountValue, minSpend, usageLimit: 500, timesUsed: 0, status: "Active", expiryDate: "2026-12-31" });
    showToast(`Coupon ${couponCode.toUpperCase()} created & activated! 🎟️`);
    setCouponCode(""); setIsCouponModal(false);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle) return;
    addCampaign({ title: campTitle, channel: campChannel, targetAudience: campAudience, status: "Draft", sentCount: 0, openRate: "0%", clickRate: "0%" });
    showToast(`Campaign "${campTitle}" created!`);
    setCampTitle(""); setIsCampModal(false);
  };

  const flashSales = [
    { name: "Weekend Flash Sale", discount: "25%", start: "2026-08-01", end: "2026-08-02", active: true },
    { name: "Independence Day Offer", discount: "20%", start: "2026-08-15", end: "2026-08-16", active: false },
    { name: "Clearance — End of Season", discount: "40%", start: "2026-09-01", end: "2026-09-05", active: false },
  ];

  const InputCls = "w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#EEF2FF] transition-all";
  const LabelCls = "block text-[12px] font-semibold text-[#475569] mb-1.5";

  return (
    <div style={FONT} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Marketing & Promotions</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{coupons.length} active coupons · {campaigns.length} campaigns</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "coupons" && (
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsCouponModal(true)}>
              New Coupon
            </Button>
          )}
          {activeTab === "campaigns" && (
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsCampModal(true)}>
              New Campaign
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-t-lg transition-all ${activeTab === tab.id ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#64748B] hover:text-[#0F172A]"}`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Coupons Panel ── */}
      {activeTab === "coupons" && (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" style={FONT}>
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Coupon Code", "Type", "Value", "Min. Spend", "Used / Limit", "Expiry", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {coupons.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-[13px] text-[#94A3B8]">No coupons yet — create your first one!</td></tr>
                ) : coupons.map((c) => (
                  <tr key={c.code} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold font-mono text-[#6366F1]">{c.code}</span>
                        <button onClick={() => { navigator.clipboard.writeText(c.code); showToast("Copied!"); }} className="p-1 text-[#94A3B8] hover:text-[#6366F1]"><Copy className="w-3 h-3" /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><Badge variant="indigo">{c.discountType}</Badge></td>
                    <td className="px-4 py-3.5"><span className="text-[13px] font-bold text-[#0F172A]">{c.discountType === "Percentage" ? `${c.value}%` : `₹${c.value}`}</span></td>
                    <td className="px-4 py-3.5"><span className="text-[12px] text-[#64748B]">₹{c.minSpend}</span></td>
                    <td className="px-4 py-3.5"><span className="text-[12px] text-[#64748B]">{c.timesUsed} / {c.usageLimit}</span></td>
                    <td className="px-4 py-3.5"><span className="text-[11px] text-[#94A3B8] flex items-center gap-1"><Clock className="w-3 h-3" />{c.expiryDate}</span></td>
                    <td className="px-4 py-3.5"><Badge variant={c.status === "Active" ? "success" : "neutral"} dot>{c.status}</Badge></td>
                    <td className="px-4 py-3.5"><button onClick={() => showToast("Coupon deactivated")} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"><X className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Flash Sales Panel ── */}
      {activeTab === "flashsales" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashSales.map((fs) => (
            <Card key={fs.name} padding="md" hover>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <Badge variant={fs.active ? "success" : "neutral"} dot>{fs.active ? "Active" : "Scheduled"}</Badge>
              </div>
              <h3 className="text-[14px] font-bold text-[#0F172A] mt-3">{fs.name}</h3>
              <p className="text-[24px] font-bold text-[#6366F1] mt-1">{fs.discount} OFF</p>
              <p className="text-[11px] text-[#94A3B8] mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{fs.start} → {fs.end}</p>
              <div className="mt-4 flex gap-2">
                <Button variant={fs.active ? "danger" : "primary"} size="xs" className="flex-1">
                  {fs.active ? "End Sale" : "Activate"}
                </Button>
                <Button variant="secondary" size="xs">Edit</Button>
              </div>
            </Card>
          ))}
          <Card padding="md" hover className="border-dashed border-2 cursor-pointer flex flex-col items-center justify-center gap-2 text-[#94A3B8] hover:text-[#6366F1] hover:border-[#6366F1] transition-all min-h-[150px]">
            <Plus className="w-6 h-6" />
            <span className="text-[13px] font-semibold">Create Flash Sale</span>
          </Card>
        </div>
      )}

      {/* ── Gift Cards Panel ── */}
      {activeTab === "giftcards" && (
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#0F172A]">Gift Card Denominations</h2>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>Add Denomination</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[500, 1000, 2000, 5000].map((amt) => (
              <div key={amt} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white text-center shadow-md">
                <Gift className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <p className="text-[24px] font-bold">₹{amt}</p>
                <p className="text-[11px] opacity-80 mt-1">Gift Card</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Campaigns Panel ── */}
      {activeTab === "campaigns" && (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" style={FONT}>
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Campaign", "Channel", "Audience", "Sent", "Opens", "Clicks", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {campaigns.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-[13px] text-[#94A3B8]">No campaigns yet</td></tr>
                ) : campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3.5"><p className="text-[13px] font-semibold text-[#0F172A]">{c.title}</p></td>
                    <td className="px-4 py-3.5"><Badge variant="info">{c.channel}</Badge></td>
                    <td className="px-4 py-3.5"><span className="text-[12px] text-[#64748B]">{c.targetAudience}</span></td>
                    <td className="px-4 py-3.5"><span className="text-[12px] font-bold text-[#0F172A]">{c.sentCount.toLocaleString()}</span></td>
                    <td className="px-4 py-3.5"><span className="text-[12px] text-emerald-600 font-bold">{c.openRate}</span></td>
                    <td className="px-4 py-3.5"><span className="text-[12px] text-[#6366F1] font-bold">{c.clickRate}</span></td>
                    <td className="px-4 py-3.5"><Badge variant={c.status === "Sent" ? "success" : c.status === "Draft" ? "neutral" : "warning"} dot>{c.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Create Coupon Modal ── */}
      {isCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCouponModal(false)} />
          <div style={FONT} className="relative bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#0F172A]">Create New Coupon</h2>
              <button onClick={() => setIsCouponModal(false)} className="p-1.5 rounded-xl hover:bg-[#F1F5F9] text-[#94A3B8]"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className={LabelCls}>Coupon Code</label>
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="SUMMER25" required className={InputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LabelCls}>Discount Type</label>
                  <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} className={InputCls}>
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className={LabelCls}>Value</label>
                  <input type="number" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} className={InputCls} />
                </div>
              </div>
              <div>
                <label className={LabelCls}>Minimum Spend (₹)</label>
                <input type="number" value={minSpend} onChange={(e) => setMinSpend(Number(e.target.value))} className={InputCls} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setIsCouponModal(false)} type="button">Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1" type="submit">Create Coupon</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Campaign Modal ── */}
      {isCampModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCampModal(false)} />
          <div style={FONT} className="relative bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#0F172A]">Create Campaign</h2>
              <button onClick={() => setIsCampModal(false)} className="p-1.5 rounded-xl hover:bg-[#F1F5F9] text-[#94A3B8]"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className={LabelCls}>Campaign Title</label>
                <input value={campTitle} onChange={(e) => setCampTitle(e.target.value)} placeholder="Festive Sale Announcement" required className={InputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LabelCls}>Channel</label>
                  <select value={campChannel} onChange={(e) => setCampChannel(e.target.value as any)} className={InputCls}>
                    <option>Email</option>
                    <option>Push</option>
                    <option>WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label className={LabelCls}>Audience</label>
                  <select value={campAudience} onChange={(e) => setCampAudience(e.target.value)} className={InputCls}>
                    <option>All Active Customers</option>
                    <option>VIP Customers</option>
                    <option>New Customers</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setIsCampModal(false)} type="button">Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1" type="submit">Create Campaign</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
