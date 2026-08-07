import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

type StaffSubTab =
  | 'all'
  | 'superadmin'
  | 'admin'
  | 'contentmanager'
  | 'inventorymanager'
  | 'marketingmanager'
  | 'support';

export const AdminStaffManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<StaffSubTab>('all');
  const { staffUsers, addStaffUser, deleteStaffUser, updateStaffUser } = useCMS();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [role, setRole] = useState<'Super Admin' | 'Inventory Manager' | 'Content Manager' | 'Marketing Manager' | 'Admin' | 'Support'>('Super Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const SUB_TABS: { id: StaffSubTab; label: string; icon: string; roleMatch?: string }[] = [
    { id: 'all', label: 'All Roles', icon: '👥' },
    { id: 'superadmin', label: 'Super Admin', icon: '👑', roleMatch: 'Super Admin' },
    { id: 'admin', label: 'Admin', icon: '🛡️', roleMatch: 'Admin' },
    { id: 'contentmanager', label: 'Content Manager', icon: '✍️', roleMatch: 'Content Manager' },
    { id: 'inventorymanager', label: 'Inventory Manager', icon: '📦', roleMatch: 'Inventory Manager' },
    { id: 'marketingmanager', label: 'Marketing Manager', icon: '🎯', roleMatch: 'Marketing Manager' },
    { id: 'support', label: 'Support', icon: '🎧', roleMatch: 'Support' },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    addStaffUser({
      id: `u-${Date.now()}`,
      name,
      email,
      role: role as any,
      password: password,
      active: true,
    });
    setName('');
    setEmail('');
    setPassword('');
    setSavedMsg(`Added ${name} as ${role}!`);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedTabObj = SUB_TABS.find((t) => t.id === activeSubTab);

  const filteredStaff = staffUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!selectedTabObj?.roleMatch) return matchesSearch;
    return matchesSearch && u.role === selectedTabObj.roleMatch;
  });

  return (
    <div className="space-y-6 font-sans text-[#2C1E16]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">
            STAFF & PERMISSIONS MANAGEMENT
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">
            User Management & Role Access ({staffUsers.length})
          </h1>
        </div>

        {savedMsg && (
          <span className="bg-[#2E6F40] text-white text-xs font-bold px-4 py-2 rounded-full shadow-subtle animate-bounce">
            ✓ {savedMsg}
          </span>
        )}
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EFE8DB] scrollbar-none">
        {SUB_TABS.map((tab) => {
          const isActive = activeSubTab === tab.id;
          const count = tab.roleMatch
            ? staffUsers.filter((u) => u.role === tab.roleMatch).length
            : staffUsers.length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#B88B38] text-white shadow-card'
                  : 'bg-white text-[#7A6B5D] border border-[#EFE8DB] hover:bg-[#F8F3EA] hover:text-[#2C1E16]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F8F3EA] text-[#B88B38]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Staff User Form */}
        <div className="lg:col-span-4 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4 h-fit">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16] border-b border-[#F2ECE1] pb-2 flex items-center gap-2">
            <span>👨‍💼</span>
            <span>Add Staff Member</span>
          </h3>

          <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] placeholder-[#8C7A6B]"
              />
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="rahul@thecandlelab.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] placeholder-[#8C7A6B]"
              />
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Account Password *</label>
              <div className="relative">
                <input
                  type={showFormPassword ? 'text' : 'password'}
                  required
                  placeholder="Set account password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 pr-10 rounded-lg text-[#2C1E16] placeholder-[#8C7A6B]"
                />
                <button
                  type="button"
                  onClick={() => setShowFormPassword(!showFormPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-[#7A6B5D] hover:text-[#2C1E16] cursor-pointer"
                >
                  {showFormPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Assigned Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-semibold"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Content Manager">Content Manager</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="Support">Support Staff</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Add Staff Account
            </button>
          </form>
        </div>

        {/* Staff Table Container */}
        <div className="lg:col-span-8 bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle flex flex-col">
          {/* Table Search Header */}
          <div className="p-4 border-b border-[#EFE8DB] bg-[#F8F3EA] flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-[#7A6B5D] uppercase tracking-wider">
              Staff List ({filteredStaff.length})
            </span>
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-[#EFE8DB] px-3 py-1.5 rounded-lg text-xs w-64 text-[#2C1E16] focus:outline-hidden focus:border-[#B88B38]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2C1E16]">
              <thead className="bg-[#FAF6F0] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Access Password</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAF6F0] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#B88B38] text-white font-serif font-bold flex items-center justify-center text-xs shadow-xs">
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <strong className="block text-[#2C1E16] font-semibold">{u.name}</strong>
                            <span className="text-[10px] text-[#7A6B5D]">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[#B88B38]">
                        <span className="bg-[#F8F3EA] border border-[#EFE8DB] px-2.5 py-1 rounded-lg">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#F8F3EA] border border-[#EFE8DB] px-2.5 py-1 rounded-lg text-[#2C1E16] font-bold">
                            {visiblePasswords[u.id] ? (u.password || 'admin123') : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            title={visiblePasswords[u.id] ? 'Hide Password' : 'Show Password'}
                            className="text-xs hover:scale-110 transition-transform cursor-pointer"
                          >
                            {visiblePasswords[u.id] ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => updateStaffUser(u.id, { active: !u.active })}
                          className={`font-bold text-[10px] px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                            u.active
                              ? 'bg-[#2E6F40]/10 text-[#2E6F40] border border-[#2E6F40]/20'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {u.active ? '● Active' : '○ Suspended'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteStaffUser(u.id)}
                          className="text-[#B93829] font-bold hover:underline cursor-pointer px-2 py-1 rounded-md hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-[#8C7A6B]">
                      No staff members found matching this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
