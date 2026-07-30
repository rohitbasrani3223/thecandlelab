import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import type { AdminTab } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminProductsManager } from './AdminProductsManager';
import { AdminCollectionsManager } from './AdminCollectionsManager';
import { AdminHomepageCMS } from './AdminHomepageCMS';
import { AdminMarketingCMS } from './AdminMarketingCMS';
import { AdminStoreSettings } from './AdminStoreSettings';
import { AdminPaymentsTaxes } from './AdminPaymentsTaxes';
import { AdminOrdersManager } from './AdminOrdersManager';
import { AdminCustomersCRM } from './AdminCustomersCRM';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminSEOManager } from './AdminSEOManager';
import { AdminStaffManager } from './AdminStaffManager';
import { AdminCMSPagesManager } from './AdminCMSPagesManager';

export interface AdminLayoutProps {
  onReturnToStore: () => void;
}

const getTabFromHash = (): AdminTab => {
  const hash = window.location.hash.replace('#', '').trim();
  if (hash.includes('?')) {
    const tab = hash.split('?')[1] as AdminTab;
    const validTabs: AdminTab[] = [
      'dashboard', 'storefront', 'products', 'content', 'cmspages',
      'marketing', 'media', 'seo', 'customers', 'orders', 'payments',
      'settings', 'staff'
    ];
    if (validTabs.includes(tab)) return tab;
  }
  return 'dashboard';
};

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onReturnToStore }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(getTabFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    window.location.hash = `#admin?${tab}`;
  };

  return (
    <div className="flex min-h-screen bg-[#FAF6F0] w-full overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onReturnToStore={onReturnToStore}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'storefront' && <AdminHomepageCMS />}
        {activeTab === 'products' && <AdminProductsManager />}
        {activeTab === 'content' && <AdminCollectionsManager />}
        {activeTab === 'cmspages' && <AdminCMSPagesManager />}
        {activeTab === 'marketing' && <AdminMarketingCMS />}
        {activeTab === 'orders' && <AdminOrdersManager />}
        {activeTab === 'customers' && <AdminCustomersCRM />}
        {activeTab === 'media' && <AdminMediaLibrary />}
        {activeTab === 'seo' && <AdminSEOManager />}
        {activeTab === 'staff' && <AdminStaffManager />}
        {activeTab === 'settings' && <AdminStoreSettings />}
        {activeTab === 'payments' && <AdminPaymentsTaxes />}
      </main>
    </div>
  );
};
