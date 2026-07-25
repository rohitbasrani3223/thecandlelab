"use client";

import React, { createContext, useContext, useState } from "react";

export interface ScentNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface CandleProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  category: string;
  collections: string[];
  waxType: "Soy Wax" | "Beeswax" | "Coconut Wax" | "Paraffin Blend";
  wickType: "Cotton Wick" | "Wooden Crackling Wick";
  burnTimeHours: number;
  weightGrams: number;
  fragranceNotes: ScentNotes;
  fragranceStrength: 1 | 2 | 3 | 4 | 5;
  roomSize: "Small (Bedroom)" | "Medium (Living Room)" | "Large (Open Space)";
  careInstructions: string[];
  ingredients: string[];
  isVegan: boolean;
  isHandmade: boolean;
  isEcoFriendly: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  stock: number;
  sellerId: string;
  sellerName: string;
  description: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  iconSymbol: string;
  productCount?: number;
  isFeatured?: boolean;
}

export interface CustomCandleConfig {
  jarVessel: { id: string; name: string; colorHex: string; price: number };
  waxType: { id: string; name: string; price: number };
  fragranceOil: { id: string; name: string; top: string; middle: string; base: string };
  waxColor: { id: string; name: string; hex: string };
  wickType: { id: string; name: string; price: number };
  customLabelText: string;
  giftBox: boolean;
  totalPrice: number;
}

export interface CartItem {
  product: CandleProduct;
  quantity: number;
  selectedSize?: string;
  isGiftWrapped?: boolean;
  giftMessage?: string;
  customConfig?: CustomCandleConfig;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  date: string;
  messages: string[];
}

interface StoreContextType {
  // Collections
  collections: CollectionItem[];
  addCollection: (col: Omit<CollectionItem, "id">) => void;
  updateCollection: (id: string, col: Partial<CollectionItem>) => void;
  deleteCollection: (id: string) => void;

  // Products
  products: CandleProduct[];
  addProduct: (product: Omit<CandleProduct, "id">) => void;
  updateProduct: (id: string, product: Partial<CandleProduct>) => void;
  deleteProduct: (id: string) => void;

  // Cart & Saved For Later
  cart: CartItem[];
  savedForLater: CartItem[];
  addToCart: (product: CandleProduct, quantity?: number, giftWrap?: boolean, giftMessage?: string, customConfig?: CustomCandleConfig) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  saveForLater: (productId: string) => void;
  moveToCartFromSaved: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Compare Engine
  compareList: CandleProduct[];
  toggleCompare: (product: CandleProduct) => void;
  clearCompare: () => void;

  // Bundle Builder
  bundleItems: CandleProduct[];
  addBundleItem: (product: CandleProduct) => void;
  removeBundleItem: (productId: string) => void;
  clearBundle: () => void;

  // User & Loyalty System
  activeRole: "customer" | "seller" | "admin";
  setActiveRole: (role: "customer" | "seller" | "admin") => void;
  loyaltyPoints: number;
  loyaltyTier: "Silver" | "Gold" | "Platinum";
  walletBalance: number;
  referralCode: string;
  supportTickets: SupportTicket[];
  addSupportTicket: (subject: string, initialMsg: string) => void;

