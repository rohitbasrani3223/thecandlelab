import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, useToast } from '../../design-system';

export const OtpVerificationForm: React.FC = () => {
  const { pendingEmail, pendingPhone, verifyOtp, isLoading, setAuthViewMode } = useAuth();
  const { toast } = useToast();

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const targetRecipient = pendingPhone || pendingEmail || 'your phone number';

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResendOtp = () => {
    setResendTimer(45);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    toast({
      type: 'info',
      title: 'New OTP Dispatched',
      description: `A fresh 6-digit OTP code has been sent to ${targetRecipient}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      toast({ type: 'warning', title: 'Incomplete Code', description: 'Please enter all 6 digits of the OTP' });
      return;
    }

    const res = await verifyOtp(code);
    if (res.success) {
      toast({ type: 'success', title: 'Verification Complete', description: res.message });
    } else {
      toast({ type: 'error', title: 'Verification Failed', description: res.message || 'Invalid OTP entered' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans text-center">
      <div className="w-14 h-14 bg-[#F4EFE6] border border-[#D4AF37]/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#2A1E17] font-bold tracking-wide">
        Security OTP Code
      </h2>

      <p className="text-xs text-[#8C7A6B] mt-1.5 font-medium leading-relaxed">
        Please enter the 6-digit verification code sent to{' '}
        <span className="font-bold text-[#2A1E17]">{targetRecipient}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* 6 Individual PIN Digit Boxes */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono font-bold text-xl sm:text-2xl text-[#2A1E17] bg-[#FFFFFF] border border-[#E5D9C5] rounded-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all shadow-xs"
            />
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Verify OTP Code
        </Button>
      </form>

      <div className="mt-6 text-xs text-[#8C7A6B] space-y-2">
        <p>
          Didn't receive the code?{' '}
          {resendTimer > 0 ? (
            <span className="font-semibold text-[#8C7A6B]">Resend in {resendTimer}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="font-bold text-[#D4AF37] hover:text-[#B38F24] underline cursor-pointer"
            >
              Resend OTP Code
            </button>
          )}
        </p>
        <p>
          <button
            type="button"
            onClick={() => setAuthViewMode('login')}
            className="text-[#8C7A6B] hover:text-[#2A1E17] underline font-medium cursor-pointer"
          >
            ← Back to Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
