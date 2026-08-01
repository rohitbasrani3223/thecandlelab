import React from 'react';
import { useAuth } from '../../context/AuthContext';

export type AdminTab =
  | 'dashboard'
  | 'storefront'
  | 'products'
  | 'content'
  | 'cmspages'
  | 'marketing'
  | 'media'
  | 'seo'
  | 'customers'
  | 'orders'
  | 'payments'
  | 'settings'
  | 'staff';

export interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onReturnToStore: () => void;
}

const SIDEBAR_ITEMS: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard & Analytics', icon: '🏠' },
  { id: 'storefront', label: 'Storefront Builder', icon: '🏪' },
  { id: 'products', label: 'Products & Inventory', icon: '🕯️' },
  { id: 'content', label: 'Content Management', icon: '🎨' },
  { id: 'cmspages', label: 'CMS Pages & Policies', icon: '📄' },
  { id: 'marketing', label: 'Marketing & Coupons', icon: '🎯' },
  { id: 'media', label: 'Media Library', icon: '📷' },
  { id: 'seo', label: 'SEO & Meta Tags', icon: '🔍' },
  { id: 'customers', label: 'Customers CRM', icon: '👥' },
  { id: 'orders', label: 'Orders & Shipping', icon: '📦' },
  { id: 'payments', label: 'Payments & Taxes', icon: '💳' },
  { id: 'settings', label: 'Store Settings', icon: '⚙️' },
  { id: 'staff', label: 'User Roles & Access', icon: '👨‍💼' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onReturnToStore,
}) => {
  const { logout } = useAuth();

  return (
    <aside className="w-full lg:w-64 bg-[#1C130E] text-[#FAF6F0] flex flex-col justify-between h-full border-r border-[#3D2C22] shrink-0 font-sans">
      <div className="p-5 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#3D2C22]">
          <img src="/logo.jpeg" alt="Logo" className="w-9 h-9 object-contain rounded-lg border border-[#B88B38]" />
          <div>
            <h2 className="font-serif font-extrabold text-sm tracking-wider text-[#FAF6F0]">THE CANDLE LAB</h2>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#B88B38] block">ENTERPRISE CMS ADMIN</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#B88B38] text-white shadow-card'
                    : 'text-[#C2AE90] hover:bg-[#2A1E17] hover:text-white'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Return & Logout Action */}
      <div className="p-4 border-t border-[#3D2C22] space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#B88B38] text-white font-bold flex items-center justify-center text-[10px]">
            SA
          </div>
          <div className="text-[11px]">
            <span className="font-bold text-white block">Super Admin</span>
            <span className="text-[9px] text-[#8C7A6B]">admin@thecandlelab.in</span>
          </div>
        </div>

        <button
          onClick={onReturnToStore}
          className="w-full bg-[#2A1E17] hover:bg-[#3D2C22] text-[#B88B38] font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 border border-[#B88B38]/40 transition-colors cursor-pointer"
        >
          ← Return to Storefront
        </button>

        <button
          onClick={() => {
            logout();
            onReturnToStore();
          }}
          className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-300 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 border border-red-800/40 transition-colors cursor-pointer"
        >
          🔒 Logout Admin
        </button>
      </div>
    </aside>
  );
};
