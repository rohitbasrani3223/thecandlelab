import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../design-system';

interface SocialLoginButtonsProps {
  labelPrefix?: string;
}

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '730161262814-p3cs07la1cstaq7l18umcmrngd66o7o4.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
  }
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ labelPrefix = 'or continue with' }) => {
  const { socialLogin, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Ensure Google Identity Services script is present
    if (window.google?.accounts) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const handleGoogleSignIn = () => {
    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                // Fetch real user profile from Google UserInfo API
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });

                if (userInfoRes.ok) {
                  const googleUser = await userInfoRes.json();
                  const res = await socialLogin('google', {
                    name: googleUser.name || googleUser.given_name,
                    email: googleUser.email,
                    avatar: googleUser.picture,
                    idToken: tokenResponse.access_token,
                  });

                  if (res.success) {
                    toast({
                      type: 'success',
                      title: 'Google Sign-In Successful',
                      description: `Welcome back, ${googleUser.name || googleUser.email}!`,
                    });
                  }
                  return;
                }
              } catch (fetchErr) {
                console.error('Failed to fetch Google user profile:', fetchErr);
              }
            }

            toast({
              type: 'error',
              title: 'Google Sign-In Cancelled',
              description: 'Google authentication was not completed. Please try again.',
            });
          },
          error_callback: (err: any) => {
            console.error('Google OAuth error:', err);
            toast({
              type: 'error',
              title: 'Google OAuth Error',
              description: 'Failed to connect to Google Identity Services.',
            });
          },
        });

        tokenClient.requestAccessToken({ prompt: 'consent' });
        return;
      } catch (err) {
        console.error('Google Token Client init error:', err);
      }
    }

    toast({
      type: 'warning',
      title: 'Google SDK Loading',
      description: 'Google Identity Services is initializing. Please try again in 2 seconds.',
    });
  };

  const handleSocialClick = (provider: 'google' | 'apple' | 'meta') => {
    if (provider === 'google') {
      handleGoogleSignIn();
    } else {
      toast({
        type: 'info',
        title: `${provider.toUpperCase()} Sign-In`,
        description: `Please configure ${provider} OAuth credentials in settings to enable direct sign-in.`,
      });
    }
  };

  return (
    <div className="space-y-2.5 w-full font-sans">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5D9C5]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#FAF6F0] px-3 text-[#8C7A6B] font-semibold tracking-wider">
            {labelPrefix}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {/* Google Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialClick('google')}
          title="Sign in with official Google Account"
          className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#E5D9C5] rounded-xs bg-[#FFFFFF] hover:bg-[#F9F6F0] hover:border-[#D4AF37] text-[#2A1E17] text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span className="hidden sm:inline">Google</span>
        </button>

        {/* Apple Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialClick('apple')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#2A1E17] rounded-xs bg-[#2A1E17] hover:bg-[#4A3B32] text-[#FAF6F0] text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0 fill-current text-[#FAF6F0]" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.81 1.44-.61.71-1.15 1.86-1.01 2.96 1.07.08 2.17-.56 2.83-1.36z" />
          </svg>
          <span className="hidden sm:inline">Apple</span>
        </button>

        {/* Meta / Facebook Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialClick('meta')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#E5D9C5] rounded-xs bg-[#FFFFFF] hover:bg-[#F9F6F0] hover:border-[#D4AF37] text-[#1877F2] text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0 fill-current text-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="hidden sm:inline">Meta</span>
        </button>
      </div>
    </div>
  );
};
