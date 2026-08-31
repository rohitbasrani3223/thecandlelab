import React, { useState, useEffect } from 'react';
import { Card, Badge, SparklesIcon, Button, Input, useToast } from '../../design-system';
import { OrderDetailsModal } from './OrderDetailsModal';
import { TrackOrderModal } from '../common/TrackOrderModal';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { supabaseFetch } from '../../config/supabaseClient';
import { getApiUrl } from '../../config/api';

export interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  badgeVariant?: 'gold' | 'success' | 'warning' | 'error' | 'info' | 'pink';
  itemsSummary?: string;
  items?: Array<{ name: string; quantity: number; price: number; fragrance?: string; size?: string; wickType?: string }>;
  itemsList?: Array<{ name: string; quantity: number; price: number; fragrance?: string; size?: string; wickType?: string }>;
  totalAmount?: number | string;
  trackingNumber?: string;
  courier?: string;
  shippingAddress?: string;
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
}

type OrderStatusFilter = 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderHistoryTabProps {
  onNavigateToShop?: () => void;
}

export const OrderHistoryTab: React.FC<OrderHistoryTabProps> = ({ onNavigateToShop }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user?.email) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userEmailLower = user.email.trim().toLowerCase();
    const userKey = `thecandlelab_orders_${userEmailLower}`;

    // 1. Read Local Storage Cache for this strictly identified user
    let userLocalOrders: OrderItem[] = [];
    try {
      const saved = localStorage.getItem(userKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          userLocalOrders = parsed.map((o: any) => ({
            id: o.id || o.orderNumber,
            orderNumber: o.orderNumber || o.id,
            date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })),
            status: o.status || 'Processing',
            badgeVariant: getStatusBadgeVariant(o.status),
            itemsSummary: o.itemsSummary || (Array.isArray(o.items) ? o.items.map((i: any) => `${i.quantity || 1}x ${i.name}`).join(', ') : o.items) || 'Handcrafted Candle Formulations',
            items: Array.isArray(o.items) ? o.items : (o.itemsList || []),
            itemsList: Array.isArray(o.itemsList) ? o.itemsList : (o.items || []),
            totalAmount: typeof o.totalAmount === 'number' ? `₹${o.totalAmount.toLocaleString('en-IN')}.00` : (o.totalAmount || '₹0.00'),
            trackingNumber: o.trackingNumber,
            courier: o.courier || 'Blue Dart Express',
            shippingAddress: o.shippingAddress || o.address || '',
            customerName: o.customerName || user?.name || '',
            customerEmail: o.customerEmail || o.email || userEmailLower,
            paymentMethod: o.paymentMethod || 'Online',
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse user local orders:', e);
    }

    // 2. Fetch from Live Supabase Database
    let dbOrders: OrderItem[] = [];
    try {
      const liveOrders = await supabaseFetch<any[]>('orders', {
        query: `customer_email=eq.${encodeURIComponent(userEmailLower)}`,
      });

      if (Array.isArray(liveOrders) && liveOrders.length > 0) {
        dbOrders = liveOrders.map((o: any) => ({
          id: o.id || o.order_number,
          orderNumber: o.order_number || o.id,
          date: o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          status: o.order_status || 'Processing',
          badgeVariant: getStatusBadgeVariant(o.order_status),
          itemsSummary: 'Handcrafted Candle Formulations',
          items: [],
          itemsList: [],
          totalAmount: `₹${Number(o.total_amount || 0).toLocaleString('en-IN')}.00`,
          trackingNumber: o.tracking_number,
          courier: 'Blue Dart Express',
          shippingAddress: o.shipping_address || '',
          customerName: o.customer_name || user?.name || '',
          customerEmail: o.customer_email || userEmailLower,
          paymentMethod: o.payment_method || 'Online',
        }));
      }
    } catch (e) {
      // Supabase fetch fallback to API or local
      try {
        const res = await fetch(getApiUrl(`orders?email=${encodeURIComponent(userEmailLower)}`));
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            dbOrders = json.data.map((o: any) => ({
              id: o.id || o.orderNumber,
              orderNumber: o.orderNumber || o.id,
              date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''),
              status: o.status || 'Processing',
              badgeVariant: getStatusBadgeVariant(o.status),
              itemsSummary: o.itemsSummary || (Array.isArray(o.items) ? o.items.map((i: any) => i.name).join(', ') : ''),
              items: o.items || [],
              itemsList: o.items || [],
              totalAmount: typeof o.totalAmount === 'number' ? `₹${o.totalAmount.toLocaleString('en-IN')}.00` : (o.totalAmount || '₹0.00'),
              trackingNumber: o.trackingNumber,
              courier: 'Blue Dart Express',
              shippingAddress: o.shippingAddress || '',
              customerName: o.customerName || user?.name || '',
              customerEmail: o.customerEmail || userEmailLower,
              paymentMethod: o.paymentMethod || 'Online',
            }));
          }
        }
      } catch {}
    }

    // 3. Merge and strictly deduplicate by Order ID
    const combined = [...userLocalOrders, ...dbOrders];
    const uniqueOrders = Array.from(new Map(combined.map((it) => [it.orderNumber || it.id, it])).values());

    // Filter strictly to verify customer email matches if present
    const strictlyScoped = uniqueOrders.filter((o) => {
      if (!o.customerEmail) return true;
      return o.customerEmail.trim().toLowerCase() === userEmailLower;
    });

    setOrders(strictlyScoped);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const handleUpdate = () => {
      fetchOrders();
    };
    window.addEventListener('tcl-orders-updated', handleUpdate);
    return () => {
      window.removeEventListener('tcl-orders-updated', handleUpdate);
    };
  }, [user]);

  const getStatusBadgeVariant = (status?: string): 'gold' | 'success' | 'warning' | 'error' | 'info' | 'pink' => {
    const s = (status || '').toUpperCase();
    if (s.includes('DELIVER')) return 'success';
    if (s.includes('CANCEL')) return 'error';
    if (s.includes('SHIP') || s.includes('DISPATCH')) return 'info';
    if (s.includes('PENDING') || s.includes('COD')) return 'warning';
    return 'pink';
  };

  // 1-Click Reorder Action: Adds all items into the Cart
  const handleReorder = (ord: OrderItem) => {
    const items = ord.itemsList && ord.itemsList.length > 0
      ? ord.itemsList
      : (ord.items && ord.items.length > 0 ? ord.items : []);

    if (items.length === 0) {
      addToCart({
        id: `reorder-${ord.id}`,
        name: 'Handcrafted Candle Formulation',
        price: typeof ord.totalAmount === 'string' ? Number(ord.totalAmount.replace(/[^0-9.]/g, '')) || 999 : Number(ord.totalAmount) || 999,
        quantity: 1,
      });
    } else {
      items.forEach((it: any) => {
        addToCart({
          id: it.id || `reorder-${it.name.replace(/\s+/g, '-').toLowerCase()}`,
          name: it.name,
          price: Number(it.price) || 999,
          quantity: Number(it.quantity) || 1,
          fragrance: it.fragrance || '',
          size: it.size || '',
          wickType: it.wickType || '',
        });
      });
    }

    toast({
      type: 'luxury',
      title: 'Order Formulations Added to Cart!',
      description: 'Your favorite artisan candles are ready in your shopping bag.',
    });
  };

  // Cancel Order Action
  const handleCancelOrder = async (ord: OrderItem) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${ord.orderNumber}?`)) {
      return;
    }

    setCancellingOrderId(ord.id);
    const userEmailLower = (user?.email || '').trim().toLowerCase();
    const userKey = `thecandlelab_orders_${userEmailLower}`;

    try {
      // 1. Update in Supabase
      try {
        await supabaseFetch(`orders?order_number=eq.${encodeURIComponent(ord.orderNumber)}`, {
          method: 'PATCH',
          body: { order_status: 'Cancelled' },
        });
      } catch {}

      // 2. Update in Local Storage
      const saved = localStorage.getItem(userKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((o: any) =>
          (o.id === ord.id || o.orderNumber === ord.orderNumber) ? { ...o, status: 'Cancelled' } : o
        );
        localStorage.setItem(userKey, JSON.stringify(updated));
      }

      // Also update cms pool
      const cmsSaved = localStorage.getItem('tcl_cms_orders');
      if (cmsSaved) {
        const cmsParsed = JSON.parse(cmsSaved);
        const updatedCms = cmsParsed.map((o: any) =>
          (o.id === ord.id || o.orderNumber === ord.orderNumber) ? { ...o, status: 'Cancelled' } : o
        );
        localStorage.setItem('tcl_cms_orders', JSON.stringify(updatedCms));
      }

      toast({
        type: 'info',
        title: 'Order Cancelled Successfully',
        description: `Order #${ord.orderNumber} has been marked as Cancelled.`,
      });

      window.dispatchEvent(new Event('tcl-orders-updated'));
      fetchOrders();
    } catch (e) {
      toast({
        type: 'error',
        title: 'Cancellation Failed',
        description: 'Unable to cancel this order. Please reach out to customer concierge.',
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Filter and Search
  const filteredOrders = orders.filter((ord) => {
    // Search query filter
    const matchesSearch =
      !searchQuery.trim() ||
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.itemsSummary && ord.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Status tab filter
    const s = ord.status.toLowerCase();
    if (statusFilter === 'processing') return s.includes('process') || s.includes('placed') || s.includes('atelier');
    if (statusFilter === 'shipped') return s.includes('ship') || s.includes('dispatch') || s.includes('transit');
    if (statusFilter === 'delivered') return s.includes('deliver');
    if (statusFilter === 'cancelled') return s.includes('cancel');

    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADDCB] pb-4">
        <div>
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>SANCTUARY ORDER ARCHIVE</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#232323] mt-1">
            My Orders & Invoices
          </h2>
          <p className="text-xs text-[#7D6F63] mt-0.5">
            Showing verified purchases linked to <strong className="text-[#8B6F4E]">{user?.email}</strong>
          </p>
        </div>

        {/* Quick Track Any Order Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTrackingOrderId(orders[0]?.orderNumber || '')}
        >
          🔎 Track by Order ID
        </Button>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADDCB]">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by Order ID (e.g. TCL-XXXX) or candle name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#8B6F4E] font-bold hover:underline shrink-0"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Status Tabs Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: `All Orders (${orders.length})` },
            { id: 'processing', label: 'In Atelier / Processing' },
            { id: 'shipped', label: 'Dispatched / In-Transit' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as OrderStatusFilter)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#8B6F4E] text-white shadow-xs'
                  : 'bg-white text-[#5C5149] hover:bg-stone-100 border border-[#EADDCB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="text-center py-16 text-xs text-[#7D6F63] space-y-2">
          <div className="w-8 h-8 border-2 border-[#8B6F4E] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Retrieving your artisan order records...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card variant="bordered" padding="lg" className="bg-[#FFFFFF] border-[#EADDCB] rounded-3xl text-center py-12 space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-[#FAF7F2] border border-[#EADDCB] rounded-full flex items-center justify-center mx-auto text-[#8B6F4E]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#232323]">
              {searchQuery || statusFilter !== 'all' ? 'No Matching Orders Found' : 'No Orders Placed Yet'}
            </h3>
            <p className="text-xs text-[#7D6F63] max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter to locate your purchases.'
                : 'When you purchase our hand-poured soy candles, you can track live dispatch, request returns, and view itemized tax invoices here.'}
            </p>
          </div>
          {onNavigateToShop && (
            <Button variant="pink" size="md" onClick={onNavigateToShop}>
              Explore Sanctuary Fragrances
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const isProcessing = ord.status.toLowerCase().includes('process') || ord.status.toLowerCase().includes('placed');

            return (
              <Card key={ord.id} variant="bordered" padding="md" className="bg-white border-[#EADDCB] rounded-3xl space-y-3 shadow-card hover:border-[#8B6F4E]/50 transition-all">
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#EADDCB] pb-3 text-xs">
                  <div>
                    <span className="text-[#7D6F63] block text-[10px] uppercase font-bold tracking-wider">Order Reference</span>
                    <strong className="font-serif text-[#232323] text-base">{ord.orderNumber}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#7D6F63] text-xs font-medium">Placed on {ord.date}</span>
                    <Badge variant={ord.badgeVariant || getStatusBadgeVariant(ord.status)} size="sm">
                      {ord.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Items, Amount & Payment Mode Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1 text-xs">
                  <div className="space-y-1.5">
                    <p className="text-[#232323] font-medium leading-relaxed">{ord.itemsSummary}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      {/* Payment Method Badge */}
                      {String(ord.paymentMethod || '').toLowerCase().includes('cod') || String(ord.status || '').toLowerCase().includes('cod') ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-xs">
                          <span>💵</span>
                          <span>Cash on Delivery (COD)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs">
                          <span>💳</span>
                          <span>Razorpay Online (Paid)</span>
                        </span>
                      )}

                      {ord.trackingNumber && (
                        <span className="text-[#7D6F63] text-[11px]">
                          Courier: <strong>{ord.courier || 'Blue Dart'}</strong> • AWB: <code className="font-mono text-[#8B6F4E] font-bold">{ord.trackingNumber}</code>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right whitespace-nowrap">
                    <span className="text-[10px] text-[#7D6F63] uppercase font-bold block">
                      {String(ord.paymentMethod || '').toLowerCase().includes('cod') ? 'Amount Due on Delivery' : 'Total Amount Paid'}
                    </span>
                    <span className="text-lg font-bold text-[#8B6F4E] font-serif block">{ord.totalAmount}</span>
                  </div>
                </div>

                {/* Action Buttons Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#EADDCB]">
                  <div className="flex items-center gap-2">
                    {/* Live Tracker */}
                    <button
                      onClick={() => setTrackingOrderId(ord.orderNumber)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#8B6F4E] hover:bg-[#FDE8EF] border border-[#EADDCB] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>📍</span>
                      <span>Track Shipment</span>
                    </button>

                    {/* Reorder Formulations */}
                    <button
                      onClick={() => handleReorder(ord)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#232323] hover:bg-[#FDE8EF] border border-[#EADDCB] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>🔄</span>
                      <span>Reorder Formulations</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Cancel button if order is processing */}
                    {isProcessing && (
                      <button
                        onClick={() => handleCancelOrder(ord)}
                        disabled={cancellingOrderId === ord.id}
                        className="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        {cancellingOrderId === ord.id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}

                    {/* View Details Modal Trigger */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrderId(ord.id)}
                    >
                      👁️ Details & Tax Invoice
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal 1: Order Details & Tax Invoice */}
      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={Boolean(selectedOrderId)}
        onClose={() => setSelectedOrderId(null)}
      />

      {/* Modal 2: Dedicated Live Order Tracking */}
      {trackingOrderId && (
        <TrackOrderModal
          isOpen={Boolean(trackingOrderId)}
          onClose={() => setTrackingOrderId(null)}
          initialOrderId={trackingOrderId}
        />
      )}
    </div>
  );
};
