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
  const {
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    settings,
    updateSettings,
    announcement,
    updateAnnouncement,
  } = useCMS();

  // Coupon Form State
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(15);
  const [minOrderAmount, setMinOrderAmount] = useState(999);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(500);
  const [description, setDescription] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  // Marketing Settings State
  const [marketing, setMarketing] = useState({
    flashSaleEnabled: settings.marketingSettings?.flashSaleEnabled ?? false,
    flashSaleTitle: settings.marketingSettings?.flashSaleTitle || 'MIDNIGHT LUXURY FLASH SALE',
    flashSaleDiscountText: settings.marketingSettings?.flashSaleDiscountText || 'UP TO 30% OFF',
    flashSaleEndTime: settings.marketingSettings?.flashSaleEndTime || '2026-10-31T23:59',
    flashSaleBannerUrl: settings.marketingSettings?.flashSaleBannerUrl || '',
    popupEnabled: settings.marketingSettings?.popupEnabled ?? true,
    popupTitle: settings.marketingSettings?.popupTitle || 'Unlock 15% Off Your Sanctuary Order',
    popupSubtitle: settings.marketingSettings?.popupSubtitle || 'Join our private atelier circle for bespoke drops & complimentary delivery.',
    popupCouponCode: settings.marketingSettings?.popupCouponCode || 'FIRST15',
    popupDelaySeconds: settings.marketingSettings?.popupDelaySeconds ?? 5,
    cartDiscountEnabled: settings.marketingSettings?.cartDiscountEnabled ?? true,
    cartDiscountThreshold: settings.marketingSettings?.cartDiscountThreshold ?? 1999,
    cartDiscountPercent: settings.marketingSettings?.cartDiscountPercent ?? 10,
    pushEnabled: settings.marketingSettings?.pushEnabled ?? false,
  });

  // Announcement Bar Form State
  const [annForm, setAnnForm] = useState(announcement);

  React.useEffect(() => {
    if (settings.marketingSettings) {
      setMarketing((prev) => ({ ...prev, ...settings.marketingSettings }));
    }
  }, [settings.marketingSettings]);

  React.useEffect(() => {
    if (announcement) {
      setAnnForm(announcement);
    }
  }, [announcement]);

  const triggerToast = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3500);
  };

  const SUB_TABS: { id: MarketingSubTab; label: string; icon: string }[] = [
    { id: 'coupons', label: 'Coupons & Vouchers', icon: '🎟️' },
    { id: 'discounts', label: 'Automatic Discounts', icon: '🏷️' },
    { id: 'flashsale', label: 'Flash Sale & Timer', icon: '⚡' },
    { id: 'popups', label: 'Promotional Popups', icon: '💬' },
    { id: 'banners', label: 'Announcement Bar', icon: '📢' },
    { id: 'email', label: 'Email Campaigns', icon: '✉️' },
    { id: 'push', label: 'Push Notifications', icon: '🔔' },
  ];

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    await addCoupon({
      code: cleanCode,
      discountPercent: Number(discountPercent),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: Number(maxDiscountAmount) || 500,
      description: description.trim() || `${discountPercent}% Off on orders above ₹${minOrderAmount}`,
      active: true,
    });

    setCode('');
    setDescription('');
    triggerToast(`Coupon "${cleanCode}" created & activated live!`);
  };

  const handleSaveMarketing = (e: React.FormEvent, successMsg: string) => {
    e.preventDefault();
    updateSettings({ marketingSettings: marketing });
    triggerToast(successMsg);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement(annForm);
    triggerToast('Announcement bar banner updated live!');
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">PROMOTIONS & CONVERSION</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Marketing & Campaigns Hub</h1>
          <p className="text-xs text-[#7A6B5D] mt-1">Manage active coupon codes, flash sale timers, welcome modals, and storefront banners.</p>
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

      {/* 1. COUPONS */}
      {activeSubTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16] border-b border-[#F2ECE1] pb-2">
              🎟️ Create Dynamic Promo Code
            </h3>

            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXURY20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-mono font-bold uppercase tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Discount % *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Customer Description / Perks</label>
                <input
                  type="text"
                  placeholder="e.g. 20% Off on orders over ₹1,499"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                + Create & Publish Coupon
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle flex flex-col justify-between">
            <div>
              <div className="p-4 bg-[#FAF6F0] border-b border-[#EFE8DB] flex items-center justify-between">
                <strong className="text-xs font-serif font-bold text-[#2C1E16]">
                  Active Store Vouchers ({coupons.length})
                </strong>
                <span className="text-[10px] text-[#7A6B5D]">Only verified codes appear in checkout</span>
              </div>

              {coupons.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <span className="text-3xl">🎟️</span>
                  <h4 className="font-serif font-bold text-[#2C1E16] text-sm">No Coupons Created Yet</h4>
                  <p className="text-xs text-[#7A6B5D]">Create your first promotional discount voucher using the form on the left.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#2C1E16]">
                    <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
                      <tr>
                        <th className="p-3.5">Code</th>
                        <th className="p-3.5">Savings</th>
                        <th className="p-3.5">Conditions</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE1]">
                      {coupons.map((c) => (
                        <tr key={c.code} className="hover:bg-[#FAF6F0] transition-colors">
                          <td className="p-3.5">
                            <span className="bg-[#FAF6F0] border border-[#B88B38] text-[#8B6F4E] font-mono font-bold px-2.5 py-1 rounded-md text-xs shadow-xs">
                              {c.code}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-[#2E6F40]">{c.discountPercent}% OFF</td>
                          <td className="p-3.5 text-[11px] text-[#7A6B5D]">
                            <div>Min ₹{c.minOrderAmount || 0}</div>
                            <div className="text-[10px] text-[#A89887] truncate max-w-[150px]">{c.description}</div>
                          </td>
                          <td className="p-3.5">
                            <button
                              type="button"
                              onClick={() => updateCoupon(c.code, { active: !c.active })}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                c.active !== false
                                  ? 'bg-[#E8F5E9] text-[#2E6F40] border border-[#2E6F40]/30'
                                  : 'bg-[#FFEBEE] text-[#C62828] border border-[#C62828]/30'
                              }`}
                            >
                              {c.active !== false ? 'ACTIVE' : 'PAUSED'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete coupon "${c.code}" permanently?`)) {
                                  deleteCoupon(c.code);
                                  triggerToast(`Deleted coupon ${c.code}`);
                                }
                              }}
                              className="text-[#B93829] hover:text-red-700 font-bold hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. AUTOMATIC DISCOUNTS */}
      {activeSubTab === 'discounts' && (
        <form onSubmit={(e) => handleSaveMarketing(e, 'Automatic discount rules saved live!')} className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-6 max-w-2xl text-xs">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Automatic Cart Promotions (No Code Required)</h3>
            <p className="text-xs text-[#7A6B5D]">Automatically apply rewards when customers hit cart value milestones.</p>
          </div>

          <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-xs text-[#2C1E16] block">Tiered Cart Order Discount</strong>
                <span className="text-[11px] text-[#7A6B5D]">Auto-discount applied at checkout when cart reaches minimum threshold</span>
              </div>
              <input
                type="checkbox"
                checked={marketing.cartDiscountEnabled}
                onChange={(e) => setMarketing({ ...marketing, cartDiscountEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#B88B38] cursor-pointer"
              />
            </div>

            {marketing.cartDiscountEnabled && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#EFE8DB]">
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Cart Minimum Spend (₹)</label>
                  <input
                    type="number"
                    value={marketing.cartDiscountThreshold}
                    onChange={(e) => setMarketing({ ...marketing, cartDiscountThreshold: Number(e.target.value) })}
                    className="w-full bg-white border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Discount Rate (%)</label>
                  <input
                    type="number"
                    value={marketing.cartDiscountPercent}
                    onChange={(e) => setMarketing({ ...marketing, cartDiscountPercent: Number(e.target.value) })}
                    className="w-full bg-white border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Automatic Discount Rules →
          </button>
        </form>
      )}

      {/* 3. FLASH SALE */}
      {activeSubTab === 'flashsale' && (
        <form onSubmit={(e) => handleSaveMarketing(e, 'Flash sale settings & countdown timer saved!')} className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-6 max-w-2xl text-xs">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">⚡ High-Urgency Flash Sale Banner & Countdown</h3>
              <p className="text-xs text-[#7A6B5D]">Display prominent live countdown clock and promotional tag across the storefront.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
              <span>Enable Flash Sale</span>
              <input
                type="checkbox"
                checked={marketing.flashSaleEnabled}
                onChange={(e) => setMarketing({ ...marketing, flashSaleEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#B88B38]"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Flash Sale Headline</label>
              <input
                type="text"
                value={marketing.flashSaleTitle}
                onChange={(e) => setMarketing({ ...marketing, flashSaleTitle: e.target.value })}
                placeholder="FESTIVE ATELIER FLASH SALE"
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Discount Offer Highlight</label>
                <input
                  type="text"
                  value={marketing.flashSaleDiscountText}
                  onChange={(e) => setMarketing({ ...marketing, flashSaleDiscountText: e.target.value })}
                  placeholder="FLAT 30% OFF ALL JARS"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Countdown End Date & Time</label>
                <input
                  type="datetime-local"
                  value={marketing.flashSaleEndTime}
                  onChange={(e) => setMarketing({ ...marketing, flashSaleEndTime: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Promotional Banner Image URL (Optional)</label>
              <input
                type="url"
                value={marketing.flashSaleBannerUrl}
                onChange={(e) => setMarketing({ ...marketing, flashSaleBannerUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Flash Sale Configuration →
          </button>
        </form>
      )}

      {/* 4. POPUPS */}
      {activeSubTab === 'popups' && (
        <form onSubmit={(e) => handleSaveMarketing(e, 'Newsletter & Welcome popup configured!')} className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-6 max-w-2xl text-xs">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">💬 Boutique Welcome & Email Collector Popup</h3>
              <p className="text-xs text-[#7A6B5D]">Engage new storefront visitors with a welcome discount incentive modal.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
              <span>Enable Modal</span>
              <input
                type="checkbox"
                checked={marketing.popupEnabled}
                onChange={(e) => setMarketing({ ...marketing, popupEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#B88B38]"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Popup Headline</label>
              <input
                type="text"
                value={marketing.popupTitle}
                onChange={(e) => setMarketing({ ...marketing, popupTitle: e.target.value })}
                placeholder="Unlock 15% Off Your Sanctuary Order"
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Subtitle / Brand Description</label>
              <textarea
                rows={2}
                value={marketing.popupSubtitle}
                onChange={(e) => setMarketing({ ...marketing, popupSubtitle: e.target.value })}
                placeholder="Join our private atelier circle for bespoke drops & complimentary delivery."
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Awarded Coupon Code</label>
                <input
                  type="text"
                  value={marketing.popupCouponCode}
                  onChange={(e) => setMarketing({ ...marketing, popupCouponCode: e.target.value })}
                  placeholder="FIRST15"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Display Delay (Seconds)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={marketing.popupDelaySeconds}
                  onChange={(e) => setMarketing({ ...marketing, popupDelaySeconds: Number(e.target.value) })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Popup Settings →
          </button>
        </form>
      )}

      {/* 5. STOREFRONT ANNOUNCEMENT BANNER */}
      {activeSubTab === 'banners' && (
        <form onSubmit={handleSaveAnnouncement} className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-6 max-w-2xl text-xs">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">📢 Top Header Announcement Bar</h3>
              <p className="text-xs text-[#7A6B5D]">Promotional message & highlighted coupon code pinned to the top of all pages.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
              <span>Visible on Site</span>
              <input
                type="checkbox"
                checked={annForm.visible}
                onChange={(e) => setAnnForm({ ...annForm, visible: e.target.checked })}
                className="w-4 h-4 accent-[#B88B38]"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Banner Announcement Text</label>
              <input
                type="text"
                value={annForm.text}
                onChange={(e) => setAnnForm({ ...annForm, text: e.target.value })}
                placeholder="✨ Complimentary Luxury Candle Care Set on all orders above ₹1,999 | Code:"
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Coupon Code Tag</label>
                <input
                  type="text"
                  value={annForm.couponCode}
                  onChange={(e) => setAnnForm({ ...annForm, couponCode: e.target.value })}
                  placeholder="LUXURY20"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Discount Tag (e.g. 20% OFF)</label>
                <input
                  type="text"
                  value={annForm.discountText}
                  onChange={(e) => setAnnForm({ ...annForm, discountText: e.target.value })}
                  placeholder="20% OFF"
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Announcement Banner →
          </button>
        </form>
      )}

      {/* 6. EMAIL MARKETING */}
      {activeSubTab === 'email' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-6 max-w-2xl text-xs">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">✉️ Email Marketing & VIP Broadcasts</h3>
            <p className="text-xs text-[#7A6B5D]">Dispatch curated collection launches and exclusive discount invitations to subscriber lists.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Audience Segment</label>
              <select className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-medium">
                <option>All Newsletter Subscribers (Active)</option>
                <option>VIP Gold & Platinum Customers</option>
                <option>First-Time Buyers</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Email Subject Line</label>
              <input
                type="text"
                placeholder="🕯️ An invitation to explore our Autumn Botanical Soy Reserve"
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Campaign Message Content</label>
              <textarea
                rows={4}
                placeholder="Dear Connoisseur, Discover our new hand-poured seasonal fragrances crafted with Madagascar Vanilla and Smoked Oud..."
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <button
              type="button"
              onClick={() => triggerToast('Campaign scheduled & queued for delivery!')}
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              🚀 Dispatch Broadcast Email →
            </button>
          </div>
        </div>
      )}

      {/* 7. PUSH NOTIFICATIONS */}
      {activeSubTab === 'push' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-6 max-w-2xl text-xs">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">🔔 Web Push Notifications</h3>
              <p className="text-xs text-[#7A6B5D]">Deliver instant browser notifications to subscribed patrons.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
              <span>Push Active</span>
              <input
                type="checkbox"
                checked={marketing.pushEnabled}
                onChange={(e) => setMarketing({ ...marketing, pushEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#B88B38]"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Notification Title</label>
              <input
                type="text"
                placeholder="🔥 Flash Sale Alert: 25% Off Ends Midnight"
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Message Body</label>
              <textarea
                rows={2}
                placeholder="Hand-poured luxury soy candles are flying fast. Tap to claim your exclusive seasonal perk."
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <button
              type="button"
              onClick={() => triggerToast('Test push notification sent successfully!')}
              className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Send Push Alert →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
