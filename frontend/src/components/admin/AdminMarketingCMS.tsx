import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export const AdminMarketingCMS: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon } = useCMS();
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [description, setDescription] = useState('');

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
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-[#EFE8DB] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">PROMOTIONAL MARKETING</span>
        <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Coupons & Discount Codes ({coupons.length})</h1>
        <p className="text-xs text-[#7A6B5D] mt-1">Manage storewide promo codes redeemable during checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Coupon Form */}
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

        {/* Coupons Table */}
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
    </div>
  );
};
