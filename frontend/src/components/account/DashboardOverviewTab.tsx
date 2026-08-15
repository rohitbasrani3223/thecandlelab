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
      <div className="bg-gradient-to-r from-[#FFF6F8] via-[#FDE8EF] to-[#FFF6F8] text-[#1C1217] p-6 rounded-3xl border border-[#F9B8CA] shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-2">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>
            SANCTUARY ARTISAN MEMBER
          </Badge>
          <h2 className="text-2xl font-serif font-bold text-[#1C1217]">
            Welcome Back, {userName}
          </h2>
          <p className="text-xs text-[#624855] font-light">
            Logged in as <strong className="text-[#E87A96] font-semibold">{user?.email}</strong>. You currently have <strong className="text-[#E87A96] font-mono font-bold">100 Rewards Points</strong>.
          </p>
        </div>

        <Button variant="pink" size="sm" onClick={() => onNavigateTab('profile')}>
          Manage Profile →
        </Button>
      </div>

      {/* 2. Order Spotlight */}
      <Card variant="bordered" padding="lg" className="bg-[#FFFFFF] border-[#F5E8EE] rounded-3xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F5E8EE] pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#886C7B] uppercase font-bold tracking-wider">Order History</span>
            <h4 className="font-serif font-bold text-base text-[#1C1217]">My Recent Orders</h4>
          </div>
          <Badge variant="pink" size="sm">ACTIVE SESSION</Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs py-2">
          <div className="space-y-1">
            <span className="text-[#624855] block">Ready to explore handcrafted candle formulations?</span>
            <span className="text-[#886C7B]">Your saved items and order history will appear here.</span>
          </div>

          <Button variant="outline" size="sm" onClick={() => onNavigateTab('orders')}>
            View Order History →
          </Button>
        </div>
      </Card>

      {/* 3. Account Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Primary Address Card */}
        <Card padding="md" className="bg-white border border-[#F5E8EE] rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F5E8EE] pb-2">
            <h4 className="font-serif font-bold text-sm text-[#1C1217]">PRIMARY SHIPPING ADDRESS</h4>
            <button
              onClick={() => onNavigateTab('addresses')}
              className="text-xs font-bold text-[#E87A96] hover:underline cursor-pointer"
            >
              {primaryAddress ? 'Edit' : '+ Add Address'}
            </button>
          </div>

          {primaryAddress ? (
            <div className="text-xs text-[#624855] space-y-1">
              <strong className="block text-[#1C1217] font-semibold">{primaryAddress.name}</strong>
              <p>{primaryAddress.street}</p>
              <p>{primaryAddress.city}, {primaryAddress.state} {primaryAddress.zip}</p>
              <p>{primaryAddress.country}</p>
            </div>
          ) : (
            <div className="text-xs text-[#886C7B] py-2">
              <p>No primary shipping address saved yet.</p>
              <button
                onClick={() => onNavigateTab('addresses')}
                className="mt-2 text-xs font-bold text-[#E87A96] underline cursor-pointer"
              >
                + Add New Address
              </button>
            </div>
          )}
        </Card>

        {/* Quick Sanctuary Shortcuts */}
        <Card padding="md" className="bg-white border border-[#F5E8EE] rounded-3xl space-y-3 shadow-xs">
          <h4 className="font-serif font-bold text-sm text-[#1C1217] border-b border-[#F5E8EE] pb-2">
            QUICK SHORTCUTS
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onNavigateTab('orders')}
              className="p-2.5 bg-[#FFF6F8] hover:bg-[#FDE8EF] rounded-2xl text-left text-[#1C1217] font-semibold transition-colors cursor-pointer"
            >
              📦 Order History
            </button>
            <button
              onClick={() => onNavigateTab('wishlist')}
              className="p-2.5 bg-[#FFF6F8] hover:bg-[#FDE8EF] rounded-2xl text-left text-[#1C1217] font-semibold transition-colors cursor-pointer"
            >
              💖 Saved Wishlist
            </button>
            <button
              onClick={() => onNavigateTab('notifications')}
              className="p-2.5 bg-[#FFF6F8] hover:bg-[#FDE8EF] rounded-2xl text-left text-[#1C1217] font-semibold transition-colors cursor-pointer"
            >
              🔔 Notifications
            </button>
            <button
              onClick={() => onNavigateTab('security')}
              className="p-2.5 bg-[#FFF6F8] hover:bg-[#FDE8EF] rounded-2xl text-left text-[#1C1217] font-semibold transition-colors cursor-pointer"
            >
              🔒 Security & 2FA
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
