import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, ProductVariant } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === product.id &&
              item.variant?.id === variant?.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }

          const newItem: CartItem = {
            id: `${product.id}-${variant?.id ?? "default"}-${Date.now()}`,
            productId: product.id,
            product,
            variant,
            quantity,
            price: variant?.price ?? product.price,
          };

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    { name: "tcl-cart" }
  )
);

// Wishlist Store
interface WishlistStore {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  clearWishlist: () => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) =>
        set((state) => ({
          items: [...state.items, productId],
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),

      toggleItem: (productId) => {
        const { items } = get();
        if (items.includes(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      clearWishlist: () => set({ items: [] }),

      isWishlisted: (productId) => get().items.includes(productId),
    }),
    { name: "tcl-wishlist" }
  )
);

// UI Store
interface UIStore {
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isCustomizerOpen: boolean;
  isFragranceQuizOpen: boolean;
  isBundleBuilderOpen: boolean;
  isCorporateOrdersOpen: boolean;
  isLoyaltyOpen: boolean;
  isAIChatOpen: boolean;
  isVoiceSearchOpen: boolean;
  isPOSBillingOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  openFragranceQuiz: () => void;
  closeFragranceQuiz: () => void;
  openBundleBuilder: () => void;
  closeBundleBuilder: () => void;
  openCorporateOrders: () => void;
  closeCorporateOrders: () => void;
  openLoyalty: () => void;
  closeLoyalty: () => void;
  openAIChat: () => void;
  closeAIChat: () => void;
  toggleAIChat: () => void;
  openVoiceSearch: () => void;
  closeVoiceSearch: () => void;
  openPOSBilling: () => void;
  closePOSBilling: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isCustomizerOpen: false,
  isFragranceQuizOpen: false,
  isBundleBuilderOpen: false,
  isCorporateOrdersOpen: false,
  isLoyaltyOpen: false,
  isAIChatOpen: false,
  isVoiceSearchOpen: false,
  isPOSBillingOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openCustomizer: () => set({ isCustomizerOpen: true }),
  closeCustomizer: () => set({ isCustomizerOpen: false }),
  openFragranceQuiz: () => set({ isFragranceQuizOpen: true }),
  closeFragranceQuiz: () => set({ isFragranceQuizOpen: false }),
  openBundleBuilder: () => set({ isBundleBuilderOpen: true }),
  closeBundleBuilder: () => set({ isBundleBuilderOpen: false }),
  openCorporateOrders: () => set({ isCorporateOrdersOpen: true }),
  closeCorporateOrders: () => set({ isCorporateOrdersOpen: false }),
  openLoyalty: () => set({ isLoyaltyOpen: true }),
  closeLoyalty: () => set({ isLoyaltyOpen: false }),
  openAIChat: () => set({ isAIChatOpen: true }),
  closeAIChat: () => set({ isAIChatOpen: false }),
  toggleAIChat: () => set((state) => ({ isAIChatOpen: !state.isAIChatOpen })),
  openVoiceSearch: () => set({ isVoiceSearchOpen: true }),
  closeVoiceSearch: () => set({ isVoiceSearchOpen: false }),
  openPOSBilling: () => set({ isPOSBillingOpen: true }),
  closePOSBilling: () => set({ isPOSBillingOpen: false }),
}));

// Compare Store
interface CompareStore {
  items: Product[];
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  isCompared: (productId: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleCompare: (product) => {
        const { items } = get();
        const exists = items.some((p) => p.id === product.id);
        if (exists) {
          set({ items: items.filter((p) => p.id !== product.id) });
        } else {
          if (items.length >= 3) {
            set({ items: [...items.slice(1), product] });
          } else {
            set({ items: [...items, product] });
          }
        }
      },
      clearCompare: () => set({ items: [] }),
      isCompared: (productId) => get().items.some((p) => p.id === productId),
    }),
    { name: "tcl-compare" }
  )
);

