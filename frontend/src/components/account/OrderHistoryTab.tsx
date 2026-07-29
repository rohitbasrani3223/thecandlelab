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
  badgeVariant?: 'gold' | 'success' | 'warning' | 'error' | 'info';
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

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const storageKey = `thecandlelab_orders_${user?.email || 'guest'}`;
      let localOrders: OrderItem[] = [];

      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          localOrders = JSON.parse(saved);
        }
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
                date: o.date || new Date(o.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                status: o.status || 'PROCESSING',
                badgeVariant: o.status === 'DELIVERED' ? 'success' : 'gold',
                itemsSummary: o.itemsSummary || (Array.isArray(o.items) ? o.items.map((i: any) => i.name || i.title).join(', ') : 'Botanical Soy Candle'),
                items: o.items || [],
                totalAmount: typeof o.totalAmount === 'number' ? `₹${o.totalAmount.toLocaleString('en-IN')}` : o.totalAmount || '₹1,499.00',
                trackingNumber: o.trackingNumber,
              }));

              // Merge unique local and server orders
              const combined = [...fetchedOrders, ...localOrders];
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

      setOrders(localOrders);
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-4">
        <div>
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>ORDER ARCHIVE</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#2A1E17] mt-1">
            Order History & Tracking
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-[#8C7A6B]">
          Fetching your sanctuary order history...
        </div>
      ) : orders.length === 0 ? (
        <Card variant="bordered" padding="lg" className="bg-[#FAF6F0] text-center py-12 space-y-4">
          <div className="w-16 h-16 bg-[#F4EFE6] border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
            </svg>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#2A1E17]">No Orders Placed Yet</h3>
            <p className="text-xs text-[#8C7A6B]">
              You haven't placed any candle orders under <span className="font-semibold text-[#2A1E17]">{user?.email}</span>.
            </p>
          </div>

          {onNavigateToShop && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onNavigateToShop}
              className="mt-2"
            >
              Explore Boutique Catalogue →
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <Card
              key={ord.id}
              variant="bordered"
              padding="lg"
              className="bg-[#FAF6F0] space-y-3 hover:border-[#D4AF37] transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E5D9C5] pb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-serif font-bold text-base text-[#2A1E17]">{ord.id}</h4>
                    <Badge variant={ord.badgeVariant || 'gold'} size="sm">{ord.status}</Badge>
                  </div>
                  <span className="text-[11px] text-[#8C7A6B]">Placed on {ord.date}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-[#8C7A6B] block">Total Amount</span>
                  <span className="text-base font-bold text-[#2A1E17]">{ord.totalAmount}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <span className="text-[#69574A] italic font-light truncate max-w-md">
                  {ord.itemsSummary || 'Artisanal Candle Formulations'}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrderId(ord.id)}
                >
                  View Details →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Shared Order Details Inspector Modal */}
      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
};
