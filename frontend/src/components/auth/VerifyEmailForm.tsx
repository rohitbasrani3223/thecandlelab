import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, useToast } from '../../design-system';

export const VerifyEmailForm: React.FC = () => {
  const { pendingEmail, verifyEmail, isLoading, setAuthViewMode } = useAuth();
  const { toast } = useToast();

  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    setResendCooldown(60);
    setCanResend(false);
    toast({
      type: 'info',
      title: 'Verification Link Sent',
      description: `A new verification email has been sent to ${pendingEmail || 'your email'}`,
    });
  };

  const handleManualVerify = async () => {
    const res = await verifyEmail('demo-token');
    if (res.success) {
      toast({ type: 'success', title: 'Email Verified!', description: res.message });
      setAuthViewMode('login');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans text-center">
      <div className="w-16 h-16 bg-[#F4EFE6] border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#2A1E17] font-bold tracking-wide">
        Check Your Email
      </h2>

      <p className="text-xs text-[#8C7A6B] mt-2 font-medium leading-relaxed">
        We sent a verification link to{' '}
        <span className="font-bold text-[#2A1E17]">{pendingEmail || 'your email address'}</span>. Click the link in the email to confirm your account.
      </p>

      <div className="bg-[#FAF6F0] border border-[#E5D9C5] p-4 rounded-xs my-6 text-xs text-[#5C4A3E]">
        <p className="font-semibold mb-1 text-[#2A1E17]">Didn't receive the email?</p>
        <p>Check your spam folder or click below to resend the link.</p>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          disabled={!canResend || isLoading}
          onClick={handleResend}
        >
          {canResend ? 'Resend Verification Email' : `Resend available in ${resendCooldown}s`}
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          onClick={handleManualVerify}
        >
          I've Verified My Email →
        </Button>
      </div>

      <div className="mt-6 text-xs text-[#8C7A6B]">
        Need to use a different email?{' '}
        <button
          type="button"
          onClick={() => setAuthViewMode('register')}
          className="font-bold text-[#2A1E17] hover:text-[#D4AF37] underline cursor-pointer"
        >
          Back to Register
        </button>
      </div>
    </div>
  );
};
