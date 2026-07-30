import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

type MarketingSubTab =
  | 'coupons'
  | 'discounts'
  | 'flashsale'
  | 'popups'
  | 'banners'
  | 'email'
  | 'push';

export const AdminMarketingCMS: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<MarketingSubTab>('coupons');
  const { coupons, addCoupon, deleteCoupon } = useCMS();
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [description, setDescription] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const SUB_TABS: { id: MarketingSubTab; label: string; icon: string }[] = [
    { id: 'coupons', label: 'Coupons', icon: '🎟️' },
    { id: 'discounts', label: 'Discounts', icon: '🏷️' },
    { id: 'flashsale', label: 'Flash Sale', icon: '⚡' },
    { id: 'popups', label: 'Popups', icon: '💬' },
    { id: 'banners', label: 'Banners', icon: '🖼️' },
    { id: 'email', label: 'Email Campaigns', icon: '✉️' },
    { id: 'push', label: 'Push Notifications', icon: '🔔' },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    addCoupon({
      code: code.toUpperCase(),
      discountPercent,
      description: description || `${discountPercent}% Off Promotional Code`,
      active: true,
    });
    setCode('');
    setDescription('');
    setSavedMsg('Coupon created!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">MARKETING & CAMPAIGNS</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Promotions & Customer Engagement</h1>
        </div>

        {savedMsg && (
          <span className="bg-[#2E6F40] text-white text-xs font-bold px-4 py-2 rounded-full shadow-subtle animate-bounce">
            ✓ {savedMsg}
          </span>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
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

      {/* Dynamic Sub-Tab Content */}
      {activeSubTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16] border-b border-[#F2ECE1] pb-2">
              🎟️ Create New Coupon
            </h3>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXURY25"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Discount Percentage (%) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Description / Conditions</label>
                <input
                  type="text"
                  placeholder="e.g. 25% Off on orders over ₹1,999"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                + Create Coupon Code
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle">
            <table className="w-full text-left text-xs text-[#2C1E16]">
              <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
                <tr>
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {coupons.map((c) => (
                  <tr key={c.code} className="hover:bg-[#FAF6F0] transition-colors">
                    <td className="p-4">
                      <span className="bg-[#B88B38] text-white font-mono font-bold px-2.5 py-1 rounded-md text-xs shadow-xs">
                        {c.code}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#2E6F40]">{c.discountPercent}% OFF</td>
                    <td className="p-4 text-xs text-[#7A6B5D]">{c.description}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteCoupon(c.code)}
                        className="text-[#B93829] font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'flashsale' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">⚡ Flash Sale & Countdown Timer</h3>
          <p className="text-xs text-[#7A6B5D]">Configure high-urgency flash sale banner and timer on storefront.</p>
        </div>
      )}

      {activeSubTab === 'email' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">✉️ Email Marketing & Blast Campaigns</h3>
          <p className="text-xs text-[#7A6B5D]">Send promotional newsletters and product announcement emails to subscribers.</p>
        </div>
      )}

      {(activeSubTab === 'discounts' || activeSubTab === 'popups' || activeSubTab === 'banners' || activeSubTab === 'push') && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16] capitalize">{activeSubTab} Manager</h3>
          <p className="text-xs text-[#7A6B5D]">Manage campaigns and display triggers for this channel.</p>
        </div>
      )}
    </div>
  );
};
