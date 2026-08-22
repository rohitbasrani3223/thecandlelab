import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { safeLocalStorageSet } from '../../utils/storage';
import { AdminSidebar, type AdminTab } from './AdminSidebar';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminProductsManager } from './AdminProductsManager';
import { AdminFragranceManager } from './AdminFragranceManager';
import { AdminCategoriesManager } from './AdminCategoriesManager';
import { AdminCollectionsManager } from './AdminCollectionsManager';
import { AdminAttributesManager } from './AdminAttributesManager';
import { AdminOrdersManager } from './AdminOrdersManager';
import { AdminCustomersCRM } from './AdminCustomersCRM';
import { AdminMarketingCMS } from './AdminMarketingCMS';
import { AdminHomepageCMS } from './AdminHomepageCMS';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminStaffManager } from './AdminStaffManager';
import { AdminStoreSettings } from './AdminStoreSettings';
import { AdminSEOManager } from './AdminSEOManager';
import { AdminDashboard } from './AdminDashboard';

export interface AdminLayoutProps {
  onLogout?: () => void;
  currentUser?: { name: string; email: string; role: string } | null;
  onReturnToStore?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onLogout,
  currentUser: propUser,
  onReturnToStore,
}) => {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    try {
      return (localStorage.getItem('tcl_admin_active_tab') as AdminTab) || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    safeLocalStorageSet('tcl_admin_active_tab', activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  const effectiveUser = propUser || (authUser ? { name: authUser.name || 'Administrator', email: authUser.email || 'admin@thecandlelab.com', role: authUser.role || 'Super Admin' } : null);

  // If user is not authenticated as admin/staff, render Admin Login Page
  if (!isAuthenticated || (authUser && authUser.role !== 'admin' && authUser.role !== 'staff')) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => setActiveTab('dashboard')}
        onReturnToStore={onReturnToStore}
      />
    );
  }

  // Tab label mapping for mobile header
  const tabTitles: Record<AdminTab, { title: string; icon: string }> = {
    dashboard: { title: 'Executive Overview', icon: '📊' },
    products: { title: 'Products Catalog', icon: '🕯️' },
    fragrances: { title: 'Fragrance Library', icon: '🌸' },
    categories: { title: 'Categories & Subcategories', icon: '📂' },
    collections: { title: 'Marketing Collections', icon: '✨' },
    attributes: { title: 'Sizes, Colors & Wicks', icon: '🏷️' },
    inventory: { title: 'Stock & Inventory', icon: '📦' },
    orders: { title: 'Orders & Fulfillment', icon: '🛍️' },
    customers: { title: 'Customer Directory', icon: '👥' },
    hero: { title: 'Hero & Announcements', icon: '🎨' },
    coupons: { title: 'Coupons & Promos', icon: '🎟️' },
    media: { title: 'Media Library', icon: '🖼️' },
    staff: { title: 'Staff & Roles', icon: '🛡️' },
    seo: { title: 'SEO & Metadata', icon: '🔍' },
    settings: { title: 'Store Settings', icon: '⚙️' },
  };

  const currentTabInfo = tabTitles[activeTab] || { title: 'Master Admin', icon: '⚡' };

  return (
    <div className="min-h-screen bg-[#140D09] text-[#FDFBF7] flex flex-col lg:flex-row">
      {/* Mobile Top Navigation Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-[#1C130E]/95 backdrop-blur-md border-b border-[#2C2018] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-9 h-9 rounded-lg bg-[#251A13] border border-amber-500/30 text-amber-300 flex items-center justify-center text-lg hover:bg-amber-500/10 active:scale-95 transition-all shrink-0"
            title="Open Menu"
          >
            ☰
          </button>
          <div className="min-w-0">
            <h1 className="font-serif text-sm font-medium text-[#FDFBF7] truncate flex items-center gap-1.5">
              <span>{currentTabInfo.icon}</span>
              <span className="truncate">{currentTabInfo.title}</span>
            </h1>
            <p className="text-[9px] uppercase font-mono tracking-wider text-amber-500/90">The Candle Lab Admin</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-red-400 hover:text-red-300 px-2.5 py-1 rounded bg-red-950/20 border border-red-900/30 text-[10px] font-mono shrink-0 cursor-pointer"
        >
          Sign Out
        </button>
      </header>

      {/* Sidebar (Desktop static / Mobile drawer) */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        currentUser={effectiveUser}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-60px)] lg:h-screen p-4 sm:p-6 lg:p-8 w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeTab === 'dashboard' && <AdminDashboard onTabChange={setActiveTab as any} />}
          {activeTab === 'products' && <AdminProductsManager />}
          {activeTab === 'fragrances' && <AdminFragranceManager />}
          {activeTab === 'categories' && <AdminCategoriesManager />}
          {activeTab === 'collections' && <AdminCollectionsManager />}
          {activeTab === 'attributes' && <AdminAttributesManager />}
          {activeTab === 'inventory' && <AdminProductsManager />}
          {activeTab === 'orders' && <AdminOrdersManager />}
          {activeTab === 'customers' && <AdminCustomersCRM />}
          {activeTab === 'hero' && <AdminHomepageCMS />}
          {activeTab === 'coupons' && <AdminMarketingCMS />}
          {activeTab === 'media' && <AdminMediaLibrary />}
          {activeTab === 'staff' && <AdminStaffManager />}
          {activeTab === 'seo' && <AdminSEOManager />}
          {activeTab === 'settings' && <AdminStoreSettings />}
        </div>
      </main>
    </div>
  );
};
