import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../design-system';
import { SocialLoginButtons } from './SocialLoginButtons';

export const RegisterForm: React.FC = () => {
  const { register, setAuthViewMode } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email address is required';
    if (!phone.trim() || !/^[0-9+\s-]{10,15}$/.test(phone)) errs.phone = 'Valid phone number required';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!agreeTerms) errs.agreeTerms = 'You must agree to terms to proceed';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await register({ name, email, phone, password });
      if (res.success) {
        toast({
          type: 'success',
          title: 'Account Created Successfully!',
          description: `Welcome to The Candle Lab, ${name}! You are now signed in.`,
        });
        if (window.location.hash === '#auth') {
          window.location.hash = '#account';
        }
      } else {
        toast({
          type: 'error',
          title: 'Registration Error',
          description: res.message || 'Could not complete registration',
        });
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', description: 'Registration failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-sans text-[#2A1E17]">
      {/* Top Floating Badge & Icon Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#F4EFE6] border border-[#E5D9C5] flex items-center justify-center shadow-xs mb-3 text-2xl">
          ✨
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2A1E17]">
          Create Account
        </h2>
        <p className="text-xs text-[#8C7A6B] mt-1">
          Join VIP Rewards and receive 15% off your first candle order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#69574A]">Full Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8C7A6B]">👤</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Sharma"
              className={`w-full bg-[#FAF6F0] border ${
                errors.name ? 'border-red-500' : 'border-[#E5D9C5] focus:border-[#D4AF37]'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-[#2A1E17] placeholder-[#B0A398] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/20 transition-all`}
            />
          </div>
          {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#69574A]">Email Address</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8C7A6B]">✉️</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ananya@example.com"
              className={`w-full bg-[#FAF6F0] border ${
                errors.email ? 'border-red-500' : 'border-[#E5D9C5] focus:border-[#D4AF37]'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-[#2A1E17] placeholder-[#B0A398] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/20 transition-all`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
        </div>

        {/* Mobile Phone */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#69574A]">Mobile Phone</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8C7A6B]">📱</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full bg-[#FAF6F0] border ${
                errors.phone ? 'border-red-500' : 'border-[#E5D9C5] focus:border-[#D4AF37]'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-[#2A1E17] placeholder-[#B0A398] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/20 transition-all`}
            />
          </div>
          {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#69574A]">Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8C7A6B]">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password (min 6 chars)"
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

        {/* Agree Terms Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2 text-xs text-[#69574A] cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded-md border-[#E5D9C5] text-[#D4AF37] focus:ring-[#D4AF37]"
            />
            <span>I agree to The Candle Lab Terms & Privacy Policy</span>
          </label>
          {errors.agreeTerms && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.agreeTerms}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2A1E17] hover:bg-[#1C130E] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          {isSubmitting ? (
            <span className="text-xs uppercase tracking-wider">Creating Account...</span>
          ) : (
            <span className="text-sm font-bold">Register & Verify OTP →</span>
          )}
        </button>
      </form>

      {/* Google, Apple & Meta Social Register Buttons */}
      <SocialLoginButtons labelPrefix="or register with" />

      {/* Already registered */}
      <div className="bg-[#F4EFE6] border border-[#E5D9C5] rounded-xl p-4 text-center mt-5">
        <p className="text-xs text-[#69574A]">
          Already have an account?{' '}
          <button
            onClick={() => setAuthViewMode('login')}
            className="font-bold text-[#2A1E17] hover:underline underline-offset-4 cursor-pointer"
          >
            Sign In Here
          </button>
        </p>
      </div>
    </div>
  );
};
