import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../design-system';

export const ResetPasswordForm: React.FC = () => {
  const { resetPassword, setAuthViewMode } = useAuth();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const validate = () => {
    const errs: { password?: string; confirmPassword?: string } = {};
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await resetPassword(password, 'otp-verification-token');
      if (res.success) {
        toast({
          type: 'success',
          title: 'Password Updated',
          description: res.message,
        });
        setAuthViewMode('login');
      } else {
        toast({
          type: 'error',
          title: 'Reset Error',
          description: res.message || 'Failed to update password. Please try again.',
        });
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', description: 'Reset failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-sans text-[#2A1E17]">
      {/* Top Floating Badge & Icon Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#F4EFE6] border border-[#E5D9C5] flex items-center justify-center shadow-xs mb-3 text-2xl">
          🔒
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2A1E17]">
          Create New Password
        </h2>
        <p className="text-xs text-[#8C7A6B] mt-1 font-medium">
          Choose a strong password for your Candle Lab account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#69574A]">New Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8C7A6B]">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={`w-full bg-[#FAF6F0] border ${
                errors.password ? 'border-red-500' : 'border-[#E5D9C5] focus:border-[#D4AF37]'
              } rounded-xl pl-10 pr-10 py-3 text-sm text-[#2A1E17] placeholder-[#B0A398] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/20 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#2A1E17] p-1 text-xs"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-red-500 font-medium">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#69574A]">Confirm New Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8C7A6B]">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className={`w-full bg-[#FAF6F0] border ${
                errors.confirmPassword ? 'border-red-500' : 'border-[#E5D9C5] focus:border-[#D4AF37]'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-[#2A1E17] placeholder-[#B0A398] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/20 transition-all`}
            />
          </div>
          {errors.confirmPassword && <p className="text-[11px] text-red-500 font-medium">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2A1E17] hover:bg-[#1C130E] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          {isSubmitting ? (
            <span className="text-xs uppercase tracking-wider">Saving Password...</span>
          ) : (
            <span className="text-sm font-bold">Save New Password & Sign In →</span>
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
