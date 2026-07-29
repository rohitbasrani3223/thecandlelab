import React from 'react';
import { useCMS } from '../../context/CMSContext';

export const AdminDashboard: React.FC = () => {
  const { totalRevenue, ordersCount, products } = useCMS();

  const lowStockProducts = products.filter((p) => !p.inStock);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">REAL-TIME METRICS</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Executive Overview Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#2E6F40]/10 text-[#2E6F40] font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E6F40] animate-pulse"></span>
            System Live & Connected
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A6B5D] font-bold uppercase tracking-wider">
            <span>Total Sales Revenue</span>
            <span className="text-xl">💰</span>
          </div>
          <div className="text-3xl font-bold text-[#2C1E16]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#2E6F40] font-semibold">↑ +18.4% from last month</span>
        </div>

        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A6B5D] font-bold uppercase tracking-wider">
            <span>Fulfilled Orders</span>
            <span className="text-xl">📦</span>
          </div>
          <div className="text-3xl font-bold text-[#2C1E16]">
            {ordersCount}
          </div>
          <span className="text-[11px] text-[#2E6F40] font-semibold">↑ +12 new orders today</span>
        </div>

        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A6B5D] font-bold uppercase tracking-wider">
            <span>Active Formulations</span>
            <span className="text-xl">🕯️</span>
          </div>
          <div className="text-3xl font-bold text-[#2C1E16]">
            {products.length}
          </div>
          <span className="text-[11px] text-[#B88B38] font-semibold">Across 8 Curated Collections</span>
        </div>

        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A6B5D] font-bold uppercase tracking-wider">
            <span>Conversion Rate</span>
            <span className="text-xl">🎯</span>
          </div>
          <div className="text-3xl font-bold text-[#2C1E16]">
            4.82%
          </div>
          <span className="text-[11px] text-[#2E6F40] font-semibold">Top 5% Industry Standard</span>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Low Stock Alerts */}
        <div className="lg:col-span-6 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16] flex items-center gap-2">
              <span>⚠️</span> Inventory Alerts
            </h3>
            <span className="text-xs text-[#B93829] font-bold">{lowStockProducts.length} Items Restock Required</span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-[#2E6F40] font-bold">✓ All product formulations are well stocked.</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-[#F8F3EA] rounded-xl text-xs">
                  <div>
                    <strong className="text-[#2C1E16] block">{p.name}</strong>
                    <span className="text-[10px] text-[#7A6B5D]">{p.category}</span>
                  </div>
                  <span className="bg-[#B93829] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Out of Stock
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Store Orders Stream */}
        <div className="lg:col-span-6 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16] flex items-center gap-2">
              <span>📋</span> Recent Orders
            </h3>
            <span className="text-xs text-[#B88B38] font-bold">Live Order Stream</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { id: 'TCL-98241', customer: 'Ananya Sharma', items: 'French Vanilla & Cinnamon', amount: '₹1,499', status: 'Processing' },
              { id: 'TCL-98240', customer: 'Vikramaditya Singh', items: 'Amber & Oud Royal Jar', amount: '₹1,299', status: 'Shipped' },
              { id: 'TCL-98239', customer: 'Priya Nair', items: 'Rose Petals Wax Melts', amount: '₹499', status: 'Delivered' },
            ].map((ord) => (
              <div key={ord.id} className="flex items-center justify-between p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE8DB]">
                <div>
                  <strong className="text-[#2C1E16] block">{ord.id} — {ord.customer}</strong>
                  <span className="text-[10px] text-[#7A6B5D]">{ord.items}</span>
                </div>
                <div className="text-right">
                  <strong className="text-[#2C1E16] block">{ord.amount}</strong>
                  <span className="text-[10px] font-bold text-[#2E6F40]">{ord.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
