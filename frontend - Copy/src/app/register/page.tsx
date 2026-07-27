"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Footer } from "@/components/Footer";
import { UserPlus, User, Mail, Phone, Lock, ArrowLeft, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser, showToast } = useStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName || !email || !phone || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      const userObj = {
        id: `u-${Date.now()}`,
        name: `${firstName} ${lastName}`.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: "CUSTOMER" as const,
        walletBalance: 100, // 100 bonus on signup!
        loyaltyPoints: 200,
        loyaltyTier: "Silver" as const
      };

      localStorage.setItem("candlelab_jwt_access", `user_token_${Date.now()}`);
      localStorage.setItem("candlelab_user", JSON.stringify(userObj));
      setCurrentUser(userObj);

      showToast(`Welcome to The Candle Lab, ${userObj.name}! 🎉`);
      router.push("/");
    } catch (err) {
      setErrorMsg("Registration failed. Please try again.");
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

      <div className="max-w-md mx-auto w-full px-4 py-10">
        <div className="bg-white p-8 rounded-2xl border-2 border-[#C8A75A]/40 shadow-2xl space-y-6 text-center">
          
          <div className="w-14 h-14 rounded-full bg-[#1F1F1F] text-[#C8A75A] flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">Create Account</h2>
            <span className="text-[10px] font-bold text-[#C8A75A] uppercase tracking-widest">JOIN US</span>
            <p className="text-xs text-gray-500">Start your shopping journey today</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl px-3 py-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl px-3 py-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number *</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-gray-500">+91</span>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-11 pr-3 py-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1F1F1F] text-[#C8A75A] py-3.5 rounded-xl font-bold text-xs hover:bg-[#C8A75A] hover:text-[#1F1F1F] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "✨ Create Account"}
            </button>
          </form>

          <div className="pt-2 text-xs">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#C8A75A] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
