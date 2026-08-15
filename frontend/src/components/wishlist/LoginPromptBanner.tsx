import React, { useState } from 'react';
import { Button, useToast } from '../../design-system';

export const LoginPromptBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { toast } = useToast();

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-[#FFF6F8] via-[#FDE8EF] to-[#FFF6F8] text-[#1C1217] p-6 rounded-3xl border border-[#F9B8CA] shadow-card flex flex-col sm:flex-row items-center justify-between gap-4 font-sans relative overflow-hidden">
      <div className="space-y-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E87A96]">
            🔒 Sync Across Devices
          </span>
        </div>
        <h4 className="font-serif font-bold text-base text-[#1C1217]">
          Sign in to save your wishlist permanently
        </h4>
        <p className="text-xs text-[#624855] max-w-lg leading-relaxed font-light">
          Your saved candle formulations are currently stored locally. Create a free account or sign in to access your wishlist on any device.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="pink"
          size="sm"
          onClick={() => toast({ type: 'luxury', title: 'Sign In Opened', description: 'Enter your email to sync your sanctuary.' })}
        >
          Sign In / Register
        </Button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-xs text-[#886C7B] hover:text-[#1C1217] p-1 cursor-pointer"
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
