import React, { useState, useEffect } from 'react';
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
  const userName = user?.name || user?.email?.split('@')[0] || 'Valued Customer';
  const userEmailLower = (user?.email || '').trim().toLowerCase();

  const addressStorageKey = `thecandlelab_addresses_${userEmailLower || 'guest'}`;
  const ordersStorageKey = `thecandlelab_orders_${userEmailLower}`;

  const [primaryAddress, setPrimaryAddress] = useState<any | null>(null);
  const [latestOrder, setLatestOrder] = useState<any | null>(null);

  useEffect(() => {
    // Load primary address
    try {
      const saved = localStorage.getItem(addressStorageKey);
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
    } catch {
      setPrimaryAddress(null);
    }

    // Load strictly this user's latest order
    if (userEmailLower) {
      try {
        const savedOrders = localStorage.getItem(ordersStorageKey);
        if (savedOrders) {
          const orderList = JSON.parse(savedOrders);
          if (Array.isArray(orderList) && orderList.length > 0) {
            setLatestOrder(orderList[0]);
          } else {
            setLatestOrder(null);
          }
        } else {
          setLatestOrder(null);
        }
      } catch {
        setLatestOrder(null);
      }
    } else {
      setLatestOrder(null);
    }
  }, [user, addressStorageKey, ordersStorageKey, userEmailLower]);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Member Loyalty Banner */}
      <div className="bg-gradient-to-r from-[#FAF7F2] via-[#FDE8EF] to-[#FAF7F2] text-[#232323] p-6 rounded-3xl border border-[#EADDCB] shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-2">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>
            SANCTUARY ARTISAN MEMBER
          </Badge>
          <h2 className="text-2xl font-serif font-bold text-[#232323]">
            Welcome Back, {userName}
          </h2>
          <p className="text-xs text-[#5C5149] font-light">
            Logged in as <strong className="text-[#8B6F4E] font-semibold">{user?.email}</strong>. You currently have <strong className="text-[#8B6F4E] font-mono font-bold">100 Rewards Points</strong>.
          </p>
        </div>

        <Button variant="pink" size="sm" onClick={() => onNavigateTab('profile')}>
          Manage Profile →
        </Button>
      </div>

      {/* 2. Order Spotlight (User-Scoped) */}
      <Card variant="bordered" padding="lg" className="bg-[#FFFFFF] border-[#EADDCB] rounded-3xl space-y-4 shadow-card">
        <div className="flex items-center justify-between border-b border-[#EADDCB] pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#7D6F63] uppercase font-bold tracking-wider">Order Management</span>
            <h4 className="font-serif font-bold text-base text-[#232323]">Recent Purchases & Tracking</h4>
          </div>
          <Badge variant="pink" size="sm">ACTIVE CONNOISSEUR</Badge>
        </div>

        {latestOrder ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs py-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADDCB]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-[#7D6F63]">Latest Order:</span>
                <strong className="font-serif text-[#232323] text-sm">{latestOrder.orderNumber || latestOrder.id}</strong>
                <Badge variant={latestOrder.status?.toLowerCase().includes('deliver') ? 'success' : 'pink'} size="sm">
                  {latestOrder.status || 'Processing'}
                </Badge>
              </div>
              <p className="text-[#5C5149]">
                {latestOrder.itemsSummary || (Array.isArray(latestOrder.items) ? latestOrder.items.map((i: any) => `${i.quantity || 1}x ${i.name}`).join(', ') : 'Artisan Soy Candle')}
              </p>
              <span className="text-[11px] text-[#7D6F63] block">
                Total: <strong className="text-[#8B6F4E] font-serif">{typeof latestOrder.totalAmount === 'number' ? `₹${latestOrder.totalAmount.toLocaleString('en-IN')}.00` : (latestOrder.totalAmount || '₹0.00')}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewOrderDetails(latestOrder.id || latestOrder.orderNumber)}
              >
                👁️ View Details
              </Button>
              <Button
                variant="pink"
                size="sm"
                onClick={() => onNavigateTab('orders')}
              >
                All Orders →
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs py-2">
            <div className="space-y-1">
              <span className="text-[#5C5149] block font-medium">Ready to explore handcrafted candle formulations?</span>
              <span className="text-[#7D6F63]">Your verified orders, shipment tracking, and invoices will appear here.</span>
            </div>

            <Button variant="outline" size="sm" onClick={() => onNavigateTab('orders')}>
              View Order History →
            </Button>
          </div>
        )}
      </Card>

      {/* 3. Account Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Primary Address Card */}
        <Card padding="md" className="bg-white border border-[#EADDCB] rounded-3xl space-y-3 shadow-card">
          <div className="flex items-center justify-between border-b border-[#EADDCB] pb-2">
            <h4 className="font-serif font-bold text-sm text-[#232323]">PRIMARY SHIPPING ADDRESS</h4>
            <button
              onClick={() => onNavigateTab('addresses')}
              className="text-xs font-bold text-[#8B6F4E] hover:underline cursor-pointer"
            >
              {primaryAddress ? 'Edit' : '+ Add Address'}
            </button>
          </div>

          {primaryAddress ? (
            <div className="text-xs text-[#5C5149] space-y-1">
              <strong className="block text-[#232323] font-semibold">{primaryAddress.name}</strong>
              <p>{primaryAddress.street}</p>
              <p>{primaryAddress.city}, {primaryAddress.state} {primaryAddress.zip}</p>
              <p>{primaryAddress.country}</p>
            </div>
          ) : (
            <div className="text-xs text-[#7D6F63] py-2">
              <p>No primary shipping address saved yet.</p>
              <button
                onClick={() => onNavigateTab('addresses')}
                className="mt-2 text-xs font-bold text-[#8B6F4E] underline cursor-pointer"
              >
                + Add New Address
              </button>
            </div>
          )}
        </Card>

        {/* Quick Sanctuary Shortcuts */}
        <Card padding="md" className="bg-white border border-[#EADDCB] rounded-3xl space-y-3 shadow-card">
          <h4 className="font-serif font-bold text-sm text-[#232323] border-b border-[#EADDCB] pb-2">
            QUICK SANCTUARY SHORTCUTS
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onNavigateTab('orders')}
              className="p-2.5 bg-[#FAF7F2] hover:bg-[#FDE8EF] rounded-2xl text-left text-[#232323] font-semibold transition-colors cursor-pointer"
            >
              📦 My Orders
            </button>
            <button
              onClick={() => onNavigateTab('wishlist')}
              className="p-2.5 bg-[#FAF7F2] hover:bg-[#FDE8EF] rounded-2xl text-left text-[#232323] font-semibold transition-colors cursor-pointer"
            >
              💖 Saved Wishlist
            </button>
            <button
              onClick={() => onNavigateTab('addresses')}
              className="p-2.5 bg-[#FAF7F2] hover:bg-[#FDE8EF] rounded-2xl text-left text-[#232323] font-semibold transition-colors cursor-pointer"
            >
              📍 Address Book
            </button>
            <button
              onClick={() => onNavigateTab('security')}
              className="p-2.5 bg-[#FAF7F2] hover:bg-[#FDE8EF] rounded-2xl text-left text-[#232323] font-semibold transition-colors cursor-pointer"
            >
              🔒 Security & 2FA
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
