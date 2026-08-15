import React from 'react';
import { UserIcon, ShoppingBagIcon, HeartIcon } from '../../design-system';
import { useAuth } from '../../context/AuthContext';

export type AccountTab =
  | 'dashboard'
  | 'profile'
  | 'addresses'
  | 'orders'
  | 'wishlist'
  | 'notifications'
  | 'security';

export interface AccountSidebarNavProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
  onNavigateToWishlist?: () => void;
  onSignOut?: () => void;
}

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'profile', label: 'Profile Settings', icon: <UserIcon size={16} /> },
  { key: 'addresses', label: 'Address Book', icon: '📍' },
  { key: 'orders', label: 'Order History', icon: <ShoppingBagIcon size={16} /> },
  { key: 'wishlist', label: 'Saved Wishlist', icon: <HeartIcon size={16} /> },
  { key: 'notifications', label: 'Notification Preferences', icon: '🔔' },
  { key: 'security', label: 'Security & Password', icon: '🔒' },
];

export const AccountSidebarNav: React.FC<AccountSidebarNavProps> = ({
  activeTab,
  onTabChange,
  onNavigateToWishlist,
  onSignOut,
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onSignOut) onSignOut();
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="bg-white border border-[#F5E8EE] rounded-3xl p-4 space-y-4 font-sans shadow-subtle">
      {/* User Avatar & VIP Status Header */}
      <div className="flex items-center gap-3 p-3 bg-[#FFF6F8] border border-[#F5E8EE] rounded-2xl">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-11 h-11 rounded-full object-cover border border-[#F9B8CA]"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#E87A96] text-white flex items-center justify-center font-serif text-lg font-bold border border-[#F9B8CA] shadow-xs">
            {getInitials(user?.name || '')}
          </div>
        )}
        <div className="space-y-0.5 truncate">
          <h4 className="font-serif font-bold text-sm text-[#1C1217] leading-none truncate">
            {user?.name || 'Valued Customer'}
          </h4>
          <span className="text-[10px] text-[#E87A96] uppercase font-bold tracking-widest block truncate">
            {user?.role === 'admin' ? 'Master Admin' : 'VIP Gold Connoisseur'}
          </span>
          <span className="text-[11px] text-[#886C7B] block truncate">
            {user?.email || ''}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 lg:gap-1 pb-2 lg:pb-0 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                if (item.key === 'wishlist' && onNavigateToWishlist) {
                  onNavigateToWishlist();
                } else {
                  onTabChange(item.key as AccountTab);
                }
              }}
              className={`shrink-0 lg:shrink w-auto lg:w-full flex items-center justify-between px-3.5 py-2 sm:py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#E87A96] text-white shadow-xs'
                  : 'bg-[#FFF6F8] lg:bg-transparent text-[#624855] hover:bg-[#FFF6F8] hover:text-[#1C1217]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {isActive && <span className="hidden lg:inline text-white font-bold">›</span>}
            </button>
          );
        })}

        <div className="shrink-0 lg:shrink pt-0 lg:pt-2 border-l lg:border-l-0 lg:border-t border-[#F5E8EE] pl-2 lg:pl-0 lg:mt-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-between px-3.5 py-2 sm:py-2.5 rounded-full text-xs font-semibold text-[#BE123C] bg-red-50/50 lg:bg-transparent hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer w-full"
          >
            <div className="flex items-center gap-2">
              <span>🚪</span>
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
};
