import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../design-system';

interface AdminLoginPageProps {
  onLoginSuccess?: () => void;
  onReturnToStore?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onReturnToStore,
}) => {
  const { adminLogin } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = 'Admin email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await adminLogin({ email, password });
      if (res.success) {
        toast({
          type: 'success',
          title: 'Admin Access Granted',
          description: 'Welcome to The Candle Lab Enterprise Management System.',
        });
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.hash = '#admin';
        }
      } else {
        toast({
          type: 'error',
          title: 'Access Denied',
          description: res.message || 'Invalid administrator credentials.',
        });
      }
    } catch (err) {
      toast({
        type: 'error',
        title: 'Authentication Error',
        description: 'Unable to connect to security gateway.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-white flex flex-col justify-center items-center px-3 sm:px-6 py-6 relative overflow-x-hidden font-sans select-none box-border">
      {/* Dynamic Grid Background Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial Soft Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm sm:max-w-md relative z-10 space-y-5 sm:space-y-6">
        {/* Top Floating Security Icon & Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2.5 sm:space-y-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-blue-500/20 to-blue-900/40 border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-500/10 backdrop-blur-md">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              Admin<span className="text-blue-400 font-light">Panel</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1.5 sm:mt-2">
              <span className="h-[1px] w-4 sm:w-6 bg-blue-500/40" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-blue-300/80">
                SECURE ACCESS
              </span>
              <span className="h-[1px] w-4 sm:w-6 bg-blue-500/40" />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              Enterprise-grade authentication portal
            </p>
          </div>
        </div>

        {/* Central Glassmorphic Card */}
        <div className="bg-[#131B2E]/90 border border-slate-700/60 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80 space-y-5 sm:space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-100 font-serif">
              Welcome Back
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Enter your administrative credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="text-blue-400 text-xs">@</span> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className={`w-full bg-slate-900/90 border ${
                    errors.email ? 'border-red-500/80' : 'border-slate-700 focus:border-blue-500'
                  } rounded-xl px-3.5 sm:px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all font-sans min-h-[44px]`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-400 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-slate-300 flex items-center gap-1.5">
                  <span className="text-blue-400 text-xs">🔒</span> Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full bg-slate-900/90 border ${
                    errors.password ? 'border-red-500/80' : 'border-slate-700 focus:border-blue-500'
                  } rounded-xl px-3.5 sm:px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all pr-10 font-sans min-h-[44px]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a9.04 9.04 0 012.122-.163c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-4.502-3.791a3.001 3.001 0 00-4.004-4.004" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Primary Action CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 min-h-[46px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-xs uppercase tracking-wider">Authenticating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-bold">Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Security Badge Container */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 sm:p-3 flex items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-400">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-medium tracking-wide">SECURE PORTAL — 256-BIT SSL ENCRYPTION</span>
          </div>
        </div>

        {/* Back to Boutique Store Link */}
        <div className="text-center pt-1 sm:pt-2">
          <button
            onClick={() => {
              if (onReturnToStore) {
                onReturnToStore();
              } else {
                window.location.hash = '#home';
              }
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group cursor-pointer py-1"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Return to Boutique Store</span>
          </button>
        </div>

        <div className="text-center text-[10px] sm:text-[11px] text-slate-500">
          © {new Date().getFullYear()} The Candle Lab. All rights reserved.
        </div>
      </div>
    </div>
  );
};