  // Search & Settings & Theme
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: "col-1",
    name: "Scented Candles",
    slug: "scented-candles",
    description: "Aromatherapy infused luxury candles for serene living",
    bannerImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
    iconSymbol: "🕯️",
    isFeatured: true
  },
  {
    id: "col-2",
    name: "Floral Collection",
    slug: "floral-collection",
    description: "Hand-poured floral bouquets of Jasmine, Rose & Lavender",
    bannerImage: "https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=1200&q=80",
    iconSymbol: "🌸",
    isFeatured: true
  },
  {
    id: "col-3",
    name: "Vanilla Collection",
    slug: "vanilla-collection",
    description: "Warm Madagascar vanilla bean & caramel gourmand blends",
    bannerImage: "https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=1200&q=80",
    iconSymbol: "🍦",
    isFeatured: true
  },
  {
    id: "col-4",
    name: "Coffee Collection",
    slug: "coffee-collection",
    description: "Rich roasted Arabica & dark espresso morning candles",
    bannerImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    iconSymbol: "☕",
    isFeatured: true
  },
  {
    id: "col-5",
    name: "Festive Collection",
    slug: "festive-collection",
    description: "Spiced cinnamon, glowing amber & holiday celebration lights",
    bannerImage: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1200&q=80",
    iconSymbol: "🎄",
    isFeatured: true
  },
  {
    id: "col-6",
    name: "Gift Boxes",
    slug: "gift-boxes",
    description: "Curated luxury gift hampers with customized gold ribbon",
    bannerImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
    iconSymbol: "🎁",
    isFeatured: true
  },
  {
    id: "col-7",
    name: "Home Decor Candles",
    slug: "home-decor",
    description: "Sculptural minimalist candles that double as art pieces",
    bannerImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    iconSymbol: "🏡",
    isFeatured: false
  },
  {
    id: "col-8",
    name: "Luxury Collection",
    slug: "luxury-collection",
    description: "Rare botanical essences poured into crystal vessels",
    bannerImage: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
    iconSymbol: "💎",
    isFeatured: true
  }
];

