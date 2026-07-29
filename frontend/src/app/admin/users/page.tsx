"use client";

import { useState } from "react";
import { ShieldCheck, Plus, UserCheck, Key, Lock } from "lucide-react";
import toast from "react-hot-toast";

const MOCK_ADMIN_USERS = [
  { id: "u1", name: "Main Administrator", email: "admin@thecandlelab.in", role: "Super Admin", status: "Active" },
  { id: "u2", name: "Operations Manager", email: "ops@thecandlelab.in", role: "Store Manager", status: "Active" },
  { id: "u3", name: "Support Executive", email: "support@thecandlelab.in", role: "Support Staff", status: "Active" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_ADMIN_USERS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
            Admin User & Role Management
          </h1>
          <p className="text-xs text-[#8B7355] mt-1">Manage staff team accounts, permission roles, and administrative security.</p>
        </div>
        <button onClick={() => toast.success("Invite team member modal")} className="btn btn-gold btn-sm gap-1.5 self-start sm:self-auto">
          <Plus size={16} /> Add Team Member
        </button>
      </div>

      <div className="rounded-2xl border border-[#2A1D13] overflow-hidden" style={{ background: "#140D07" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A1D13] text-[11px] uppercase tracking-wider text-[#8B7355]" style={{ background: "#1A1208" }}>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1D13] text-xs">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#1F140B] transition-colors">
                  <td className="p-4 font-semibold text-[#F5EFE4] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#A87B32] flex items-center justify-center font-bold text-white text-xs">
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </td>
                  <td className="p-4 text-[#A08060]">{u.email}</td>
                  <td className="p-4 font-semibold text-[#C4964A]">{u.role}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-950/40 text-[#4ADE80]">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => toast.success(`Password reset link sent to ${u.email}`)} className="text-xs text-[#A08060] hover:text-[#C4964A] hover:underline">
                      Reset Key
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
}
