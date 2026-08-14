import React from 'react';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'fragrances'
  | 'categories'
  | 'collections'
  | 'attributes'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'hero'
  | 'coupons'
  | 'media'
  | 'staff'
  | 'settings'
  | 'seo';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  currentUser?: { name: string; email: string; role: string } | null;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navItems: { id: AdminTab; label: string; icon: string; badge?: string; section?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', section: 'Overview' },
  { id: 'products', label: 'Products Catalog', icon: '🕯️', section: 'Catalog Management' },
  { id: 'fragrances', label: 'Fragrance Library', icon: '🌸' },
  { id: 'categories', label: 'Categories & Sub', icon: '📂' },
  { id: 'collections', label: 'Marketing Collections', icon: '✨' },
  { id: 'attributes', label: 'Sizes, Colors & Wicks', icon: '🏷️' },
  { id: 'inventory', label: 'Stock & Inventory', icon: '📦' },
  { id: 'orders', label: 'Orders & Fulfillment', icon: '🛍️', section: 'Sales & Store' },
  { id: 'customers', label: 'Customer Directory', icon: '👥' },
  { id: 'coupons', label: 'Coupons & Promos', icon: '🎟️' },
  { id: 'hero', label: 'Hero & Announcements', icon: '🎨', section: 'Content & Settings' },
  { id: 'media', label: 'Media Library', icon: '🖼️' },
  { id: 'staff', label: 'Staff & Roles', icon: '🛡️' },
  { id: 'seo', label: 'SEO & Metadata', icon: '🔍' },
  { id: 'settings', label: 'Store Settings', icon: '⚙️' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  currentUser,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const handleItemClick = (tab: AdminTab) => {
    onTabChange(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1C130E] text-stone-300 flex flex-col h-screen border-r border-[#2C2018] shrink-0 transition-transform duration-300 ease-in-out lg:static lg:w-64 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-[#2C2018] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg">
              🕯️
            </div>
            <div>
              <h1 className="font-serif text-base text-[#FDFBF7] font-medium tracking-wide">The Candle Lab</h1>
              <p className="text-[10px] uppercase tracking-widest text-amber-400/80 font-mono">Master Admin 4.0</p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-lg bg-[#251A13] border border-[#2C2018] flex items-center justify-center text-stone-400 hover:text-stone-100 text-sm"
              title="Close Menu"
            >
              ✕
            </button>
          )}
        </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-stone-800">
        {navItems.map((item, idx) => {
          const isFirstInSection = item.section && (idx === 0 || navItems[idx - 1]?.section !== item.section);
          const isActive = activeTab === item.id;

          return (
            <React.Fragment key={item.id}>
              {isFirstInSection && item.section && (
                <div className="px-3 pt-4 pb-1 text-[10px] uppercase font-mono tracking-wider text-stone-300">
                  {item.section}
                </div>
              )}
              <button
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm font-semibold'
                    : 'text-stone-300 hover:bg-[#251A13] hover:text-[#FDFBF7]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-[#2C2018] bg-[#170F0B]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-serif font-bold">
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#FDFBF7] truncate">{currentUser?.name || 'Administrator'}</p>
            <p className="text-[10px] text-stone-300 truncate">{currentUser?.role || 'Super Admin'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/30 rounded transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
};
