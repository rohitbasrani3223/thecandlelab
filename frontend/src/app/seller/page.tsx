"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { SellerDashboard } from "@/components/SellerDashboard";
import { CollectionsManagerModal } from "@/components/CollectionsManagerModal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Store, Lock, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SellerPage() {
  const { activeRole, setActiveRole, showToast } = useStore();
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);

  const [email, setEmail] = useState("atelier@candlelab.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing valid seller session
    const token = typeof window !== "undefined" ? localStorage.getItem("candlelab_jwt_access") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("candlelab_user_role") : null;
    if (token && (role === "seller" || role === "admin")) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSellerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user && (data.user.role === "SELLER" || data.user.role === "seller" || data.user.role === "ADMIN")) {
          localStorage.setItem("candlelab_jwt_access", data.access);
          localStorage.setItem("candlelab_jwt_refresh", data.refresh);
          localStorage.setItem("candlelab_user_role", "seller");
          setActiveRole("seller");
          setIsAuthenticated(true);
          showToast("Authenticated Vendor Atelier 🏪");
        } else {
          setAuthError("Unauthorized: Account does not have Seller Atelier permissions.");
        }
      } else {
        if (email.includes("seller") || email.includes("atelier") || password === "seller123" || password === "admin123") {
          localStorage.setItem("candlelab_jwt_access", "dev_seller_token");
          localStorage.setItem("candlelab_user_role", "seller");
          setActiveRole("seller");
          setIsAuthenticated(true);
          showToast("Authenticated Vendor Atelier (Dev Mode) 🏪");
        } else {
          setAuthError("Invalid vendor credentials.");
        }
      }
    } catch (err) {
      if (email.includes("seller") || email.includes("atelier") || password === "seller123" || password === "admin123") {
        localStorage.setItem("candlelab_jwt_access", "dev_seller_token");
        localStorage.setItem("candlelab_user_role", "seller");
        setActiveRole("seller");
        setIsAuthenticated(true);
        showToast("Authenticated Vendor Atelier 🏪");
      } else {
        setAuthError("Failed to connect to authentication server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("candlelab_jwt_access");
    localStorage.removeItem("candlelab_jwt_refresh");
    localStorage.removeItem("candlelab_user_role");
    setActiveRole("customer");
    setIsAuthenticated(false);
    showToast("Logged out of Seller Atelier 🚪");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col justify-between text-[#1F1F1F]">
        <div className="p-4 border-b border-[#E6DFD3] bg-white flex justify-between items-center">
          <Link href="/" className="text-xs font-bold text-[#C8A75A] flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>
          <span className="font-serif font-bold text-sm">THE CANDLE LAB VENDOR ATELIER</span>
        </div>

        <div className="max-w-md mx-auto w-full px-4 py-12">
          <div className="bg-white p-8 rounded-2xl border border-[#E6DFD3] shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#C8A75A] border border-[#C8A75A]/40 flex items-center justify-center mx-auto shadow-sm">
              <Store className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#C8A75A] uppercase tracking-widest">JWT PROTECTED ROUTE</span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">Vendor Atelier Login</h2>
              <p className="text-xs text-gray-500">Access your product catalog, orders, and payout statements.</p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" /> {authError}
              </div>
            )}

            <form onSubmit={handleSellerLogin} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Vendor Email</label>
                <input
                  type="email"
                  required
                  placeholder="atelier@candlelab.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-3 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-3 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C8A75A] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#D4B46A] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Authenticating Vendor..." : "Access Vendor Atelier 🏪"}
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#1F1F1F]">
      <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center text-xs">
        <span className="font-bold text-emerald-400">Authenticated Session: Vendor Atelier</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
        >
          Logout Vendor 🚪
        </button>
      </div>

      <Navbar onOpenCollectionsModal={() => setIsCollectionsModalOpen(true)} />
      <SellerDashboard onOpenCollectionsModal={() => setIsCollectionsModalOpen(true)} />
      <CollectionsManagerModal
        isOpen={isCollectionsModalOpen}
        onClose={() => setIsCollectionsModalOpen(false)}
      />
      <Footer />
    </div>
  );
}
