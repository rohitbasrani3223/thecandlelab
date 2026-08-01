import React, { useState, useEffect } from 'react';
import { Card, Badge, SparklesIcon, Button } from '../../design-system';
import { useAuth } from '../../context/AuthContext';

export interface DashboardOverviewTabProps {
  onNavigateTab: (tab: any) => void;
  onViewOrderDetails: (orderId: string) => void;
}

export const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({
  onNavigateTab,
}) => {
  const { user } = useAuth();
  const userName = user?.name || user?.email?.split('@')[0] || 'Valued Customer';

  const storageKey = `thecandlelab_addresses_${user?.email || 'guest'}`;
  const [primaryAddress, setPrimaryAddress] = useState<any | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && list.length > 0) {
          const defaultAddr = list.find((a: any) => a.isDefault) || list[0];
          setPrimaryAddress(defaultAddr);
        } else {
          setPrimaryAddress(null);
        }
      } else {
        setPrimaryAddress(null);
      }
    } catch (e) {
      setPrimaryAddress(null);
    }
  }, [user, storageKey]);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Member Loyalty Banner */}
      <div className="bg-gradient-to-r from-[#2A1E17] via-[#1C130E] to-[#2A1E17] text-[#FAF6F0] p-6 rounded-2xl border border-[#D4AF37]/40 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-2">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>
            SANCTUARY ARTISAN MEMBER
          </Badge>
          <h2 className="text-2xl font-serif font-bold text-[#FAF6F0]">
            Welcome Back, {userName}
          </h2>
          <p className="text-xs text-[#E5D9C5] font-light">
            Logged in as <strong className="text-[#D4AF37] font-semibold">{user?.email}</strong>. You currently have <strong className="text-[#D4AF37] font-mono font-bold">100 Rewards Points</strong>.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={() => onNavigateTab('profile')}>
          Manage Profile →
        </Button>
      </div>

      {/* 2. Order Spotlight */}
      <Card variant="gold-border" padding="lg" className="bg-[#FAF6F0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#8C7A6B] uppercase font-bold tracking-wider">Order History</span>
            <h4 className="font-serif font-bold text-base text-[#2A1E17]">My Recent Orders</h4>
          </div>
          <Badge variant="gold" size="sm">ACTIVE SESSION</Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs py-2">
          <div className="space-y-1">
            <span className="text-[#69574A] block">Ready to explore handcrafted candle formulations?</span>
            <span className="text-[#8C7A6B]">Your saved items and order history will appear here.</span>
          </div>

          <Button variant="outline" size="sm" onClick={() => onNavigateTab('orders')}>
            View Order History →
          </Button>
        </div>
      </Card>

      {/* 3. Account Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Primary Address Card */}
        <Card padding="md" className="bg-white border border-[#E5D9C5] space-y-3">
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-2">
            <h4 className="font-serif font-bold text-sm text-[#2A1E17]">PRIMARY SHIPPING ADDRESS</h4>
            <button
              onClick={() => onNavigateTab('address')}
              className="text-xs font-bold text-[#B88B38] hover:underline cursor-pointer"
            >
              {primaryAddress ? 'Edit' : '+ Add Address'}
            </button>
          </div>

          {primaryAddress ? (
            <div className="text-xs text-[#69574A] space-y-1">
              <strong className="block text-[#2A1E17] font-semibold">{primaryAddress.name}</strong>
              <p>{primaryAddress.street}</p>
              <p>{primaryAddress.city}, {primaryAddress.state} {primaryAddress.zip}</p>
              <p>{primaryAddress.country}</p>
            </div>
          ) : (
            <div className="text-xs text-[#8C7A6B] py-2">
              <p>No primary shipping address saved yet.</p>
              <button
                onClick={() => onNavigateTab('address')}
                className="mt-2 text-xs font-bold text-[#2A1E17] underline cursor-pointer"
              >
                + Add New Address
              </button>
            </div>
          )}
        </Card>

        {/* Quick Sanctuary Shortcuts */}
        <Card padding="md" className="bg-white border border-[#E5D9C5] space-y-3">
          <h4 className="font-serif font-bold text-sm text-[#2A1E17] border-b border-[#F4EFE6] pb-2">
            QUICK SHORTCUTS
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onNavigateTab('orders')}
              className="p-2.5 bg-[#FAF6F0] hover:bg-[#F4EFE6] rounded-lg text-left text-[#2A1E17] font-semibold transition-colors cursor-pointer"
            >
              📦 Order History
            </button>
            <button
              onClick={() => onNavigateTab('wishlist')}
              className="p-2.5 bg-[#FAF6F0] hover:bg-[#F4EFE6] rounded-lg text-left text-[#2A1E17] font-semibold transition-colors cursor-pointer"
            >
              💖 Saved Wishlist
            </button>
            <button
              onClick={() => onNavigateTab('notifications')}
              className="p-2.5 bg-[#FAF6F0] hover:bg-[#F4EFE6] rounded-lg text-left text-[#2A1E17] font-semibold transition-colors cursor-pointer"
            >
              🔔 Notifications
            </button>
            <button
              onClick={() => onNavigateTab('security')}
              className="p-2.5 bg-[#FAF6F0] hover:bg-[#F4EFE6] rounded-lg text-left text-[#2A1E17] font-semibold transition-colors cursor-pointer"
            >
              🔒 Security & 2FA
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
