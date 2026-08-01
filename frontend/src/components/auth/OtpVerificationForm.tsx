import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../design-system';

export const OtpVerificationForm: React.FC = () => {
  const { verifyOtp, pendingEmail, pendingPhone, setAuthViewMode } = useAuth();
  const { toast } = useToast();

  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(45);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    toast({
      type: 'info',
      title: 'Verification Code Dispatched 📩',
      description: `OTP sent to ${pendingEmail || 'your email'}. Enter 123456 to verify instant access!`,
    });

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value) && value !== '') return;

    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasteData) return;

    const newOtp = [...otpValues];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtpValues(newOtp);

    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = () => {
    setTimer(45);
    toast({
      type: 'info',
      title: 'Verification Code Dispatched',
      description: 'A new 6-digit verification OTP has been sent to your email & phone.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');
    if (fullOtp.length < 6) {
      toast({ type: 'warning', title: 'Incomplete OTP', description: 'Please enter all 6 digits' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await verifyOtp(fullOtp);
      if (res.success) {
        toast({
          type: 'success',
          title: 'Verification Complete',
          description: 'Your account and email address have been verified successfully!',
        });
      } else {
        toast({ type: 'error', title: 'Invalid Code', description: res.message || 'The OTP code is incorrect' });
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', description: 'OTP verification failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const targetIdentifier = pendingEmail || pendingPhone || 'support@thecandlelab.in';

  return (
    <div className="w-full max-w-full font-sans text-[#2A1E17] px-1 sm:px-0">
      {/* Top Floating Badge & Icon Header */}
      <div className="flex flex-col items-center text-center mb-5 sm:mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F4EFE6] border border-[#E5D9C5] flex items-center justify-center shadow-xs mb-2.5 sm:mb-3 text-xl sm:text-2xl">
          📩
        </div>
        <h2 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-[#2A1E17]">
          Verify OTP Code
        </h2>
        <p className="text-xs sm:text-xs text-[#8C7A6B] mt-1 sm:mt-1.5 leading-relaxed max-w-xs sm:max-w-none">
          We sent a 6-digit security code to:
          <span className="block font-bold text-[#2A1E17] mt-0.5 break-all">{targetIdentifier}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* 6 Digit Ultra-Responsive OTP Boxes */}
        <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 w-full max-w-full overflow-hidden py-1">
          {otpValues.map((digit, index) => (
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
              className="w-10 h-12 xs:w-11 xs:h-13 sm:w-12 sm:h-14 shrink bg-[#FAF6F0] border border-[#E5D9C5] focus:border-[#D4AF37] rounded-xl text-center text-lg sm:text-xl font-bold text-[#2A1E17] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-xs"
            />
          ))}
        </div>

        {/* Resend Timer & Link */}
        <div className="text-center text-xs text-[#8C7A6B]">
          {timer > 0 ? (
            <span>Resend security code in <strong className="text-[#2A1E17] font-bold">{timer}s</strong></span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-[#B88B38] hover:text-[#2A1E17] underline cursor-pointer p-1 active:scale-95 transition-transform"
            >
              Didn't receive code? Resend OTP Now
            </button>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={isSubmitting || otpValues.join('').length < 6}
          className="w-full bg-[#2A1E17] hover:bg-[#1C130E] active:scale-[0.98] text-white font-semibold py-3.5 px-4 sm:px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm min-h-[46px]"
        >
          {isSubmitting ? (
            <span className="text-xs uppercase tracking-wider">Verifying Code...</span>
          ) : (
            <span className="font-bold">Verify & Complete Sign In →</span>
          )}
        </button>
      </form>

      {/* Alternative Email Link Verification */}
      <div className="bg-[#F4EFE6] border border-[#E5D9C5] rounded-xl p-3.5 sm:p-4 text-center mt-5 sm:mt-6 space-y-1.5">
        <p className="text-[11px] sm:text-xs text-[#69574A]">
          Prefer verifying via email link instead?
        </p>
        <button
          type="button"
          onClick={() => setAuthViewMode('verify-email')}
          className="text-xs font-bold text-[#2A1E17] hover:underline cursor-pointer active:scale-95 transition-transform"
        >
          📧 Send Email Verification Link
        </button>
      </div>

      {/* Back to Login */}
      <div className="text-center mt-4 sm:mt-5">
        <button
          type="button"
          onClick={() => setAuthViewMode('login')}
          className="text-xs font-semibold text-[#8C7A6B] hover:text-[#2A1E17] transition-colors py-1 cursor-pointer"
        >
          ← Return to Login
        </button>
      </div>
    </div>
  );
};
