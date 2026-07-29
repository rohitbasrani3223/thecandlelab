import React from 'react';
import { useCMS } from '../../context/CMSContext';

export const AdminOrdersManager: React.FC = () => {
  const { orders, updateOrderStatus } = useCMS();

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#EFE8DB] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">ORDER FULFILLMENT</span>
        <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Orders & Shipping Tracking ({orders.length})</h1>
        <p className="text-xs text-[#7A6B5D] mt-1">Manage order statuses, shipping updates, and customer receipts.</p>
      </div>

      <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle">
        <table className="w-full text-left text-xs text-[#2C1E16]">
          <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items Purchased</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Update Status</th>
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
                <td className="p-4 text-right">
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                    className="bg-[#F8F3EA] border border-[#EFE8DB] p-1.5 rounded-lg text-xs text-[#2C1E16] font-semibold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
