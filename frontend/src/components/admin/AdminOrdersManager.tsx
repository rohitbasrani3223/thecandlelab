import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

type OrdersSubTab = 'orders' | 'returns' | 'refunds' | 'shipping' | 'tracking';

export const AdminOrdersManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<OrdersSubTab>('orders');
  const { orders, updateOrderStatus, addOrder, deleteOrder } = useCMS();
  const [savedMsg, setSavedMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ customerName: '', email: '', items: '', totalAmount: 1499, paymentMethod: 'Razorpay UPI' });

  const [returnsList] = useState([
    { id: 'RET-901', orderId: 'TCL-98239', customer: 'Priya Nair', reason: 'Damaged Jar in transit', status: 'Approved' },
  ]);

  const SUB_TABS: { id: OrdersSubTab; label: string; icon: string }[] = [
    { id: 'orders', label: 'All Orders', icon: '📦' },
    { id: 'returns', label: 'Returns', icon: '↩️' },
    { id: 'refunds', label: 'Refunds', icon: '💸' },
    { id: 'shipping', label: 'Courier Shipping', icon: '🚚' },
    { id: 'tracking', label: 'AWB Tracking', icon: '🔎' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">ORDER FULFILLMENT & LOGISTICS</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Orders & Shipping Dispatch</h1>
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

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#1C130E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EFE8DB] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-card">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Create Manual Store Order</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8C7A6B]">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const ordId = `TCL-${Math.floor(10000 + Math.random() * 90000)}`;
                addOrder({
                  id: ordId,
                  customerName: newOrder.customerName,
                  email: newOrder.email,
                  items: newOrder.items,
                  totalAmount: Number(newOrder.totalAmount),
                  paymentMethod: newOrder.paymentMethod,
                  status: 'Processing',
                });
                setShowAddModal(false);
                setSavedMsg(`Order ${ordId} created!`);
                setTimeout(() => setSavedMsg(''), 3000);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Customer Email *</label>
                <input
                  type="email"
                  required
                  value={newOrder.email}
                  onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Items Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1x French Vanilla Jar, 1x Rose Wax Melt"
                  value={newOrder.items}
                  onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Total Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={newOrder.totalAmount}
                  onChange={(e) => setNewOrder({ ...newOrder, totalAmount: Number(e.target.value) })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <button type="submit" className="w-full bg-[#B88B38] text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">
                + Create Order Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Views */}
      {activeSubTab === 'orders' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Live Orders List ({orders.length})</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#B88B38] text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              + Create Order
            </button>
          </div>
          <table className="w-full text-left text-xs text-[#2C1E16]">
            <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items Purchased</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAF6F0] transition-colors">
                  <td className="p-4 font-mono font-bold text-[#B88B38]">{ord.id}</td>
                  <td className="p-4">
                    <strong className="block text-[#2C1E16]">{ord.customerName}</strong>
                    <span className="text-[10px] text-[#7A6B5D]">{ord.email}</span>
                  </td>
                  <td className="p-4 text-xs">{ord.items}</td>
                  <td className="p-4 font-bold text-[#2C1E16]">₹{ord.totalAmount.toLocaleString('en-IN')}.00</td>
                  <td className="p-4 text-xs font-semibold text-[#7A6B5D]">{ord.paymentMethod}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ord.status === 'Delivered' ? 'bg-[#2E6F40]/10 text-[#2E6F40]' :
                      ord.status === 'Shipped' ? 'bg-[#B88B38]/10 text-[#B88B38]' :
                      ord.status === 'Processing' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-[#B93829]/10 text-[#B93829]'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <select
                      value={ord.status}
                      onChange={(e) => {
                        updateOrderStatus(ord.id, e.target.value as any);
                        setSavedMsg(`Order ${ord.id} status updated to ${e.target.value}!`);
                        setTimeout(() => setSavedMsg(''), 3000);
                      }}
                      className="bg-[#F8F3EA] border border-[#EFE8DB] p-1 rounded-lg text-xs text-[#2C1E16] font-semibold cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => {
                        deleteOrder(ord.id);
                        setSavedMsg(`Order ${ord.id} deleted.`);
                        setTimeout(() => setSavedMsg(''), 3000);
                      }}
                      className="text-[#B93829] font-bold hover:underline text-xs cursor-pointer"
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

      {activeSubTab === 'returns' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16]">↩️ Customer Returns Workflow</h3>
          <div className="space-y-3 text-xs">
            {returnsList.map((ret) => (
              <div key={ret.id} className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB] flex items-center justify-between">
                <div>
                  <strong className="text-[#2C1E16] text-sm block">{ret.id} — Order {ret.orderId}</strong>
                  <span className="text-[#7A6B5D] text-[11px] block mt-0.5">{ret.customer} • Reason: {ret.reason}</span>
                </div>
                <span className="bg-[#2E6F40]/10 text-[#2E6F40] font-bold text-[10px] px-3 py-1 rounded-full">
                  {ret.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeSubTab === 'refunds' || activeSubTab === 'shipping' || activeSubTab === 'tracking') && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-3">
          <h3 className="font-serif font-bold text-lg text-[#2C1E16] capitalize">{activeSubTab} Center</h3>
          <p className="text-xs text-[#7A6B5D]">Manage Razorpay refunds, Delhivery/Shiprocket API integrations, and AWB tracking numbers.</p>
        </div>
      )}
    </div>
  );
};
