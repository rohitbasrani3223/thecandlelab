import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../design-system';

export const VerifyEmailForm: React.FC = () => {
  const { verifyEmail, pendingEmail, setAuthViewMode } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const emailToVerify = pendingEmail || 'customer@thecandlelab.com';

  const handleResendLink = async () => {
    setIsSending(true);
    try {
      await verifyEmail();
      toast({
        type: 'success',
        title: 'Verification Link Dispatched',
        description: `A confirmation link has been sent to ${emailToVerify}`,
      });
    } catch (e) {
      toast({ type: 'error', title: 'Error', description: 'Failed to send link' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full font-sans text-[#2A1E17]">
      {/* Top Floating Badge & Icon Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#F4EFE6] border border-[#E5D9C5] flex items-center justify-center shadow-xs mb-3 text-2xl">
          ✉️
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2A1E17]">
          Check Your Email
        </h2>
        <p className="text-xs text-[#8C7A6B] mt-1.5 leading-relaxed">
          We sent a verification link to:
          <span className="block font-bold text-[#2A1E17] mt-0.5">{emailToVerify}</span>
        </p>
      </div>

      <div className="bg-[#FAF6F0] border border-[#E5D9C5] rounded-xl p-5 text-center space-y-3">
        <p className="text-xs text-[#69574A] leading-relaxed">
          Click the link in your email inbox to verify your email address and unlock complete access to your candle order history and rewards.
        </p>
        <div className="pt-2">
          <button
            onClick={handleResendLink}
            disabled={isSending}
            className="w-full bg-[#2A1E17] hover:bg-[#1C130E] text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all text-xs cursor-pointer disabled:opacity-50"
          >
            {isSending ? 'Sending Link...' : 'Resend Email Link'}
          </button>
        </div>
      </div>

      {/* Switch to OTP Option */}
      <div className="bg-[#F4EFE6] border border-[#E5D9C5] rounded-xl p-4 text-center mt-5">
        <p className="text-xs text-[#69574A]">
          Have an OTP code instead?{' '}
          <button
            onClick={() => setAuthViewMode('verify-otp')}
            className="font-bold text-[#2A1E17] hover:underline cursor-pointer"
          >
            Enter 6-Digit OTP
          </button>
        </p>
      </div>

      <div className="text-center mt-5">
        <button
          onClick={() => setAuthViewMode('login')}
          className="text-xs font-semibold text-[#8C7A6B] hover:text-[#2A1E17] transition-colors"
        >
          ← Return to Login
        </button>
      </div>
    </div>
  );
};
