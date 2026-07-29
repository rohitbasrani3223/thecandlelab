import React from 'react';
import { useCMS } from '../../context/CMSContext';

export const AdminCustomersCRM: React.FC = () => {
  const { customers } = useCMS();

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#EFE8DB] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">CUSTOMER RELATIONSHIP MANAGEMENT</span>
        <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Customers CRM & VIP Tiers ({customers.length})</h1>
        <p className="text-xs text-[#7A6B5D] mt-1">Track customer order histories, email profiles, and loyalty reward tiers.</p>
      </div>

      <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle">
        <table className="w-full text-left text-xs text-[#2C1E16]">
          <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Orders Placed</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4">Loyalty Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2ECE1]">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-[#FAF6F0] transition-colors">
                <td className="p-4 font-bold text-[#2C1E16]">{c.name}</td>
                <td className="p-4 text-[#7A6B5D]">{c.email}</td>
                <td className="p-4 font-semibold">{c.ordersCount} Orders</td>
                <td className="p-4 font-bold text-[#2E6F40]">₹{c.totalSpent.toLocaleString('en-IN')}.00</td>
                <td className="p-4">
                  <span className="bg-[#B88B38]/10 text-[#B88B38] font-bold px-2.5 py-1 rounded-full text-[10px]">
                    ★ {c.tier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
