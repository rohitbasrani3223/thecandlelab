import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../design-system';
import { SocialLoginButtons } from './SocialLoginButtons';

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
    <div className="w-full max-w-full font-sans text-[#1C1217] px-1 sm:px-0 box-border">
      {/* Top Floating Badge & Icon Header */}
      <div className="flex flex-col items-center text-center mb-5 sm:mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF6F8] border border-[#F9B8CA] flex items-center justify-center shadow-xs mb-2.5 sm:mb-3 text-xl sm:text-2xl text-[#E87A96]">
          🕯️
        </div>
        <h2 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-[#1C1217]">
          Welcome Back
        </h2>
        <p className="text-[11px] sm:text-xs text-[#886C7B] mt-1 max-w-xs sm:max-w-none">
          Sign in to access your saved candles, wishlist & exclusive rewards.
        </p>
      </div>

      {/* Switch between Email and Phone Login */}
      <div className="flex bg-[#FFF6F8] p-1 rounded-2xl border border-[#F5E8EE] mb-4 sm:mb-5">
        <button
          type="button"
          onClick={() => {
            setLoginType('email');
            setErrors({});
          }}
          className={`flex-1 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            loginType === 'email'
              ? 'bg-white text-[#1C1217] shadow-xs'
              : 'text-[#886C7B] hover:text-[#1C1217]'
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
          className={`flex-1 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            loginType === 'phone'
              ? 'bg-white text-[#1C1217] shadow-xs'
              : 'text-[#886C7B] hover:text-[#1C1217]'
          }`}
        >
          Phone OTP
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Phone Input */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#624855]">
            {loginType === 'email' ? 'Email Address' : 'Phone Number'}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#886C7B]">
              {loginType === 'email' ? '✉️' : '📱'}
            </span>
            <input
              type={loginType === 'email' ? 'email' : 'tel'}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder={loginType === 'email' ? 'client@sanctuary.com' : '+91 98765 43210'}
              className={`w-full bg-[#FFFFFF] border ${
                errors.emailOrPhone ? 'border-red-500' : 'border-[#F5E8EE] focus:border-[#E87A96]'
              } rounded-2xl pl-10 pr-4 py-3 text-xs text-[#1C1217] placeholder-[#AC94A1] focus:outline-none focus:ring-2 focus:ring-[#F9B8CA]/30 transition-all`}
            />
          </div>
          {errors.emailOrPhone && <p className="text-[11px] text-red-500 font-medium">{errors.emailOrPhone}</p>}
        </div>

        {/* Password (if email mode) */}
        {loginType === 'email' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#624855]">Password</label>
              <button
                type="button"
                onClick={() => setAuthViewMode('forgot-password')}
                className="text-[11px] font-semibold text-[#E87A96] hover:underline cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#886C7B]">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full bg-[#FFFFFF] border ${
                  errors.password ? 'border-red-500' : 'border-[#F5E8EE] focus:border-[#E87A96]'
                } rounded-2xl pl-10 pr-10 py-3 text-xs text-[#1C1217] placeholder-[#AC94A1] focus:outline-none focus:ring-2 focus:ring-[#F9B8CA]/30 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#886C7B] hover:text-[#1C1217] cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-red-500 font-medium">{errors.password}</p>}
          </div>
        )}

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#624855]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-[#E87A96]"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#E87A96] hover:bg-[#D45D7D] text-white font-bold py-3 px-4 rounded-full text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="inline-block animate-spin">⏳</span>
          ) : loginType === 'email' ? (
            'Sign In to Account'
          ) : (
            'Send Login OTP →'
          )}
        </button>
      </form>

      {/* Social Login Alternatives */}
      <SocialLoginButtons labelPrefix="or continue with" />

      {/* Sign Up Redirect Switch */}
      <div className="mt-6 text-center text-xs text-[#886C7B]">
        Don't have a sanctuary account yet?{' '}
        <button
          type="button"
          onClick={() => setAuthViewMode('register')}
          className="font-bold text-[#E87A96] hover:underline ml-1 cursor-pointer"
        >
          Create One
        </button>
      </div>
    </div>
  );
};
