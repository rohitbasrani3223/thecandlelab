import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Checkbox, useToast } from '../../design-system';
import { SocialLoginButtons } from './SocialLoginButtons';

export const RegisterForm: React.FC = () => {
  const { register, isLoading, setAuthViewMode } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-blue-500' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-600' };
      default:
        return { score: 10, label: 'Very Weak', color: 'bg-red-400' };
    }
  };

  const strength = calculatePasswordStrength(password);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email address is required';
    if (!phone.trim() || !/^[0-9+\s-]{10,15}$/.test(phone)) errs.phone = 'Valid 10-digit phone number required';
    if (!password || password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!agreeTerms) errs.agreeTerms = 'You must agree to the Terms & Conditions';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await register({ name, email, phone, password });
    if (res.success) {
      toast({
        type: 'success',
        title: 'Account Created',
        description: res.message || 'Please verify your phone/email to complete registration.',
      });
    } else {
      toast({
        type: 'error',
        title: 'Registration Error',
        description: res.message || 'Unable to create account. Please try again.',
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2A1E17] font-bold tracking-wide">
          Join The Candle Lab
        </h2>
        <p className="text-xs text-[#8C7A6B] mt-1.5 font-medium">
          Create an account to receive 15% off your first order & member perks.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Full Name"
            placeholder="Eleanor Vance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />
        </div>

        <div>
          <Input
            label="Email Address"
            type="email"
            placeholder="eleanor@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />
        </div>

        <div>
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            helperText="Used for order updates and quick OTP logins."
            required
          />
        </div>

        <div className="relative">
          <Input
            label="Create Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
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

          {/* Password Strength Meter */}
          {password && (
            <div className="mt-2">
              <div className="flex justify-between items-center text-[10px] font-semibold text-[#8C7A6B] mb-1">
                <span>Password Strength:</span>
                <span className="capitalize font-bold">{strength.label}</span>
              </div>
              <div className="w-full bg-[#E5D9C5] h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <Checkbox
            label={
              <span className="text-xs text-[#8C7A6B]">
                I agree to the{' '}
                <a href="#terms" className="text-[#2A1E17] font-semibold underline hover:text-[#D4AF37]">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-[#2A1E17] font-semibold underline hover:text-[#D4AF37]">
                  Privacy Policy
                </a>
              </span>
            }
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          {errors.agreeTerms && <p className="text-[11px] text-red-600 mt-1">{errors.agreeTerms}</p>}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="mt-2"
        >
          Create Account & Verify OTP
        </Button>
      </form>

      <SocialLoginButtons />

      <div className="mt-6 text-center text-xs text-[#8C7A6B]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => setAuthViewMode('login')}
          className="font-bold text-[#2A1E17] hover:text-[#D4AF37] underline cursor-pointer"
        >
          Sign In Here
        </button>
      </div>
    </div>
  );
};
