import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Checkbox, useToast } from '../../design-system';
import { SocialLoginButtons } from './SocialLoginButtons';

export const LoginForm: React.FC = () => {
  const { login, isLoading, setAuthViewMode, openAuthModal } = useAuth();
  const { toast } = useToast();

  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
        description: `An OTP code has been dispatched to ${emailOrPhone}`,
      });
      return;
    }

    const res = await login({ emailOrPhone, password, rememberMe });
    if (res.success) {
      toast({ type: 'success', title: 'Welcome Back', description: res.message });
    } else {
      toast({ type: 'error', title: 'Sign In Failed', description: res.message || 'Invalid credentials provided' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2A1E17] font-bold tracking-wide">
          Welcome Back
        </h2>
        <p className="text-xs text-[#8C7A6B] mt-1.5 font-medium">
          Sign in to access your saved candles, wishlist, and exclusive artisan rewards.
        </p>
      </div>

      {/* Switch between Email and Phone Login */}
      <div className="flex border-b border-[#E5D9C5] mb-6">
        <button
          type="button"
          onClick={() => {
            setLoginType('email');
            setErrors({});
          }}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors cursor-pointer ${
            loginType === 'email'
              ? 'border-[#D4AF37] text-[#2A1E17]'
              : 'border-transparent text-[#8C7A6B] hover:text-[#2A1E17]'
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
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors cursor-pointer ${
            loginType === 'phone'
              ? 'border-[#D4AF37] text-[#2A1E17]'
              : 'border-transparent text-[#8C7A6B] hover:text-[#2A1E17]'
          }`}
        >
          Phone & OTP
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {loginType === 'email' ? (
          <>
            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                error={errors.emailOrPhone}
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-xs font-semibold text-[#8C7A6B] hover:text-[#2A1E17] cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </>
        ) : (
          <div>
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              error={errors.emailOrPhone}
              helperText="We will send a 6-digit OTP to verify your mobile number."
              required
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          {loginType === 'email' && (
            <button
              type="button"
              onClick={() => setAuthViewMode('forgot-password')}
              className="text-xs font-semibold text-[#D4AF37] hover:text-[#B38F24] hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="mt-2"
        >
          {loginType === 'email' ? 'Sign In to Account' : 'Get OTP Code'}
        </Button>
      </form>

      <SocialLoginButtons />

      <div className="mt-6 text-center text-xs text-[#8C7A6B]">
        Don't have an account yet?{' '}
        <button
          type="button"
          onClick={() => setAuthViewMode('register')}
          className="font-bold text-[#2A1E17] hover:text-[#D4AF37] underline cursor-pointer"
        >
          Create One Here
        </button>
      </div>
    </div>
  );
};
