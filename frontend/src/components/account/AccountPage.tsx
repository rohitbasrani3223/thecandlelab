import React, { useState } from 'react';
import { AccountSidebarNav } from './AccountSidebarNav';
import type { AccountTab } from './AccountSidebarNav';

import { DashboardOverviewTab } from './DashboardOverviewTab';
import { ProfileSettingsTab } from './ProfileSettingsTab';
import { AddressBookTab } from './AddressBookTab';
import { OrderHistoryTab } from './OrderHistoryTab';
import { NotificationsTab } from './NotificationsTab';
import { SecurityTab } from './SecurityTab';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useToast, Button } from '../../design-system';
import { useAuth } from '../../context/AuthContext';

export interface AccountPageProps {
  onNavigateToWishlist?: () => void;
  onNavigateToShop?: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onNavigateToWishlist,
  onNavigateToShop,
}) => {
  const { isAuthenticated, openAuthModal, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AccountTab>('dashboard');
  const [activeModalOrderId, setActiveModalOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignOut = () => {
    logout();
    toast({
      type: 'info',
      title: 'Signed Out Successfully',
      description: 'You have been logged out of your sanctuary account.',
    });
    if (onNavigateToShop) onNavigateToShop();
  };

  // If user is LOGGED OUT, present clean Authentication Required view
  if (!isAuthenticated) {
    return (
      <div className="w-full bg-[#FAF6F8] min-h-[80vh] flex flex-col justify-center items-center py-16 px-4 font-sans text-center">
        <div className="max-w-md w-full bg-white border border-[#F5E8EE] p-8 sm:p-10 rounded-3xl shadow-card">
          <div className="w-16 h-16 bg-[#FFF6F8] border border-[#F9B8CA] rounded-full flex items-center justify-center mx-auto mb-6 text-[#E87A96]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1217] font-bold tracking-wide mb-2">
            Sanctuary Account Access
          </h2>

          <p className="text-xs text-[#886C7B] font-medium leading-relaxed mb-8">
            Please sign in to view your orders, addresses, saved wishlists, and exclusive artisan membership rewards.
          </p>

          <div className="space-y-3">
            <Button
              type="button"
              variant="pink"
              size="lg"
              fullWidth
              onClick={() => openAuthModal('login')}
            >
              Sign In to Your Account
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => openAuthModal('register')}
            >
              Create New Account
            </Button>
          </div>

          {onNavigateToShop && (
            <div className="mt-8 pt-6 border-t border-[#F5E8EE]">
              <button
                onClick={onNavigateToShop}
                className="text-xs font-bold uppercase tracking-wider text-[#886C7B] hover:text-[#E87A96] transition-colors"
              >
                ← Explore Fragrance Catalogue
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF6F8] min-h-screen font-sans">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-[#F5E8EE] py-3.5 px-6 sm:px-12 text-xs text-[#886C7B]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#home" className="hover:text-[#E87A96] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#1C1217] font-bold">My Connoisseur Account</span>
          </div>

          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="text-xs font-bold uppercase tracking-wider text-[#E87A96] hover:underline"
            >
              ← Explore Catalogue
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Account Navigation Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <AccountSidebarNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onNavigateToWishlist={onNavigateToWishlist}
              onSignOut={handleSignOut}
            />
          </div>

          {/* Right Column: Active Tab Content */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#F5E8EE] shadow-card">
            {activeTab === 'dashboard' && (
              <DashboardOverviewTab
                onNavigateTab={setActiveTab}
                onViewOrderDetails={(id) => setActiveModalOrderId(id)}
              />
            )}

            {activeTab === 'profile' && <ProfileSettingsTab />}

            {activeTab === 'addresses' && <AddressBookTab />}

            {activeTab === 'orders' && <OrderHistoryTab />}

            {activeTab === 'notifications' && <NotificationsTab />}

            {activeTab === 'security' && <SecurityTab />}
          </div>
        </div>
      </div>

      {/* Shared Order Details Inspector Modal */}
      <OrderDetailsModal
        orderId={activeModalOrderId}
        isOpen={activeModalOrderId !== null}
        onClose={() => setActiveModalOrderId(null)}
      />
    </div>
  );
};
