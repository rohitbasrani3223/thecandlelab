"use client";

import React, { createContext, useContext, useState } from "react";

export interface ScentNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sizeGrams: number;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  barcode: string;
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
  sku?: string;
  barcode?: string;
  brand?: string;
  status?: "Active" | "Draft" | "Archived";
  seoTitle?: string;
  seoDescription?: string;
  variants?: ProductVariant[];
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
  customerName?: string;
  customerEmail?: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority?: "High" | "Medium" | "Low";
  date: string;
  messages: string[];
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemsSummary: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: "Razorpay" | "Stripe" | "UPI" | "COD";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  status: "Pending" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Refund" | "Returned";
  courier: string;
  trackingNumber: string;
  date: string;
  shippingAddress: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  walletBalance: number;
  loyaltyPoints: number;
  loyaltyTier: "Silver" | "Gold" | "Platinum";
  isBlocked: boolean;
  internalNotes: string;
  wishlistIds: string[];
}

export interface SellerRecord {
  id: string;
  name: string;
  email: string;
  storeName: string;
  phone: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  gstNumber: string;
  panNumber: string;
  bankAccount: string;
  totalSales: number;
  commissionRate: number; // e.g. 12%
  pendingPayout: number;
  productsCount: number;
}

export interface CouponRecord {
  id: string;
  code: string;
  discountType: "Percentage" | "Fixed";
  value: number;
  minSpend: number;
  usageLimit: number;
  timesUsed: number;
  status: "Active" | "Expired" | "Scheduled";
  expiryDate: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  channel: "Email" | "Push" | "WhatsApp";
  targetAudience: string;
  status: "Sent" | "Scheduled" | "Draft";
  sentCount: number;
  openRate: string;
  clickRate: string;
}

export interface WarehouseItem {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  location: string;
  totalStock: number;
  reservedStock: number;
  reorderPoint: number;
}

