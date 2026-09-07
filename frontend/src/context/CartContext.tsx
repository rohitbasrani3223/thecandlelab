import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../design-system';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  fragrance?: string;
  size?: string;
  color?: string;
  wickType?: string;
  sku?: string;
  variantId?: string;
  giftPackaging?: boolean;
  customMessage?: string;
  inStock?: boolean;
}

export interface CartContextType {
  cartItems: CartItem[];
  savedForLater: CartItem[];
  addToCart: (
    item: Partial<CartItem> & { id: string; name: string; price: number },
    options?: { openDrawer?: boolean; silent?: boolean }
  ) => void;
  updateQuantity: (id: string, delta: number, variantId?: string) => void;
  removeFromCart: (id: string, variantId?: string) => void;
  saveForLater: (item: CartItem) => void;
  moveToCart: (item: CartItem) => void;
  clearCart: () => void;
  subtotal: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tcl_cart_items';
const SAVED_STORAGE_KEY = 'tcl_saved_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cross-tab sync only (avoids intra-tab re-entrancy loops)
  useEffect(() => {
    const handleCrossTabSync = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          setCartItems(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === SAVED_STORAGE_KEY && e.newValue) {
        try {
          setSavedForLater(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleCrossTabSync);
    return () => window.removeEventListener('storage', handleCrossTabSync);
  }, []);

  const addToCart = (
    item: Partial<CartItem> & { id: string; name: string; price: number },
    options?: { openDrawer?: boolean; silent?: boolean }
  ) => {
    const qty = item.quantity || 1;

    setCartItems((prev) => {
      const index = prev.findIndex(
        (i) => (i.variantId && i.variantId === item.variantId) || (i.id === item.id && i.fragrance === item.fragrance && i.size === item.size)
      );

      let updated: CartItem[];
      if (index > -1) {
        updated = [...prev];
        updated[index] = { ...updated[index], quantity: updated[index].quantity + qty };
      } else {
        const newItem: CartItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: qty,
          image: item.image,
          fragrance: item.fragrance,
          size: item.size,
          color: item.color,
          wickType: item.wickType,
          sku: item.sku,
          variantId: item.variantId,
          giftPackaging: item.giftPackaging,
          customMessage: item.customMessage,
          inStock: item.inStock ?? true,
        };
        updated = [...prev, newItem];
      }

      // Synchronous write to localStorage to guarantee zero race condition
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {}

      return updated;
    });

    // Notify all other components immediately
    window.dispatchEvent(new Event('tcl-cart-updated'));

    if (!options?.silent) {
      const variantLabel = [item.fragrance, item.size].filter(Boolean).join(' • ');
      toast({
        type: 'luxury',
        title: 'Added to Shopping Bag',
        description: variantLabel ? `${qty}x ${item.name} — ${variantLabel}` : `${qty}x ${item.name}`,
      });
    }

    // Auto-open Cart Drawer on Add to Cart (unless openDrawer: false)
    if (options?.openDrawer !== false) {
      window.dispatchEvent(new Event('tcl-open-cart'));
    }
  };

  const updateQuantity = (id: string, delta: number, variantId?: string) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) => {
          if ((variantId && item.variantId === variantId) || item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);

      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    window.dispatchEvent(new Event('tcl-cart-updated'));
  };

  const removeFromCart = (id: string, variantId?: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => {
        if (variantId && item.variantId) {
          return item.variantId !== variantId;
        }
        return item.id !== id;
      });
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    window.dispatchEvent(new Event('tcl-cart-updated'));
  };

  const saveForLater = (item: CartItem) => {
    removeFromCart(item.id, item.variantId);
    setSavedForLater((prev) => {
      const updated = [...prev, item];
      try {
        localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    toast({
      type: 'info',
      title: 'Saved for Later',
      description: `${item.name} moved to your wishlist for later.`,
    });
  };

  const moveToCart = (item: CartItem) => {
    setSavedForLater((prev) => {
      const updated = prev.filter((i) => i.id !== item.id);
      try {
        localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    addToCart(item);
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
    window.dispatchEvent(new Event('tcl-cart-updated'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedForLater,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLater,
        moveToCart,
        clearCart,
        subtotal,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
