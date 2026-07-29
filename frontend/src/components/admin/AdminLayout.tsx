import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import type { AdminTab } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminProductsManager } from './AdminProductsManager';
import { AdminCollectionsManager } from './AdminCollectionsManager';
import { AdminHomepageCMS } from './AdminHomepageCMS';
import { AdminMarketingCMS } from './AdminMarketingCMS';
import { AdminStoreSettings } from './AdminStoreSettings';
import { AdminOrdersManager } from './AdminOrdersManager';
import { AdminCustomersCRM } from './AdminCustomersCRM';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminSEOManager } from './AdminSEOManager';
import { AdminStaffManager } from './AdminStaffManager';
import { useCMS } from '../../context/CMSContext';

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
  const { pagesContent, updatePagesContent } = useCMS();
  const [pagesForm, setPagesForm] = useState(pagesContent);
  const [savedMsg, setSavedMsg] = useState('');

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

  const handlePagesSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePagesContent(pagesForm);
    setSavedMsg('CMS Policy content updated live!');
    setTimeout(() => setSavedMsg(''), 3000);
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
        {activeTab === 'marketing' && <AdminMarketingCMS />}
        {activeTab === 'orders' && <AdminOrdersManager />}
        {activeTab === 'customers' && <AdminCustomersCRM />}
        {activeTab === 'media' && <AdminMediaLibrary />}
        {activeTab === 'seo' && <AdminSEOManager />}
        {activeTab === 'staff' && <AdminStaffManager />}
        {activeTab === 'settings' && <AdminStoreSettings />}
        {activeTab === 'payments' && <AdminStoreSettings />}
        
        {activeTab === 'cmspages' && (
          <div className="space-y-6 font-sans max-w-4xl">
            <div className="border-b border-[#EFE8DB] pb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">CMS CONTENT MANAGEMENT</span>
                <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Store Policies & Editorial Text</h1>
                <p className="text-xs text-[#7A6B5D] mt-1">Edit About Us, Privacy Policy, Terms, Shipping, Refund, and Careers content.</p>
              </div>

              {savedMsg && (
                <span className="bg-[#2E6F40] text-white text-xs font-bold px-3 py-1.5 rounded-full animate-bounce">
                  ✓ {savedMsg}
                </span>
              )}
            </div>

            <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
              <form onSubmit={handlePagesSave} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">About Us Editorial Story</label>
                  <textarea
                    rows={4}
                    value={pagesForm.aboutUs}
                    onChange={(e) => setPagesForm({ ...pagesForm, aboutUs: e.target.value })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Privacy Policy Overview</label>
                  <textarea
                    rows={3}
                    value={pagesForm.privacyPolicy}
                    onChange={(e) => setPagesForm({ ...pagesForm, privacyPolicy: e.target.value })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Shipping Policy Details</label>
                  <textarea
                    rows={3}
                    value={pagesForm.shippingPolicy}
                    onChange={(e) => setPagesForm({ ...pagesForm, shippingPolicy: e.target.value })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2C1E16] block uppercase mb-1">Refund & Returns Policy</label>
                  <textarea
                    rows={3}
                    value={pagesForm.refundPolicy}
                    onChange={(e) => setPagesForm({ ...pagesForm, refundPolicy: e.target.value })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save All CMS Content →
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
