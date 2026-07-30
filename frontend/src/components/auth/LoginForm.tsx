import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../design-system';

export const LoginForm: React.FC = () => {
  const { login, openAuthModal, setAuthViewMode } = useAuth();
  const { toast } = useToast();

  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string }>({});

  const validate = () => {
    const errs: { emailOrPhone?: string; password?: string } = {};
    if (!emailOrPhone.trim()) {
      errs.emailOrPhone = loginType === 'email' ? 'Email address is required' : 'Phone number is required';
    } else if (loginType === 'email' && !/\S+@\S+\.\S+/.test(emailOrPhone)) {
      errs.emailOrPhone = 'Please enter a valid email address';
    } else if (loginType === 'phone' && !/^[0-9+\s-]{10,15}$/.test(emailOrPhone)) {
      errs.emailOrPhone = 'Please enter a valid phone number';
    }

    if (loginType === 'email' && !password) {
      errs.password = 'Password is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (loginType === 'phone') {
      openAuthModal('verify-otp', emailOrPhone);
      toast({
        type: 'info',
        title: 'Verification Code Sent',
        description: `An OTP verification code has been sent to ${emailOrPhone}`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login({ emailOrPhone, password, rememberMe });
      if (res.success) {
        toast({ type: 'success', title: 'Welcome Back', description: res.message });
      } else {
        toast({ type: 'error', title: 'Sign In Failed', description: res.message || 'Invalid credentials provided' });
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', description: 'Authentication failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-sans text-[#2A1E17]">
      {/* Top Floating Badge & Icon Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#F4EFE6] border border-[#E5D9C5] flex items-center justify-center shadow-xs mb-3 text-2xl">
          🕯️
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2A1E17]">
          Welcome Back
        </h2>
        <p className="text-xs text-[#8C7A6B] mt-1">
          Sign in to access your saved candles, wishlist & exclusive rewards.
        </p>
      </div>

      {/* Switch between Email and Phone Login */}
      <div className="flex bg-[#F4EFE6] p-1 rounded-xl border border-[#E5D9C5] mb-5">
        <button
          type="button"
          onClick={() => {
            setLoginType('email');
            setErrors({});
          }}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            loginType === 'email'
              ? 'bg-white text-[#2A1E17] shadow-xs'
              : 'text-[#8C7A6B] hover:text-[#2A1E17]'
          }`}
        >
          Email & Password
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginType('phone');
            setErrors({});
          }}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            loginType === 'phone'
              ? 'bg-white text-[#2A1E17] shadow-xs'
              : 'text-[#8C7A6B] hover:text-[#2A1E17]'
          }`}
        >
          Phone & OTP
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Phone Input */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#69574A]">
            {loginType === 'email' ? 'Email Address' : 'Mobile Phone Number'}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8C7A6B]">
              {loginType === 'email' ? '✉️' : '📱'}
            </span>
            <input
              type={loginType === 'email' ? 'email' : 'tel'}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder={loginType === 'email' ? 'admin@example.com' : '+91 98765 43210'}
              className={`w-full bg-[#FAF6F0] border ${
                errors.emailOrPhone ? 'border-red-500' : 'border-[#E5D9C5] focus:border-[#D4AF37]'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-[#2A1E17] placeholder-[#B0A398] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/20 transition-all`}
            />
          </div>
          {errors.emailOrPhone && (
            <p className="text-[11px] text-red-500 font-medium">{errors.emailOrPhone}</p>
          )}
        </div>

        {/* Password Input (Email mode) */}
        {loginType === 'email' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#69574A]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setAuthViewMode('forgot-password')}
                className="text-[11px] font-semibold text-[#B88B38] hover:text-[#2A1E17] transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8C7A6B]">
                🔒
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
            {errors.password && (
              <p className="text-[11px] text-red-500 font-medium">{errors.password}</p>
            )}
          </div>
        )}

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-[#69574A] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded-md border-[#E5D9C5] text-[#D4AF37] focus:ring-[#D4AF37]"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2A1E17] hover:bg-[#1C130E] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          {isSubmitting ? (
            <span className="text-xs uppercase tracking-wider">Signing In...</span>
          ) : (
            <span className="text-sm font-bold">Sign In</span>
          )}
        </button>
      </form>

      {/* Account Signup Box */}
      <div className="bg-[#F4EFE6] border border-[#E5D9C5] rounded-xl p-4 text-center mt-5">
        <p className="text-xs text-[#69574A]">
          First time here?{' '}
          <button
            onClick={() => setAuthViewMode('register')}
            className="font-bold text-[#2A1E17] hover:underline underline-offset-4 cursor-pointer"
          >
            Create an Account
          </button>
        </p>
      </div>

      {/* Switch to Admin Portal Link */}
      <div className="text-center mt-4">
        <button
          onClick={() => {
            window.location.hash = '#admin-login';
          }}
          className="text-xs font-semibold text-[#8C7A6B] hover:text-[#2A1E17] transition-colors inline-flex items-center gap-1.5"
        >
          🛡️ Access Admin Portal
        </button>
      </div>
    </div>
  );
};
