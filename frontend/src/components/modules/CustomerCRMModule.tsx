"use client";

import React, { useState } from "react";
import { useStore, CustomerRecord } from "@/context/StoreContext";
import {
  Users,
  Search,
  Download,
  ShieldAlert,
  Wallet,
  Award,
  Heart,
  MessageSquare,
  FileText,
  X,
  Plus,
  CheckCircle2,
  Clock,
  Ban,
  Mail,
  Phone,
  Calendar,
  ShoppingBag
} from "lucide-react";

export const CustomerCRMModule: React.FC = () => {
  const { customers, toggleBlockCustomer, updateCustomerNotes, adjustCustomerWallet, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerDrawer, setSelectedCustomerDrawer] = useState<CustomerRecord | null>(null);

  // Wallet adjustment modal state
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletAdjustAmount, setWalletAdjustAmount] = useState(500);

  // Notes editing state
  const [noteText, setNoteText] = useState("");

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    return true;
  });

  const handleExportCRM = () => {
    showToast(`Exported ${filteredCustomers.length} customer records to CSV/CRM format 📊`);
  };

  const handleSaveNotes = () => {
    if (!selectedCustomerDrawer) return;
    updateCustomerNotes(selectedCustomerDrawer.id, noteText);
    setSelectedCustomerDrawer((prev) => (prev ? { ...prev, internalNotes: noteText } : null));
  };

  const handleConfirmWalletAdjust = () => {
    if (!selectedCustomerDrawer) return;
    adjustCustomerWallet(selectedCustomerDrawer.id, walletAdjustAmount);
    setSelectedCustomerDrawer((prev) =>
      prev ? { ...prev, walletBalance: Math.max(0, prev.walletBalance + walletAdjustAmount) } : null
    );
    setIsWalletModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Customer CRM 360 & Loyalty Portal</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer profiles, order history, wallet balance, loyalty points, wishlist & support history.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCRM}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CRM Data
          </button>
        </div>
      </div>

      {/* Search box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Wallet</th>
                <th className="p-4">Loyalty Tier</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {c.id}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-800">{c.email}</div>
                    <div className="text-[10px] text-slate-400">{c.phone}</div>
                  </td>
                  <td className="p-4 text-slate-500">{c.joinedDate}</td>
                  <td className="p-4 font-bold text-slate-900">{c.totalOrders} orders</td>
                  <td className="p-4 font-bold text-emerald-600">₹{c.totalSpent.toLocaleString()}</td>
                  <td className="p-4 font-bold text-indigo-600">₹{c.walletBalance}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.loyaltyTier === "Platinum"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : c.loyaltyTier === "Gold"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <Award className="w-3 h-3 mr-1" /> {c.loyaltyTier}
                    </span>
                  </td>
                  <td className="p-4">
                    {c.isBlocked ? (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        Blocked / Banned
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedCustomerDrawer(c);
                        setNoteText(c.internalNotes || "");
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      View 360° Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360 Profile Side Drawer */}
      {selectedCustomerDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{selectedCustomerDrawer.name}</h3>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      {selectedCustomerDrawer.loyaltyTier} Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selectedCustomerDrawer.email} • {selectedCustomerDrawer.phone}</p>
                </div>
                <button
                  onClick={() => setSelectedCustomerDrawer(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Lifetime Value</span>
                  <p className="text-base font-bold text-emerald-600 mt-0.5">₹{selectedCustomerDrawer.totalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Wallet Balance</span>
                  <p className="text-base font-bold text-indigo-600 mt-0.5">₹{selectedCustomerDrawer.walletBalance}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Loyalty Points</span>
                  <p className="text-base font-bold text-amber-600 mt-0.5">{selectedCustomerDrawer.loyaltyPoints} pts</p>
                </div>
              </div>

              {/* Wallet Adjustment Button */}
              <div className="flex justify-between items-center bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-xs">
                <span className="font-medium text-indigo-900">Manage Store Credit / Wallet</span>
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                >
                  Adjust Wallet Balance
                </button>
              </div>

              {/* Internal Notes Editor */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Internal Admin Notes</span>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none"
                  placeholder="Add private note regarding preferences, VIP status, or past issues..."
                />
                <button
                  onClick={handleSaveNotes}
                  className="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Save Internal Note
                </button>
              </div>

              {/* Customer Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Account Risk Governance</span>
                <button
                  onClick={() => {
                    toggleBlockCustomer(selectedCustomerDrawer.id);
                    setSelectedCustomerDrawer((prev) => (prev ? { ...prev, isBlocked: !prev.isBlocked } : null));
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-colors ${
                    selectedCustomerDrawer.isBlocked
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                  }`}
                >
                  <Ban className="w-4 h-4" />
                  {selectedCustomerDrawer.isBlocked ? "Unblock Customer Account" : "Block / Ban Customer Account"}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-400">Account Created: {selectedCustomerDrawer.joinedDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Wallet Modal */}
      {isWalletModalOpen && selectedCustomerDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-indigo-600" /> Adjust Wallet Credit
              </h3>
              <button onClick={() => setIsWalletModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">Add or deduct store credit for <strong>{selectedCustomerDrawer.name}</strong>.</p>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount Delta (Positive to Add, Negative to Deduct)</label>
                <input
                  type="number"
                  value={walletAdjustAmount}
                  onChange={(e) => setWalletAdjustAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWalletAdjust}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow transition-colors"
              >
                Update Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
