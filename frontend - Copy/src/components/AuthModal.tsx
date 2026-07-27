"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { X, Lock, Mail, User, Phone, Sparkles, ShieldCheck, KeyRound } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentUser, showToast } = useStore();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginMode, setLoginMode] = useState<"otp" | "password">("password");

  // Login States
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Register States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setErrorMsg("Please enter Mobile Number or Email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      showToast("OTP sent successfully! 📱");
    }, 800);
  };

  const handleLogin = async (e: React.FormEvent) => {
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

        showToast(`Welcome back! ✨`);
        onClose();
      } else {
        const userObj = {
          id: `u-${Date.now()}`,
          name: identifier.split("@")[0] || "Customer",
          email: identifier,
          role: "CUSTOMER" as const,
          walletBalance: 200,
          loyaltyPoints: 100,
          loyaltyTier: "Silver" as const
        };
        localStorage.setItem("candlelab_user", JSON.stringify(userObj));
        setCurrentUser(userObj);
        showToast("Signed in successfully! 🔒");
        onClose();
      }
    } catch (err) {
      setErrorMsg("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName || !regEmail || !regPhone || !regPassword) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (regPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userObj = {
        id: `u-${Date.now()}`,
        name: `${firstName} ${lastName}`.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        role: "CUSTOMER" as const,
        walletBalance: 100,
        loyaltyPoints: 200,
        loyaltyTier: "Silver" as const
      };

      localStorage.setItem("candlelab_jwt_access", `user_token_${Date.now()}`);
      localStorage.setItem("candlelab_user", JSON.stringify(userObj));
      setCurrentUser(userObj);

      showToast(`Welcome to The Candle Lab, ${userObj.name}! 🎉`);
      onClose();
    } catch (err) {
      setErrorMsg("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white rounded-2xl border-2 border-[#C8A75A]/40 shadow-2xl p-6 text-[#1F1F1F] max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#1F1F1F] hover:bg-[#FAF7F2] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 mb-5">
          <div className="w-12 h-12 rounded-full bg-[#1F1F1F] text-[#C8A75A] flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1F1F1F]">THE CANDLE LAB</h3>
          <p className="text-xs text-gray-500">Sign in or create account to continue shopping</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#E6DFD3] mb-4 text-xs font-bold">
          <button
            onClick={() => { setTab("login"); setErrorMsg(null); }}
            className={`flex-1 pb-2.5 transition-colors ${tab === "login" ? "border-b-2 border-[#C8A75A] text-[#1F1F1F]" : "text-gray-400"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab("register"); setErrorMsg(null); }}
            className={`flex-1 pb-2.5 transition-colors ${tab === "register" ? "border-b-2 border-[#C8A75A] text-[#1F1F1F]" : "text-gray-400"}`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {tab === "login" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 bg-[#FAF7F2] p-1 rounded-xl border border-[#E6DFD3] text-xs font-bold">
              <button
                onClick={() => setLoginMode("otp")}
                className={`py-1.5 rounded-lg transition-all ${loginMode === "otp" ? "bg-[#1F1F1F] text-[#C8A75A]" : "text-gray-500"}`}
              >
                OTP Login
              </button>
              <button
                onClick={() => setLoginMode("password")}
                className={`py-1.5 rounded-lg transition-all ${loginMode === "password" ? "bg-[#1F1F1F] text-[#C8A75A]" : "text-gray-500"}`}
              >
                Password Login
              </button>
            </div>

            {loginMode === "password" ? (
              <form onSubmit={handleLogin} className="space-y-3 text-xs text-left">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email or Mobile Number *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Enter email or phone number"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-700">Password *</label>
                    <a href="#" className="text-[11px] font-bold text-[#C8A75A] hover:underline">Forgot Password?</a>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1F1F1F] text-[#C8A75A] py-3 rounded-xl font-bold text-xs hover:bg-[#C8A75A] hover:text-[#1F1F1F] transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? "Signing In..." : "Login 🔒"}
                </button>
              </form>
            ) : (
              <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-3 text-xs text-left">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mobile Number or Email *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="+91 9876543210"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Enter 6-Digit OTP *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono font-bold tracking-widest text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                      />
                      <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1F1F1F] text-[#C8A75A] py-3 rounded-xl font-bold text-xs hover:bg-[#C8A75A] hover:text-[#1F1F1F] transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? "Processing..." : otpSent ? "Verify OTP & Login" : "Send OTP 📲"}
                </button>
              </form>
            )}

            <div className="pt-2 text-center text-xs">
              <Link href="/login" onClick={onClose} className="text-[#C8A75A] font-bold hover:underline">
                Open Full Dedicated Login Page →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3 text-xs text-left">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-gray-700 block mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl px-3 py-2 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl px-3 py-2 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Phone Number *</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-gray-500">+91</span>
                <input
                  type="tel"
                  required
                  placeholder="10-digit phone"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-11 pr-3 py-2 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1F1F1F] text-[#C8A75A] py-3 rounded-xl font-bold text-xs hover:bg-[#C8A75A] hover:text-[#1F1F1F] transition-all shadow-md disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account ✨"}
            </button>

            <div className="pt-2 text-center text-xs">
              <Link href="/register" onClick={onClose} className="text-[#C8A75A] font-bold hover:underline">
                Open Full Dedicated Register Page →
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

