import React from 'react';
import { useAuth, type AuthViewMode } from '../../context/AuthContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { VerifyEmailForm } from './VerifyEmailForm';
import { OtpVerificationForm } from './OtpVerificationForm';
import { AdminLoginPage } from '../admin/AdminLoginPage';

interface AuthPageProps {
  initialMode?: AuthViewMode | 'admin-login';
  onNavigateHome?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onNavigateHome }) => {
  const { authViewMode, setAuthViewMode } = useAuth();
  const [isAdminView, setIsAdminView] = React.useState(initialMode === 'admin-login');

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin-login') {
        setIsAdminView(true);
      } else if (hash === 'login' || hash === 'auth') {
        setIsAdminView(false);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  React.useEffect(() => {
    if (initialMode && initialMode !== 'admin-login') {
      setAuthViewMode(initialMode);
    }
  }, [initialMode]);

  if (isAdminView) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          window.location.hash = '#admin';
        }}
        onReturnToStore={onNavigateHome}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F8] text-[#1C1217] py-8 sm:py-12 px-3 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-x-hidden box-border select-none">
      {/* Soft Luxury Glow Accents */}
      <div className="absolute top-1/4 -left-32 w-72 h-72 sm:w-80 sm:h-80 bg-[#F9B8CA]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-72 h-72 sm:w-80 sm:h-80 bg-[#FDE8EF]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Auth Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white border border-[#F5E8EE] shadow-2xl rounded-3xl p-6 sm:p-9 relative z-10 box-border">
        {/* Brand Top Header */}
        <div className="flex flex-col items-center mb-5 sm:mb-6">
          <img
            src="/logo.jpeg"
            alt="The Candle Lab Logo"
            className="h-10 sm:h-12 w-auto rounded-xl shadow-xs mb-2"
          />
          <span className="font-serif font-extrabold text-base sm:text-lg tracking-widest text-[#1C1217]">
            THE CANDLE LAB
          </span>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#886C7B] font-semibold mt-0.5 text-center">
            Handcrafted Luxury Soy & Botanical Scent Architecture
          </span>
        </div>

        {/* Dynamic Auth Forms */}
        {authViewMode === 'login' && <LoginForm />}
        {authViewMode === 'register' && <RegisterForm />}
        {authViewMode === 'forgot-password' && <ForgotPasswordForm />}
        {authViewMode === 'reset-password' && <ResetPasswordForm />}
        {authViewMode === 'verify-email' && <VerifyEmailForm />}
        {authViewMode === 'verify-otp' && <OtpVerificationForm />}

        {onNavigateHome && (
          <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#F5E8EE] text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs font-semibold text-[#886C7B] hover:text-[#E87A96] transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
            >
              ← Return to Boutique Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
