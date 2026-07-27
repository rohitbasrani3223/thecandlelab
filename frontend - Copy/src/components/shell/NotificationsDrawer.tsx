"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Bell, X, CheckCircle2, AlertTriangle, Clock, ShoppingBag, Store, Database } from "lucide-react";

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex justify-end animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 space-y-6 flex flex-col justify-between border-l border-slate-200">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" /> Notifications & Audit Stream
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> High-Value Order #ORD-94821
              </div>
              <p className="text-[11px]">New customer order received for ₹1,798.</p>
              <span className="text-[9px] text-emerald-700 font-mono">2 mins ago • Razorpay Paid</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Low Stock Reorder Alert
              </div>
              <p className="text-[11px]">Madagascar Vanilla & Caramelized Pear has 4 units left.</p>
              <span className="text-[9px] text-amber-700 font-mono">32 mins ago • Reorder Point Hit</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" /> Vendor Verification Submitted
              </div>
              <p className="text-[11px]">Botanical Aromas India uploaded GSTIN documentation.</p>
              <span className="text-[9px] text-indigo-700 font-mono">1 hour ago • Pending Review</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-colors text-center shadow"
        >
          Close Stream
        </button>
      </div>
    </div>
  );
};
