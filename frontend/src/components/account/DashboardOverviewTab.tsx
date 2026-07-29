import React from 'react';
import { Card, Badge, SparklesIcon, Button } from '../../design-system';
import { useAuth } from '../../context/AuthContext';

export interface DashboardOverviewTabProps {
  onNavigateTab: (tab: any) => void;
  onViewOrderDetails: (orderId: string) => void;
}

export const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({
  onNavigateTab,
  onViewOrderDetails,
}) => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Valued Customer';

  return (
    <div className="space-y-6 font-sans">
      {/* 1. VIP Connoisseur Loyalty Banner */}
      <div className="bg-gradient-to-r from-[#2A1E17] via-[#1C130E] to-[#2A1E17] text-[#FAF6F0] p-6 rounded-md border border-[#D4AF37]/50 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-2">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>VIP GOLD ARTISAN CONNOISSEUR</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#FAF6F0]">
            Welcome Back, {firstName}
          </h2>
          <p className="text-xs text-[#E5D9C5] font-light">
            Logged in as <strong className="text-[#D4AF37] font-semibold">{user?.email}</strong>. You currently have <strong className="text-[#D4AF37] font-mono font-bold">480 Sanctuary Rewards Points</strong> (₹480 redeemable voucher value).
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={() => onNavigateTab('profile')}>
          Manage Preferences →
        </Button>
      </div>

      {/* 2. Recent Active Order Spotlight */}
      <Card variant="gold-border" padding="lg" className="bg-[#FAF6F0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#8C7A6B] uppercase font-bold tracking-wider">Latest Order Spotlight</span>
            <h4 className="font-serif font-bold text-base text-[#2A1E17]">Order #TCL-2026-8841</h4>
          </div>
          <Badge variant="gold" size="sm">IN TRANSIT • COURIER</Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[#69574A] block">2 Formulations (Velvet Rose & Bourbon Vanilla)</span>
            <span className="text-[#8C7A6B]">Placed on July 29, 2026 • Total: <strong>$172.00</strong></span>
          </div>

          <Button variant="outline" size="sm" onClick={() => onViewOrderDetails('#TCL-2026-8841')}>
            View Order Details →
          </Button>
        </div>
      </Card>

      {/* 3. Account Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Primary Address Card */}
        <Card variant="bordered" padding="md" className="bg-[#FAF6F0] space-y-3">
          <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A6B]">Primary Shipping Address</span>
            <button onClick={() => onNavigateTab('addresses')} className="text-xs font-bold text-[#D4AF37] hover:underline">
              Edit
            </button>
          </div>
          <div className="text-xs space-y-1 text-[#4A3B32]">
            <strong className="text-[#2A1E17] block">Clara Hemsworth</strong>
            <p>742 Evergreen Terrace, Penthouse 4B</p>
            <p>Boston, MA 02108 • United States</p>
          </div>
        </Card>

        {/* Quick Shortcuts Card */}
        <Card variant="bordered" padding="md" className="bg-[#FAF6F0] space-y-3">
          <div className="border-b border-[#E5D9C5] pb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A6B]">Quick Sanctuary Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => onNavigateTab('orders')} className="p-2 bg-[#F4EFE6] border border-[#E5D9C5] rounded-xs font-semibold text-[#2A1E17] hover:border-[#D4AF37] text-left">
              📦 Order History
            </button>
            <button onClick={() => onNavigateTab('wishlist')} className="p-2 bg-[#F4EFE6] border border-[#E5D9C5] rounded-xs font-semibold text-[#2A1E17] hover:border-[#D4AF37] text-left">
              💖 Saved Wishlist
            </button>
            <button onClick={() => onNavigateTab('notifications')} className="p-2 bg-[#F4EFE6] border border-[#E5D9C5] rounded-xs font-semibold text-[#2A1E17] hover:border-[#D4AF37] text-left">
              🔔 SMS Alerts
            </button>
            <button onClick={() => onNavigateTab('security')} className="p-2 bg-[#F4EFE6] border border-[#E5D9C5] rounded-xs font-semibold text-[#2A1E17] hover:border-[#D4AF37] text-left">
              🔒 Security & 2FA
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
