import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export const AdminStoreSettings: React.FC = () => {
  const { settings, updateSettings } = useCMS();
  const [form, setForm] = useState(settings);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedMsg('Store configuration updated live!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      <div className="border-b border-[#EFE8DB] pb-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">SYSTEM CONFIGURATION</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Store Settings & Financial Rules</h1>
          <p className="text-xs text-[#7A6B5D] mt-1">Configure global store details, shipping fee thresholds, currency, and support contact details.</p>
        </div>

        {savedMsg && (
          <span className="bg-[#2E6F40] text-white text-xs font-bold px-3 py-1.5 rounded-full animate-bounce">
            ✓ {savedMsg}
          </span>
        )}
      </div>

      <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Store Name *</label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Currency Symbol</label>
              <input
                type="text"
                value={form.currencySymbol}
                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                value={form.standardShippingFee}
                onChange={(e) => setForm({ ...form, standardShippingFee: Number(e.target.value) })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Support Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Support Phone</label>
              <input
                type="text"
                value={form.supportPhone}
                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#2C1E16] block uppercase mb-1">Studio Address</label>
            <textarea
              rows={2}
              value={form.studioAddress}
              onChange={(e) => setForm({ ...form, studioAddress: e.target.value })}
              className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Save Global Settings →
          </button>
        </form>
      </div>
    </div>
  );
};
