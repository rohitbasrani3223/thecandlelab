import { useState, useEffect } from 'react';
import { Drawer, Button, useToast } from '../../design-system';
import { ShippingProgressBar } from './ShippingProgressBar';
import { GiftWrapToggle } from './GiftWrapToggle';
import type { CartItem } from './CartItemRow';



export interface CartDrawerUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  onViewFullCart?: () => void;
}


export const CartDrawerUpgrade: React.FC<CartDrawerUpgradeProps> = ({
  isOpen,
  onClose,
  onViewFullCart,
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
    setItems((prev) => prev.filter((i) => i.id !== id));
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
          <div className="flex items-center justify-between text-sm font-bold text-[#2A1E17]">
            <span>Subtotal</span>
            <span className="text-lg font-serif font-bold text-[#D4AF37]">
              ${subtotal.toFixed(2)}
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
              variant="gold"
              size="md"
              onClick={() => {
                onClose();
                toast({ type: 'luxury', title: 'Proceeding to Checkout...' });
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
            <div className="py-12 text-center text-xs text-[#8C7A6B]">
              Your bag is currently empty.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md flex items-center justify-between gap-3"
              >
                <div className="w-12 h-12 bg-[#2A1E17] text-xl rounded-xs flex items-center justify-center border border-[#4A3B32] shrink-0">
                  🕯️
                </div>

                <div className="flex-1 space-y-0.5">
                  <h5 className="text-xs font-bold text-[#2A1E17]">{item.name}</h5>
                  <span className="text-[10px] text-[#8C7A6B] block">
                    {item.size} • ${item.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center border border-[#E5D9C5] rounded-xs bg-[#FAF6F0]">
                      <button
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="px-2 py-0.5 text-xs font-bold text-[#2A1E17]"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="px-2 py-0.5 text-xs font-bold text-[#2A1E17]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-xs font-bold text-[#2A1E17] block">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-[10px] text-[#B33A3A] font-bold hover:underline"
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