export interface CMSConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  heroImage: string;
  announcementText: string;
  isAnnouncementActive: boolean;
  popupEnabled: boolean;
  popupHeadline: string;
  popupDiscountCode: string;
  globalSeoTitle: string;
  globalSeoDescription: string;
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

  // Orders Management
  orders: OrderRecord[];
  updateOrderStatus: (orderId: string, status: OrderRecord["status"], courier?: string, tracking?: string) => void;
  addOrder: (order: Omit<OrderRecord, "id">) => void;

  // Customer CRM
  customers: CustomerRecord[];
  toggleBlockCustomer: (customerId: string) => void;
  updateCustomerNotes: (customerId: string, notes: string) => void;
  adjustCustomerWallet: (customerId: string, amount: number) => void;

  // Seller Management
  sellers: SellerRecord[];
  approveSeller: (sellerId: string) => void;
  rejectSeller: (sellerId: string) => void;
  processSellerPayout: (sellerId: string) => void;

  // Marketing & Campaigns
  coupons: CouponRecord[];
  addCoupon: (coupon: Omit<CouponRecord, "id">) => void;
  campaigns: MarketingCampaign[];
  addCampaign: (campaign: Omit<MarketingCampaign, "id">) => void;

  // Warehouse & Operations
  warehouseItems: WarehouseItem[];
  updateWarehouseStock: (itemId: string, qtyDelta: number) => void;

  // CMS Settings
  cmsConfig: CMSConfig;
  updateCMSConfig: (config: Partial<CMSConfig>) => void;

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
  currentUser: { id: string; name: string; email: string; role: string; walletBalance: number; loyaltyPoints: number; loyaltyTier: string } | null;
  setCurrentUser: (user: any) => void;
  logoutUser: () => void;
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
    stock: 42,
    sku: "SKU-AMB-001",
    barcode: "8901234567890",
    brand: "The Candle Lab Atelier",
    status: "Active",
    seoTitle: "Velvet Amber & Smoked Oud Luxury Soy Candle",
    seoDescription: "Hand-poured luxury soy candle with crackling wooden wick.",
    sellerId: "s-1",
    sellerName: "The Candle Lab Atelier",
    description: "An intoxicating blend of dark amber resin, rare Indian oud, and warm spiced vanilla."
  },
  {
    id: "prod-2",
    name: "Wild Jasmine & Moonlight Bloom",
    slug: "wild-jasmine-moonlight-bloom",
    tagline: "Night-blooming jasmine petals bathed in soft botanical dew",
    price: 749,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 94,
    images: [
      "https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Floral",
    collections: ["floral-collection", "scented-candles"],
    waxType: "Beeswax",
    wickType: "Cotton Wick",
    burnTimeHours: 45,
    weightGrams: 220,
    fragranceNotes: {
      top: ["Night Jasmine", "Green Leaf Dew"],
      middle: ["White Gardenia", "Tuberose"],
      base: ["Sheer Musk", "Cashmere Wood"]
    },
    fragranceStrength: 3,
    roomSize: "Small (Bedroom)",
    careInstructions: ["Keep away from drafts"],
    ingredients: ["Purified Beeswax", "Jasmine Essential Oil"],
    isVegan: false,
    isHandmade: true,
    isEcoFriendly: true,
    stock: 18,
    sku: "SKU-JAS-002",
    barcode: "8901234567891",
    brand: "Artisan Wax Crafters",
    status: "Active",
    seoTitle: "Wild Jasmine Moonlight Bloom Candle",
    seoDescription: "Pure beeswax candle infused with night blooming jasmine.",
    sellerId: "s-2",
    sellerName: "Artisan Wax Crafters",
    description: "Serene night floral fragrance crafted for relaxation."
  },
  {
    id: "prod-3",
    name: "Madagascar Vanilla & Caramelized Pear",
    slug: "madagascar-vanilla-caramelized-pear",
    tagline: "Gourmand vanilla bean swirled with golden nectar",
    price: 699,
    rating: 4.9,
    reviewsCount: 210,
    images: [
      "https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Gourmand",
    collections: ["vanilla-collection"],
    waxType: "Soy Wax",
    wickType: "Wooden Crackling Wick",
    burnTimeHours: 60,
    weightGrams: 300,
    fragranceNotes: {
      top: ["Caramelized Pear", "Cinnamon Pinch"],
      middle: ["Madagascar Vanilla Pod", "Warm Buttercream"],
      base: ["Toasted Tonka Bean", "Brown Sugar"]
    },
    fragranceStrength: 5,
    roomSize: "Large (Open Space)",
    careInstructions: ["Burn for at least 2 hours on first use"],
    ingredients: ["Soy Wax Blend", "Vanilla Absolute"],
    isVegan: true,
    isHandmade: true,
    isEcoFriendly: true,
    isBestSeller: true,
    stock: 4,
    sku: "SKU-VAN-003",
    barcode: "8901234567892",
    brand: "The Candle Lab Atelier",
    status: "Active",
    seoTitle: "Madagascar Vanilla Gourmand Candle",
    seoDescription: "Rich gourmand candle with real Madagascar vanilla bean.",
    sellerId: "s-1",
    sellerName: "The Candle Lab Atelier",
    description: "Ultra-cozy gourmand candle filling your entire home with warm vanilla bakery scents."
  },
  {
    id: "prod-4",
    name: "Roasted Arabica & Dark Espresso",
    slug: "roasted-arabica-dark-espresso",
    tagline: "Freshly brewed espresso shots with dark chocolate undertones",
    price: 799,
    rating: 4.7,
    reviewsCount: 76,
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Gourmand",
    collections: ["coffee-collection"],
    waxType: "Coconut Wax",
    wickType: "Cotton Wick",
    burnTimeHours: 50,
    weightGrams: 250,
    fragranceNotes: {
      top: ["Roasted Coffee Bean", "Hazelnut"],
      middle: ["Dark Cocoa", "Espresso Cream"],
      base: ["Vanilla Cane", "Maple Wood"]
    },
    fragranceStrength: 5,
    roomSize: "Medium (Living Room)",
    careInstructions: ["Trim wick before each lighting"],
    ingredients: ["Coconut Wax", "Coffee Extract Oils"],
    isVegan: true,
    isHandmade: true,
    isEcoFriendly: true,
    stock: 0,
    sku: "SKU-COF-004",
    barcode: "8901234567893",
    brand: "Botanical Aromas India",
    status: "Draft",
    seoTitle: "Roasted Arabica Coffee Candle",
    seoDescription: "Energizing dark coffee candle for study and office spaces.",
    sellerId: "s-3",
    sellerName: "Botanical Aromas India",
    description: "Invigorating morning brew scent poured with natural coconut wax."
  }
];

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "ORD-94821",
    customerName: "Aarav Sharma",
    customerEmail: "aarav.sharma@example.com",
    customerPhone: "+91 98765 43210",
    itemsSummary: "Velvet Amber & Smoked Oud x 2",
    itemsCount: 2,
    totalAmount: 1798,
    paymentMethod: "Razorpay",
    paymentStatus: "Paid",
    status: "Pending",
    courier: "Bluedart Express",
    trackingNumber: "BD-99481023",
    date: "2026-07-25 14:10",
    shippingAddress: "Flat 402, Royal Palms, MG Road, Mumbai, Maharashtra 400001"
  },
  {
    id: "ORD-94820",
    customerName: "Priya Patel",
    customerEmail: "priya.p@example.com",
    customerPhone: "+91 98123 45678",
    itemsSummary: "Wild Jasmine & Moonlight Bloom x 1",
    itemsCount: 1,
    totalAmount: 749,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Packed",
    courier: "Delhivery Courier",
    trackingNumber: "DL-88371920",
    date: "2026-07-25 12:45",
    shippingAddress: "12, Rosewood Enclave, Jubilee Hills, Hyderabad 500033"
  },
  {
    id: "ORD-94819",
    customerName: "Rohan Mehta",
    customerEmail: "rohan.mehta@example.com",
    customerPhone: "+91 99001 12233",
    itemsSummary: "Madagascar Vanilla & Caramelized Pear x 3",
    itemsCount: 3,
    totalAmount: 2097,
    paymentMethod: "Stripe",
    paymentStatus: "Paid",
    status: "Shipped",
    courier: "Shiprocket Express",
    trackingNumber: "SR-9482103859",
    date: "2026-07-24 18:30",
    shippingAddress: "Villa 8, Palm Meadows, Whitefield, Bengaluru 560066"
  },
  {
    id: "ORD-94818",
    customerName: "Ananya Iyer",
    customerEmail: "ananya.i@example.com",
    customerPhone: "+91 97400 55667",
    itemsSummary: "Velvet Amber (1), Wild Jasmine (1)",
    itemsCount: 2,
    totalAmount: 1648,
    paymentMethod: "Razorpay",
    paymentStatus: "Paid",
    status: "Delivered",
    courier: "FedEx Priority",
    trackingNumber: "FX-11029384",
    date: "2026-07-23 10:15",
    shippingAddress: "Apt 9B, Horizon Towers, Worli, Mumbai 400018"
  },
  {
    id: "ORD-94817",
    customerName: "Vikram Malhotra",
    customerEmail: "vikram.m@example.com",
    customerPhone: "+91 96543 21098",
    itemsSummary: "Roasted Arabica Coffee Candle x 1",
    itemsCount: 1,
    totalAmount: 799,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    status: "Cancelled",
    courier: "None",
    trackingNumber: "N/A",
    date: "2026-07-22 16:00",
    shippingAddress: "Plot 45, Vasant Vihar, New Delhi 110057"
  },
  {
    id: "ORD-94816",
    customerName: "Sneha Reddy",
    customerEmail: "sneha.reddy@example.com",
    customerPhone: "+91 95000 88776",
    itemsSummary: "Gift Hamper Set x 1",
    itemsCount: 1,
    totalAmount: 2499,
    paymentMethod: "Razorpay",
    paymentStatus: "Refunded",
    status: "Refund",
    courier: "Delhivery",
    trackingNumber: "DL-77382910",
    date: "2026-07-21 11:20",
    shippingAddress: "Flat 201, Green Glen Layout, Bellandur, Bengaluru 560103"
  }
];

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: "cust-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    joinedDate: "2025-11-10",
    totalOrders: 14,
    totalSpent: 18450,
    walletBalance: 1200,
    loyaltyPoints: 1450,
    loyaltyTier: "Platinum",
    isBlocked: false,
    internalNotes: "VIP corporate buyer for luxury candles.",
    wishlistIds: ["prod-1", "prod-3"]
  },
  {
    id: "cust-2",
    name: "Priya Patel",
    email: "priya.p@example.com",
    phone: "+91 98123 45678",
    joinedDate: "2026-01-15",
    totalOrders: 6,
    totalSpent: 6200,
    walletBalance: 350,
    loyaltyPoints: 620,
    loyaltyTier: "Gold",
    isBlocked: false,
    internalNotes: "Loves floral scents and wooden wicks.",
    wishlistIds: ["prod-2"]
  },
  {
    id: "cust-3",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 99001 12233",
    joinedDate: "2026-03-04",
    totalOrders: 3,
    totalSpent: 3499,
    walletBalance: 150,
    loyaltyPoints: 340,
    loyaltyTier: "Silver",
    isBlocked: false,
    internalNotes: "Frequent buyer during festive offers.",
    wishlistIds: ["prod-4"]
  }
];

