import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export const AdminStaffManager: React.FC = () => {
  const { staffUsers, addStaffUser, deleteStaffUser } = useCMS();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Super Admin' | 'Inventory Manager' | 'Content Manager' | 'Marketing Manager'>('Content Manager');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    addStaffUser({
      id: `u-${Date.now()}`,
      name,
      email,
      role,
      active: true,
    });
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#EFE8DB] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">STAFF ACCESS CONTROL</span>
        <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">User Management & Roles ({staffUsers.length})</h1>
        <p className="text-xs text-[#7A6B5D] mt-1">Manage staff admin permissions (Super Admin, Inventory Manager, Content Manager).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Staff User Form */}
        <div className="lg:col-span-5 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16] border-b border-[#F2ECE1] pb-2">
            👨‍💼 Add Staff Member
          </h3>

          <form onSubmit={handleAdd} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
              />
            </div>

            <div>
              <label className="font-bold text-[#2C1E16] block uppercase mb-1">Assigned Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16] font-semibold"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Content Manager">Content Manager</option>
                <option value="Marketing Manager">Marketing Manager</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Add Staff Account
            </button>
          </form>
        </div>

        {/* Staff Table */}
        <div className="lg:col-span-7 bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle">
          <table className="w-full text-left text-xs text-[#2C1E16]">
            <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {staffUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAF6F0] transition-colors">
                  <td className="p-4">
                    <strong className="block text-[#2C1E16]">{u.name}</strong>
                    <span className="text-[10px] text-[#7A6B5D]">{u.email}</span>
                  </td>
                  <td className="p-4 font-bold text-[#B88B38]">{u.role}</td>
                  <td className="p-4">
                    <span className="bg-[#2E6F40]/10 text-[#2E6F40] font-bold text-[10px] px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteStaffUser(u.id)}
                      className="text-[#B93829] font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
