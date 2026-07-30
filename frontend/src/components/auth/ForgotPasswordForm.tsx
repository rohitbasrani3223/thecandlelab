import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../design-system';

export const ForgotPasswordForm: React.FC = () => {
  const { requestPasswordReset, setAuthViewMode } = useAuth();
  const { toast } = useToast();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await requestPasswordReset(emailOrPhone);
      if (res.success) {
        toast({
          type: 'success',
          title: 'Reset Request Dispatched',
          description: 'Password reset code has been sent to your email/phone.',
        });
        setAuthViewMode('verify-otp');
      } else {
        toast({ type: 'error', title: 'Request Failed', description: res.message });
      }
    } catch (e) {
      toast({ type: 'error', title: 'Error', description: 'Request failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-sans text-[#2A1E17]">
      {/* Top Floating Badge & Icon Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#F4EFE6] border border-[#E5D9C5] flex items-center justify-center shadow-xs mb-3 text-2xl">
          🔑
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2A1E17]">
          Reset Password
        </h2>
        <p className="text-xs text-[#8C7A6B] mt-1">
          Enter your registered email or phone to receive a password reset code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#69574A]">Email Address or Mobile Phone</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8C7A6B]">✉️</span>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="customer@example.com"
              className={`w-full bg-[#FAF6F0] border ${
                error ? 'border-red-500' : 'border-[#E5D9C5] focus:border-[#D4AF37]'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-[#2A1E17] placeholder-[#B0A398] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/20 transition-all`}
            />
          </div>
          {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2A1E17] hover:bg-[#1C130E] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          {isSubmitting ? (
            <span className="text-xs uppercase tracking-wider">Sending Code...</span>
          ) : (
            <span className="text-sm font-bold">Send Reset OTP →</span>
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => setAuthViewMode('login')}
          className="text-xs font-semibold text-[#8C7A6B] hover:text-[#2A1E17] transition-colors"
        >
          ← Return to Login
        </button>
      </div>
    </div>
  );
};
