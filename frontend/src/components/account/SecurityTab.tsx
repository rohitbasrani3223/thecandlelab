import React, { useState } from 'react';
import { Input, Button, Switch, Badge, SparklesIcon, useToast } from '../../design-system';

export const SecurityTab: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const { toast } = useToast();

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        type: 'info',
        title: 'Passwords Do Not Match',
        description: 'Please ensure your new password and confirmation match.',
      });
      return;
    }
    toast({
      type: 'luxury',
      title: 'Password Changed Successfully!',
      description: 'Your account security credentials have been updated.',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-4">
        <div>
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>ACCOUNT SECURITY</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#2A1E17] mt-1">
            Security & Credentials
          </h2>
        </div>
      </div>

      {/* 1. Change Password Form */}
      <form onSubmit={handlePasswordChange} className="p-6 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-4">
        <h3 className="font-serif font-bold text-base text-[#2A1E17] border-b border-[#E5D9C5] pb-2">
          Change Account Password
        </h3>

        <Input
          label="Current Password"
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••••••"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="New Password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 8 characters"
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-type new password"
          />
        </div>

        <Button variant="gold" size="md" type="submit">
          Update Password
        </Button>
      </form>

      {/* 2. Two-Factor Authentication (2FA) */}
      <div className="p-6 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#2A1E17]">Two-Factor Authentication (2FA)</span>
            <Badge variant="success" size="sm">RECOMMENDED</Badge>
          </div>
          <p className="text-xs text-[#8C7A6B]">
            Add an additional layer of security to your account using authenticator apps or SMS codes.
          </p>
        </div>
        <Switch
          checked={is2FAEnabled}
          onChange={(val) => {
            setIs2FAEnabled(val);
            toast({
              type: 'info',
              title: val ? '2FA Enabled' : '2FA Disabled',
            });
          }}
        />
      </div>

      {/* 3. Active Sessions List */}
      <div className="p-6 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-2">
          <h4 className="font-serif font-bold text-sm text-[#2A1E17]">Active Login Sessions</h4>
          <button
            onClick={() => toast({ type: 'luxury', title: 'Signed Out from All Other Devices' })}
            className="text-xs font-bold text-[#B33A3A] hover:underline"
          >
            Sign Out All Other Devices
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#F4EFE6] rounded-xs border border-[#E5D9C5] flex items-center justify-between">
            <div>
              <strong className="text-[#2A1E17] block">MacBook Pro • Chrome Browser (Current Session)</strong>
              <span className="text-[#8C7A6B]">Boston, MA • IP 192.168.1.1</span>
            </div>
            <Badge variant="gold" size="sm">ACTIVE NOW</Badge>
          </div>

          <div className="p-3 bg-[#FAF6F0] rounded-xs border border-[#E5D9C5] flex items-center justify-between">
            <div>
              <strong className="text-[#2A1E17] block">iPhone 15 Pro • Safari Mobile</strong>
              <span className="text-[#8C7A6B]">Boston, MA • Last active 2 hours ago</span>
            </div>
            <span className="text-[10px] text-[#8C7A6B]">Trusted Device</span>
          </div>
        </div>
      </div>
    </div>
  );
};
