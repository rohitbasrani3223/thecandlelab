import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../design-system';
import { safeLocalStorageSet } from '../utils/storage';

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
  addToCart: (item: Partial<CartItem> & { id: string; name: string; price: number }) => void;
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

  useEffect(() => {
    safeLocalStorageSet(CART_STORAGE_KEY, cartItems);
    window.dispatchEvent(new Event('tcl-cart-updated'));
  }, [cartItems]);

  useEffect(() => {
    safeLocalStorageSet(SAVED_STORAGE_KEY, savedForLater);
  }, [savedForLater]);

  // Listen to external cart updates
  useEffect(() => {
    const handleCartSync = () => {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          setCartItems(JSON.parse(saved));
        }
      } catch {}
    };
    window.addEventListener('tcl-cart-updated', handleCartSync);
    return () => window.removeEventListener('tcl-cart-updated', handleCartSync);
  }, []);

  const addToCart = (item: Partial<CartItem> & { id: string; name: string; price: number }) => {
    const qty = item.quantity || 1;

    setCartItems((prev) => {
      const index = prev.findIndex(
        (i) => (i.variantId && i.variantId === item.variantId) || (i.id === item.id && i.fragrance === item.fragrance && i.size === item.size)
      );

      if (index > -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], quantity: updated[index].quantity + qty };
        return updated;
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
        return [...prev, newItem];
      }
    });

    const variantLabel = [item.fragrance, item.size].filter(Boolean).join(' • ');
    toast({
      type: 'luxury',
      title: 'Added to Shopping Bag',
      description: variantLabel ? `${qty}x ${item.name} — ${variantLabel}` : `${qty}x ${item.name}`,
    });
  };

  const updateQuantity = (id: string, delta: number, variantId?: string) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if ((variantId && item.variantId === variantId) || item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (id: string, variantId?: string) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        if (variantId && item.variantId) {
          return item.variantId !== variantId;
        }
        return item.id !== id;
      })
    );
  };

  const saveForLater = (item: CartItem) => {
    removeFromCart(item.id, item.variantId);
    setSavedForLater((prev) => [...prev, item]);
    toast({
      type: 'info',
      title: 'Saved for Later',
      description: `${item.name} moved to your wishlist for later.`,
    });
  };

  const moveToCart = (item: CartItem) => {
    setSavedForLater((prev) => prev.filter((i) => i.id !== item.id));
    addToCart(item);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
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
