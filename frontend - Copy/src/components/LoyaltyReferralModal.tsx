"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Crown, Gift, X, Copy, Sparkles, Award, Wallet, Share2 } from "lucide-react";

interface LoyaltyReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoyaltyReferralModal: React.FC<LoyaltyReferralModalProps> = ({ isOpen, onClose }) => {
  const { loyaltyPoints, loyaltyTier, walletBalance, referralCode, currency, showToast } = useStore();

  if (!isOpen) return null;

  const copyReferral = () => {
    navigator.clipboard?.writeText(referralCode);
    showToast(`Referral Code ${referralCode} copied! Share for ₹100 reward 🎁`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 md:p-8">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-brand-charcoal hover:bg-brand-beige rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-brand-beige pb-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-gold">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">PRIVATE GLOW CLUB</span>
            <h3 className="font-serif text-2xl font-bold text-brand-charcoal">LOYALTY & REFERRAL REWARDS</h3>
          </div>
        </div>

        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-brand-charcoal text-brand-beige p-4 rounded-xl border border-brand-gold/40 space-y-1">
            <span className="text-[10px] text-brand-gold uppercase font-bold tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Tier Status
            </span>
            <p className="font-serif text-xl font-bold text-white">{loyaltyTier} Member</p>
            <span className="text-[10px] text-gray-400">1.5x Multiplier Points</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-brand-beige shadow-sm space-y-1">
            <span className="text-[10px] text-brand-earth uppercase font-bold tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Points Balance
            </span>
            <p className="font-serif text-xl font-bold text-brand-charcoal">{loyaltyPoints} Points</p>
            <span className="text-[10px] text-green-700 font-bold">= {currency}240 Redeemable</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-brand-beige shadow-sm space-y-1">
            <span className="text-[10px] text-brand-earth uppercase font-bold tracking-wider flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-brand-gold" /> Store Wallet
            </span>
            <p className="font-serif text-xl font-bold text-brand-charcoal">{currency}{walletBalance}</p>
            <span className="text-[10px] text-brand-earth">Auto applies at checkout</span>
          </div>
        </div>

        {/* Invite Friend Section */}
        <div className="bg-white p-5 rounded-2xl border border-brand-gold/40 shadow-inner space-y-3">
          <div className="flex items-center gap-2 text-brand-charcoal">
            <Gift className="w-5 h-5 text-brand-gold" />
            <h4 className="font-serif text-sm font-bold">INVITE A FRIEND, GET {currency}100 WALLET CREDIT</h4>
          </div>
          <p className="text-xs text-brand-earth">
            Share your unique invitation code with friends. When they place their first luxury candle order, you both receive {currency}100 in your wallet!
          </p>

          <div className="flex items-center gap-2 pt-2">
            <div className="flex-1 bg-brand-surface p-2.5 rounded-xl border border-brand-beige font-mono text-xs font-bold text-brand-charcoal uppercase tracking-wider text-center">
              {referralCode}
            </div>
            <button
              onClick={copyReferral}
              className="bg-brand-charcoal text-brand-gold px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-gold hover:text-brand-charcoal transition-colors flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Code
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
