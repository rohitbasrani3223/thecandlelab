import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, useToast } from '../../design-system';

export const ForgotPasswordForm: React.FC = () => {
  const { requestPasswordReset, isLoading, setAuthViewMode } = useAuth();
  const { toast } = useToast();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    const res = await requestPasswordReset(emailOrPhone);
    if (res.success) {
      toast({
        type: 'success',
        title: 'Reset Code Dispatched',
        description: res.message,
      });
    } else {
      toast({
        type: 'error',
        title: 'Reset Request Failed',
        description: res.message || 'Unable to process request. Please try again.',
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2A1E17] font-bold tracking-wide">
          Reset Password
        </h2>
        <p className="text-xs text-[#8C7A6B] mt-1.5 font-medium leading-relaxed">
          Enter the email address or phone number associated with your account, and we'll send you instructions or a verification code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Email or Phone Number"
            type="text"
            placeholder="name@example.com or +91 98765 43210"
            value={emailOrPhone}
            onChange={(e) => {
              setEmailOrPhone(e.target.value);
              setError('');
            }}
            error={error}
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
          Send Reset Instructions / OTP
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-[#8C7A6B]">
        Remember your password?{' '}
        <button
          type="button"
          onClick={() => setAuthViewMode('login')}
          className="font-bold text-[#2A1E17] hover:text-[#D4AF37] underline cursor-pointer"
        >
          Return to Sign In
        </button>
      </div>
    </div>
  );
};