const INITIAL_SELLERS: SellerRecord[] = [
  {
    id: "s-1",
    name: "The Candle Lab Atelier",
    email: "atelier@candlelab.com",
    phone: "+91 90000 11111",
    storeName: "The Candle Lab Flagship",
    status: "VERIFIED",
    gstNumber: "27AAATC1234F1Z5",
    panNumber: "AAATC1234F",
    bankAccount: "HDFC Bank (A/C: ****9821)",
    totalSales: 142850,
    commissionRate: 12,
    pendingPayout: 24500,
    productsCount: 12
  },
  {
    id: "s-2",
    name: "Artisan Wax Crafters",
    email: "artisan@waxcrafters.in",
    phone: "+91 98888 22222",
    storeName: "Artisan Wax Crafters",
    status: "VERIFIED",
    gstNumber: "36BBBWA5678G1Z2",
    panNumber: "BBBWA5678G",
    bankAccount: "ICICI Bank (A/C: ****4310)",
    totalSales: 89200,
    commissionRate: 12,
    pendingPayout: 14200,
    productsCount: 6
  },
  {
    id: "s-3",
    name: "Botanical Aromas India",
    email: "contact@botanicalaromas.in",
    phone: "+91 97777 33333",
    storeName: "Botanical Aromas India",
    status: "PENDING",
    gstNumber: "07CCCBA9101H1Z9",
    panNumber: "CCCBA9101H",
    bankAccount: "Axis Bank (A/C: ****7729)",
    totalSales: 0,
    commissionRate: 12,
    pendingPayout: 0,
    productsCount: 2
  }
];

