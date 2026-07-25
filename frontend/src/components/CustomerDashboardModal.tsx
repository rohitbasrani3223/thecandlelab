"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { User, X, Package, Ticket, FileText, Wallet, Crown, Truck, MessageSquare, Plus } from "lucide-react";

interface CustomerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDashboardModal: React.FC<CustomerDashboardModalProps> = ({ isOpen, onClose }) => {
  const { loyaltyPoints, loyaltyTier, walletBalance, supportTickets, addSupportTicket, currency, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "tickets" | "wallet">("orders");
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMsg, setNewTicketMsg] = useState("");
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  if (!isOpen) return null;

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMsg) return;
    addSupportTicket(newTicketSubject, newTicketMsg);
    setNewTicketSubject("");
    setNewTicketMsg("");
    setShowNewTicketForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-brand-charcoal hover:bg-brand-beige rounded-full">
          <X className="w-5 h-5" />
        </button>

        {/* User Card */}
        <div className="bg-brand-charcoal text-brand-beige p-5 rounded-2xl border border-brand-gold/40 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-gold text-brand-charcoal font-bold flex items-center justify-center text-lg">
              AS
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                Aarav Sharma
                <span className="text-[10px] bg-brand-gold text-brand-charcoal px-2 py-0.5 rounded-full font-sans uppercase">
                  {loyaltyTier} Member
                </span>
              </h3>
              <p className="text-xs text-gray-300">aarav.sharma@example.com • +91 98765 43210</p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-brand-gold uppercase block">Store Wallet Balance</span>
            <span className="font-serif text-xl font-bold text-white">{currency}{walletBalance}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-brand-beige gap-6 text-xs font-serif font-bold mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-2.5 ${activeTab === "orders" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"}`}
          >
            My Orders (1)
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`pb-2.5 ${activeTab === "tickets" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"}`}
          >
            Concierge Tickets ({supportTickets.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-brand-beige space-y-3">
              <div className="flex justify-between items-center text-xs font-bold border-b border-brand-beige pb-2">
                <div>
                  <span className="text-brand-gold">#TCL-94821</span>
                  <span className="text-gray-400 font-normal ml-2">Placed July 24, 2026</span>
                </div>
                <button
                  onClick={() => showToast("Downloading Invoice TCL-94821.pdf 📄")}
                  className="text-brand-charcoal hover:text-brand-gold flex items-center gap-1 text-[11px]"
                >
                  <FileText className="w-3.5 h-3.5" /> Download Invoice
                </button>
              </div>

              {/* Progress Timeline */}
              <div className="py-2 text-xs">
                <p className="font-bold text-brand-charcoal mb-2">Live Status: Hand-Poured Wax Sealing & Packing 🕯️</p>
                <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                  <div className="p-1 bg-green-100 text-green-800 font-bold rounded">1. Placed</div>
                  <div className="p-1 bg-brand-gold text-brand-charcoal font-bold rounded animate-pulse">2. Hand-Poured</div>
                  <div className="p-1 bg-gray-100 text-gray-400 rounded">3. Dispatched</div>
                  <div className="p-1 bg-gray-100 text-gray-400 rounded">4. Delivered</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Concierge Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Concierge Support Tickets</h4>
              <button
                onClick={() => setShowNewTicketForm(!showNewTicketForm)}
                className="bg-brand-charcoal text-brand-gold px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-gold hover:text-brand-charcoal flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Create Ticket
              </button>
            </div>

            {showNewTicketForm && (
              <form onSubmit={handleCreateTicket} className="bg-white p-4 rounded-xl border border-brand-gold/40 space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="Ticket Subject..."
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="w-full p-2 rounded-lg border border-brand-beige"
                  required
                />
                <textarea
                  rows={2}
                  placeholder="Describe your inquiry to Concierge..."
                  value={newTicketMsg}
                  onChange={(e) => setNewTicketMsg(e.target.value)}
                  className="w-full p-2 rounded-lg border border-brand-beige"
                  required
                />
                <button type="submit" className="bg-brand-gold text-brand-charcoal px-4 py-1.5 rounded-lg font-bold">
                  Submit Ticket
                </button>
              </form>
            )}

            {supportTickets.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-xl border border-brand-beige space-y-2 text-xs">
                <div className="flex justify-between font-bold text-brand-charcoal">
                  <span>#{t.id}: {t.subject}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${t.status === "RESOLVED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-brand-earth text-[11px] bg-brand-surface p-2 rounded border border-brand-beige">
                  {t.messages[0]}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
