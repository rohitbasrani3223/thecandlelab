import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, useToast } from '../../design-system';

export const ResetPasswordForm: React.FC = () => {
  const { resetPassword, isLoading, setAuthViewMode } = useAuth();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const validate = () => {
    const errs: { password?: string; confirmPassword?: string } = {};
    if (!password || password.length < 8) {
      errs.password = 'Password must be at least 8 characters long';
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
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2A1E17] font-bold tracking-wide">
          Create New Password
        </h2>
        <p className="text-xs text-[#8C7A6B] mt-1.5 font-medium">
          Choose a strong password with at least 8 characters for your Candle Lab account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            label="New Password"
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
        </div>

        <div>
          <Input
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="mt-2"
        >
          Save New Password & Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-[#8C7A6B]">
        Back to{' '}
        <button
          type="button"
          onClick={() => setAuthViewMode('login')}
          className="font-bold text-[#2A1E17] hover:text-[#D4AF37] underline cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
