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
    <div className="bg-[#FAF6F0] border border-[#E5D9C5] rounded-md p-4 space-y-4 font-sans shadow-subtle">
      {/* User Avatar & VIP Status Header */}
      <div className="flex items-center gap-3 p-3 bg-[#F4EFE6] border border-[#E5D9C5] rounded-md">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-11 h-11 rounded-full object-cover border border-[#D4AF37]"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#2A1E17] text-[#D4AF37] flex items-center justify-center font-serif text-lg font-bold border border-[#D4AF37]/50 shadow-xs">
            {getInitials(user?.name || '')}
          </div>
        )}
        <div className="space-y-0.5 truncate">
          <h4 className="font-serif font-bold text-sm text-[#2A1E17] leading-none truncate">
            {user?.name || 'Valued Customer'}
          </h4>
          <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block truncate">
            {user?.role === 'admin' ? 'Master Admin' : 'VIP Gold Connoisseur'}
          </span>
          <span className="text-[11px] text-[#8C7A6B] block truncate">
            {user?.email || ''}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#2A1E17] text-[#FAF6F0] shadow-xs'
                  : 'text-[#5C4A3E] hover:bg-[#F4EFE6] hover:text-[#2A1E17]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {isActive && <span className="text-[#D4AF37] font-bold">›</span>}
            </button>
          );
        })}

        <div className="pt-2 border-t border-[#E5D9C5]/60 mt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span>🚪</span>
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
};
