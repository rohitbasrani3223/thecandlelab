import React from 'react';
import { useAuth, type AuthViewMode } from '../../context/AuthContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { VerifyEmailForm } from './VerifyEmailForm';
import { OtpVerificationForm } from './OtpVerificationForm';

interface AuthPageProps {
  initialMode?: AuthViewMode;
  onNavigateHome?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onNavigateHome }) => {
  const { authViewMode, setAuthViewMode } = useAuth();

  React.useEffect(() => {
    if (initialMode) {
      setAuthViewMode(initialMode);
    }
  }, [initialMode]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg bg-[#FAF6F0] border border-[#E5D9C5] shadow-card rounded-sm p-6 sm:p-10 relative">
        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.jpeg"
            alt="The Candle Lab Logo"
            className="h-14 w-auto rounded-xs shadow-subtle mb-3"
          />
          <span className="font-serif font-extrabold text-xl tracking-wider text-[#2A1E17]">
            THE CANDLE LAB
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold mt-0.5">
            Artisanal Soy & Botanical Scent Architecture
          </span>
        </div>

        {/* Dynamic Form Render */}
        {authViewMode === 'login' && <LoginForm />}
        {authViewMode === 'register' && <RegisterForm />}
        {authViewMode === 'forgot-password' && <ForgotPasswordForm />}
        {authViewMode === 'reset-password' && <ResetPasswordForm />}
        {authViewMode === 'verify-email' && <VerifyEmailForm />}
        {authViewMode === 'verify-otp' && <OtpVerificationForm />}

        {/* Back to Home Link */}
        {onNavigateHome && (
          <div className="mt-8 pt-4 border-t border-[#E5D9C5] text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs font-semibold text-[#8C7A6B] hover:text-[#2A1E17] transition-colors inline-flex items-center gap-1.5"
            >
              ← Return to Boutique Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
