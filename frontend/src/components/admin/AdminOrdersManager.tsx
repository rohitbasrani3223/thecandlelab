import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { safeLocalStorageSet } from '../../utils/storage';
import { printOrderInvoice } from '../../utils/printInvoice';
import { PrintableInvoice } from '../invoice/PrintableInvoice';

type OrdersSubTab = 'orders' | 'returns' | 'refunds' | 'shipping' | 'tracking';

export const AdminOrdersManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<OrdersSubTab>('orders');
  const { orders, updateOrderStatus, addOrder, deleteOrder } = useCMS();
  const [savedMsg, setSavedMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [shipmentOrder, setShipmentOrder] = useState<string | null>(null);
  const [shipment, setShipment] = useState({ courier: 'Shiprocket', awb: '', pickupDate: '' });
  const [newOrder, setNewOrder] = useState({ customerName: '', email: '', phone: '', address: '', items: '', totalAmount: 1499, paymentMethod: 'Razorpay UPI' });
  const [modalView, setModalView] = useState<'slip' | 'invoice'>('slip');

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

  const [selectedPackingOrder, setSelectedPackingOrder] = useState<any | null>(null);

  const getFullOrderDetails = (ord: any) => {
    try {
      const userOrders = JSON.parse(localStorage.getItem('tcl_user_orders') || '[]');
      const cmsOrders = JSON.parse(localStorage.getItem('tcl_cms_orders') || '[]');
      const allOrders = JSON.parse(localStorage.getItem('thecandlelab_orders_all') || '[]');
      const match = [...userOrders, ...cmsOrders, ...allOrders].find(
        (o: any) => o.id === ord.id || o.orderNumber === ord.id || String(o.id).toLowerCase() === String(ord.id).toLowerCase()
      );

      const resolvedItems = (ord.itemsList && Array.isArray(ord.itemsList) && ord.itemsList.length > 0)
        ? ord.itemsList
        : (match?.itemsList && Array.isArray(match.itemsList) && match.itemsList.length > 0)
          ? match.itemsList
          : Array.isArray(ord.items) && ord.items.length > 0
            ? ord.items
            : (typeof ord.items === 'string' && ord.items.trim())
              ? [{ name: ord.items, quantity: 1, price: Number(ord.totalAmount) || 0 }]
              : [];

      const orderTot = Number(ord.totalAmount) || Number(match?.totalAmount) || 0;
      const orderSub = ord.subtotal !== undefined ? ord.subtotal : (match?.subtotal !== undefined ? match.subtotal : Math.round(orderTot / 1.18));
      const orderTax = ord.tax !== undefined ? ord.tax : (match?.tax !== undefined ? match.tax : Math.round(orderTot - orderSub));

      return {
        ...ord,
        ...(match || {}),
        itemsList: resolvedItems,
        items: resolvedItems,
        customerName: ord.customerName || match?.customerName || '',
        customerEmail: ord.customerEmail || ord.email || match?.customerEmail || match?.email || '',
        customerPhone: ord.customerPhone || ord.phone || match?.customerPhone || match?.phone || '',
        shippingAddress: ord.shippingAddress || ord.address || match?.shippingAddress || match?.address || '',
        paymentMethod: ord.paymentMethod || match?.paymentMethod || 'Online',
        totalAmount: orderTot,
        subtotal: orderSub,
        tax: orderTax,
      };
    } catch {
      return ord;
    }
  };

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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${isActive
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

      {/* Full Order Specification, Packing Slip & Tax Invoice Modal */}
      {selectedPackingOrder && (
        <div className="fixed inset-0 z-50 bg-[#1C130E]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#EFE8DB] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            {/* Header with View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE8DB] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">
                  🕯️ ATELIER FULFILLMENT DESK
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#2C1E16]">
                  Order {selectedPackingOrder.id || selectedPackingOrder.orderNumber}
                </h3>
                <span className="text-xs text-[#7A6B5D]">
                  Placed on {selectedPackingOrder.date || 'Today'} • Status: <strong className="text-[#2C1E16]">{selectedPackingOrder.status || 'Processing'}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#FAF7F2] p-1 rounded-xl border border-[#EFE8DB] flex items-center gap-1">
                  <button
                    onClick={() => setModalView('slip')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      modalView === 'slip' ? 'bg-[#B88B38] text-white shadow-xs' : 'text-[#7A6B5D] hover:text-[#2C1E16]'
                    }`}
                  >
                    📦 Packing Slip
                  </button>
                  <button
                    onClick={() => setModalView('invoice')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      modalView === 'invoice' ? 'bg-[#B88B38] text-white shadow-xs' : 'text-[#7A6B5D] hover:text-[#2C1E16]'
                    }`}
                  >
                    🧾 A4 Tax Invoice
                  </button>
                </div>

                <button
                  onClick={() => setSelectedPackingOrder(null)}
                  className="w-8 h-8 rounded-full bg-[#F8F3EA] hover:bg-[#EFE8DB] flex items-center justify-center text-sm font-bold text-[#2C1E16] cursor-pointer ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {modalView === 'invoice' ? (
              <div className="space-y-4">
                <PrintableInvoice
                  order={selectedPackingOrder}
                  onClose={() => setSelectedPackingOrder(null)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Customer & Shipping Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F8F3EA] rounded-2xl border border-[#EFE8DB] text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#7A6B5D] block">👤 Customer Details</span>
                    <p className="font-bold text-[#2C1E16] text-sm">{selectedPackingOrder.customerName}</p>
                    <p className="text-[#7A6B5D]">✉️ {selectedPackingOrder.email || selectedPackingOrder.customerEmail || 'No email provided'}</p>
                    {(selectedPackingOrder.phone || selectedPackingOrder.customerPhone) && (
                      <p className="text-[#2C1E16] font-semibold flex items-center gap-2 mt-1">
                        <span>📞 {selectedPackingOrder.phone || selectedPackingOrder.customerPhone}</span>
                        <a
                          href={`https://wa.me/91${String(selectedPackingOrder.phone || selectedPackingOrder.customerPhone).replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] bg-[#2E6F40] text-white px-2 py-0.5 rounded-full font-bold"
                        >
                          WhatsApp
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#7A6B5D] block">🏠 Delivery Destination</span>
                    <p className="text-[#2C1E16] font-medium leading-relaxed">
                      {selectedPackingOrder.shippingAddress || selectedPackingOrder.address || 'Address on invoice'}
                    </p>
                    <p className="text-[#7A6B5D] font-mono text-[11px] pt-1">
                      Payment: <strong>{selectedPackingOrder.paymentMethod || 'Razorpay / Online'}</strong>
                    </p>
                  </div>
                </div>

                {/* Itemized Packing List with EXACT Specifications */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#2C1E16] flex items-center justify-between">
                    <span>📦 Ordered Items & Formulation Details</span>
                    <span className="text-[11px] font-normal text-[#7A6B5D]">Verify each candle formulation before boxing</span>
                  </h4>

                  <div className="space-y-3">
                    {selectedPackingOrder.itemsList && Array.isArray(selectedPackingOrder.itemsList) && selectedPackingOrder.itemsList.length > 0 ? (
                      selectedPackingOrder.itemsList.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-white border border-[#EFE8DB] rounded-2xl space-y-2 shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#F8F3EA] border border-[#EFE8DB] flex items-center justify-center text-xl shrink-0 overflow-hidden">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  '🕯️'
                                )}
                              </div>
                              <div>
                                <h5 className="font-serif font-bold text-sm text-[#2C1E16]">{item.name}</h5>
                                <span className="text-[11px] font-mono text-[#7A6B5D]">SKU: {item.sku || 'TCL-CANDLE'}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-bold text-[#2C1E16] block">
                                Qty: <strong className="text-base text-[#B88B38]">{item.quantity || 1}</strong>
                              </span>
                              <span className="text-[11px] text-[#7A6B5D]">₹{item.price || 999} each</span>
                            </div>
                          </div>

                          {/* Formulation Pill Specifications */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#F2ECE1] text-[11px]">
                            <div className="p-2 bg-[#F8F3EA] rounded-xl border border-[#EFE8DB]">
                              <span className="text-[9px] uppercase font-bold text-[#7A6B5D] block">🌸 Fragrance</span>
                              <strong className="text-[#2C1E16] truncate block">{item.fragrance || 'Signature Blend'}</strong>
                            </div>
                            <div className="p-2 bg-[#F8F3EA] rounded-xl border border-[#EFE8DB]">
                              <span className="text-[9px] uppercase font-bold text-[#7A6B5D] block">📏 Size / Weight</span>
                              <strong className="text-[#2C1E16] truncate block">{item.size || '250g Classic'}</strong>
                            </div>
                            <div className="p-2 bg-[#F8F3EA] rounded-xl border border-[#EFE8DB]">
                              <span className="text-[9px] uppercase font-bold text-[#7A6B5D] block">🕯️ Wick Type</span>
                              <strong className="text-[#2C1E16] truncate block">{item.wickType || 'Wood Wick'}</strong>
                            </div>
                            <div className="p-2 bg-[#F8F3EA] rounded-xl border border-[#EFE8DB]">
                              <span className="text-[9px] uppercase font-bold text-[#7A6B5D] block">🎨 Vessel Finish</span>
                              <strong className="text-[#2C1E16] truncate block">{item.color || 'Standard Glass'}</strong>
                            </div>
                          </div>

                          {/* Gift Packaging & Message */}
                          {(item.giftPackaging || item.customMessage) && (
                            <div className="p-2.5 bg-[#FAF7F2] border border-[#EADDCB] rounded-xl text-xs space-y-1">
                              {item.giftPackaging && (
                                <span className="font-bold text-[#C94C6D] flex items-center gap-1">
                                  <span>🎁</span> Pack in Luxury Blush Rose Gift Box (+ Wax Seal)
                                </span>
                              )}
                              {item.customMessage && (
                                <div className="bg-white p-2 rounded-lg border border-[#EADDCB]/40">
                                  <span className="text-[10px] font-bold uppercase text-[#7D6F63] block">💌 Handwritten Card Note:</span>
                                  <p className="italic text-[#232323] font-serif">"{item.customMessage}"</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-[#F8F3EA] rounded-2xl text-xs space-y-1">
                        <span className="font-bold text-[#2C1E16] block">Order Summary:</span>
                        <p className="text-[#7A6B5D]">{selectedPackingOrder.items || 'Standard Artisanal Candle Order'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Packing Checklist & Print Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#EFE8DB]">
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedPackingOrder.status}
                      onChange={(e) => {
                        updateOrderStatus(selectedPackingOrder.id, e.target.value as any);
                        setSelectedPackingOrder({ ...selectedPackingOrder, status: e.target.value });
                        setSavedMsg(`Order ${selectedPackingOrder.id} status updated to ${e.target.value}!`);
                        setTimeout(() => setSavedMsg(''), 3000);
                      }}
                      className="bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-xl text-xs font-bold text-[#2C1E16] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => {
                        setShipmentOrder(selectedPackingOrder.id);
                        setSelectedPackingOrder(null);
                      }}
                      className="px-4 py-2.5 bg-[#B88B38] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#A37829]"
                    >
                      🚚 Create Shipment
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => printOrderInvoice(selectedPackingOrder, 'invoice')}
                      className="px-4 py-2.5 bg-[#2C1E16] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#1C130E] flex items-center gap-1.5 shadow-xs"
                    >
                      <span>🖨️</span>
                      <span>Print Tax Invoice (A4)</span>
                    </button>

                    <button
                      onClick={() => printOrderInvoice(selectedPackingOrder, 'packingslip')}
                      className="px-3.5 py-2.5 bg-[#F8F3EA] border border-[#EFE8DB] hover:border-[#B88B38] text-[#2C1E16] text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <span>📋</span>
                      <span>Print Slip</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                  orderNumber: ordId,
                  customerName: newOrder.customerName,
                  email: newOrder.email,
                  customerEmail: newOrder.email,
                  phone: newOrder.phone,
                  customerPhone: newOrder.phone,
                  address: newOrder.address,
                  shippingAddress: newOrder.address,
                  items: newOrder.items,
                  totalAmount: Number(newOrder.totalAmount),
                  paymentMethod: newOrder.paymentMethod,
                  status: 'Processing',
                  date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
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
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newOrder.phone}
                  onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="font-bold text-[#2C1E16] block uppercase mb-1">Shipping Address</label>
                <input
                  type="text"
                  value={newOrder.address}
                  onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
                  placeholder="e.g. 402 Sanctuary Lane, Mumbai"
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

      {shipmentOrder && (
        <div className="fixed inset-0 z-50 bg-[#1C130E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const awb = shipment.awb.trim() || `AWB${Date.now().toString().slice(-9)}`;
              try {
                const shipmentRecords = JSON.parse(localStorage.getItem('tcl_shipments') || '{}');
                shipmentRecords[shipmentOrder] = { ...shipment, awb, createdAt: new Date().toISOString() };
                safeLocalStorageSet('tcl_shipments', shipmentRecords);
              } catch {}
              updateOrderStatus(shipmentOrder, 'Shipped');
              window.dispatchEvent(new Event('tcl-orders-updated'));
              setSavedMsg(`Shipment created for ${shipmentOrder}. AWB: ${awb}`);
              setShipmentOrder(null);
              setShipment({ courier: 'Shiprocket', awb: '', pickupDate: '' });
              setTimeout(() => setSavedMsg(''), 4000);
            }}
            className="bg-white border border-[#EFE8DB] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-card"
          >
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
              <div><h3 className="font-serif font-bold text-lg text-[#2C1E16]">Create Shipment</h3><p className="text-[11px] text-[#7A6B5D]">Order {shipmentOrder}</p></div>
              <button type="button" onClick={() => setShipmentOrder(null)} className="text-[#8C7A6B]">✕</button>
            </div>
            <label className="block text-xs font-bold text-[#2C1E16]">Courier
              <select value={shipment.courier} onChange={(event) => setShipment({ ...shipment, courier: event.target.value })} className="mt-1 w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg">
                <option>Shiprocket</option><option>Delhivery</option><option>Blue Dart</option><option>India Post</option>
              </select>
            </label>
            <label className="block text-xs font-bold text-[#2C1E16]">AWB / Tracking Number
              <input value={shipment.awb} onChange={(event) => setShipment({ ...shipment, awb: event.target.value })} placeholder="Leave blank to auto-generate" className="mt-1 w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg" />
            </label>
            <label className="block text-xs font-bold text-[#2C1E16]">Pickup date
              <input type="date" value={shipment.pickupDate} onChange={(event) => setShipment({ ...shipment, pickupDate: event.target.value })} className="mt-1 w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg" />
            </label>
            <button type="submit" className="w-full bg-[#B88B38] text-white font-bold text-xs py-3 rounded-xl">Create Shipment & Mark Shipped</button>
          </form>
        </div>
      )}

      {/* Dynamic Views */}
      {activeSubTab === 'orders' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">Live Orders List ({orders.length})</h3>
              <p className="text-[11px] text-[#7A6B5D]">Real-time dispatch, customer invoices & tracking</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#B88B38] text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer hover:bg-[#A37829]"
            >
              + Create Order
            </button>
          </div>

          <div className="overflow-x-auto max-w-full">
            <table className="min-w-[800px] w-full text-left text-xs text-[#2C1E16]">
              <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items Purchased</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF6F0] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#B88B38]">{ord.id}</td>
                    <td className="p-4 text-[11px] text-[#7A6B5D] whitespace-nowrap font-medium">
                      {ord.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <strong className="block text-[#2C1E16]">{ord.customerName}</strong>
                      <span className="text-[10px] text-[#7A6B5D] block">{ord.email}</span>
                      {ord.phone && <span className="text-[10px] text-[#7A6B5D] font-mono">📞 {ord.phone}</span>}
                    </td>
                    <td className="p-4 text-xs">
                      {ord.itemsList && Array.isArray(ord.itemsList) && ord.itemsList.length > 0 ? (
                        <div className="space-y-1 max-w-xs">
                          {ord.itemsList.map((it: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-[#232323]">
                              <span className="font-bold text-[#8B6F4E]">{it.quantity || 1}x</span>
                              <span className="font-medium truncate">{it.name}</span>
                              {it.fragrance && <span className="text-[10px] text-[#7D6F63] truncate">({it.fragrance})</span>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="max-w-xs text-xs font-medium text-[#232323]">
                          {ord.items && !ord.items.includes('Maharashtra') && !ord.items.includes('Pradesh')
                            ? ord.items
                            : '🕯️ Handcrafted Candle Order'}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-xs font-semibold">
                      {String(ord.paymentMethod || '').toLowerCase().includes('cod') || String(ord.status || '').toLowerCase().includes('cod') ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-xs">
                          <span>💵</span>
                          <span>COD</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs">
                          <span>💳</span>
                          <span>Razorpay</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ord.status === 'Delivered' || ord.status === 'DELIVERED' ? 'bg-[#2E6F40]/10 text-[#2E6F40]' :
                        ord.status === 'Shipped' || ord.status === 'SHIPPED' ? 'bg-[#8B6F4E]/10 text-[#8B6F4E]' :
                        ord.status === 'Processing' || ord.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-600' :
                        'bg-[#B93829]/10 text-[#B93829]'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedPackingOrder(getFullOrderDetails(ord));
                          setModalView('slip');
                        }}
                        className="px-2.5 py-1 bg-[#8B6F4E] text-white hover:bg-[#745A3D] rounded-lg font-bold text-[11px] cursor-pointer shadow-xs transition-all"
                        title="View Full Order Details"
                      >
                        👁️ View
                      </button>

                      <button
                        onClick={() => printOrderInvoice(getFullOrderDetails(ord), 'invoice')}
                        className="px-2 py-1 bg-[#2C1E16] text-white hover:bg-[#111111] rounded-lg font-bold text-[10px] cursor-pointer transition-all"
                        title="Print Official A4 Tax Invoice"
                      >
                        🖨️ Print
                      </button>

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
                        onClick={() => setShipmentOrder(ord.id)}
                        className="text-[#8B6F4E] font-bold hover:underline text-xs cursor-pointer px-1"
                      >
                        Shipment
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete Order ${ord.id}? This action cannot be undone.`)) {
                            deleteOrder(ord.id);
                            setSavedMsg(`Order ${ord.id} deleted.`);
                            setTimeout(() => setSavedMsg(''), 3000);
                          }
                        }}
                        className="text-[#B93829] font-bold hover:underline text-xs cursor-pointer px-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {orders.map((ord) => (
              <article key={ord.id} className="rounded-xl border border-[#EFE8DB] bg-[#FAF6F0] p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono font-bold text-[#B88B38]">{ord.id}</p>
                    <p className="text-[10px] text-[#7A6B5D]">{ord.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p className="font-bold text-[#2C1E16]">{ord.customerName}</p>
                    <p className="text-[11px] text-[#7A6B5D] break-all">{ord.email}</p>
                  </div>
                  <span className="text-xs font-bold">₹{ord.totalAmount.toLocaleString('en-IN')}.00</span>
                </div>
                <p className="text-xs text-[#7A6B5D]">{ord.items}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedPackingOrder(getFullOrderDetails(ord));
                      setModalView('slip');
                    }}
                    className="p-2 bg-[#8B6F4E] text-white text-xs font-bold rounded-lg text-center cursor-pointer"
                  >
                    👁️ View Details
                  </button>
                  <button
                    onClick={() => printOrderInvoice(getFullOrderDetails(ord), 'invoice')}
                    className="p-2 bg-[#2C1E16] text-white text-xs font-bold rounded-lg text-center cursor-pointer"
                  >
                    🖨️ Print Invoice
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <select
                    value={ord.status}
                    onChange={(event) => updateOrderStatus(ord.id, event.target.value)}
                    className="bg-white border border-[#EFE8DB] p-2 rounded-lg text-xs"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => setShipmentOrder(ord.id)}
                    className="rounded-lg border border-[#B88B38] text-[#B88B38] text-xs font-bold p-2"
                  >
                    Shipment
                  </button>
                </div>
              </article>
            ))}
          </div>
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
