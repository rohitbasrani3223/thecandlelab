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
    <div className="w-full font-sans text-[#232323]">
      {/* Top Floating Badge & Icon Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EADDCB] flex items-center justify-center shadow-xs mb-3 text-2xl text-[#8B6F4E]">
          ✨
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#232323]">
          Create Account
        </h2>
        <p className="text-xs text-[#7D6F63] mt-1">
          Join VIP Rewards and receive 15% off your first candle order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#5C5149]">Full Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7D6F63]">👤</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Sharma"
              className={`w-full bg-[#FFFFFF] border ${
                errors.name ? 'border-red-500' : 'border-[#EADDCB] focus:border-[#8B6F4E]'
              } rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#232323] placeholder-[#A39486] focus:outline-none focus:ring-2 focus:ring-[#EADDCB]/30 transition-all`}
            />
          </div>
          {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#5C5149]">Email Address</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7D6F63]">✉️</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@sanctuary.com"
              className={`w-full bg-[#FFFFFF] border ${
                errors.email ? 'border-red-500' : 'border-[#EADDCB] focus:border-[#8B6F4E]'
              } rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#232323] placeholder-[#A39486] focus:outline-none focus:ring-2 focus:ring-[#EADDCB]/30 transition-all`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#5C5149]">Phone Number (for Courier SMS)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7D6F63]">📱</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full bg-[#FFFFFF] border ${
                errors.phone ? 'border-red-500' : 'border-[#EADDCB] focus:border-[#8B6F4E]'
              } rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#232323] placeholder-[#A39486] focus:outline-none focus:ring-2 focus:ring-[#EADDCB]/30 transition-all`}
            />
          </div>
          {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#5C5149]">Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7D6F63]">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className={`w-full bg-[#FFFFFF] border ${
                errors.password ? 'border-red-500' : 'border-[#EADDCB] focus:border-[#8B6F4E]'
              } rounded-2xl pl-10 pr-10 py-2.5 text-xs text-[#232323] placeholder-[#A39486] focus:outline-none focus:ring-2 focus:ring-[#EADDCB]/30 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7D6F63] hover:text-[#232323] cursor-pointer"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-red-500 font-medium">{errors.password}</p>}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="space-y-1 pt-1">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-[#5C5149]">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded text-[#8B6F4E] mt-0.5"
            />
            <span>
              I agree to the{' '}
              <a href="#terms" className="text-[#8B6F4E] underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-[#8B6F4E] underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.agreeTerms && <p className="text-[11px] text-red-500 font-medium">{errors.agreeTerms}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#8B6F4E] hover:bg-[#745A3D] text-white font-bold py-3 px-4 rounded-full text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          {isSubmitting ? <span className="inline-block animate-spin">⏳</span> : 'Create Connoisseur Account'}
        </button>
      </form>

      {/* Social Register */}
      <SocialLoginButtons labelPrefix="or register with" />

      {/* Login Switch */}
      <div className="mt-5 text-center text-xs text-[#7D6F63]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => setAuthViewMode('login')}
          className="font-bold text-[#8B6F4E] hover:underline ml-1 cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
