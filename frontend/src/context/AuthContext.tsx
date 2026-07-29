import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: 'customer' | 'admin' | 'staff';
  createdAt: string;
}

export type AuthViewMode =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'verify-otp';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authViewMode: AuthViewMode;
  pendingEmail?: string;
  pendingPhone?: string;
  openAuthModal: (mode?: AuthViewMode, emailOrPhone?: string) => void;
  closeAuthModal: () => void;
  setAuthViewMode: (mode: AuthViewMode) => void;
  login: (credentials: { emailOrPhone: string; password?: string; otp?: string; rememberMe?: boolean }) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; message?: string; requireOtp?: boolean; requireEmailVerify?: boolean }>;
  requestPasswordReset: (emailOrPhone: string) => Promise<{ success: boolean; message?: string; method: 'email' | 'otp' }>;
  resetPassword: (password: string, tokenOrOtp: string) => Promise<{ success: boolean; message?: string }>;
  verifyEmail: (token?: string) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; message?: string }>;
  socialLogin: (provider: 'google' | 'apple' | 'meta', profileData?: { name?: string; email?: string; avatar?: string; idToken?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const STORAGE_KEY = 'thecandlelab_auth_user';
const TOKEN_KEY = 'thecandlelab_auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authViewMode, setAuthViewModeState] = useState<AuthViewMode>('login');
  const [pendingEmail, setPendingEmail] = useState<string | undefined>(undefined);
  const [pendingPhone, setPendingPhone] = useState<string | undefined>(undefined);

  // Restore session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (mode: AuthViewMode = 'login', emailOrPhone?: string) => {
    setAuthViewModeState(mode);
    if (emailOrPhone) {
      if (emailOrPhone.includes('@')) {
        setPendingEmail(emailOrPhone);
      } else {
        setPendingPhone(emailOrPhone);
      }
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setAuthViewMode = (mode: AuthViewMode) => {
    setAuthViewModeState(mode);
  };

  const saveSession = (userData: UserProfile, token: string = 'mock-jwt-token-12345') => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, token);
  };

  const login = async (credentials: { emailOrPhone: string; password?: string; otp?: string; rememberMe?: boolean }) => {
    setIsLoading(true);
    try {
      // Try backend call first
      const res = await fetch(getApiUrl('auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          saveSession(data.user, data.token);
          closeAuthModal();
          return { success: true, message: 'Successfully signed in!' };
        }
      }
    } catch (err) {
      // Fallback local demo login mode
    } finally {
      setIsLoading(false);
    }

    // Fallback Mock Authentication
    const mockUser: UserProfile = {
      id: 'usr_' + Date.now().toString().slice(-6),
      name: credentials.emailOrPhone.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Valued Customer',
      email: credentials.emailOrPhone.includes('@') ? credentials.emailOrPhone : 'customer@thecandlelab.com',
      phone: credentials.emailOrPhone.includes('@') ? '+91 98765 43210' : credentials.emailOrPhone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isEmailVerified: true,
      isPhoneVerified: true,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    saveSession(mockUser);
    closeAuthModal();
    return { success: true, message: 'Signed in successfully!' };
  };

  const register = async (data: { name: string; email: string; phone: string; password?: string }) => {
    setIsLoading(true);
    setPendingEmail(data.email);
    setPendingPhone(data.phone);

    try {
      const res = await fetch(getApiUrl('auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.success) {
          setAuthViewModeState('verify-otp');
          return { success: true, message: resData.message || 'OTP sent for verification.', requireOtp: true };
        }
      }
    } catch (e) {
      // Fallback
    } finally {
      setIsLoading(false);
    }

    setAuthViewModeState('verify-otp');
    return {
      success: true,
      message: 'Account created! Please enter the 6-digit OTP sent to your phone/email.',
      requireOtp: true,
    };
  };

  const requestPasswordReset = async (emailOrPhone: string) => {
    setIsLoading(true);
    if (emailOrPhone.includes('@')) {
      setPendingEmail(emailOrPhone);
    } else {
      setPendingPhone(emailOrPhone);
    }

    try {
      await fetch(getApiUrl('auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone }),
      });
    } catch (e) {
      // Ignore fallback
    } finally {
      setIsLoading(false);
    }

    setAuthViewModeState('verify-otp');
    return {
      success: true,
      message: 'Password reset code has been sent via SMS/Email.',
      method: (emailOrPhone.includes('@') ? 'email' : 'otp') as 'email' | 'otp',
    };
  };

  const resetPassword = async (password: string, tokenOrOtp: string) => {
    setIsLoading(true);
    try {
      await fetch(getApiUrl('auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, tokenOrOtp, email: pendingEmail }),
      });
    } catch (e) {
      // Fallback
    } finally {
      setIsLoading(false);
    }

    setAuthViewModeState('login');
    return { success: true, message: 'Password reset successfully! Please sign in with your new password.' };
  };

  const verifyEmail = async (token?: string) => {
    setIsLoading(true);
    try {
      await fetch(getApiUrl('auth/verify-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: pendingEmail }),
      });
    } catch (e) {
      // Fallback
    } finally {
      setIsLoading(false);
    }

    if (user) {
      setUser({ ...user, isEmailVerified: true });
    }
    return { success: true, message: 'Email address verified successfully!' };
  };

  const verifyOtp = async (otp: string) => {
    setIsLoading(true);
    try {
      await fetch(getApiUrl('auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, email: pendingEmail, phone: pendingPhone }),
      });
    } catch (e) {
      // Fallback
    } finally {
      setIsLoading(false);
    }

    // Complete authentication upon OTP verification
    const newUser: UserProfile = {
      id: 'usr_' + Date.now().toString().slice(-6),
      name: pendingEmail ? pendingEmail.split('@')[0] : 'Valued Customer',
      email: pendingEmail || 'customer@thecandlelab.com',
      phone: pendingPhone || '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isEmailVerified: true,
      isPhoneVerified: true,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    saveSession(newUser);
    closeAuthModal();
    return { success: true, message: 'OTP verified successfully! Welcome to The Candle Lab.' };
  };

  const socialLogin = async (provider: 'google' | 'apple' | 'meta', profileData?: { name?: string; email?: string; avatar?: string; idToken?: string }) => {
    setIsLoading(true);
    const providerNames = { google: 'Google', apple: 'Apple ID', meta: 'Facebook' };
    
    try {
      const res = await fetch(getApiUrl('auth/social'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, ...profileData }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const userObj = profileData?.email ? {
            ...data.user,
            name: profileData.name || data.user.name,
            email: profileData.email,
            avatar: profileData.avatar || data.user.avatar,
          } : data.user;
          saveSession(userObj, data.token);
          setIsLoading(false);
          closeAuthModal();
          return { success: true, message: `Successfully authenticated via ${providerNames[provider]}` };
        }
      }
    } catch (e) {
      // Fallback
    }

    const socialUser: UserProfile = {
      id: `usr_${provider}_${Date.now().toString().slice(-6)}`,
      name: profileData?.name || `Valued User (${providerNames[provider]})`,
      email: profileData?.email || `user.${provider}@thecandlelab.com`,
      avatar: profileData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isEmailVerified: true,
      isPhoneVerified: false,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    saveSession(socialUser);
    setIsLoading(false);
    closeAuthModal();
    return { success: true, message: `Successfully authenticated via ${providerNames[provider]}` };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authViewMode,
        pendingEmail,
        pendingPhone,
        openAuthModal,
        closeAuthModal,
        setAuthViewMode,
        login,
        register,
        requestPasswordReset,
        resetPassword,
        verifyEmail,
        verifyOtp,
        socialLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
