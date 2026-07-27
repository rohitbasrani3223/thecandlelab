"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { User, X, Package, Ticket, FileText, Wallet, Crown, Truck, MessageSquare, Plus, ShoppingBag, MapPin, Key, ShieldCheck, Check } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

interface CustomerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDashboardModal: React.FC<CustomerDashboardModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, loyaltyPoints, loyaltyTier, walletBalance, supportTickets, addSupportTicket, currency, showToast, logoutUser } = useStore();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wallet" | "tickets">("profile");
  
  // Edit Profile Form State
  const [editName, setEditName] = useState(currentUser?.name || "Rohit Basrani");
  const [editPhone, setEditPhone] = useState("+91 98765 43210");
  const [editAddress, setEditAddress] = useState("Flat 402, Luxury Heights, Marine Drive, Mumbai - 400020");
  const [isSaved, setIsSaved] = useState(false);

  // Ticket Form State
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMsg, setNewTicketMsg] = useState("");
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  if (!isOpen) return null;

  const userName = currentUser?.name || "Customer Account";
  const userEmail = currentUser?.email || "customer@candlelab.in";
  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase() || "CA";

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    showToast("Profile details updated successfully ✨");
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMsg) return;
    addSupportTicket(newTicketSubject, newTicketMsg);
    setNewTicketSubject("");
    setNewTicketMsg("");
    setShowNewTicketForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md text-[#1F1F1F]">
      <div className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-3xl border-2 border-[#C8A75A]/40 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#1F1F1F] hover:bg-white rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Dynamic Authenticated User Header (Flipkart / Amazon Style) */}
        <div className="bg-[#1F1F1F] text-white p-6 rounded-2xl border border-[#C8A75A]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#C8A75A] text-[#1F1F1F] font-bold flex items-center justify-center text-xl shadow-lg border-2 border-white">
              {userInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-white">
                  {userName}
                </h3>
                <span className="text-[10px] bg-[#C8A75A] text-[#1F1F1F] px-2.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider">
                  {currentUser?.loyaltyTier || loyaltyTier} Member
                </span>
              </div>
              <p className="text-xs text-gray-300 font-light mt-0.5">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#383838] pt-3 md:pt-0">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-[#C8A75A] font-bold uppercase block tracking-widest">Store Wallet</span>
              <span className="font-serif text-2xl font-bold text-white">{currency}{currentUser?.walletBalance ?? walletBalance}</span>
            </div>

            <button
              onClick={() => {
                logoutUser();
                onClose();
              }}
              className="bg-red-600/90 hover:bg-red-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow"
            >
              Logout 🚪
            </button>
          </div>
        </div>

        {/* Flipkart Style Account Tabs */}
        <div className="flex border-b border-[#E6DFD3] gap-6 text-xs font-serif font-bold mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 flex items-center gap-1.5 transition-colors whitespace-nowrap ${activeTab === "profile" ? "border-b-2 border-[#C8A75A] text-[#1F1F1F]" : "text-gray-400 hover:text-[#1F1F1F]"}`}
          >
            <User className="w-4 h-4 text-[#C8A75A]" /> Personal Profile
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 flex items-center gap-1.5 transition-colors whitespace-nowrap ${activeTab === "orders" ? "border-b-2 border-[#C8A75A] text-[#1F1F1F]" : "text-gray-400 hover:text-[#1F1F1F]"}`}
          >
            <Package className="w-4 h-4 text-[#C8A75A]" /> My Orders (0)
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`pb-3 flex items-center gap-1.5 transition-colors whitespace-nowrap ${activeTab === "wallet" ? "border-b-2 border-[#C8A75A] text-[#1F1F1F]" : "text-gray-400 hover:text-[#1F1F1F]"}`}
          >
            <Wallet className="w-4 h-4 text-[#C8A75A]" /> Wallet & Refunds
          </button>

          <button
            onClick={() => setActiveTab("tickets")}
            className={`pb-3 flex items-center gap-1.5 transition-colors whitespace-nowrap ${activeTab === "tickets" ? "border-b-2 border-[#C8A75A] text-[#1F1F1F]" : "text-gray-400 hover:text-[#1F1F1F]"}`}
          >
            <Ticket className="w-4 h-4 text-[#C8A75A]" /> Support Tickets ({supportTickets.length})
          </button>
        </div>

        {/* Tab 1: Personal Profile */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-6 bg-white p-6 rounded-2xl border border-[#E6DFD3] shadow-sm text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD3]">
              <h4 className="font-serif text-sm font-bold text-[#1F1F1F] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8A75A]" /> Personal Account Details
              </h4>
              <span className="text-[10px] text-gray-400 font-mono">ID: {currentUser?.id || "USR-2026-LIVE"}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-3 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full bg-gray-100 border border-[#E6DFD3] rounded-xl p-3 text-xs text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-3 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Membership Status</label>
                <input
                  type="text"
                  value={`${currentUser?.loyaltyTier || loyaltyTier} Member (${loyaltyPoints} Candle Points)`}
                  disabled
                  className="w-full bg-gray-100 border border-[#E6DFD3] rounded-xl p-3 text-xs text-gray-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C8A75A]" /> Default Delivery Address
              </label>
              <textarea
                rows={2}
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-3 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#C8A75A] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-[#D4B46A] transition-all shadow-md flex items-center gap-2"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <User className="w-4 h-4" />}
              {isSaved ? "Profile Saved!" : "Save Profile Details"}
            </button>
          </form>
        )}

        {/* Tab 2: My Orders (Zero-Demo Hardened) */}
        {activeTab === "orders" && (
          <div className="py-4">
            <EmptyState
              icon={<Package className="w-6 h-6 text-[#C8A75A]" />}
              title="No Purchase History Yet"
              description="You have not placed any orders yet. Explore our handcrafted luxury candle catalog to glow up your space."
              actionLabel="Explore Candle Catalog 🕯️"
              onAction={onClose}
            />
          </div>
        )}

        {/* Tab 3: Store Wallet */}
        {activeTab === "wallet" && (
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-[#E6DFD3] shadow-sm text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6DFD3]">
              <div>
                <h4 className="font-serif text-sm font-bold text-[#1F1F1F]">Store Wallet & Credits</h4>
                <p className="text-gray-500 text-[11px]">Use wallet balance for instant checkout discounts and instant return refunds.</p>
              </div>
              <span className="font-serif text-2xl font-bold text-[#C8A75A]">{currency}{currentUser?.walletBalance ?? walletBalance}</span>
            </div>

            <EmptyState
              icon={<Wallet className="w-6 h-6 text-[#C8A75A]" />}
              title="Wallet Ready for Checkout"
              description="Your wallet balance is active. Add store credits or process refunds directly to your Candle Lab wallet."
              actionLabel="Shop Now"
              onAction={onClose}
            />
          </div>
        )}

        {/* Tab 4: Concierge Support Tickets */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F]">Concierge Support Tickets</h4>
              <button
                onClick={() => setShowNewTicketForm(!showNewTicketForm)}
                className="bg-[#1F1F1F] text-[#C8A75A] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#C8A75A] hover:text-[#1F1F1F] transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Create Ticket
              </button>
            </div>

            {showNewTicketForm && (
              <form onSubmit={handleCreateTicket} className="bg-white p-4 rounded-xl border border-[#C8A75A]/40 space-y-3 text-xs shadow-sm">
                <input
                  type="text"
                  placeholder="Ticket Subject..."
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6DFD3] text-[#1F1F1F]"
                  required
                />
                <textarea
                  rows={2}
                  placeholder="Describe your inquiry to Concierge..."
                  value={newTicketMsg}
                  onChange={(e) => setNewTicketMsg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6DFD3] text-[#1F1F1F]"
                  required
                />
                <button type="submit" className="bg-[#C8A75A] text-white px-4 py-2 rounded-xl font-bold">
                  Submit Ticket
                </button>
              </form>
            )}

            {supportTickets.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="w-6 h-6 text-[#C8A75A]" />}
                title="No Support Tickets"
                description="Need custom engraving or corporate gift packaging? Create a ticket for our concierge team."
                actionLabel="Create First Ticket"
                onAction={() => setShowNewTicketForm(true)}
              />
            ) : (
              supportTickets.map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-xl border border-[#E6DFD3] space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-[#1F1F1F]">
                    <span>#{t.id}: {t.subject}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${t.status === "RESOLVED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px] bg-[#FAF7F2] p-2 rounded border border-[#E6DFD3]">
                    {t.messages[0]}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
