"use client";

import { useState } from "react";
import { Tag, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const MOCK_COUPONS = [
  { id: "c1", code: "FIRSTORDER", discount: "15%", minCart: 999, usageLimit: 500, usedCount: 142, active: true },
  { id: "c2", code: "SAVE10", discount: "10%", minCart: 499, usageLimit: 1000, usedCount: 389, active: true },
  { id: "c3", code: "FESTIVE25", discount: "25%", minCart: 1999, usageLimit: 200, usedCount: 200, active: false },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);

  const toggleActive = (id: string) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    toast.success("Coupon status updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
            Coupons & Promotional Discounts
          </h1>
          <p className="text-xs text-[#8B7355] mt-1">Manage promotional discount codes, usage limits, and minimum cart values.</p>
        </div>
        <button onClick={() => toast.success("Create coupon modal")} className="btn btn-gold btn-sm gap-1.5 self-start sm:self-auto">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((c) => (
          <div key={c.id} className="p-5 rounded-2xl border border-[#2A1D13] space-y-4" style={{ background: "#140D07" }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-[#C4964A] tracking-wider px-3 py-1 rounded bg-[#1F140B] border border-[#3A281A]">
                {c.code}
              </span>
              <button
                onClick={() => toggleActive(c.id)}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: c.active ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: c.active ? "#4ADE80" : "#F87171",
                }}
              >
                {c.active ? "Active" : "Disabled"}
              </button>
            </div>
            <div className="space-y-1 text-xs text-[#A08060]">
              <p><span className="text-[#8B7355]">Discount:</span> <strong className="text-[#F5EFE4]">{c.discount} OFF</strong></p>
              <p><span className="text-[#8B7355]">Min Order Value:</span> {formatPrice(c.minCart)}</p>
              <p><span className="text-[#8B7355]">Used / Total Limit:</span> {c.usedCount} / {c.usageLimit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
