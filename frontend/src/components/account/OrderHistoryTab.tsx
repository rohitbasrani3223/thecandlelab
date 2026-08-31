import React, { useState, useEffect } from 'react';
import { Card, Badge, SparklesIcon, Button } from '../../design-system';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

export interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  badgeVariant?: 'gold' | 'success' | 'warning' | 'error' | 'info' | 'pink';
  itemsSummary?: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  totalAmount?: number | string;
  trackingNumber?: string;
}

interface OrderHistoryTabProps {
  onNavigateToShop?: () => void;
}

export const OrderHistoryTab: React.FC<OrderHistoryTabProps> = ({ onNavigateToShop }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    let allLocal: OrderItem[] = [];

    try {
      const storageKey = `thecandlelab_orders_${user?.email || 'guest'}`;
      const userSpecific = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const userOrders = JSON.parse(localStorage.getItem('tcl_user_orders') || '[]');
      const cmsOrders = JSON.parse(localStorage.getItem('tcl_cms_orders') || '[]');
      const allGlobalOrders = JSON.parse(localStorage.getItem('thecandlelab_orders_all') || '[]');

      const combinedRaw = [...userSpecific, ...userOrders, ...cmsOrders, ...allGlobalOrders];

      allLocal = combinedRaw.map((o: any) => ({
        id: o.id || o.orderNumber,
        orderNumber: o.orderNumber || o.id,
        date: o.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: o.status || 'Processing',
        badgeVariant: o.status === 'Delivered' || o.status === 'DELIVERED' ? 'success' : 'pink',
        itemsSummary: o.itemsSummary || (Array.isArray(o.items) ? o.items.map((i: any) => `${i.quantity || 1}x ${i.name}`).join(', ') : o.items) || 'Handcrafted Soy Candle',
        items: Array.isArray(o.items) ? o.items : o.itemsList || [],
        totalAmount: typeof o.totalAmount === 'number' ? `₹${o.totalAmount.toLocaleString('en-IN')}.00` : (o.totalAmount || '₹1,499.00'),
        trackingNumber: o.trackingNumber,
      }));
    } catch (e) {
      console.error('Failed to read local orders:', e);
    }

    try {
      if (user?.email) {
        const res = await fetch(getApiUrl(`orders?email=${encodeURIComponent(user.email)}`));
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            const fetchedOrders: OrderItem[] = data.data.map((o: any) => ({
              id: o.id || o.orderNumber,
              orderNumber: o.orderNumber || o.id,
              date: o.date || new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: o.status || 'Processing',
              badgeVariant: o.status === 'Delivered' || o.status === 'DELIVERED' ? 'success' : 'pink',
              itemsSummary: o.itemsSummary || (Array.isArray(o.items) ? o.items.map((i: any) => i.name || i.title).join(', ') : 'Botanical Soy Candle'),
              items: o.items || [],
              totalAmount: typeof o.totalAmount === 'number' ? `₹${o.totalAmount.toLocaleString('en-IN')}.00` : o.totalAmount || '₹1,499.00',
              trackingNumber: o.trackingNumber,
            }));

            const combined = [...allLocal, ...fetchedOrders];
            const uniqueOrders = Array.from(new Map(combined.map((item) => [item.id, item])).values());
            setOrders(uniqueOrders);
            setLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      // Fallback to local persistent orders
    }

    const uniqueLocal = Array.from(new Map(allLocal.map((item) => [item.id, item])).values());
    setOrders(uniqueLocal);
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

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-4">
        <div>
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>ORDER ARCHIVE</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#232323] mt-1">
            Order History & Invoices
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-[#7D6F63]">
          Fetching your sanctuary order history...
        </div>
      ) : orders.length === 0 ? (
        <Card variant="bordered" padding="lg" className="bg-[#FFFFFF] border-[#EADDCB] rounded-3xl text-center py-12 space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-[#FAF7F2] border border-[#EADDCB] rounded-full flex items-center justify-center mx-auto text-[#8B6F4E]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#232323]">No Orders Placed Yet</h3>
            <p className="text-xs text-[#7D6F63] max-w-sm mx-auto">
              When you purchase our hand-poured soy candles, you can track live dispatch and view itemized invoices here.
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
          {orders.map((ord) => (
            <Card key={ord.id} variant="bordered" padding="md" className="bg-white border-[#EADDCB] rounded-3xl space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#EADDCB] pb-2 text-xs">
                <div>
                  <span className="text-[#7D6F63] block text-[10px] uppercase font-bold">Order Number</span>
                  <strong className="font-serif text-[#232323] text-sm">{ord.orderNumber}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#7D6F63] text-[11px]">{ord.date}</span>
                  <Badge variant={ord.status === 'Delivered' || ord.status === 'DELIVERED' ? 'success' : 'pink'} size="sm">
                    {ord.status}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1 text-xs">
                <div className="space-y-1">
                  <p className="text-[#232323] font-medium">{ord.itemsSummary}</p>
                  {ord.trackingNumber && (
                    <span className="text-[#7D6F63] text-[11px] block">
                      Courier AWB: <code className="font-mono text-[#8B6F4E]">{ord.trackingNumber}</code>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-base font-bold text-[#232323] font-serif">{ord.totalAmount}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrderId(ord.id)}
                  >
                    👁️ View Details & Invoice
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={Boolean(selectedOrderId)}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
};