const INITIAL_PRODUCTS: CandleProduct[] = [
  {
    id: "prod-1",
    name: "Velvet Amber & Smoked Oud",
    slug: "velvet-amber-smoked-oud",
    tagline: "Deep resinous wood with a glowing honey warm core",
    price: 899,
    originalPrice: 1299,
    rating: 4.9,
    reviewsCount: 128,
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Luxury",
    collections: ["scented-candles", "luxury-collection"],
    waxType: "Soy Wax",
    wickType: "Wooden Crackling Wick",
    burnTimeHours: 55,
    weightGrams: 280,
    fragranceNotes: {
      top: ["Golden Amber", "Bergamot Crisp"],
      middle: ["Smoked Oud Wood", "Wild Patchouli"],
      base: ["French Vanilla Bean", "Sandalwood"]
    },
    fragranceStrength: 4,
    roomSize: "Medium (Living Room)",
    careInstructions: ["Trim wooden wick to 1/4 inch before burn"],
    ingredients: ["100% Soy Wax", "Essential Oils", "Wooden Wick"],
    isVegan: true,
    isHandmade: true,
    isEcoFriendly: true,
    isBestSeller: true,
    stock: 45,
    sellerId: "seller-1",
    sellerName: "The Candle Lab Atelier",
    description: "An intoxicating blend crafted to evoke warm fireside evenings."
  },
  {
    id: "prod-2",
    name: "Midnight Lavender & Wild Sage",
    slug: "midnight-lavender-wild-sage",
    tagline: "Serene French lavender fields infused with crisp herbal sage",
    price: 649,
    originalPrice: 899,
    rating: 4.8,
    reviewsCount: 94,
    images: [
      "https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Floral",
    collections: ["scented-candles", "floral-collection"],
    waxType: "Soy Wax",
    wickType: "Cotton Wick",
    burnTimeHours: 45,
    weightGrams: 220,
    fragranceNotes: {
      top: ["French Lavender", "Eucalyptus Leaf"],
      middle: ["Clary Sage", "Blue Chamomile"],
      base: ["Cedarwood", "Cashmere Musk"]
    },
    fragranceStrength: 3,
    roomSize: "Small (Bedroom)",
    careInstructions: ["Keep flame away from drafts"],
    ingredients: ["Soy Wax Blend", "Lavender Oil"],
    isVegan: true,
    isHandmade: true,
    isEcoFriendly: true,
    isNewArrival: true,
    stock: 60,
    sellerId: "seller-1",
    sellerName: "The Candle Lab Atelier",
    description: "Designed for evening wind-down rituals."
  },
  {
    id: "prod-3",
    name: "Espresso Roast & Salted Caramel",
    slug: "espresso-roast-salted-caramel",
    tagline: "Freshly pulled espresso with buttery warm salted caramel notes",
    price: 699,
    originalPrice: 949,
    rating: 4.95,
    reviewsCount: 156,
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Gourmand",
    collections: ["coffee-collection", "vanilla-collection"],
    waxType: "Beeswax",
    wickType: "Wooden Crackling Wick",
    burnTimeHours: 50,
    weightGrams: 250,
    fragranceNotes: {
      top: ["Roasted Arabica Beans", "Toasted Hazelnut"],
      middle: ["Salted Caramel Swirl", "Warm Milk Foam"],
      base: ["Bourbon Vanilla", "Cocoa Butter"]
    },
    fragranceStrength: 5,
    roomSize: "Large (Open Space)",
    careInstructions: ["Trim wick before each burn"],
    ingredients: ["Beeswax", "Coffee Essence"],
    isVegan: false,
    isHandmade: true,
    isEcoFriendly: true,
    isBestSeller: true,
    stock: 30,
    sellerId: "seller-2",
    sellerName: "Artisan Wax Crafters",
    description: "Fills your room with the scent of a Parisian coffee shop."
  },
  {
    id: "prod-4",
    name: "Madagascar Vanilla Bean & Tonka",
    slug: "madagascar-vanilla-tonka",
    tagline: "Silky smooth gourmand vanilla with soft toasted almond undertones",
    price: 549,
    originalPrice: 799,
    rating: 4.7,
    reviewsCount: 81,
    images: [
      "https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Vanilla",
    collections: ["vanilla-collection", "scented-candles"],
    waxType: "Coconut Wax",
    wickType: "Cotton Wick",
    burnTimeHours: 40,
    weightGrams: 200,
    fragranceNotes: {
      top: ["Vanilla Orchid", "White Peach"],
      middle: ["Madagascar Vanilla Pod", "Toasted Tonka Bean"],
      base: ["Amber Glow", "Whipped Cream"]
    },
    fragranceStrength: 3,
    roomSize: "Medium (Living Room)",
    careInstructions: ["Burn on heat-resistant surface"],
    ingredients: ["Coconut-Soy Blend"],
    isVegan: true,
    isHandmade: true,
    isEcoFriendly: true,
    isFlashSale: true,
    stock: 80,
    sellerId: "seller-1",
    sellerName: "The Candle Lab Atelier",
    description: "Pure comfort poured into an ivory ceramic pot."
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<CollectionItem[]>(INITIAL_COLLECTIONS);
  const [products, setProducts] = useState<CandleProduct[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(["prod-1", "prod-3"]);
  const [compareList, setCompareList] = useState<CandleProduct[]>([]);
  const [bundleItems, setBundleItems] = useState<CandleProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRole, setActiveRole] = useState<"customer" | "seller" | "admin">("customer");
  const [currency, setCurrency] = useState("₹");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme State ("light" | "dark")
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("thecandlelab_theme", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
  };

  // Loyalty System
  const [loyaltyPoints, setLoyaltyPoints] = useState(480);
  const [walletBalance, setWalletBalance] = useState(500);
  const referralCode = "CANDLE-GLOW-99";
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: "TICK-901",
      subject: "Gift packaging wax seal inquiry",
      status: "RESOLVED",
      date: "2026-07-20",
      messages: ["Hello Concierge, can I add a metallic gold wax seal?", "Yes! All gift boxes come with our signature gold wax stamp."]
    }
  ]);

  const addSupportTicket = (subject: string, initialMsg: string) => {
    const newId = `TICK-${Math.floor(100 + Math.random() * 900)}`;
    setSupportTickets((prev) => [
      {
        id: newId,
        subject,
        status: "OPEN",
        date: new Date().toISOString().split("T")[0],
        messages: [initialMsg]
      },
      ...prev
    ]);
    showToast(`Support Ticket #${newId} submitted to Concierge!`);
  };

  // Collections CRUD
  const addCollection = (colData: Omit<CollectionItem, "id">) => {
    const newId = `col-${Date.now()}`;
    setCollections((prev) => [{ ...colData, id: newId }, ...prev]);
    showToast(`Collection "${colData.name}" published!`);
  };

  const updateCollection = (id: string, colData: Partial<CollectionItem>) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...colData } : c)));
    showToast("Collection updated.");
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    showToast("Collection deleted.");
  };

  // Products CRUD
  const addProduct = (prodData: Omit<CandleProduct, "id">) => {
    const newId = `prod-${Date.now()}`;
    setProducts((prev) => [{ ...prodData, id: newId }, ...prev]);
    showToast(`Published "${prodData.name}"!`);
  };

  const updateProduct = (id: string, prodData: Partial<CandleProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...prodData } : p)));
    showToast("Product updated.");
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Product deleted.");
  };

  // Cart & Save for Later
  const addToCart = (
    product: CandleProduct,
    quantity = 1,
    isGiftWrapped = false,
    giftMessage = "",
    customConfig?: CustomCandleConfig
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && JSON.stringify(item.customConfig) === JSON.stringify(customConfig)
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, isGiftWrapped, giftMessage, customConfig }];
    });
    showToast(`Added ${product.name} to Bag 🛒`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast("Item removed.");
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item)));
  };

  const saveForLater = (productId: string) => {
    const itemToSave = cart.find((i) => i.product.id === productId);
    if (!itemToSave) return;
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    setSavedForLater((prev) => [...prev, itemToSave]);
    showToast("Saved item for later!");
  };

  const moveToCartFromSaved = (productId: string) => {
    const itemToMove = savedForLater.find((i) => i.product.id === productId);
    if (!itemToMove) return;
    setSavedForLater((prev) => prev.filter((i) => i.product.id !== productId));
    setCart((prev) => [...prev, itemToMove]);
    showToast("Moved item back to Bag 🛒");
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const basePrice = item.customConfig ? item.customConfig.totalPrice : item.product.price;
    return sum + (basePrice + (item.isGiftWrapped ? 99 : 0)) * item.quantity;
  }, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast("Removed from Wishlist ❤️");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to Wishlist ❤️");
        return [...prev, productId];
      }
    });
  };

  // Compare Engine
  const toggleCompare = (product: CandleProduct) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name} from comparison.`);
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast("Maximum 3 candles can be compared side-by-side!");
        return prev;
      }
      showToast(`Added ${product.name} to comparison! ⚖️`);
      return [...prev, product];
    });
  };

  const clearCompare = () => setCompareList([]);

  // Bundle Builder
  const addBundleItem = (product: CandleProduct) => {
    if (bundleItems.length >= 3) return;
    setBundleItems((prev) => [...prev, product]);
  };
  const removeBundleItem = (productId: string) => setBundleItems((prev) => prev.filter((p) => p.id !== productId));
  const clearBundle = () => setBundleItems([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3200);
  };

  const loyaltyTier = loyaltyPoints >= 1000 ? "Platinum" : loyaltyPoints >= 500 ? "Gold" : "Silver";

  return (
    <StoreContext.Provider
      value={{
        collections,
        addCollection,
        updateCollection,
        deleteCollection,

        products,
        addProduct,
        updateProduct,
        deleteProduct,

        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        saveForLater,
        moveToCartFromSaved,
        clearCart,
        cartTotal,

        wishlist,
        toggleWishlist,

        compareList,
        toggleCompare,
        clearCompare,

        bundleItems,
        addBundleItem,
        removeBundleItem,
        clearBundle,

        activeRole,
        setActiveRole,
        loyaltyPoints,
        loyaltyTier,
        walletBalance,
        referralCode,
        supportTickets,
        addSupportTicket,

        searchQuery,
        setSearchQuery,
        currency,
        setCurrency,
        theme,
        setTheme,
        toggleTheme,

        toastMessage,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
