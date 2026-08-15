import { useState, useEffect } from 'react';
import { Drawer, Button, useToast } from '../../design-system';
import { ShippingProgressBar } from './ShippingProgressBar';
import { GiftWrapToggle } from './GiftWrapToggle';
import type { CartItem } from './CartItemRow';

export interface CartDrawerUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  onViewFullCart?: () => void;
  onCheckout?: () => void;
}

export const CartDrawerUpgrade: React.FC<CartDrawerUpgradeProps> = ({
  isOpen,
  onClose,
  onViewFullCart,
  onCheckout,
}) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [giftMsg, setGiftMsg] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('tcl_cart_items');
        setItems(saved ? JSON.parse(saved) : []);
      } catch {}
    };
    window.addEventListener('tcl-cart-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('tcl-cart-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleUpdateQty = (id: string, delta: number) => {
    const updated = items
      .map((item) => {
        if (item.id === id) {
          const q = item.quantity + delta;
          return q > 0 ? { ...item, quantity: q } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    setItems(updated);
    try {
      localStorage.setItem('tcl_cart_items', JSON.stringify(updated));
      window.dispatchEvent(new Event('tcl-cart-updated'));
    } catch {}
  };

  const handleRemove = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    try {
      localStorage.setItem('tcl_cart_items', JSON.stringify(updated));
      window.dispatchEvent(new Event('tcl-cart-updated'));
    } catch {}
    toast({ type: 'info', title: 'Item Removed' });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="md"
      title={`Your Shopping Bag (${items.reduce((s, i) => s + i.quantity, 0)})`}
      footer={
        <div className="space-y-3 font-sans">
          <div className="flex items-center justify-between text-sm font-bold text-[#1C1217]">
            <span>Subtotal</span>
            <span className="text-lg font-serif font-bold text-[#E87A96]">
              ₹{Math.round(subtotal)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                onClose();
                if (onViewFullCart) onViewFullCart();
              }}
            >
              View Full Bag
            </Button>
            <Button
              variant="pink"
              size="md"
              onClick={() => {
                onClose();
                if (onCheckout) {
                  onCheckout();
                } else {
                  window.location.hash = '#checkout';
                  window.dispatchEvent(new HashChangeEvent('hashchange'));
                }
              }}
            >
              Checkout Now →
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 font-sans">
        {/* Shipping Goal Bar */}
        <ShippingProgressBar currentSubtotal={subtotal} />

        {/* Gift Wrap Toggle */}
        <GiftWrapToggle
          isGiftWrapSelected={isGiftWrap}
          onToggleGiftWrap={setIsGiftWrap}
          giftMessage={giftMsg}
          onGiftMessageChange={setGiftMsg}
        />

        {/* Cart Items List */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#886C7B]">
              Your bag is currently empty.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#FFFFFF] border border-[#F5E8EE] rounded-2xl flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="w-12 h-12 bg-[#FFF6F8] text-xl rounded-xl flex items-center justify-center border border-[#F5E8EE] shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    '🕯️'
                  )}
                </div>

                <div className="flex-1 space-y-0.5 min-w-0">
                  <h5 className="text-xs font-bold text-[#1C1217] truncate">{item.name}</h5>
                  <span className="text-[10px] text-[#886C7B] block">
                    {item.size || '12 oz Glass'} • ₹{Math.round(item.price)}
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center border border-[#F5E8EE] rounded-full bg-[#FFF6F8]">
                      <button
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="px-2.5 py-0.5 text-xs font-bold text-[#1C1217] hover:text-[#E87A96]"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="px-2.5 py-0.5 text-xs font-bold text-[#1C1217] hover:text-[#E87A96]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1 shrink-0">
                  <span className="text-xs font-bold text-[#1C1217] block">
                    ₹{Math.round(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-[10px] text-[#BE123C] font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Drawer>
  );
};
