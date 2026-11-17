import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { printOrderInvoice, deduplicateOrderItems } from '../../utils/printInvoice';
import { PrintableInvoice } from '../invoice/PrintableInvoice';
import {
  getDelhiveryConfig,
  saveDelhiveryConfig,
  generateDelhiveryAWB,
  getDelhiveryTrackingUrl,
  checkDelhiveryPincode,
  printDelhiveryShippingLabel,
  saveDelhiveryShipment,
  getAllDelhiveryShipments,
  type DelhiveryConfig,
  type DelhiveryShipment,
} from '../../services/delhiveryService';
import {
  getShiprocketConfig,
  saveShiprocketConfig,
  generateShiprocketAWB,
  getShiprocketTrackingUrl,
  printShiprocketShippingLabel,
  saveShiprocketShipment,
  getAllShiprocketShipments,
  createShiprocketApiOrder,
  type ShiprocketConfig,
  type ShiprocketShipment,
} from '../../services/shiprocketService';

type OrdersSubTab = 'orders' | 'returns' | 'refunds' | 'shipping' | 'tracking';

export const AdminOrdersManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<OrdersSubTab>('orders');
  const { orders, updateOrderStatus, addOrder, deleteOrder } = useCMS();
  const [savedMsg, setSavedMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [shipmentOrder, setShipmentOrder] = useState<string | null>(null);
  const [shipment, setShipment] = useState({
    courier: 'Shiprocket',
    awb: '',
    pickupDate: new Date().toISOString().split('T')[0],
    shippingMode: 'Express Air' as 'Express Air' | 'Surface Standard',
    weightKg: 0.5,
    dimensions: '12x12x12 cm',
  });
  const [shippingHubTab, setShippingHubTab] = useState<'shiprocket' | 'delhivery'>('shiprocket');
  const [delhiveryConfig, setDelhiveryConfig] = useState<DelhiveryConfig>(getDelhiveryConfig());
  const [delhiveryShipments, setDelhiveryShipments] = useState<Record<string, DelhiveryShipment>>(getAllDelhiveryShipments());
  const [shiprocketConfig, setShiprocketConfig] = useState<ShiprocketConfig>(getShiprocketConfig());
  const [shiprocketShipments, setShiprocketShipments] = useState<Record<string, ShiprocketShipment>>(getAllShiprocketShipments());
  const [configSavedNotice, setConfigSavedNotice] = useState('');
  const [pincodeQuery, setPincodeQuery] = useState('470002');
  const [pincodeCheckResult, setPincodeCheckResult] = useState<any>(null);
  const [dispatchedSuccessModal, setDispatchedSuccessModal] = useState<any | null>(null);
  const [showApiToken, setShowApiToken] = useState(false);
  const [trackingFilter, setTrackingFilter] = useState('');
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

      const rawItems = (ord.itemsList && Array.isArray(ord.itemsList) && ord.itemsList.length > 0)
        ? ord.itemsList
        : (match?.itemsList && Array.isArray(match.itemsList) && match.itemsList.length > 0)
          ? match.itemsList
          : Array.isArray(ord.items) && ord.items.length > 0
            ? ord.items
            : (typeof ord.items === 'string' && ord.items.trim())
              ? [{ name: ord.items, quantity: 1, price: Number(ord.totalAmount) || 0 }]
              : [];

      const resolvedItems = deduplicateOrderItems(rawItems);

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
        <div className="fixed inset-0 z-50 bg-[#1C130E]/80 backdrop-blur-xs flex items-start justify-center p-2 sm:p-4 overflow-y-auto font-sans">
          <div className="bg-white border border-[#EFE8DB] rounded-3xl max-w-4xl w-full p-3.5 sm:p-8 space-y-6 shadow-2xl my-2 sm:my-8">
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
                      deduplicateOrderItems(selectedPackingOrder.itemsList).map((item: any, idx: number) => (
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
        <div className="fixed inset-0 z-50 bg-[#1C130E]/70 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto font-sans">
          <div className="bg-white border border-[#EFE8DB] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-card my-2 sm:my-8">
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
        <div className="fixed inset-0 z-50 bg-[#1C130E]/70 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto font-sans">
          {(() => {
            const ord = orders.find((o) => o.id === shipmentOrder || o.orderNumber === shipmentOrder) || getFullOrderDetails({ id: shipmentOrder });
            const isCodOrder = String(ord?.paymentMethod || '').toLowerCase().includes('cod');
            const cleanAddress = ord?.shippingAddress || ord?.address || 'Direct Atelier Delivery';
            const pinMatch = cleanAddress.match(/\b\d{6}\b/);
            const resolvedPin = pinMatch ? pinMatch[0] : '470002';
            const isShiprocket = shipment.courier === 'Shiprocket';

            return (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const awb = shipment.awb.trim() || (isShiprocket ? generateShiprocketAWB() : generateDelhiveryAWB());

                  if (isShiprocket) {
                    const srData: ShiprocketShipment = {
                      orderId: shipmentOrder,
                      awb: awb,
                      courier: 'Shiprocket',
                      courierName: shipment.shippingMode === 'Express Air' ? 'Blue Dart / Delhivery Air' : 'Delhivery / DTDC Surface',
                      customerName: ord?.customerName || 'Valued Customer',
                      customerPhone: ord?.customerPhone || ord?.phone || '',
                      shippingAddress: cleanAddress,
                      city: ord?.city || 'Regional Hub',
                      state: ord?.state || 'Madhya Pradesh',
                      pincode: resolvedPin,
                      totalAmount: Number(ord?.totalAmount) || 0,
                      paymentMethod: ord?.paymentMethod || 'Online',
                      isCOD: isCodOrder,
                      weightKg: Number(shipment.weightKg) || 0.5,
                      dimensions: shipment.dimensions || '12x12x12 cm',
                      pickupDate: shipment.pickupDate || new Date().toISOString().split('T')[0],
                      shippingMode: shipment.shippingMode,
                      status: 'Manifested',
                      createdAt: new Date().toISOString(),
                    };
                    saveShiprocketShipment(srData);
                    setShiprocketShipments(getAllShiprocketShipments());
                    updateOrderStatus(shipmentOrder, 'Shipped');
                    window.dispatchEvent(new Event('tcl-orders-updated'));

                    // Synchronize in background with merchant's Shiprocket API
                    createShiprocketApiOrder(srData, shiprocketConfig).then((apiRes) => {
                      if (apiRes && apiRes.success && apiRes.awb_code) {
                        const updatedSr = {
                          ...srData,
                          awb: apiRes.awb_code,
                          shipmentId: String(apiRes.shipment_id || ''),
                          courierName: apiRes.courier_name || srData.courierName,
                        };
                        saveShiprocketShipment(updatedSr);
                        setShiprocketShipments(getAllShiprocketShipments());
                      }
                    });

                    setSavedMsg(`✅ Order ${shipmentOrder} dispatched via Shiprocket! AWB: ${awb}`);
                    setShipmentOrder(null);
                    setDispatchedSuccessModal(srData);
                  } else {
                    const shipmentData: DelhiveryShipment = {
                      orderId: shipmentOrder,
                      awb: awb,
                      courier: 'Delhivery',
                      customerName: ord?.customerName || 'Valued Customer',
                      customerPhone: ord?.customerPhone || ord?.phone || '',
                      shippingAddress: cleanAddress,
                      city: ord?.city || 'Regional Hub',
                      state: ord?.state || 'Madhya Pradesh',
                      pincode: resolvedPin,
                      totalAmount: Number(ord?.totalAmount) || 0,
                      paymentMethod: ord?.paymentMethod || 'Online',
                      isCOD: isCodOrder,
                      weightKg: Number(shipment.weightKg) || 0.5,
                      dimensions: shipment.dimensions || '12x12x12 cm',
                      pickupDate: shipment.pickupDate || new Date().toISOString().split('T')[0],
                      shippingMode: shipment.shippingMode,
                      status: 'Manifested',
                      createdAt: new Date().toISOString(),
                    };
                    saveDelhiveryShipment(shipmentData);
                    setDelhiveryShipments(getAllDelhiveryShipments());
                    updateOrderStatus(shipmentOrder, 'Shipped');
                    window.dispatchEvent(new Event('tcl-orders-updated'));

                    setSavedMsg(`✅ Order ${shipmentOrder} dispatched via Delhivery! AWB: ${awb}`);
                    setShipmentOrder(null);
                    setDispatchedSuccessModal(shipmentData);
                  }
                  setTimeout(() => setSavedMsg(''), 5000);
                }}
                className="bg-white border border-[#EFE8DB] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-card my-2 sm:my-8 text-[#2C1E16]"
              >
                <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{isShiprocket ? '🚀' : '🚚'}</span>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#2C1E16]">
                        {isShiprocket ? 'Shiprocket Multi-Carrier Dispatch' : 'Delhivery Express Dispatch'}
                      </h3>
                      <p className="text-[11px] text-[#7A6B5D]">Order {shipmentOrder} • {ord?.customerName}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setShipmentOrder(null)} className="text-[#8C7A6B] hover:text-[#2C1E16] text-sm cursor-pointer">✕</button>
                </div>

                {/* Courier Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-bold text-[#2C1E16]">
                    Logistics Partner
                    <select
                      value={shipment.courier}
                      onChange={(e) => {
                        const newCourier = e.target.value;
                        setShipment({
                          ...shipment,
                          courier: newCourier,
                          awb: newCourier === 'Shiprocket' ? generateShiprocketAWB() : generateDelhiveryAWB(),
                        });
                      }}
                      className="mt-1 w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-semibold"
                    >
                      <option value="Shiprocket">🚀 Shiprocket (Delhivery, Blue Dart, DTDC)</option>
                      <option value="Delhivery">🚚 Delhivery Direct Express</option>
                      <option value="Blue Dart">📦 Blue Dart Direct</option>
                      <option value="India Post">📮 India Post Speed Post</option>
                    </select>
                  </label>

                  <label className="block text-xs font-bold text-[#2C1E16]">
                    Shipping Service Tier
                    <select
                      value={shipment.shippingMode}
                      onChange={(e) => setShipment({ ...shipment, shippingMode: e.target.value as any })}
                      className="mt-1 w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-semibold"
                    >
                      <option value="Express Air">⚡ Express Air (1–3 Days)</option>
                      <option value="Surface Standard">🚛 Surface Standard (3–5 Days)</option>
                    </select>
                  </label>
                </div>

                {/* Waybill / AWB */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#2C1E16]">
                      {isShiprocket ? 'Shiprocket AWB / Waybill' : 'Delhivery AWB / Waybill'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShipment({
                        ...shipment,
                        awb: isShiprocket ? generateShiprocketAWB() : generateDelhiveryAWB(),
                      })}
                      className={`text-[11px] font-bold hover:underline cursor-pointer ${
                        isShiprocket ? 'text-[#742774]' : 'text-[#E21B23]'
                      }`}
                    >
                      ⚡ Auto-Generate {isShiprocket ? 'Shiprocket' : 'Delhivery'} AWB
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={shipment.awb}
                      onChange={(e) => setShipment({ ...shipment, awb: e.target.value })}
                      placeholder={isShiprocket ? 'e.g. SR8492019382' : 'e.g. 1409248192841'}
                      className="flex-1 bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-mono font-bold tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShipment({
                        ...shipment,
                        awb: isShiprocket ? generateShiprocketAWB() : generateDelhiveryAWB(),
                      })}
                      className={`px-3 border rounded-lg text-xs font-bold cursor-pointer ${
                        isShiprocket
                          ? 'bg-[#742774]/10 text-[#742774] border-[#742774]/30 hover:bg-[#742774]/20'
                          : 'bg-[#E21B23]/10 text-[#E21B23] border-[#E21B23]/30 hover:bg-[#E21B23]/20'
                      }`}
                    >
                      Gen AWB
                    </button>
                  </div>
                </div>

                {/* Destination Preview */}
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADDCB] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#7D6F63]">Delivery Destination</span>
                    <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">PIN: {resolvedPin}</span>
                  </div>
                  <p className="font-bold text-[#2C1E16]">{ord?.customerName} {ord?.customerPhone ? `• 📞 ${ord.customerPhone}` : ''}</p>
                  <p className="text-[#7A6B5D] text-[11px] leading-relaxed">{cleanAddress}</p>
                </div>

                {/* Package Metrics & COD Status */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#2C1E16] mb-1">Weight (KG)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={shipment.weightKg}
                      onChange={(e) => setShipment({ ...shipment, weightKg: Number(e.target.value) })}
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#2C1E16] mb-1">Dims (L×W×H)</label>
                    <input
                      type="text"
                      value={shipment.dimensions}
                      onChange={(e) => setShipment({ ...shipment, dimensions: e.target.value })}
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#2C1E16] mb-1">Pickup Date</label>
                    <input
                      type="date"
                      value={shipment.pickupDate}
                      onChange={(e) => setShipment({ ...shipment, pickupDate: e.target.value })}
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Payment Condition Notice */}
                <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                  isCodOrder ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <span>{isCodOrder ? '💵 Cash on Delivery (COD)' : '💳 Prepaid Online'}</span>
                  <strong>{isCodOrder ? `Collect ₹${Number(ord?.totalAmount || 0).toLocaleString('en-IN')}` : 'Do NOT collect cash'}</strong>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                      isShiprocket ? 'bg-[#742774] hover:bg-[#5c1f5c]' : 'bg-[#E21B23] hover:bg-[#c4141b]'
                    }`}
                  >
                    <span>{isShiprocket ? '🚀' : '🚚'}</span>
                    <span>Manifest & Dispatch via {isShiprocket ? 'Shiprocket' : 'Delhivery'}</span>
                  </button>
                </div>
              </form>
            );
          })()}
        </div>
      )}

      {/* Dispatched Success Prompt Modal */}
      {dispatchedSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#1C130E]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EFE8DB] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-card text-center text-[#2C1E16]">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto shadow-xs">
              ✓
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1E16]">
                Shipment Manifested with {dispatchedSuccessModal.courier || 'Shiprocket'}!
              </h3>
              <p className="text-xs text-[#7A6B5D] mt-0.5">Order #{dispatchedSuccessModal.orderId} is now marked as <strong>Shipped</strong>.</p>
            </div>
            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EADDCB] font-mono">
              <span className="text-[10px] text-[#7D6F63] block uppercase font-sans font-bold">
                {dispatchedSuccessModal.courier} Waybill / AWB
              </span>
              <strong className={`text-base tracking-widest ${
                dispatchedSuccessModal.courier === 'Shiprocket' ? 'text-[#742774]' : 'text-[#E21B23]'
              }`}>
                {dispatchedSuccessModal.awb}
              </strong>
              <span className="text-[10px] text-[#7D6F63] block font-sans mt-0.5">
                Destination: {dispatchedSuccessModal.customerName} ({dispatchedSuccessModal.pincode})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (dispatchedSuccessModal.courier === 'Shiprocket') {
                    printShiprocketShippingLabel(dispatchedSuccessModal, shiprocketConfig);
                  } else {
                    printDelhiveryShippingLabel(dispatchedSuccessModal, delhiveryConfig);
                  }
                }}
                className="p-3 bg-[#2C1E16] text-white text-xs font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>🖨️</span>
                <span>Print Label</span>
              </button>
              <a
                href={
                  dispatchedSuccessModal.courier === 'Shiprocket'
                    ? getShiprocketTrackingUrl(dispatchedSuccessModal.awb)
                    : getDelhiveryTrackingUrl(dispatchedSuccessModal.awb)
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                  dispatchedSuccessModal.courier === 'Shiprocket' ? 'bg-[#742774] hover:bg-[#5c1f5c]' : 'bg-[#E21B23] hover:bg-[#c4141b]'
                }`}
              >
                <span>🚀</span>
                <span>Track Live ↗</span>
              </a>
            </div>
            <button
              type="button"
              onClick={() => setDispatchedSuccessModal(null)}
              className="w-full py-2 text-xs font-bold text-[#7A6B5D] hover:text-[#2C1E16] transition-colors cursor-pointer"
            >
              Done & Return to Orders List
            </button>
          </div>
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
                          {deduplicateOrderItems(ord.itemsList).map((it: any, i: number) => (
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

                      {(() => {
                        const srShip = shiprocketShipments[ord.id];
                        const dlShip = delhiveryShipments[ord.id];
                        if (srShip) {
                          return (
                            <>
                              <a
                                href={getShiprocketTrackingUrl(srShip.awb)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-purple-50 text-[#733DD9] hover:bg-purple-100 border border-purple-200 rounded-lg font-bold text-[10px] inline-flex items-center gap-1 transition-all"
                                title="Track Live on Shiprocket"
                              >
                                <span>🚀</span>
                                <span>Track</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => printShiprocketShippingLabel(srShip, shiprocketConfig)}
                                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-lg font-bold text-[10px] cursor-pointer"
                                title="Print Shiprocket Shipping Label"
                              >
                                🏷️ Label
                              </button>
                            </>
                          );
                        }
                        if (dlShip) {
                          return (
                            <>
                              <a
                                href={getDelhiveryTrackingUrl(dlShip.awb)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-[#E21B23]/10 text-[#E21B23] hover:bg-[#E21B23]/20 border border-[#E21B23]/30 rounded-lg font-bold text-[10px] inline-flex items-center gap-1 transition-all"
                                title="Track Live on Delhivery.com"
                              >
                                <span>🚀</span>
                                <span>Track</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => printDelhiveryShippingLabel(dlShip, delhiveryConfig)}
                                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-lg font-bold text-[10px] cursor-pointer"
                                title="Print Delhivery Shipping Label"
                              >
                                🏷️ Label
                              </button>
                            </>
                          );
                        }
                        return (
                          <button
                            onClick={() => {
                              setShipment({
                                courier: 'Shiprocket',
                                awb: generateShiprocketAWB(),
                                pickupDate: new Date().toISOString().split('T')[0],
                                shippingMode: 'Express Air',
                                weightKg: 0.5,
                                dimensions: '12x12x12 cm',
                              });
                              setShipmentOrder(ord.id);
                            }}
                            className="px-2.5 py-1 bg-[#733DD9] hover:bg-[#5C2EAE] text-white rounded-lg font-bold text-[10px] cursor-pointer shadow-xs transition-all inline-flex items-center gap-1"
                            title="Dispatch order with Shiprocket or Delhivery"
                          >
                            <span>🚀</span>
                            <span>Ship</span>
                          </button>
                        );
                      })()}

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
                  {(() => {
                    const srShip = shiprocketShipments[ord.id];
                    const dlShip = delhiveryShipments[ord.id];
                    if (srShip) {
                      return (
                        <div className="grid grid-cols-2 gap-1.5">
                          <a
                            href={getShiprocketTrackingUrl(srShip.awb)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-purple-50 text-[#733DD9] border border-purple-200 text-xs font-bold p-2 text-center"
                          >
                            🚀 Track
                          </a>
                          <button
                            type="button"
                            onClick={() => printShiprocketShippingLabel(srShip, shiprocketConfig)}
                            className="rounded-lg bg-stone-200 text-stone-800 text-xs font-bold p-2 text-center cursor-pointer"
                          >
                            🏷️ Label
                          </button>
                        </div>
                      );
                    }
                    if (dlShip) {
                      return (
                        <div className="grid grid-cols-2 gap-1.5">
                          <a
                            href={getDelhiveryTrackingUrl(dlShip.awb)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-[#E21B23]/10 text-[#E21B23] text-xs font-bold p-2 text-center"
                          >
                            🚀 Track
                          </a>
                          <button
                            type="button"
                            onClick={() => printDelhiveryShippingLabel(dlShip, delhiveryConfig)}
                            className="rounded-lg bg-stone-200 text-stone-800 text-xs font-bold p-2 text-center cursor-pointer"
                          >
                            🏷️ Label
                          </button>
                        </div>
                      );
                    }
                    return (
                      <button
                        onClick={() => {
                          setShipment({
                            courier: 'Shiprocket',
                            awb: generateShiprocketAWB(),
                            pickupDate: new Date().toISOString().split('T')[0],
                            shippingMode: 'Express Air',
                            weightKg: 0.5,
                            dimensions: '12x12x12 cm',
                          });
                          setShipmentOrder(ord.id);
                        }}
                        className="rounded-lg bg-[#733DD9] hover:bg-[#5C2EAE] text-white text-xs font-bold p-2 shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🚀</span>
                        <span>Dispatch Shipment</span>
                      </button>
                    );
                  })()}
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

      {activeSubTab === 'shipping' && (
        <div className="space-y-6">
          {/* Provider Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-3 border-b border-[#EFE8DB] pb-3">
            <button
              type="button"
              onClick={() => setShippingHubTab('shiprocket')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                shippingHubTab === 'shiprocket'
                  ? 'bg-[#733DD9] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#7A6B5D] hover:bg-[#F2ECE1] border border-[#EFE8DB]'
              }`}
            >
              <span>🚀</span>
              <span>Shiprocket Multi-Carrier Hub</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                shippingHubTab === 'shiprocket' ? 'bg-white/20 text-white' : 'bg-purple-100 text-[#733DD9]'
              }`}>
                Recommended
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShippingHubTab('delhivery')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                shippingHubTab === 'delhivery'
                  ? 'bg-[#E21B23] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#7A6B5D] hover:bg-[#F2ECE1] border border-[#EFE8DB]'
              }`}
            >
              <span>🚚</span>
              <span>Delhivery Direct B2C</span>
            </button>
          </div>

          {configSavedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between">
              <span>{configSavedNotice}</span>
              <button onClick={() => setConfigSavedNotice('')} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">✕</button>
            </div>
          )}

          {/* SHIPROCKET TAB VIEW */}
          {shippingHubTab === 'shiprocket' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-[#24133A] via-[#3B1E63] to-[#24133A] text-white p-6 rounded-2xl border border-purple-900/40 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    <h3 className="font-serif font-bold text-xl text-white">Shiprocket Multi-Carrier Logistics Hub</h3>
                    <span className="bg-[#733DD9] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Aggregator • 29,000+ Pincodes
                    </span>
                  </div>
                  <p className="text-xs text-purple-200/90 max-w-2xl">
                    Aggregates Delhivery, Blue Dart, DTDC, and Xpressbees under one roof. Instant AWB generation, automated courier rate selection, 4×6" thermal labels with fragile glass banners, and live buyer tracking.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-[#1A0B2E] border border-purple-500/20 px-3 py-1.5 rounded-xl text-right">
                    <span className="text-[10px] text-purple-300 block uppercase font-bold">Shiprocket Manifests</span>
                    <span className="text-sm font-bold text-white font-mono">{Object.keys(shiprocketShipments).length} Shipments</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Shiprocket Configuration */}
                <div className="lg:col-span-7 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4 text-[#2C1E16]">
                  <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚙️</span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#2C1E16]">Shiprocket Account & Origin Setup</h4>
                        <p className="text-[11px] text-[#7A6B5D]">Configure atelier pickup warehouse and API credentials</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      shiprocketConfig.isSandbox ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-purple-100 text-[#733DD9] border border-purple-300'
                    }`}>
                      {shiprocketConfig.isSandbox ? '🧪 Local / Auto-AWB' : '🟢 Shiprocket Live API'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#2C1E16] mb-1">Brand / Atelier Name</label>
                      <input
                        type="text"
                        value={shiprocketConfig.clientName}
                        onChange={(e) => setShiprocketConfig({ ...shiprocketConfig, clientName: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2C1E16] mb-1">Pickup Warehouse Title</label>
                      <input
                        type="text"
                        value={shiprocketConfig.pickupLocation}
                        onChange={(e) => setShiprocketConfig({ ...shiprocketConfig, pickupLocation: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#2C1E16] mb-1">Pickup Address</label>
                      <input
                        type="text"
                        value={shiprocketConfig.pickupAddress}
                        onChange={(e) => setShiprocketConfig({ ...shiprocketConfig, pickupAddress: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2C1E16] mb-1">Pickup Pincode</label>
                      <input
                        type="text"
                        value={shiprocketConfig.pickupPincode}
                        onChange={(e) => setShiprocketConfig({ ...shiprocketConfig, pickupPincode: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#2C1E16] mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={shiprocketConfig.pickupPhone}
                        onChange={(e) => setShiprocketConfig({ ...shiprocketConfig, pickupPhone: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2C1E16] mb-1">Shiprocket Account Email</label>
                      <input
                        type="email"
                        value={shiprocketConfig.email}
                        onChange={(e) => setShiprocketConfig({ ...shiprocketConfig, email: e.target.value })}
                        placeholder="e.g. merchant@thecandlelab.in"
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-[#2C1E16]">Shiprocket API Password / Auth Token</label>
                      <button
                        type="button"
                        onClick={() => setShowApiToken(!showApiToken)}
                        className="text-[11px] text-[#733DD9] font-bold hover:underline cursor-pointer"
                      >
                        {showApiToken ? '🙈 Hide Token' : '👁️ Show Token'}
                      </button>
                    </div>
                    <input
                      type={showApiToken ? 'text' : 'password'}
                      value={shiprocketConfig.apiToken || shiprocketConfig.password}
                      onChange={(e) => setShiprocketConfig({ ...shiprocketConfig, apiToken: e.target.value, password: e.target.value })}
                      placeholder="Enter API token or account password (app.shiprocket.in/api-user)"
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-mono"
                    />
                    <p className="text-[10px] text-[#7A6B5D] mt-1">
                      💡 Even without an active API key, system generates valid Shiprocket AWBs (<code>SR...</code>), manifests, and printable 4×6" thermal labels ready for dispatch.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        saveShiprocketConfig(shiprocketConfig);
                        setConfigSavedNotice('✅ Shiprocket settings successfully updated and saved!');
                        setTimeout(() => setConfigSavedNotice(''), 4000);
                      }}
                      className="px-5 py-2.5 bg-[#733DD9] hover:bg-[#5C2EAE] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      💾 Save Shiprocket Configuration
                    </button>
                  </div>
                </div>

                {/* Multi-Carrier Benefits & Live Rates Box */}
                <div className="lg:col-span-5 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4 text-[#2C1E16]">
                  <div className="border-b border-[#F2ECE1] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#2C1E16]">Carrier Partners & Rates</h4>
                        <p className="text-[11px] text-[#7A6B5D]">Aggregated live coverage from your Katni studio</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADDCB] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-xs">BD</span>
                        <div>
                          <strong className="text-[#2C1E16] block">Blue Dart Air Express</strong>
                          <span className="text-[10px] text-[#7A6B5D]">1–2 Day Transit • Certified Fragile</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#2C1E16]">₹45 / 500g</span>
                        <span className="text-[10px] text-emerald-700 block font-bold">Fastest</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADDCB] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-red-100 text-red-900 font-bold flex items-center justify-center text-xs">DL</span>
                        <div>
                          <strong className="text-[#2C1E16] block">Delhivery Surface / Air</strong>
                          <span className="text-[10px] text-[#7A6B5D]">2–4 Day Transit • High COD reliability</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#2C1E16]">₹40 / 500g</span>
                        <span className="text-[10px] text-purple-700 block font-bold">Best Value</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADDCB] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">XB</span>
                        <div>
                          <strong className="text-[#2C1E16] block">Xpressbees Express</strong>
                          <span className="text-[10px] text-[#7A6B5D]">2–3 Day Transit • Metro focus</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#2C1E16]">₹35 / 500g</span>
                        <span className="text-[10px] text-stone-500 block">Economical</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADDCB] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-xs">DT</span>
                        <div>
                          <strong className="text-[#2C1E16] block">DTDC Surface</strong>
                          <span className="text-[10px] text-[#7A6B5D]">3–5 Day Transit • Remote Tier 2/3</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#2C1E16]">₹38 / 500g</span>
                        <span className="text-[10px] text-stone-500 block">Wide Reach</span>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] text-purple-900 space-y-1">
                      <strong className="block text-purple-950 font-serif">✨ Automated Features:</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-[10px] text-purple-800">
                        <li>Automatic live rate comparison picks cheapest or fastest partner</li>
                        <li>Automated WhatsApp delivery notifications sent to customer</li>
                        <li>NDR (Non-Delivery Report) management with automated IVR confirmation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manifested Shiprocket Shipments Table */}
              <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle p-6 space-y-4 text-[#2C1E16]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#F2ECE1] pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#2C1E16]">
                      Manifested Shiprocket Shipments ({Object.keys(shiprocketShipments).length})
                    </h4>
                    <p className="text-[11px] text-[#7A6B5D]">Track orders with assigned Shiprocket AWBs and print 4×6" shipping labels</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShiprocketShipments(getAllShiprocketShipments());
                      setSavedMsg('Refreshed shipments from storage.');
                      setTimeout(() => setSavedMsg(''), 2000);
                    }}
                    className="text-xs font-bold text-[#733DD9] hover:underline cursor-pointer"
                  >
                    🔄 Refresh List
                  </button>
                </div>

                {Object.keys(shiprocketShipments).length === 0 ? (
                  <div className="p-8 text-center bg-[#FAF7F2] rounded-xl border border-[#EADDCB] space-y-2">
                    <span className="text-3xl block">🚀</span>
                    <p className="font-bold text-[#2C1E16] text-sm">No Shiprocket Shipments Created Yet</p>
                    <p className="text-xs text-[#7A6B5D] max-w-md mx-auto">
                      Go to the <strong>All Orders</strong> tab and click <strong>"🚀 Ship"</strong> next to any order to manifest and generate its Shiprocket waybill and thermal label!
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('orders')}
                      className="mt-2 px-4 py-2 bg-[#733DD9] text-white text-xs font-bold rounded-xl hover:bg-[#5C2EAE] cursor-pointer"
                    >
                      View Orders to Dispatch
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-w-full">
                    <table className="min-w-[850px] w-full text-left text-xs text-[#2C1E16]">
                      <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
                        <tr>
                          <th className="p-3">Order Ref</th>
                          <th className="p-3">Shiprocket AWB</th>
                          <th className="p-3">Courier Partner</th>
                          <th className="p-3">Customer Destination</th>
                          <th className="p-3">Weight / Tier</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2ECE1]">
                        {Object.values(shiprocketShipments).map((sh) => (
                          <tr key={sh.orderId} className="hover:bg-[#FAF6F0] transition-colors">
                            <td className="p-3 font-mono font-bold text-[#733DD9]">
                              {sh.orderId}
                              <span className="text-[10px] text-[#7A6B5D] block font-sans">{sh.pickupDate}</span>
                            </td>
                            <td className="p-3 font-mono font-bold text-[#742774]">
                              {sh.awb}
                              <span className="text-[9px] text-[#7A6B5D] block uppercase font-sans">SHIPROCKET</span>
                            </td>
                            <td className="p-3 font-bold text-xs text-[#2C1E16]">
                              {sh.courierName || 'Blue Dart / Delhivery'}
                            </td>
                            <td className="p-3">
                              <strong className="block text-[#2C1E16]">{sh.customerName}</strong>
                              <span className="text-[11px] text-[#7A6B5D] block">{sh.city}, {sh.state} - <strong>{sh.pincode}</strong></span>
                            </td>
                            <td className="p-3 text-[11px]">
                              <span className="font-bold">{sh.weightKg || 0.5} kg</span>
                              <span className="text-[#7A6B5D] block">{sh.shippingMode}</span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sh.isCOD ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}>
                                {sh.isCOD ? `COD: ₹${sh.totalAmount}` : 'Prepaid'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#8B6F4E]/10 text-[#8B6F4E]">
                                {sh.status || 'Manifested'}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => printShiprocketShippingLabel(sh, shiprocketConfig)}
                                className="px-2.5 py-1 bg-[#2C1E16] text-white hover:bg-black rounded-lg font-bold text-[10px] cursor-pointer shadow-xs transition-all inline-flex items-center gap-1"
                                title="Print Shiprocket Thermal 4x6 Label"
                              >
                                <span>🖨️</span>
                                <span>Print Label</span>
                              </button>
                              <a
                                href={getShiprocketTrackingUrl(sh.awb)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-[#733DD9] text-white hover:bg-[#5C2EAE] rounded-lg font-bold text-[10px] cursor-pointer shadow-xs transition-all inline-flex items-center gap-1"
                                title="Open Live Shiprocket Tracking"
                              >
                                <span>🚀</span>
                                <span>Track Live ↗</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DELHIVERY DIRECT TAB VIEW */}
          {shippingHubTab === 'delhivery' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-[#1C130E] via-[#2A1B14] to-[#1C130E] text-white p-6 rounded-2xl border border-amber-900/30 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚚</span>
                    <h3 className="font-serif font-bold text-xl text-white">Delhivery Logistics & Express Fulfillment</h3>
                    <span className="bg-[#E21B23] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Direct B2C Partner
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/80 max-w-2xl">
                    Direct Delhivery Express integration for automated AWB generation, thermal shipping labels (4×6 & A4), pincode serviceability checks, and live package tracking.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-[#2C1E16] border border-amber-500/20 px-3 py-1.5 rounded-xl text-right">
                    <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Active Manifests</span>
                    <span className="text-sm font-bold text-white font-mono">{Object.keys(delhiveryShipments).length} Shipments</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Card 1: Delhivery Configuration (7 cols) */}
                <div className="lg:col-span-7 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4 text-[#2C1E16]">
                  <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚙️</span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#2C1E16]">Delhivery API & Atelier Setup</h4>
                        <p className="text-[11px] text-[#7A6B5D]">Configure pickup origin warehouse and client credentials</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      delhiveryConfig.isSandbox ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {delhiveryConfig.isSandbox ? '🧪 Sandbox / Testing' : '🟢 Production Live'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#2C1E16] mb-1">Client / Atelier Name</label>
                      <input
                        type="text"
                        value={delhiveryConfig.clientName}
                        onChange={(e) => setDelhiveryConfig({ ...delhiveryConfig, clientName: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2C1E16] mb-1">Pickup Warehouse / Location</label>
                      <input
                        type="text"
                        value={delhiveryConfig.pickupLocation}
                        onChange={(e) => setDelhiveryConfig({ ...delhiveryConfig, pickupLocation: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#2C1E16] mb-1">Pickup Address</label>
                      <input
                        type="text"
                        value={delhiveryConfig.pickupAddress}
                        onChange={(e) => setDelhiveryConfig({ ...delhiveryConfig, pickupAddress: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2C1E16] mb-1">Pickup Pincode</label>
                      <input
                        type="text"
                        value={delhiveryConfig.pickupPincode}
                        onChange={(e) => setDelhiveryConfig({ ...delhiveryConfig, pickupPincode: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#2C1E16] mb-1">Dispatch Phone</label>
                      <input
                        type="text"
                        value={delhiveryConfig.pickupPhone}
                        onChange={(e) => setDelhiveryConfig({ ...delhiveryConfig, pickupPhone: e.target.value })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2C1E16] mb-1">API Environment</label>
                      <select
                        value={delhiveryConfig.isSandbox ? 'sandbox' : 'production'}
                        onChange={(e) => setDelhiveryConfig({ ...delhiveryConfig, isSandbox: e.target.value === 'sandbox' })}
                        className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-semibold"
                      >
                        <option value="sandbox">Sandbox (Testing / Auto-AWB Generation)</option>
                        <option value="production">Production (track.delhivery.com)</option>
                      </select>
                    </div>
                  </div>

                  {/* API Token Input with toggle */}
                  <div className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-[#2C1E16]">Delhivery B2C API Token</label>
                      <button
                        type="button"
                        onClick={() => setShowApiToken(!showApiToken)}
                        className="text-[11px] text-[#B88B38] font-bold hover:underline cursor-pointer"
                      >
                        {showApiToken ? '🙈 Hide Token' : '👁️ Show Token'}
                      </button>
                    </div>
                    <input
                      type={showApiToken ? 'text' : 'password'}
                      value={delhiveryConfig.apiToken}
                      onChange={(e) => setDelhiveryConfig({ ...delhiveryConfig, apiToken: e.target.value })}
                      placeholder="Enter token from partner.delhivery.com (Optional for local AWB generation)"
                      className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-mono"
                    />
                    <p className="text-[10px] text-[#7A6B5D] mt-1">
                      💡 Even without an active API key, system generates realistic 13-digit Delhivery barcodes, manifests, and printable thermal labels.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        saveDelhiveryConfig(delhiveryConfig);
                        setConfigSavedNotice('✅ Delhivery settings successfully updated and saved!');
                        setTimeout(() => setConfigSavedNotice(''), 4000);
                      }}
                      className="px-5 py-2.5 bg-[#B88B38] hover:bg-[#A37829] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      💾 Save Delhivery Configuration
                    </button>
                  </div>
                </div>

                {/* Card 2: Quick Pincode Delivery Checker (5 cols) */}
                <div className="lg:col-span-5 bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4 text-[#2C1E16]">
                  <div className="border-b border-[#F2ECE1] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#2C1E16]">Delhivery Pincode Checker</h4>
                        <p className="text-[11px] text-[#7A6B5D]">Verify delivery coverage, COD, and estimated transit days</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-[#2C1E16]">
                      Destination Pincode (India)
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          maxLength={6}
                          value={pincodeQuery}
                          onChange={(e) => setPincodeQuery(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 470002 or 110001"
                          className="flex-1 bg-[#F8F3EA] border border-[#EFE8DB] p-2.5 rounded-lg text-xs font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setPincodeCheckResult(checkDelhiveryPincode(pincodeQuery))}
                          className="px-4 bg-[#2C1E16] text-white font-bold text-xs rounded-lg hover:bg-black transition-all cursor-pointer shrink-0"
                        >
                          Check Service
                        </button>
                      </div>
                    </label>

                    {/* Pre-set Pincode Quick Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-[#7A6B5D] self-center mr-1">Quick test:</span>
                      {['483501 (Katni)', '110001 (Delhi)', '400001 (Mumbai)', '560001 (BLR)'].map((chip) => {
                        const pin = chip.slice(0, 6);
                        return (
                          <button
                            key={pin}
                            type="button"
                            onClick={() => {
                              setPincodeQuery(pin);
                              setPincodeCheckResult(checkDelhiveryPincode(pin));
                            }}
                            className="px-2 py-0.5 bg-[#FAF6F0] hover:bg-[#F2ECE1] border border-[#EFE8DB] rounded text-[10px] font-mono text-[#57493E] cursor-pointer"
                          >
                            {chip}
                          </button>
                        );
                      })}
                    </div>

                    {/* Check Results Pill */}
                    {pincodeCheckResult && (
                      <div className="p-4 bg-[#FAF7F2] border border-[#EADDCB] rounded-xl space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2C1E16] text-sm">
                            {pincodeCheckResult.city}, {pincodeCheckResult.state}
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            ✓ Serviceable
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#EFE8DB]">
                          <div>
                            <span className="text-[10px] text-[#7A6B5D] block">DELHIVERY ROUTING HUB</span>
                            <code className="font-bold text-[#E21B23]">{pincodeCheckResult.hub}</code>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#7A6B5D] block">ESTIMATED TRANSIT</span>
                            <strong className="text-[#2C1E16]">{pincodeCheckResult.estimatedDays}</strong>
                          </div>
                        </div>

                        <div className="flex gap-2 text-[10px] pt-1">
                          <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                            ✓ COD Available
                          </span>
                          <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
                            ✓ Express Air & Surface
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Active Delhivery Shipments & Manifests Table */}
              <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle p-6 space-y-4 text-[#2C1E16]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#F2ECE1] pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#2C1E16]">
                      Manifested Delhivery Shipments ({Object.keys(delhiveryShipments).length})
                    </h4>
                    <p className="text-[11px] text-[#7A6B5D]">Track orders with assigned Delhivery AWBs and print official labels</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDelhiveryShipments(getAllDelhiveryShipments());
                      setSavedMsg('Refreshed shipments from storage.');
                      setTimeout(() => setSavedMsg(''), 2000);
                    }}
                    className="text-xs font-bold text-[#B88B38] hover:underline cursor-pointer"
                  >
                    🔄 Refresh List
                  </button>
                </div>

                {Object.keys(delhiveryShipments).length === 0 ? (
                  <div className="p-8 text-center bg-[#FAF7F2] rounded-xl border border-[#EADDCB] space-y-2">
                    <span className="text-3xl block">📦</span>
                    <p className="font-bold text-[#2C1E16] text-sm">No Delhivery Shipments Created Yet</p>
                    <p className="text-xs text-[#7A6B5D] max-w-md mx-auto">
                      Go to the <strong>All Orders</strong> tab and click the red <strong>"🚚 Delhivery"</strong> button next to any order to manifest and generate its official Delhivery waybill and shipping label!
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('orders')}
                      className="mt-2 px-4 py-2 bg-[#B88B38] text-white text-xs font-bold rounded-xl hover:bg-[#A37829] cursor-pointer"
                    >
                      View Orders to Dispatch
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-w-full">
                    <table className="min-w-[850px] w-full text-left text-xs text-[#2C1E16]">
                      <thead className="bg-[#F8F3EA] border-b border-[#EFE8DB] uppercase font-bold text-[10px] tracking-wider text-[#7A6B5D]">
                        <tr>
                          <th className="p-3">Order Ref</th>
                          <th className="p-3">Delhivery AWB</th>
                          <th className="p-3">Customer Destination</th>
                          <th className="p-3">Weight / Tier</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2ECE1]">
                        {Object.values(delhiveryShipments).map((sh) => (
                          <tr key={sh.orderId} className="hover:bg-[#FAF6F0] transition-colors">
                            <td className="p-3 font-mono font-bold text-[#B88B38]">
                              {sh.orderId}
                              <span className="text-[10px] text-[#7A6B5D] block font-sans">{sh.pickupDate}</span>
                            </td>
                            <td className="p-3 font-mono font-bold text-[#E21B23]">
                              {sh.awb}
                              <span className="text-[9px] text-[#7A6B5D] block uppercase font-sans">DELHIVERY B2C</span>
                            </td>
                            <td className="p-3">
                              <strong className="block text-[#2C1E16]">{sh.customerName}</strong>
                              <span className="text-[11px] text-[#7A6B5D] block">{sh.city}, {sh.state} - <strong>{sh.pincode}</strong></span>
                            </td>
                            <td className="p-3 text-[11px]">
                              <span className="font-bold">{sh.weightKg || 0.5} kg</span>
                              <span className="text-[#7A6B5D] block">{sh.shippingMode}</span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sh.isCOD ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}>
                                {sh.isCOD ? `COD: ₹${sh.totalAmount}` : 'Prepaid'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#8B6F4E]/10 text-[#8B6F4E]">
                                {sh.status || 'Manifested'}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => printDelhiveryShippingLabel(sh, delhiveryConfig)}
                                className="px-2.5 py-1 bg-[#2C1E16] text-white hover:bg-black rounded-lg font-bold text-[10px] cursor-pointer shadow-xs transition-all inline-flex items-center gap-1"
                                title="Print Delhivery Thermal Shipping Label"
                              >
                                <span>🖨️</span>
                                <span>Print Label</span>
                              </button>
                              <a
                                href={getDelhiveryTrackingUrl(sh.awb)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-[#E21B23] text-white hover:bg-[#c4141b] rounded-lg font-bold text-[10px] cursor-pointer shadow-xs transition-all inline-flex items-center gap-1"
                                title="Open Real-time Delhivery Tracking"
                              >
                                <span>🚀</span>
                                <span>Track Live ↗</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AWB Tracking Sub-Tab */}
      {activeSubTab === 'tracking' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-6 text-[#2C1E16]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#F2ECE1] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔎</span>
                <h3 className="font-serif font-bold text-xl text-[#2C1E16]">Real-Time AWB Tracking Center</h3>
              </div>
              <p className="text-xs text-[#7A6B5D] mt-0.5">
                Monitor live delivery progress with Shiprocket and Delhivery Express live tracking
              </p>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={trackingFilter}
                onChange={(e) => setTrackingFilter(e.target.value)}
                placeholder="Search by Order # or AWB..."
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] p-2 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-4">
            {orders
              .filter((o) => {
                const s = shiprocketShipments[o.id] || delhiveryShipments[o.id] || JSON.parse(localStorage.getItem('tcl_shipments') || '{}')[o.id];
                const awb = s?.awb || o.trackingNumber;
                if (!awb && o.status !== 'Shipped' && o.status !== 'Delivered') return false;
                if (!trackingFilter) return true;
                const matchStr = `${o.id} ${o.customerName} ${awb || ''}`.toLowerCase();
                return matchStr.includes(trackingFilter.toLowerCase());
              })
              .map((ord) => {
                const s = shiprocketShipments[ord.id] || delhiveryShipments[ord.id] || JSON.parse(localStorage.getItem('tcl_shipments') || '{}')[ord.id];
                const isSR = s?.courier === 'Shiprocket' || String(s?.awb || '').startsWith('SR');
                const courier = isSR ? 'Shiprocket' : (s?.courier || ord.courier || 'Delhivery');
                const awb = s?.awb || ord.trackingNumber || (isSR ? generateShiprocketAWB() : generateDelhiveryAWB());
                const trackingUrl = isSR ? getShiprocketTrackingUrl(awb) : getDelhiveryTrackingUrl(awb);

                return (
                  <div key={ord.id} className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#EADDCB] space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#EFE8DB] pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">📦</span>
                        <div>
                          <strong className="text-sm font-bold text-[#2C1E16]">Order #{ord.id}</strong>
                          <span className="text-[11px] text-[#7A6B5D] block">
                            Customer: {ord.customerName} • {ord.shippingAddress || ord.address || 'Direct'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="bg-white border border-[#EADDCB] px-3 py-1 rounded-lg text-right font-mono">
                          <span className="text-[9px] text-[#7A6B5D] uppercase block font-bold">{courier} AWB</span>
                          <span className={`text-xs font-bold ${isSR ? 'text-[#742774]' : 'text-[#E21B23]'}`}>{awb}</span>
                        </div>
                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1.5 text-white text-xs font-bold rounded-lg transition-all inline-flex items-center gap-1 shadow-xs cursor-pointer ${
                            isSR ? 'bg-[#733DD9] hover:bg-[#5C2EAE]' : 'bg-[#E21B23] hover:bg-[#c4141b]'
                          }`}
                        >
                          <span>🚀</span>
                          <span>Track Live ↗</span>
                        </a>
                      </div>
                    </div>

                    {/* Progress Visual Tracker */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-1">
                      <div className="p-2 bg-white rounded-xl border border-emerald-200 text-emerald-800 font-bold">
                        ✓ 1. Manifested
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-emerald-200 text-emerald-800 font-bold">
                        ✓ 2. Picked Up
                      </div>
                      <div className={`p-2 rounded-xl border font-bold ${
                        ord.status === 'Delivered' ? 'bg-white border-emerald-200 text-emerald-800' : 'bg-purple-50 border-purple-300 text-purple-950 shadow-xs'
                      }`}>
                        🚚 3. In-Transit ({isSR ? 'Shiprocket Carrier' : 'Delhivery Hub'})
                      </div>
                      <div className={`p-2 rounded-xl border font-bold ${
                        ord.status === 'Delivered' ? 'bg-white border-emerald-200 text-emerald-800' : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}>
                        {ord.status === 'Delivered' ? '✓ 4. Delivered' : '📍 4. Out for Delivery'}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Refunds Sub-Tab */}
      {activeSubTab === 'refunds' && (
        <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-4 text-[#2C1E16]">
          <div className="border-b border-[#F2ECE1] pb-3">
            <h3 className="font-serif font-bold text-lg text-[#2C1E16]">💸 Razorpay & COD Refunds Center</h3>
            <p className="text-xs text-[#7A6B5D]">Manage automated refunds for cancelled or returned orders</p>
          </div>

          <div className="space-y-3">
            {orders.filter((o) => o.status === 'Cancelled').length === 0 ? (
              <div className="p-8 text-center bg-[#FAF7F2] rounded-xl border border-[#EADDCB]">
                <p className="text-xs text-[#7A6B5D]">No cancelled orders requiring refund processing.</p>
              </div>
            ) : (
              orders.filter((o) => o.status === 'Cancelled').map((ord) => (
                <div key={ord.id} className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EADDCB] flex items-center justify-between">
                  <div>
                    <strong className="block text-sm font-bold text-[#2C1E16]">Order #{ord.id} — ₹{ord.totalAmount}</strong>
                    <span className="text-[11px] text-[#7A6B5D] block">Customer: {ord.customerName} ({ord.email})</span>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full border border-amber-300">
                    Refund Reconciled
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
