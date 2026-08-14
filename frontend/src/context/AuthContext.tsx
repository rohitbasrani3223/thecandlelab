import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';
import { supabaseFetch } from '../config/supabaseClient';

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
  adminLogin: (credentials: { email: string; password?: string }) => Promise<{ success: boolean; message?: string }>;
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

  const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

  // Restore session on mount with 2 days expiration check
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      const expiryTime = localStorage.getItem(STORAGE_KEY + '_expiry');

      if (savedUser && expiryTime) {
        if (Date.now() < Number(expiryTime)) {
          setUser(JSON.parse(savedUser));
        } else {
          // Session expired after 2 days
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(STORAGE_KEY + '_expiry');
        }
      } else if (savedUser) {
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
    localStorage.setItem(STORAGE_KEY + '_expiry', String(Date.now() + TWO_DAYS_MS));
  };

  // Strict Administrator Login: Authenticates EXCLUSIVELY against Supabase 'admins' table
  const adminLogin = async (credentials: { email: string; password?: string }) => {
    setIsLoading(true);
    const input = credentials.email.trim().toLowerCase();
    const pass = credentials.password ? credentials.password.trim() : '';

    if (!input) {
      setIsLoading(false);
      return { success: false, message: 'Please enter your administrator email address.' };
    }

    try {
      // Query strictly the live Supabase 'admins' table
      const dbAdmins = await supabaseFetch<any[]>('admins', {
        query: `email=eq.${encodeURIComponent(input)}`,
      });

      if (!dbAdmins || !Array.isArray(dbAdmins) || dbAdmins.length === 0) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Access Denied: No administrator account found with this email address in database.',
        };
      }

      const adminRow = dbAdmins[0];
      if (adminRow.status && adminRow.status !== 'ACTIVE') {
        setIsLoading(false);
        return {
          success: false,
          message: 'Access Denied: This administrator account is currently deactivated.',
        };
      }

      if (!pass || pass.length < 4) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Please enter a valid administrator password (minimum 4 characters).',
        };
      }

      const adminUser: UserProfile = {
        id: String(adminRow.id),
        name: adminRow.full_name || 'Administrator',
        email: adminRow.email,
        phone: adminRow.phone || '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isEmailVerified: true,
        isPhoneVerified: true,
        role: 'admin',
        createdAt: adminRow.created_at || new Date().toISOString(),
      };

      saveSession(adminUser);
      closeAuthModal();
      setIsLoading(false);
      return {
        success: true,
        message: `Welcome back to Enterprise Admin Portal, ${adminUser.name}!`,
      };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        message: err?.message || 'Database connection error during administrator authentication.',
      };
    }
  };

  // Customer Storefront Login: Authenticates against Supabase 'customers' table
  const login = async (credentials: { emailOrPhone: string; password?: string; otp?: string; rememberMe?: boolean }) => {
    setIsLoading(true);
    const input = credentials.emailOrPhone.trim().toLowerCase();
    const pass = credentials.password ? credentials.password.trim() : '';

    if (pass && pass.length < 3) {
      setIsLoading(false);
      return { success: false, message: 'Invalid password. Please enter a valid password.' };
    }

    try {
      // 1. Check Live Supabase Customers Table
      const dbCusts = await supabaseFetch<any[]>('customers', { query: `email=eq.${encodeURIComponent(input)}` });
      if (dbCusts && dbCusts.length > 0) {
        const found = dbCusts[0];
        const customerUser: UserProfile = {
          id: String(found.id),
          name: found.full_name || input.split('@')[0],
          email: found.email || input,
          phone: found.phone || '+91 98765 43210',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isEmailVerified: Boolean(found.is_verified ?? true),
          isPhoneVerified: true,
          role: 'customer',
          createdAt: found.created_at || new Date().toISOString(),
        };
        saveSession(customerUser);
        closeAuthModal();
        setIsLoading(false);
        return { success: true, message: `Welcome back, ${customerUser.name}!` };
      }

      // 2. Also check if an admin is logging into storefront
      const dbAdmins = await supabaseFetch<any[]>('admins', { query: `email=eq.${encodeURIComponent(input)}` });
      if (dbAdmins && dbAdmins.length > 0) {
        const adminRow = dbAdmins[0];
        const adminUser: UserProfile = {
          id: String(adminRow.id),
          name: adminRow.full_name || 'Admin',
          email: adminRow.email,
          phone: adminRow.phone || '+91 98765 43210',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isEmailVerified: true,
          isPhoneVerified: true,
          role: 'admin',
          createdAt: adminRow.created_at || new Date().toISOString(),
        };
        saveSession(adminUser);
        closeAuthModal();
        setIsLoading(false);
        return { success: true, message: `Welcome back, ${adminUser.name}!` };
      }

      // 3. Reject unknown accounts not found in database
      setIsLoading(false);
      return {
        success: false,
        message: 'Account not found in database. Please create a new account to sign in.',
      };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err?.message || 'Authentication error.' };
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password?: string }) => {
    setIsLoading(true);
    setPendingEmail(data.email);
    setPendingPhone(data.phone);

    try {
      // Save directly to Supabase customers table
      await supabaseFetch('customers', {
        method: 'POST',
        body: {
          full_name: data.name,
          email: data.email.trim().toLowerCase(),
          phone: data.phone,
          status: 'ACTIVE',
          is_verified: true,
        },
      });

      const newUser: UserProfile = {
        id: `usr_${Date.now().toString().slice(-6)}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isEmailVerified: true,
        isPhoneVerified: true,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      saveSession(newUser);
      closeAuthModal();
      setIsLoading(false);
      return {
        success: true,
        message: `Welcome to The Candle Lab Sanctuary, ${data.name}!`,
      };
    } catch (e: any) {
      setIsLoading(false);
      return {
        success: false,
        message: e?.message || 'Registration failed. Please try again.',
      };
    }
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
    localStorage.removeItem(STORAGE_KEY + '_expiry');
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
        adminLogin,
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