const INITIAL_COUPONS: CouponRecord[] = [
  {
    id: "c-1",
    code: "LUXURY20",
    discountType: "Percentage",
    value: 20,
    minSpend: 1499,
    usageLimit: 500,
    timesUsed: 142,
    status: "Active",
    expiryDate: "2026-12-31"
  },
  {
    id: "c-2",
    code: "FLAT300",
    discountType: "Fixed",
    value: 300,
    minSpend: 1999,
    usageLimit: 200,
    timesUsed: 89,
    status: "Active",
    expiryDate: "2026-08-15"
  }
];

const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: "camp-1",
    title: "Monsoon Aromatherapy VIP Drop",
    channel: "Email",
    targetAudience: "Platinum & Gold Customers",
    status: "Sent",
    sentCount: 1420,
    openRate: "64.2%",
    clickRate: "18.5%"
  },
  {
    id: "camp-2",
    title: "Festive Early Bird 20% Off",
    channel: "WhatsApp",
    targetAudience: "All Active Buyers",
    status: "Scheduled",
    sentCount: 0,
    openRate: "0%",
    clickRate: "0%"
  }
];

const INITIAL_WAREHOUSE: WarehouseItem[] = [
  {
    id: "w-1",
    name: "Velvet Amber Soy Wax Jars",
    sku: "SKU-AMB-001",
    barcode: "8901234567890",
    location: "Aisle A4 - Rack 2",
    totalStock: 150,
    reservedStock: 25,
    reorderPoint: 30
  },
  {
    id: "w-2",
    name: "Moonlight Bloom Glass Vessels",
    sku: "SKU-JAS-002",
    barcode: "8901234567891",
    location: "Aisle B1 - Rack 5",
    totalStock: 45,
    reservedStock: 10,
    reorderPoint: 20
  }
];

