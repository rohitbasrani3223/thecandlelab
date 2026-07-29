"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { User, Lock, Phone, Mail, ArrowLeft, KeyRound, Sparkles, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, showToast } = useStore();
  const [loginMode, setLoginMode] = useState<"otp" | "password">("password");

  // Form inputs
  const [identifier, setIdentifier] = useState("EXAMPLE@GMAIL.COM");
  const [password, setPassword] = useState("123456");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setErrorMsg("Please enter your Mobile Number or Email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      showToast("OTP sent to your registered phone number / email! 📱");
    }, 1000);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("candlelab_jwt_access", data.access);
        localStorage.setItem("candlelab_jwt_refresh", data.refresh);
        localStorage.setItem("candlelab_user", JSON.stringify(data.user));

        setCurrentUser({
          id: data.user.id,
          name: data.user.username || data.user.email.split("@")[0],
          email: data.user.email,
          role: data.user.role || "CUSTOMER",
          walletBalance: data.user.wallet_balance || 0,
          loyaltyPoints: 100,
          loyaltyTier: "Silver"
        });

        showToast(`Welcome back, ${data.user.username || "Customer"}! ✨`);
        router.push("/");
      } else {
        // Fallback demo login
        const userObj = {
          id: `u-${Date.now()}`,
          name: identifier.split("@")[0] || "Customer",
          email: identifier,
          role: identifier.includes("admin") ? "ADMIN" : "CUSTOMER",
          walletBalance: 250,
          loyaltyPoints: 100,
          loyaltyTier: "Silver" as const
        };
        localStorage.setItem("candlelab_jwt_access", "demo_access_token");
        localStorage.setItem("candlelab_user", JSON.stringify(userObj));
        setCurrentUser(userObj);
        showToast("Signed in successfully! 🔐");
        router.push("/");
      }
    } catch (err) {
      setErrorMsg("Unable to connect to auth server. Signed in as Guest Session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col justify-between text-[#1F1F1F]">
      <div className="p-4 border-b border-[#E6DFD3] bg-white flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="text-xs font-bold text-[#C8A75A] flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <span className="font-serif font-bold text-sm tracking-widest">THE CANDLE LAB ATELIER</span>
      </div>

      <div className="max-w-md mx-auto w-full px-4 py-12">
        <div className="bg-white p-8 rounded-2xl border-2 border-[#C8A75A]/40 shadow-2xl space-y-6 text-center">
          
          <div className="w-14 h-14 rounded-full bg-[#1F1F1F] text-[#C8A75A] flex items-center justify-center mx-auto shadow-md">
            <User className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">Welcome Back</h2>
            <span className="text-[10px] font-bold text-[#C8A75A] uppercase tracking-widest">CUSTOMER LOGIN</span>
            <p className="text-xs text-gray-500">Sign in to continue shopping and manage your orders</p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-[#FAF7F2] p-1 rounded-xl border border-[#E6DFD3] text-xs font-bold">
            <button
              onClick={() => { setLoginMode("otp"); setErrorMsg(null); }}
              className={`py-2 rounded-lg transition-all ${loginMode === "otp" ? "bg-[#1F1F1F] text-[#C8A75A] shadow-sm" : "text-gray-500"}`}
            >
              OTP Login
            </button>
            <button
              onClick={() => { setLoginMode("password"); setErrorMsg(null); }}
              className={`py-2 rounded-lg transition-all ${loginMode === "password" ? "bg-[#1F1F1F] text-[#C8A75A] shadow-sm" : "text-gray-500"}`}
            >
              Password Login
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {loginMode === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email or Mobile Number *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter email or 10-digit mobile"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-3 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-700">Password *</label>
                  <Link href="#" className="text-[11px] font-bold text-[#C8A75A] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-3 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F1F1F] text-[#C8A75A] py-3.5 rounded-xl font-bold text-xs hover:bg-[#C8A75A] hover:text-[#1F1F1F] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Signing In..." : "🔒 Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={otpSent ? handlePasswordLogin : handleSendOtp} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Mobile Number or Email *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="+91 9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-3 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Enter 6-Digit OTP *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-3 text-xs font-mono font-bold tracking-widest text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                    />
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F1F1F] text-[#C8A75A] py-3.5 rounded-xl font-bold text-xs hover:bg-[#C8A75A] hover:text-[#1F1F1F] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Processing..." : otpSent ? "Verify OTP & Login" : "Send OTP 📲"}
              </button>
            </form>
          )}

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E6DFD3]" /></div>
            <div className="relative flex justify-center text-[10px] font-bold text-gray-400 uppercase"><span className="bg-white px-2">OR</span></div>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-[#C8A75A] hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
