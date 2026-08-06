import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLoginPage } from './AdminLoginPage';
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
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>(getTabFromHash);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Admin Auth Guard: Check if user has admin/staff role
  const isAdminUser = isAuthenticated && (user?.role === 'admin' || user?.role === 'staff');
  const [sessionAdminAccess, setSessionAdminAccess] = useState(false);

  const hasAccess = isAdminUser || sessionAdminAccess;

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
    setIsMobileSidebarOpen(false);
  };

  // If not authenticated as admin, show Admin Login Portal Page first!
  if (!hasAccess) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          setSessionAdminAccess(true);
        }}
        onReturnToStore={onReturnToStore}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAF6F0] w-full max-w-full overflow-x-hidden font-sans box-border">
      {/* Mobile Header Bar with Menu Toggle */}
      <div className="lg:hidden bg-[#1C130E] text-[#FAF6F0] p-4 flex items-center justify-between sticky top-0 z-40 border-b border-[#3D2C22] shadow-md">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="Logo" className="w-8 h-8 object-contain rounded-lg border border-[#B88B38]" />
          <div>
            <h2 className="font-serif font-extrabold text-xs tracking-wider text-[#FAF6F0]">THE CANDLE LAB</h2>
            <span className="text-[8px] uppercase font-bold tracking-widest text-[#B88B38]">ENTERPRISE CMS ADMIN</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-lg bg-[#2A1E17] border border-[#3D2C22] text-[#FAF6F0] hover:text-[#B88B38] transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Backdrop Drawer */}
      <div
        className={`fixed inset-0 bg-black/60 z-50 lg:hidden transition-opacity ${
          isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      <div
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onReturnToStore={() => {
            setSessionAdminAccess(false);
            onReturnToStore();
          }}
        />
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen box-border max-w-full bg-[#FAF6F0]">
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