const INITIAL_CMS: CMSConfig = {
  heroTitle: "Artisanal Luxury Hand-Poured Candles",
  heroSubtitle: "Transform your living sanctuary with 100% natural botanical wax, rare amber resins, and crackling wooden wicks.",
  heroCTA: "Explore Autumn Atelier",
  heroImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1600&q=80",
  announcementText: "✨ Compliments of The Atelier: Free Gold Velvet Gift Box on orders over ₹1,999!",
  isAnnouncementActive: true,
  popupEnabled: true,
  popupHeadline: "Unlock 15% Off Your First Luxury Candle",
  popupDiscountCode: "WELCOME15",
  globalSeoTitle: "The Candle Lab — Atelier Luxury Candles & Home Fragrances",
  globalSeoDescription: "Discover handcrafted luxury soy candles, custom candle bars, and aromatherapy gift boxes."
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<CollectionItem[]>(INITIAL_COLLECTIONS);
  const [products, setProducts] = useState<CandleProduct[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [sellers, setSellers] = useState<SellerRecord[]>(INITIAL_SELLERS);
  const [coupons, setCoupons] = useState<CouponRecord[]>(INITIAL_COUPONS);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(INITIAL_CAMPAIGNS);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>(INITIAL_WAREHOUSE);
  const [cmsConfig, setCmsConfig] = useState<CMSConfig>(INITIAL_CMS);

  // Cart & Saved state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(["prod-1"]);
  const [compareList, setCompareList] = useState<CandleProduct[]>([]);
  const [bundleItems, setBundleItems] = useState<CandleProduct[]>([]);

  // User state
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string; walletBalance: number; loyaltyPoints: number; loyaltyTier: string } | null>(null);
  const [activeRole, setActiveRole] = useState<"customer" | "seller" | "admin">("customer");
  const [loyaltyPoints, setLoyaltyPoints] = useState(100);
  const [walletBalance, setWalletBalance] = useState(0);
  const [referralCode] = useState("CANDLE-CLUB");
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  // Check stored user session on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("candlelab_user");
      if (stored) {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        setWalletBalance(u.walletBalance || 0);
        setLoyaltyPoints(u.loyaltyPoints || 100);
      }
    } catch (e) {
      console.error("Session parse error", e);
    }
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("candlelab_jwt_access");
    localStorage.removeItem("candlelab_jwt_refresh");
    localStorage.removeItem("candlelab_user");
    localStorage.removeItem("candlelab_user_role");
    setCurrentUser(null);
    setActiveRole("customer");
    showToast("Logged out successfully 🚪");
  };

  // System settings
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync collections and products with live Supabase Django backend APIs
  React.useEffect(() => {
    async function loadBackendData() {
      try {
        const [colRes, prodRes] = await Promise.all([
          fetch('/api/v1/collections/').catch(() => null),
          fetch('/api/v1/products/').catch(() => null)
        ]);

        if (colRes && colRes.ok) {
          const colData = await colRes.json();
          const items = colData.results || colData;
          if (Array.isArray(items) && items.length > 0) {
            setCollections(items.map((c: any) => ({
              id: String(c.id),
              name: c.name,
              slug: c.slug,
              description: c.description || "",
              bannerImage: c.banner_image || c.bannerImage || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
              iconSymbol: c.icon_symbol || c.iconSymbol || "🕯️",
              isFeatured: c.is_featured ?? true
            })));
          }
        }

        if (prodRes && prodRes.ok) {
          const prodData = await prodRes.json();
          const items = prodData.results || prodData;
          if (Array.isArray(items) && items.length > 0) {
            setProducts(items.map((p: any) => ({
              id: String(p.id),
              name: p.name,
              slug: p.slug,
              tagline: p.tagline || "",
              price: Number(p.price),
              originalPrice: p.original_price ? Number(p.original_price) : undefined,
              rating: p.rating ? Number(p.rating) : 4.9,
              reviewsCount: p.reviews_count || 12,
              images: p.images && p.images.length > 0 ? p.images : ["https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"],
              category: p.category_name || p.category || "Luxury",
              collections: p.collection_slugs || ["scented-candles"],
              waxType: p.wax_type || "Soy Wax",
              wickType: p.wick_type || "Wooden Crackling Wick",
              burnTimeHours: p.burn_time_hours || 55,
              weightGrams: p.weight_grams || 280,
              fragranceNotes: p.fragrance_notes || { top: ["Amber"], middle: ["Oud"], base: ["Vanilla"] },
              fragranceStrength: p.fragrance_strength || 4,
              roomSize: p.room_size || "Medium (Living Room)",
              careInstructions: p.care_instructions || ["Trim wick to 1/4 inch"],
              ingredients: p.ingredients || ["100% Soy Wax"],
              isVegan: p.is_vegan ?? true,
              isHandmade: p.is_handmade ?? true,
              isEcoFriendly: p.is_eco_friendly ?? true,
              isBestSeller: p.is_bestseller ?? true,
              stock: p.stock ?? 10,
              sku: p.sku || `SKU-${p.id}`,
              barcode: p.barcode || "8901234567890",
              brand: "The Candle Lab Atelier",
              status: "Active",
              sellerId: "s-1",
              sellerName: "The Candle Lab Atelier",
              description: p.description || ""
            })));
          }
        }
      } catch (err) {
        console.error("Backend fetch error:", err);
      }
    }
    loadBackendData();
  }, []);

  // Collection Handlers
  const addCollection = (col: Omit<CollectionItem, "id">) => {
    const newCol: CollectionItem = { ...col, id: `col-${Date.now()}` };
    setCollections((prev) => [...prev, newCol]);
    showToast(`Created collection "${col.name}" ✨`);
  };

  const updateCollection = (id: string, col: Partial<CollectionItem>) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...col } : c)));
    showToast(`Updated collection details 🏷️`);
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    showToast(`Collection removed 🗑️`);
  };

  // Product Handlers
  const addProduct = (product: Omit<CandleProduct, "id">) => {
    const newProd: CandleProduct = { ...product, id: `prod-${Date.now()}` };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added product "${product.name}" 🕯️`);
  };

  const updateProduct = (id: string, product: Partial<CandleProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...product } : p)));
    showToast(`Updated product status 📝`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Product deleted 🗑️`);
  };

  // Order Handlers
  const updateOrderStatus = (orderId: string, status: OrderRecord["status"], courier?: string, tracking?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, courier: courier || o.courier, trackingNumber: tracking || o.trackingNumber } : o))
    );
    showToast(`Order ${orderId} updated to ${status} 📦`);
  };

  const addOrder = (order: Omit<OrderRecord, "id">) => {
    const newOrder: OrderRecord = { ...order, id: `ORD-${Math.floor(10000 + Math.random() * 90000)}` };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`New Order ${newOrder.id} logged 🎉`);
  };

  // Customer CRM Handlers
  const toggleBlockCustomer = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, isBlocked: !c.isBlocked } : c))
    );
    showToast(`Customer account status toggled 👤`);
  };

  const updateCustomerNotes = (customerId: string, notes: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, internalNotes: notes } : c))
    );
    showToast(`Saved customer notes 📝`);
  };

  const adjustCustomerWallet = (customerId: string, amount: number) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, walletBalance: Math.max(0, c.walletBalance + amount) } : c))
    );
    showToast(`Adjusted wallet balance by ₹${amount} 💳`);
  };

  // Seller Handlers
  const approveSeller = (sellerId: string) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: "VERIFIED" } : s))
    );
    showToast(`Seller account verified & approved! 🏪`);
  };

  const rejectSeller = (sellerId: string) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: "REJECTED" } : s))
    );
    showToast(`Seller application updated ❌`);
  };

  const processSellerPayout = (sellerId: string) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, pendingPayout: 0 } : s))
    );
    showToast(`Payout processed successfully! 💸`);
  };

  // Marketing Handlers
  const addCoupon = (coupon: Omit<CouponRecord, "id">) => {
    const newCoupon: CouponRecord = { ...coupon, id: `c-${Date.now()}` };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon ${coupon.code} activated 🎟️`);
  };

  const addCampaign = (campaign: Omit<MarketingCampaign, "id">) => {
    const newCamp: MarketingCampaign = { ...campaign, id: `camp-${Date.now()}` };
    setCampaigns((prev) => [newCamp, ...prev]);
    showToast(`Campaign launched successfully! 🚀`);
  };

  // Operations Handlers
  const updateWarehouseStock = (itemId: string, qtyDelta: number) => {
    setWarehouseItems((prev) =>
      prev.map((w) => (w.id === itemId ? { ...w, totalStock: Math.max(0, w.totalStock + qtyDelta) } : w))
    );
    showToast(`Warehouse inventory updated 🏭`);
  };

  // CMS Config Handlers
  const updateCMSConfig = (config: Partial<CMSConfig>) => {
    setCmsConfig((prev) => ({ ...prev, ...config }));
    showToast(`CMS Homepage configuration updated! 🎨`);
  };

  // Cart & Save for later logic
  const addToCart = (
    product: CandleProduct,
    quantity = 1,
    giftWrap = false,
    giftMessage = "",
    customConfig?: CustomCandleConfig
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && !customConfig);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && !customConfig
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, isGiftWrapped: giftWrap, giftMessage, customConfig }];
    });
    showToast(`Added ${product.name} to cart! 🛍️`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const saveForLater = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    if (item) {
      setCart((prev) => prev.filter((c) => c.product.id !== productId));
      setSavedForLater((prev) => [...prev, item]);
      showToast(`Saved item for later! 🔖`);
    }
  };

  const moveToCartFromSaved = (productId: string) => {
    const item = savedForLater.find((c) => c.product.id === productId);
    if (item) {
      setSavedForLater((prev) => prev.filter((c) => c.product.id !== productId));
      setCart((prev) => [...prev, item]);
      showToast(`Moved item back to cart! 🛒`);
    }
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const unitPrice = item.customConfig ? item.customConfig.totalPrice : item.product.price;
    const wrapFee = item.isGiftWrapped ? 150 : 0;
    return sum + (unitPrice + wrapFee) * item.quantity;
  }, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    showToast(wishlist.includes(productId) ? "Removed from wishlist" : "Added to wishlist 💖");
  };

  // Compare Engine
  const toggleCompare = (product: CandleProduct) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast("Maximum 3 products can be compared ⚖️");
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

  const addSupportTicket = (subject: string, initialMsg: string) => {
    const newTicket: SupportTicket = {
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      subject,
      status: "OPEN",
      priority: "Medium",
      date: new Date().toISOString().split("T")[0],
      messages: [initialMsg]
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    showToast(`Support Ticket #${newTicket.id} created! 💬`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3200);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
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

        orders,
        updateOrderStatus,
        addOrder,

        customers,
        toggleBlockCustomer,
        updateCustomerNotes,
        adjustCustomerWallet,

        sellers,
        approveSeller,
        rejectSeller,
        processSellerPayout,

        coupons,
        addCoupon,
        campaigns,
        addCampaign,

        warehouseItems,
        updateWarehouseStock,

        cmsConfig,
        updateCMSConfig,

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

        currentUser,
        setCurrentUser,
        logoutUser,
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
