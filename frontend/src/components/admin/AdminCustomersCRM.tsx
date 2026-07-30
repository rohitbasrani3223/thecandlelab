import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

type CustomersSubTab = 'users' | 'groups' | 'addresses' | 'wishlist' | 'reviews';

export const AdminCustomersCRM: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<CustomersSubTab>('users');
  const { customers, addCustomer, deleteCustomer } = useCMS();
  const [savedMsg, setSavedMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', email: '', tier: 'Silver' });

  const [reviews, setReviews] = useState([
    { id: '1', customer: 'Ananya Sharma', product: 'French Vanilla Jar', rating: 5, status: 'Approved', comment: 'Smells like pure heaven! Long burn time.' },
    { id: '2', customer: 'Vikramaditya Singh', product: 'Royal Amber & Oud', rating: 5, status: 'Approved', comment: 'A luxury signature scent for my living room.' },
  ]);

  const SUB_TABS: { id: CustomersSubTab; label: string; icon: string }[] = [
    { id: 'users', label: 'Users & Customers', icon: '👤' },
    { id: 'groups', label: 'Customer Groups', icon: '🏷️' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'wishlist', label: 'Wishlist Analytics', icon: '❤️' },
    { id: 'reviews', label: 'Reviews Moderation', icon: '⭐' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">CUSTOMER RELATIONSHIP MANAGEMENT</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Customers & Reviews CRM</h1>
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
            </button>
          );
        })}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#1C130E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EFE8DB] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-card">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Add New Customer</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8C7A6B]">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCustomer({
                  id: `c-${Date.now()}`,
                  name: newCust.name,
                  email: newCust.email,
                  ordersCount: 0,
                  totalSpent: 0,
                  tier: newCust.tier,
                });
                setNewCust({ name: '', email: '', tier: 'Silver' });
                setShowAddModal(false);
                setSavedMsg('Customer added to CRM!');
                setTimeout(() => setSavedMsg(''), 3000);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newCust.email}
                  onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Loyalty Tier *</label>
                <select
                  value={newCust.tier}
                  onChange={(e) => setNewCust({ ...newCust, tier: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                >
                  <option value="Silver">Silver</option>
                  <option value="VIP Gold">VIP Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#B88B38] text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">
                + Create Customer Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Views */}
      {activeSubTab === 'users' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Registered Customer Directory</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#B88B38] text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              + Add Customer
            </button>
          </div>
          <table className="w-full text-left text-xs text-[#2C1E16]">
            <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Loyalty Tier</th>
                <th className="p-4 text-right">Actions</th>
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
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        deleteCustomer(c.id);
                        setSavedMsg(`Customer ${c.name} removed.`);
                        setTimeout(() => setSavedMsg(''), 3000);
                      }}
                      className="text-[#B93829] font-bold hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'groups' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">🏷️ Customer Segment Groups</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
              <span className="text-[#7A6B5D] block font-bold">VIP Gold Members</span>
              <strong className="text-lg text-[#2C1E16] block mt-1">42 Users</strong>
            </div>
            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
              <span className="text-[#7A6B5D] block font-bold">Wholesale Buyers</span>
              <strong className="text-lg text-[#2C1E16] block mt-1">18 Accounts</strong>
            </div>
            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
              <span className="text-[#7A6B5D] block font-bold">First-Time Buyers</span>
              <strong className="text-lg text-[#2C1E16] block mt-1">184 Users</strong>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'reviews' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">⭐ Product Reviews Moderation</h3>
          <div className="space-y-3 text-xs">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] flex items-center justify-between">
                <div>
                  <strong className="text-[#2C1E16] text-sm block">{r.product} — {'★'.repeat(r.rating)}</strong>
                  <span className="text-[#7A6B5D] text-[11px] block mt-0.5">By {r.customer}: "{r.comment}"</span>
                </div>
                <button
                  onClick={() => {
                    setSavedMsg(`Review by ${r.customer} approved!`);
                    setTimeout(() => setSavedMsg(''), 3000);
                  }}
                  className="bg-[#2E6F40] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  ✓ Approved
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeSubTab === 'addresses' || activeSubTab === 'wishlist') && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-3">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16] capitalize">{activeSubTab} Overview</h3>
          <p className="text-xs text-[#7A6B5D]">Manage customer saved addresses and inspect top wishlisted items.</p>
        </div>
      )}
    </div>
  );
};
