"use client";

import React, { useState } from "react";
import { useStore, SellerRecord } from "@/context/StoreContext";
import {
  Store,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  DollarSign,
  Building,
  CreditCard,
  FileCheck,
  TrendingUp,
  Package,
  Clock,
  X,
  MessageSquare
} from "lucide-react";

export const SellerManagementModule: React.FC = () => {
  const { sellers, approveSeller, rejectSeller, processSellerPayout, showToast } = useStore();
  const [selectedSellerModal, setSelectedSellerModal] = useState<SellerRecord | null>(null);

  const pendingSellersCount = sellers.filter((s) => s.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Seller Portal & Multi-Vendor Governance</h2>
          <p className="text-xs text-slate-500 mt-0.5">Approve vendor applications, audit GST/PAN/Bank verification, review payouts & commission revenue share.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Platform Fee: 12% Standard
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-medium text-slate-500">Active Verified Sellers</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{sellers.filter((s) => s.status === "VERIFIED").length} Vendors</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Store className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-medium text-slate-500">Pending KYB Approvals</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{pendingSellersCount} Applications</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Pending Payouts</span>
            <div className="text-2xl font-bold text-indigo-600 mt-1">₹{sellers.reduce((sum, s) => sum + s.pendingPayout, 0).toLocaleString()}</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sellers Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="p-4">Seller Store</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">GSTIN & PAN</th>
                <th className="p-4">Gross Sales</th>
                <th className="p-4">Commission</th>
                <th className="p-4">Pending Payout</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sellers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{s.storeName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">Owner: {s.name}</span>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div>{s.email}</div>
                    <div className="text-[10px] text-slate-400">{s.phone}</div>
                  </td>
                  <td className="p-4 font-mono text-slate-700">
                    <div className="font-bold">{s.gstNumber}</div>
                    <div className="text-[10px] text-slate-400">PAN: {s.panNumber}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-900">₹{s.totalSales.toLocaleString()}</td>
                  <td className="p-4 text-indigo-600 font-bold">{s.commissionRate}%</td>
                  <td className="p-4 font-bold text-amber-600">₹{s.pendingPayout.toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === "VERIFIED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : s.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedSellerModal(s)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                      >
                        KYB Audit
                      </button>
                      {s.pendingPayout > 0 && (
                        <button
                          onClick={() => processSellerPayout(s.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-colors shadow-xs"
                        >
                          Payout
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYB Audit Modal */}
      {selectedSellerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> KYB Verification Audit
              </h3>
              <button onClick={() => setSelectedSellerModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Legal Business Name</span>
                <p className="font-bold text-slate-900 text-sm">{selectedSellerModal.name}</p>
                <p className="text-slate-600">Store: {selectedSellerModal.storeName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">GST Registration</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{selectedSellerModal.gstNumber}</p>
                  <span className="text-[10px] text-emerald-600 font-bold">GST Portal Validated</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">PAN Card Number</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{selectedSellerModal.panNumber}</p>
                  <span className="text-[10px] text-emerald-600 font-bold">KYC Verified</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Settlement Bank Account</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedSellerModal.bankAccount}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs font-semibold">
              {selectedSellerModal.status === "PENDING" && (
                <>
                  <button
                    onClick={() => {
                      rejectSeller(selectedSellerModal.id);
                      setSelectedSellerModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => {
                      approveSeller(selectedSellerModal.id);
                      setSelectedSellerModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow transition-colors"
                  >
                    Approve Seller
                  </button>
                </>
              )}
              {selectedSellerModal.status === "VERIFIED" && (
                <button
                  onClick={() => setSelectedSellerModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Close Audit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
