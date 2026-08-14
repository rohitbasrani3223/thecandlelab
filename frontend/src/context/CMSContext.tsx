import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseFetch } from '../config/supabaseClient';
import { fetchCmsBundle, saveCmsBundle } from '../services/cmsRemote';
import { PRODUCT_IMAGE_PLACEHOLDER } from '../config/placeholders';

// Storage keys
const PRODUCTS_STORAGE_KEY = 'tcl_cms_products';
const FRAGRANCES_STORAGE_KEY = 'tcl_cms_fragrances';
const SIZES_STORAGE_KEY = 'tcl_cms_sizes';
const COLORS_STORAGE_KEY = 'tcl_cms_colors';
const WICK_TYPES_STORAGE_KEY = 'tcl_cms_wick_types';
const MAIN_CATEGORIES_STORAGE_KEY = 'tcl_cms_main_categories';
const SUB_CATEGORIES_STORAGE_KEY = 'tcl_cms_sub_categories';
const COLLECTIONS_STORAGE_KEY = 'tcl_cms_collections';

export interface CMSStoreSettings {
  storeName: string;
  tagline: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  supportEmail: string;
  supportPhone: string;
  studioAddress: string;
  logoUrl: string;
  footerText?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    pinterest?: string;
    whatsapp?: string;
  };
}

export interface CMSAnnouncement {
  text: string;
  couponCode: string;
  discountText: string;
  visible: boolean;
}

export interface CMSHeroBanner {
  tagline: string;
  title: string;
  subtitle: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  imageUrl: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
  featuredImage?: string;
  layoutStyle?: 'scentandchill' | 'glass-circle' | 'split-featured';
}

export interface CMSFragrance {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  shortDescription?: string;
  scentProfile?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  scentFamily?: string;
  intensity?: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CMSSize {
  id: string;
  name: string;
  slug: string;
  unit: string;
  value: number;
  isActive: boolean;
  sortOrder: number;
}

export interface CMSColor {
  id: string;
  name: string;
  hexCode: string;
  swatchImage?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CMSWickType {
  id: string;
  name: string;
  description?: string;
  additionalPrice: number;
  isActive: boolean;
  sortOrder: number;
}

export interface CMSMainCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  bannerDesktop?: string;
  bannerMobile?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  sortOrder: number;
  subCategories?: CMSSubCategory[];
  productCount?: number;
}

export interface CMSSubCategory {
  id: string;
  mainCategoryId: string;
  mainCategoryName?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  bannerDesktop?: string;
  bannerMobile?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
}

export interface CMSCollection {
  id: string;
  name: string;
  title: string;
  slug: string;
  desc: string;
  description?: string;
  icon: string;
  badge: string;
  count: string;
  scents: string;
  image: string;
  bannerImage?: string;
  imageUrl?: string;
  collectionType?: 'MANUAL' | 'RULE_BASED';
  ruleConditions?: any;
  metaTitle?: string;
  metaDescription?: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  productIds?: string[];
}

export interface CMSProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  fragranceId?: string;
  fragranceName?: string;
  sizeId?: string;
  sizeName?: string;
  colorId?: string;
  colorName?: string;
  colorCode?: string;
  wickTypeId?: string;
  wickTypeName?: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold?: number;
  imageUrl?: string;
  isDefault: boolean;
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

export interface CMSProduct {
  id: string;
  name: string;
  slug?: string;
  tagline?: string;
  sku?: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  mainCategoryId?: string;
  category: string;
  subCategoryId?: string;
  subCategory?: string;
  collectionIds?: string[];
  collection: string;
  collections?: string[];
  scentProfile: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  burnTime: string;
  burnTimeHours?: number;
  waxType?: string;
  wickType?: string;
  weightGrams?: number;
  shortDescription?: string;
  longDescription?: string;
  productDetails?: {
    wax?: string;
    burnTime?: string;
    wick?: string;
    vessel?: string;
    dimensions?: string;
    weight?: string;
    madeIn?: string;
    packaging?: string;
    material?: string;
    [key: string]: any;
  };
  fragrancePyramid?: {
    scentProfile?: string;
    topNotes?: string;
    heartNotes?: string;
    baseNotes?: string;
    intensity?: string;
    [key: string]: any;
  };
  howToUse?: string;
  safetyInstructions?: string;
  whatsIncluded?: string;
  shippingReturns?: string;
  inStock: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isLimitedEdition?: boolean;
  hasFragranceOption?: boolean;
  hasSizeOption?: boolean;
  hasColorOption?: boolean;
  hasWickOption?: boolean;
  hasGiftPackaging?: boolean;
  hasCustomMessage?: boolean;
  availableFragranceIds?: string[];
  availableSizeIds?: string[];
  availableColorIds?: string[];
  availableWickTypeIds?: string[];
  vesselDescription: string;
  image: string;
  imageUrl: string;
  images: string[];
  variants?: CMSProductVariant[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface CMSCoupon {
  code: string;
  discountPercent: number;
  description: string;
  active: boolean;
}

export interface CMSPagesContent {
  aboutUs: string;
  shippingPolicy: string;
  refundPolicy: string;
  termsConditions: string;
  privacyPolicy: string;
  faqList: { question: string; answer: string; category: string }[];
}

export interface CMSCustomer {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  tier: string;
}

export interface CMSMediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
}

export interface CMSOrder {
  date: string;
  id: string;
  customerName: string;
  email: string;
  items: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

export interface CMSSEOSetting {
  pageKey: string;
  title: string;
  description: string;
  keywords: string;
}

export interface CMSStaffUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Inventory Manager' | 'Content Manager' | 'Marketing Manager' | 'Admin' | 'Support';
  password?: string;
  active: boolean;
}

export interface CMSContextType {
  settings: CMSStoreSettings;
  updateSettings: (newSettings: Partial<CMSStoreSettings>) => void;
  announcement: CMSAnnouncement;
  updateAnnouncement: (newAnn: Partial<CMSAnnouncement>) => void;
  hero: CMSHeroBanner;
  updateHero: (newHero: Partial<CMSHeroBanner>) => void;

  // Fragrance Management
  fragrances: CMSFragrance[];
  addFragrance: (f: Partial<CMSFragrance>) => Promise<void>;
  updateFragrance: (id: string, updated: Partial<CMSFragrance>) => Promise<void>;
  deleteFragrance: (id: string) => Promise<void>;

  // Sizes, Colors, Wicks
  sizes: CMSSize[];
  addSize: (s: Partial<CMSSize>) => Promise<void>;
  updateSize: (id: string, updated: Partial<CMSSize>) => Promise<void>;
  deleteSize: (id: string) => Promise<void>;

  colors: CMSColor[];
  addColor: (c: Partial<CMSColor>) => Promise<void>;
  updateColor: (id: string, updated: Partial<CMSColor>) => Promise<void>;
  deleteColor: (id: string) => Promise<void>;

  wickTypes: CMSWickType[];
  addWickType: (w: Partial<CMSWickType>) => Promise<void>;
  updateWickType: (id: string, updated: Partial<CMSWickType>) => Promise<void>;
  deleteWickType: (id: string) => Promise<void>;

  // Categories & Subcategories
  mainCategories: CMSMainCategory[];
  addMainCategory: (cat: Partial<CMSMainCategory>) => Promise<void>;
  updateMainCategory: (id: string, updated: Partial<CMSMainCategory>) => Promise<void>;
  deleteMainCategory: (id: string) => Promise<{ success: boolean; message?: string }>;

  subCategories: CMSSubCategory[];
  addSubCategory: (sub: Partial<CMSSubCategory>) => Promise<void>;
  updateSubCategory: (id: string, updated: Partial<CMSSubCategory>) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<{ success: boolean; message?: string }>;

  // Collections
  collections: CMSCollection[];
  addCollection: (col: Partial<CMSCollection>) => Promise<void>;
  updateCollection: (id: string, updated: Partial<CMSCollection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  assignProductsToCollection: (colId: string, productIds: string[]) => Promise<void>;

  // Products
  products: CMSProduct[];
  addProduct: (prod: CMSProduct) => Promise<void>;
  updateProduct: (id: string, updated: Partial<CMSProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Coupons, Pages, Media, Orders, Staff
  coupons: CMSCoupon[];
  addCoupon: (coupon: CMSCoupon) => Promise<void> | void;
  updateCoupon: (code: string, updated: Partial<CMSCoupon>) => Promise<void> | void;
  deleteCoupon: (code: string) => Promise<void> | void;
  pagesContent: CMSPagesContent;
  updatePagesContent: (updated: Partial<CMSPagesContent>) => void;
  customers: CMSCustomer[];
  addCustomer: (c: CMSCustomer) => Promise<void> | void;
  updateCustomer: (id: string, updated: Partial<CMSCustomer>) => Promise<void> | void;
  deleteCustomer: (id: string) => Promise<void> | void;
  mediaItems: CMSMediaItem[];
  addMediaItem: (m: CMSMediaItem) => void;
  deleteMediaItem: (id: string) => void;
  registerMediaAsset: (name: string, url: string, size?: string) => void;
  orders: CMSOrder[];
  addOrder: (order: CMSOrder) => Promise<void> | void;
  updateOrderStatus: (id: string, status: string) => Promise<void> | void;
  deleteOrder: (id: string) => Promise<void> | void;
  seoSettings: CMSSEOSetting[];
  updateSEO: (pageKey: string, updated: Partial<CMSSEOSetting>) => void;
  staffUsers: CMSStaffUser[];
  addStaffUser: (u: CMSStaffUser) => void;
  updateStaffUser: (id: string, updated: Partial<CMSStaffUser>) => void;
  deleteStaffUser: (id: string) => void;
  ordersCount: number;
  totalRevenue: number;
  incrementRevenue: (amount: number) => void;
}

// Default Seed Data
const DEFAULT_SETTINGS: CMSStoreSettings = {
  storeName: 'The Candle Lab',
  tagline: 'Botanical & Soy Artisans',
  currencySymbol: '₹',
  freeShippingThreshold: 1499,
  standardShippingFee: 99,
  supportEmail: 'support.thecandlelab@gmail.com',
  supportPhone: '+916264885453',
  studioAddress: 'Artisanal Studio, Bandra West, Mumbai, Maharashtra 400050',
  logoUrl: '/logo.jpeg',
  footerText: 'Artisanal hand-poured soy candles crafted in small batches using 100% natural botanical oils and lead-free wicks.',
  socialLinks: {
    instagram: 'https://instagram.com/thecandlelab.in',
    facebook: 'https://facebook.com/thecandlelab',
    pinterest: 'https://pinterest.com/thecandlelab',
    whatsapp: 'https://wa.me/916264885453',
  },
};

const DEFAULT_ANNOUNCEMENT: CMSAnnouncement = {
  text: '✨ Complimentary Luxury Candle Care Set on all orders above ₹1,999 | Code:',
  couponCode: 'LUXURY20',
  discountText: '(20% OFF)',
  visible: true,
};

const DEFAULT_HERO: CMSHeroBanner = {
  tagline: 'HANDCRAFTED BOTANICAL SOY CANDLES',
  title: 'Illuminate Your Sanctuary With Pure Elegance',
  subtitle: 'Artisanal soy wax candles infused with fine botanical essential oils, hand-poured in small luxury batches.',
  primaryBtnText: 'Explore Collections',
  secondaryBtnText: 'Our Atelier Story',
  imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1600&auto=format&fit=crop',
  featuredTitle: 'French Vanilla & Cinnamon',
  featuredSubtitle: '200g Heavy Italian Glass • 65 Hours',
  featuredImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
  layoutStyle: 'scentandchill',
};

export const DEFAULT_FRAGRANCES: CMSFragrance[] = [
  {
    id: 'fr111111-1111-1111-1111-111111111111',
    name: 'Vanilla Bourbon & Toasted Tonka',
    slug: 'vanilla-bourbon-toasted-tonka',
    imageUrl: 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Rich Madagascar vanilla pod infused with dark spiced rum and caramelized tonka.',
    scentProfile: 'Warm Gourmand & Spiced Vanilla',
    topNotes: 'Madagascar Vanilla Bean, Caramelized Sugar',
    heartNotes: 'Bourbon Pod, French Butter, Spiced Nutmeg',
    baseNotes: 'Toasted Tonka Bean, Golden Amber, Cashmere Musk',
    scentFamily: 'Gourmand',
    intensity: 'Rich',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'fr222222-2222-2222-2222-222222222222',
    name: 'Velvet Rose & Smoked Amber',
    slug: 'velvet-rose-smoked-amber',
    imageUrl: 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Sensual damask rose layered over smoked birch and nocturnal vetiver.',
    scentProfile: 'Romantic Floral & Smoked Woods',
    topNotes: 'Bergamot Zest, Pink Peppercorn, Dewy Violet',
    heartNotes: 'Turkish Damask Rose, Moroccan Jasmine, Clove Leaf',
    baseNotes: 'Smoked Birch, Amber Resins, Sandalwood, Dark Musk',
    scentFamily: 'Floral Woody',
    intensity: 'Intense',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'fr333333-3333-3333-3333-333333333333',
    name: 'Royal Cambodian Oud & Smoked Birch',
    slug: 'royal-cambodian-oud-smoked-birch',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Deep resinous agarwood blended with smoked leather and Himalayan cedar.',
    scentProfile: 'Majestic Resinous Oud & Leather',
    topNotes: 'Cardamom Pods, Incense Smoke, Wild Thyme',
    heartNotes: 'Cambodian Agarwood, Aged Leather, Iris',
    baseNotes: 'Smoked Birch, Atlas Cedarwood, Patchouli, Ambergris',
    scentFamily: 'Woody Oriental',
    intensity: 'Intense',
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'fr444444-4444-4444-4444-444444444444',
    name: 'French Lavender & Wild Chamomile',
    slug: 'french-lavender-wild-chamomile',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Soothing high-altitude French lavender blossoms with calming Roman chamomile.',
    scentProfile: 'Aromatherapeutic Herbal Serenity',
    topNotes: 'French Lavender Buds, Crushed Eucalyptus',
    heartNotes: 'Blue Chamomile, Clary Sage, Geranium',
    baseNotes: 'Clean White Musk, Blonde Cedar, Tonka',
    scentFamily: 'Fresh Herbal',
    intensity: 'Medium',
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'fr555555-5555-5555-5555-555555555555',
    name: 'Mysore Sandalwood & Spiced Saffron',
    slug: 'mysore-sandalwood-spiced-saffron',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Sacred Indian sandalwood paste infused with Kashmiri saffron strands.',
    scentProfile: 'Meditative Warm Sandalwood',
    topNotes: 'Kashmiri Saffron, Sweet Cardamom, Cinnamon Bark',
    heartNotes: 'Mysore Sandalwood, Rose Petals, Olibanum',
    baseNotes: 'Golden Amber, Vetiver Roots, Creamy Benzoin',
    scentFamily: 'Woody',
    intensity: 'Rich',
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 'fr666666-6666-6666-6666-666666666666',
    name: 'Arabica Dark Roast & Belgian Cocoa',
    slug: 'arabica-dark-roast-belgian-cocoa',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Freshly ground Arabica espresso beans with velvety roasted cacao notes.',
    scentProfile: 'Gourmand Roasted Coffee Bar',
    topNotes: 'Crushed Arabica Coffee Beans, Hazelnut Liqueur',
    heartNotes: 'Dark Belgian Cocoa, Steamed Milk Froth',
    baseNotes: 'Espresso Crema, Vanilla Extract, Brown Sugar',
    scentFamily: 'Gourmand',
    intensity: 'Rich',
    isActive: true,
    sortOrder: 6,
  },
];

export const DEFAULT_SIZES: CMSSize[] = [
  { id: 'sz111111-1111-1111-1111-111111111111', name: '100g Petite Travel', slug: '100g', unit: 'g', value: 100, isActive: true, sortOrder: 1 },
  { id: 'sz222222-2222-2222-2222-222222222222', name: '200g Classic Atelier', slug: '200g', unit: 'g', value: 200, isActive: true, sortOrder: 2 },
  { id: 'sz333333-3333-3333-3333-333333333333', name: '400g Grand Reserve (3-Wick)', slug: '400g', unit: 'g', value: 400, isActive: true, sortOrder: 3 },
  { id: 'sz444444-4444-4444-4444-444444444444', name: '100ml Reed Diffuser', slug: '100ml', unit: 'ml', value: 100, isActive: true, sortOrder: 4 },
  { id: 'sz555555-5555-5555-5555-555555555555', name: '200ml Luxury Flacon', slug: '200ml', unit: 'ml', value: 200, isActive: true, sortOrder: 5 },
];

export const DEFAULT_COLORS: CMSColor[] = [
  { id: 'cl111111-1111-1111-1111-111111111111', name: 'Ivory Warm Cream', hexCode: '#FAF6F0', isActive: true, sortOrder: 1 },
  { id: 'cl222222-2222-2222-2222-222222222222', name: 'Matte Obsidian Black', hexCode: '#1C130E', isActive: true, sortOrder: 2 },
  { id: 'cl333333-3333-3333-3333-333333333333', name: 'Royal 24K Gold Foil', hexCode: '#D4AF37', isActive: true, sortOrder: 3 },
  { id: 'cl444444-4444-4444-4444-444444444444', name: 'Blush Botanical Rose', hexCode: '#E8C5B8', isActive: true, sortOrder: 4 },
];

export const DEFAULT_WICK_TYPES: CMSWickType[] = [
  { id: 'wk111111-1111-1111-1111-111111111111', name: 'Organic Wood Wick (Crackling)', description: 'Sustainably sourced FSC wood that emits a soothing fireside crackle.', additionalPrice: 0, isActive: true, sortOrder: 1 },
  { id: 'wk222222-2222-2222-2222-222222222222', name: '100% Organic Cotton Wick (Silent)', description: 'Lead-free unbleached braided cotton wick for an ultra-clean, whisper-silent flame.', additionalPrice: 0, isActive: true, sortOrder: 2 },
];

export const DEFAULT_MAIN_CATEGORIES: CMSMainCategory[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Scented Soy Candles',
    slug: 'scented-soy-candles',
    description: 'Hand-poured pure soy wax candle creations infused with botanical fragrance oils.',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Home & Ambient Fragrance',
    slug: 'home-ambient-fragrance',
    description: 'Flame-free ambient diffusion systems including rattan reed diffusers and room mists.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Luxury Gift Sets & Ateliers',
    slug: 'luxury-gift-sets-ateliers',
    description: 'Bespoke gift box presentations embossed in gold foil with candle care brass tools.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 3,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Wax Melts & Aromatherapy',
    slug: 'wax-melts-aromatherapy',
    description: 'Snap bars and botanical wax melts designed for ceramic and electric warmers.',
    imageUrl: 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 4,
  },
];

export const DEFAULT_SUB_CATEGORIES: CMSSubCategory[] = [
  {
    id: 'sc111111-1111-1111-1111-111111111111',
    mainCategoryId: '11111111-1111-1111-1111-111111111111',
    mainCategoryName: 'Scented Soy Candles',
    name: 'Luxury Glass Jar Candles',
    slug: 'luxury-glass-jar-candles',
    description: 'Handcrafted in heavy frosted Italian glass vessels with timber dust covers.',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'sc222222-2222-2222-2222-222222222222',
    mainCategoryId: '11111111-1111-1111-1111-111111111111',
    mainCategoryName: 'Scented Soy Candles',
    name: 'Botanical Travel Tins',
    slug: 'botanical-travel-tins',
    description: 'Seamless brushed metallic travel tins for wanderlust and compact spaces.',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'sc333333-3333-3333-3333-333333333333',
    mainCategoryId: '22222222-2222-2222-2222-222222222222',
    mainCategoryName: 'Home & Ambient Fragrance',
    name: 'Rattan Reed Diffusers',
    slug: 'rattan-reed-diffusers',
    description: 'Continuous ambient scent throw lasting 90+ days without open flames.',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'sc444444-4444-4444-4444-444444444444',
    mainCategoryId: '33333333-3333-3333-3333-333333333333',
    mainCategoryName: 'Luxury Gift Sets & Ateliers',
    name: 'Festive & Bridal Gift Boxes',
    slug: 'festive-bridal-gift-boxes',
    description: 'Curated trios packaged in embossed rigid velvet-lined boxes.',
    isActive: true,
    sortOrder: 1,
  },
];

export const DEFAULT_COLLECTIONS: CMSCollection[] = [
  {
    id: 'ca111111-1111-1111-1111-111111111111',
    name: 'Best Sellers Atelier',
    title: 'Best Sellers Atelier',
    slug: 'best-sellers',
    desc: 'Our most beloved and iconic hand-poured olfactory signatures.',
    description: 'Our most beloved and iconic hand-poured olfactory signatures.',
    icon: '🔥',
    badge: 'BESTSELLER',
    count: '12 Candles',
    scents: 'Vanilla, Rose & Amber',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600',
    bannerImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200',
    collectionType: 'MANUAL',
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'ca222222-2222-2222-2222-222222222222',
    name: 'Royal 24K Luxury Reserve',
    title: 'Royal 24K Luxury Reserve',
    slug: 'royal-luxury-reserve',
    desc: 'Rare botanical extracts poured in custom frosted glass and gold-leaf vessels.',
    description: 'Rare botanical extracts poured in custom frosted glass and gold-leaf vessels.',
    icon: '✨',
    badge: 'LUXURY',
    count: '8 Candles',
    scents: 'Cambodian Oud & Damask Rose',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600',
    bannerImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200',
    collectionType: 'MANUAL',
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'ca333333-3333-3333-3333-333333333333',
    name: 'New Seasonal Releases',
    title: 'New Seasonal Releases',
    slug: 'new-arrivals',
    desc: 'Fresh batch formulations capturing the spirit of changing seasons.',
    description: 'Fresh batch formulations capturing the spirit of changing seasons.',
    icon: '🌟',
    badge: 'NEW BATCH',
    count: '6 Sets',
    scents: 'French Lavender & Bergamot',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600',
    bannerImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200',
    collectionType: 'MANUAL',
    isFeatured: true,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'ca444444-4444-4444-4444-444444444444',
    name: 'Gourmand & Coffee Bar',
    title: 'Gourmand & Coffee Bar',
    slug: 'gourmand-coffee',
    desc: 'Warm vanillas, roasted Arabica beans, tonka, and spiced confections.',
    description: 'Warm vanillas, roasted Arabica beans, tonka, and spiced confections.',
    icon: '☕',
    badge: 'GOURMAND',
    count: '5 Items',
    scents: 'Bourbon Vanilla, Espresso & Cocoa',
    image: 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=600',
    bannerImage: 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=1200',
    collectionType: 'MANUAL',
    isFeatured: true,
    isActive: true,
    sortOrder: 4,
  },
];

export const DEFAULT_PRODUCTS: CMSProduct[] = [
  {
    id: 'fa111111-1111-1111-1111-111111111111',
    name: 'Vanilla Bourbon & Spiced Tonka Atelier Candle',
    slug: 'vanilla-bourbon-spiced-tonka-candle',
    tagline: 'Madagascar vanilla pod with bourbon oak and warm toasted tonka',
    sku: 'TCL-VNB-001',
    price: 1499,
    originalPrice: 1899,
    rating: 4.96,
    reviewsCount: 142,
    mainCategoryId: '11111111-1111-1111-1111-111111111111',
    category: 'Scented Soy Candles',
    subCategoryId: 'sc111111-1111-1111-1111-111111111111',
    subCategory: 'Luxury Glass Jar Candles',
    collectionIds: ['ca111111-1111-1111-1111-111111111111', 'ca444444-4444-4444-4444-444444444444'],
    collection: 'Best Sellers Atelier',
    collections: ['Best Sellers Atelier', 'Gourmand & Coffee Bar'],
    scentProfile: 'Warm Gourmand & Spiced Vanilla',
    topNotes: 'Madagascar Vanilla Bean, Caramelized Sugar',
    heartNotes: 'Bourbon Pod, French Butter, Spiced Nutmeg',
    baseNotes: 'Toasted Tonka Bean, Golden Amber, Cashmere Musk',
    burnTime: '65 Hours',
    burnTimeHours: 65,
    waxType: '100% Organic Soy Wax',
    wickType: 'Organic Wood Wick (Crackling)',
    weightGrams: 250,
    shortDescription: 'Hand-poured luxury soy candle featuring warm French vanilla, aged bourbon cask oak, and caramelized tonka bean.',
    longDescription: 'An opulent gourmand masterpiece crafted for intimate evenings and serene living spaces. Poured by master artisans in small small-batch runs using 100% pure organic soy wax derived from American farms and therapeutic botanical extracts.',
    productDetails: {
      wax: '100% Pure Organic Soy Wax',
      burnTime: '60-65 Hours',
      wick: 'Organic FSC Wood Wick / Cotton',
      vessel: 'Heavy Frosted Glass Jar',
      dimensions: '8.5cm Dia x 10cm Height',
      weight: '250g Wax Net Weight (600g Gross)',
      madeIn: 'Handcrafted in Mumbai, India',
    },
    fragrancePyramid: {
      scentProfile: 'Warm Gourmand & Spiced Vanilla',
      topNotes: 'Madagascar Vanilla Bean, Caramelized Sugar',
      heartNotes: 'Bourbon Pod, French Butter, Spiced Nutmeg',
      baseNotes: 'Toasted Tonka Bean, Golden Amber, Cashmere Musk',
      intensity: 'Rich & Cozy',
    },
    howToUse: 'On first light, allow the candle wax to melt completely across the top diameter (approx 2-3 hours) to prevent wax memory tunneling. Always trim wick to 1/4 inch before each relighting.',
    safetyInstructions: 'Never leave a burning candle unattended. Keep away from flammable materials, drafty corridors, pets, and children. Discontinue use when 1/2 inch of unmelted wax remains.',
    whatsIncluded: '1x Hand-Poured Glass Candle (250g), 1x Custom Wooden Snuffer Lid, 1x Matchbox with Gold Matches, 1x Luxury Embossed Gift Box.',
    shippingReturns: 'Complimentary Pan-India Gold Express Delivery on orders above ₹1,499. Dispatched within 24 hours in shock-proof custom foam packaging. 30-Day Hassle-Free Exchange Guarantee.',
    inStock: true,
    isBestSeller: true,
    isNew: true,
    isFeatured: true,
    isTrending: true,
    isLimitedEdition: false,
    hasFragranceOption: true,
    hasSizeOption: true,
    hasColorOption: true,
    hasWickOption: true,
    hasGiftPackaging: true,
    hasCustomMessage: true,
    availableFragranceIds: ['fr111111-1111-1111-1111-111111111111', 'fr222222-2222-2222-2222-222222222222', 'fr555555-5555-5555-5555-555555555555'],
    availableSizeIds: ['sz111111-1111-1111-1111-111111111111', 'sz222222-2222-2222-2222-222222222222', 'sz333333-3333-3333-3333-333333333333'],
    availableColorIds: ['cl111111-1111-1111-1111-111111111111', 'cl222222-2222-2222-2222-222222222222'],
    availableWickTypeIds: ['wk111111-1111-1111-1111-111111111111', 'wk222222-2222-2222-2222-222222222222'],
    vesselDescription: 'Hand-poured in heavy frosted Italian glass vessel with custom wooden snuffer lid.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [
      {
        id: 'va111111-1111-1111-1111-111111111111',
        productId: 'fa111111-1111-1111-1111-111111111111',
        sku: 'TCL-VNB-100G-IVR',
        title: 'Vanilla Bourbon • 100g • Ivory',
        fragranceId: 'fr111111-1111-1111-1111-111111111111',
        fragranceName: 'Vanilla Bourbon & Toasted Tonka',
        sizeId: 'sz111111-1111-1111-1111-111111111111',
        sizeName: '100g Petite Travel',
        colorId: 'cl111111-1111-1111-1111-111111111111',
        colorName: 'Ivory Warm Cream',
        colorCode: '#FAF6F0',
        wickTypeId: 'wk111111-1111-1111-1111-111111111111',
        wickTypeName: 'Organic Wood Wick (Crackling)',
        price: 999,
        originalPrice: 1299,
        stock: 45,
        isDefault: false,
        status: 'ACTIVE',
      },
      {
        id: 'va222222-2222-2222-2222-222222222222',
        productId: 'fa111111-1111-1111-1111-111111111111',
        sku: 'TCL-VNB-200G-IVR',
        title: 'Vanilla Bourbon • 200g • Ivory',
        fragranceId: 'fr111111-1111-1111-1111-111111111111',
        fragranceName: 'Vanilla Bourbon & Toasted Tonka',
        sizeId: 'sz222222-2222-2222-2222-222222222222',
        sizeName: '200g Classic Atelier',
        colorId: 'cl111111-1111-1111-1111-111111111111',
        colorName: 'Ivory Warm Cream',
        colorCode: '#FAF6F0',
        wickTypeId: 'wk111111-1111-1111-1111-111111111111',
        wickTypeName: 'Organic Wood Wick (Crackling)',
        price: 1499,
        originalPrice: 1899,
        stock: 80,
        isDefault: true,
        status: 'ACTIVE',
      },
      {
        id: 'va333333-3333-3333-3333-333333333333',
        productId: 'fa111111-1111-1111-1111-111111111111',
        sku: 'TCL-VNB-400G-IVR',
        title: 'Vanilla Bourbon • 400g • Ivory',
        fragranceId: 'fr111111-1111-1111-1111-111111111111',
        fragranceName: 'Vanilla Bourbon & Toasted Tonka',
        sizeId: 'sz333333-3333-3333-3333-333333333333',
        sizeName: '400g Grand Reserve (3-Wick)',
        colorId: 'cl111111-1111-1111-1111-111111111111',
        colorName: 'Ivory Warm Cream',
        colorCode: '#FAF6F0',
        wickTypeId: 'wk111111-1111-1111-1111-111111111111',
        wickTypeName: 'Organic Wood Wick (Crackling)',
        price: 2199,
        originalPrice: 2699,
        stock: 25,
        isDefault: false,
        status: 'ACTIVE',
      },
      {
        id: 'va444444-4444-4444-4444-444444444444',
        productId: 'fa111111-1111-1111-1111-111111111111',
        sku: 'TCL-VRSA-200G-IVR',
        title: 'Velvet Rose • 200g • Ivory',
        fragranceId: 'fr222222-2222-2222-2222-222222222222',
        fragranceName: 'Velvet Rose & Smoked Amber',
        sizeId: 'sz222222-2222-2222-2222-222222222222',
        sizeName: '200g Classic Atelier',
        colorId: 'cl111111-1111-1111-1111-111111111111',
        colorName: 'Ivory Warm Cream',
        colorCode: '#FAF6F0',
        wickTypeId: 'wk111111-1111-1111-1111-111111111111',
        wickTypeName: 'Organic Wood Wick (Crackling)',
        price: 1499,
        originalPrice: 1899,
        stock: 35,
        isDefault: false,
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: 'fa222222-2222-2222-2222-222222222222',
    name: 'Velvet Rose & Smoked Amber Luxury Jar',
    slug: 'velvet-rose-smoked-amber-jar',
    tagline: 'Nocturnal Damask rose blossoms with smoked birch and golden amber',
    sku: 'TCL-VRSA-002',
    price: 1599,
    originalPrice: 1999,
    rating: 4.94,
    reviewsCount: 98,
    mainCategoryId: '11111111-1111-1111-1111-111111111111',
    category: 'Scented Soy Candles',
    subCategoryId: 'sc111111-1111-1111-1111-111111111111',
    subCategory: 'Luxury Glass Jar Candles',
    collectionIds: ['ca111111-1111-1111-1111-111111111111', 'ca222222-2222-2222-2222-222222222222'],
    collection: 'Best Sellers Atelier',
    collections: ['Best Sellers Atelier', 'Royal 24K Luxury Reserve'],
    scentProfile: 'Romantic Floral & Smoked Woods',
    topNotes: 'Bergamot Zest, Pink Peppercorn, Dewy Violet',
    heartNotes: 'Turkish Damask Rose, Moroccan Jasmine, Clove Leaf',
    baseNotes: 'Smoked Birch, Amber Resins, Sandalwood, Dark Musk',
    burnTime: '65 Hours',
    burnTimeHours: 65,
    waxType: '100% Organic Soy Wax',
    wickType: 'Organic Wood Wick (Crackling)',
    weightGrams: 250,
    shortDescription: 'A deeply seductive floral-woody formulation balancing Turkish rose petals and smoldering amber resins.',
    longDescription: 'Formulated with cold-extracted Turkish damask rose petals and ancient Baltic amber resins. Designed to create a moody, romantic atmosphere in master bedrooms and luxury lounges.',
    productDetails: {
      wax: '100% Pure Organic Soy Wax',
      burnTime: '60-65 Hours',
      wick: 'Organic FSC Wood Wick',
      vessel: 'Italian Frosted Amber Glass',
      dimensions: '8.5cm Dia x 10cm Height',
      weight: '250g Wax Net Weight',
      madeIn: 'Handcrafted in Mumbai, India',
    },
    fragrancePyramid: {
      scentProfile: 'Romantic Floral & Smoked Woods',
      topNotes: 'Bergamot Zest, Pink Peppercorn, Dewy Violet',
      heartNotes: 'Turkish Damask Rose, Moroccan Jasmine, Clove Leaf',
      baseNotes: 'Smoked Birch, Amber Resins, Sandalwood, Dark Musk',
      intensity: 'Intense',
    },
    howToUse: 'Trim wick before every burn. Allow entire top pool to liquefy to the glass rim.',
    safetyInstructions: 'Keep away from flammable fabrics and pets. Do not burn for more than 4 hours at a time.',
    whatsIncluded: '1x Velvet Rose Luxury Candle, 1x Brushed Gold Metal Lid, 1x Velvet Gift Pouch.',
    shippingReturns: 'Ships within 24h. Free Express Delivery Pan-India.',
    inStock: true,
    isBestSeller: true,
    isNew: false,
    isFeatured: true,
    isTrending: true,
    isLimitedEdition: false,
    hasFragranceOption: true,
    hasSizeOption: true,
    hasColorOption: true,
    hasWickOption: true,
    hasGiftPackaging: true,
    hasCustomMessage: true,
    availableFragranceIds: ['fr222222-2222-2222-2222-222222222222', 'fr111111-1111-1111-1111-111111111111'],
    availableSizeIds: ['sz222222-2222-2222-2222-222222222222', 'sz333333-3333-3333-3333-333333333333'],
    availableColorIds: ['cl111111-1111-1111-1111-111111111111', 'cl444444-4444-4444-4444-444444444444'],
    availableWickTypeIds: ['wk111111-1111-1111-1111-111111111111'],
    vesselDescription: 'Hand-poured in Italian frosted amber glass jar.',
    image: 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [
      {
        id: 'va555555-5555-5555-5555-555555555555',
        productId: 'fa222222-2222-2222-2222-222222222222',
        sku: 'TCL-VR-200G-ROSE',
        title: 'Velvet Rose • 200g • Blush Rose',
        fragranceId: 'fr222222-2222-2222-2222-222222222222',
        fragranceName: 'Velvet Rose & Smoked Amber',
        sizeId: 'sz222222-2222-2222-2222-222222222222',
        sizeName: '200g Classic Atelier',
        colorId: 'cl444444-4444-4444-4444-444444444444',
        colorName: 'Blush Botanical Rose',
        colorCode: '#E8C5B8',
        wickTypeId: 'wk111111-1111-1111-1111-111111111111',
        wickTypeName: 'Organic Wood Wick (Crackling)',
        price: 1599,
        originalPrice: 1999,
        stock: 50,
        isDefault: true,
        status: 'ACTIVE',
      },
      {
        id: 'va666666-6666-6666-6666-666666666666',
        productId: 'fa222222-2222-2222-2222-222222222222',
        sku: 'TCL-VR-400G-ROSE',
        title: 'Velvet Rose • 400g • Blush Rose',
        fragranceId: 'fr222222-2222-2222-2222-222222222222',
        fragranceName: 'Velvet Rose & Smoked Amber',
        sizeId: 'sz333333-3333-3333-3333-333333333333',
        sizeName: '400g Grand Reserve (3-Wick)',
        colorId: 'cl444444-4444-4444-4444-444444444444',
        colorName: 'Blush Botanical Rose',
        colorCode: '#E8C5B8',
        wickTypeId: 'wk111111-1111-1111-1111-111111111111',
        wickTypeName: 'Organic Wood Wick (Crackling)',
        price: 2299,
        originalPrice: 2799,
        stock: 18,
        isDefault: false,
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: 'fa333333-3333-3333-3333-333333333333',
    name: 'Royal Cambodian Oud & Smoked Birch Grand Reserve',
    slug: 'royal-cambodian-oud-smoked-birch',
    tagline: 'Rare Cambodian agarwood with aged leather and smoky birch',
    sku: 'TCL-OUD-003',
    price: 2499,
    originalPrice: 2999,
    rating: 4.98,
    reviewsCount: 76,
    mainCategoryId: '11111111-1111-1111-1111-111111111111',
    category: 'Scented Soy Candles',
    subCategoryId: 'sc111111-1111-1111-1111-111111111111',
    subCategory: 'Luxury Glass Jar Candles',
    collectionIds: ['ca222222-2222-2222-2222-222222222222'],
    collection: 'Royal 24K Luxury Reserve',
    collections: ['Royal 24K Luxury Reserve'],
    scentProfile: 'Majestic Resinous Oud & Leather',
    topNotes: 'Cardamom Pods, Incense Smoke, Wild Thyme',
    heartNotes: 'Cambodian Agarwood, Aged Leather, Iris',
    baseNotes: 'Smoked Birch, Atlas Cedarwood, Patchouli, Ambergris',
    burnTime: '75 Hours',
    burnTimeHours: 75,
    waxType: 'Organic Soy & Coconut Wax Blend',
    wickType: 'Organic Wood Wick (Crackling)',
    weightGrams: 350,
    shortDescription: 'Our most majestic woody formulation infused with genuine Cambodian agarwood and Himalayan cedarwood.',
    longDescription: 'Reserved for connoisseurs of deep, mysterious oriental scents. Hand-poured in limited batches of 50 units with gold-leaf accents.',
    productDetails: {
      wax: '100% Organic Soy & Coconut Wax Blend',
      burnTime: '75 Hours',
      wick: 'Double Organic Wood Wick',
      vessel: 'Matte Obsidian Ceramic Jar',
      dimensions: '10cm Dia x 12cm Height',
      weight: '350g Wax Net Weight',
      madeIn: 'Handcrafted in Mumbai, India',
    },
    fragrancePyramid: {
      scentProfile: 'Majestic Resinous Oud & Leather',
      topNotes: 'Cardamom Pods, Incense Smoke, Wild Thyme',
      heartNotes: 'Cambodian Agarwood, Aged Leather, Iris',
      baseNotes: 'Smoked Birch, Atlas Cedarwood, Patchouli, Ambergris',
      intensity: 'Intense & Long-Lasting',
    },
    howToUse: 'Burn for 3 hours on first lighting. Ensure crackling double wick is trimmed to 4mm.',
    safetyInstructions: 'Extinguish using the included ceramic snuffer lid.',
    whatsIncluded: '1x Grand Reserve Oud Candle (350g), 1x Brass Wick Trimmer, 1x Luxury Rigid Presentation Box.',
    shippingReturns: 'Dispatched in reinforced presentation packaging. 30-Day Guarantee.',
    inStock: true,
    isBestSeller: false,
    isNew: true,
    isFeatured: true,
    isTrending: true,
    isLimitedEdition: true,
    hasFragranceOption: true,
    hasSizeOption: true,
    hasColorOption: true,
    hasWickOption: true,
    hasGiftPackaging: true,
    hasCustomMessage: true,
    availableFragranceIds: ['fr333333-3333-3333-3333-333333333333', 'fr555555-5555-5555-5555-555555555555'],
    availableSizeIds: ['sz222222-2222-2222-2222-222222222222', 'sz333333-3333-3333-3333-333333333333'],
    availableColorIds: ['cl222222-2222-2222-2222-222222222222', 'cl333333-3333-3333-3333-333333333333'],
    availableWickTypeIds: ['wk111111-1111-1111-1111-111111111111'],
    vesselDescription: 'Handcrafted in matte obsidian ceramic jar with 24K gold foil trim.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [
      {
        id: 'va777777-7777-7777-7777-777777777777',
        productId: 'fa333333-3333-3333-3333-333333333333',
        sku: 'TCL-OUD-200G-BLK',
        title: 'Royal Oud • 200g • Obsidian Black',
        fragranceId: 'fr333333-3333-3333-3333-333333333333',
        fragranceName: 'Royal Cambodian Oud & Smoked Birch',
        sizeId: 'sz222222-2222-2222-2222-222222222222',
        sizeName: '200g Classic Atelier',
        colorId: 'cl222222-2222-2222-2222-222222222222',
        colorName: 'Matte Obsidian Black',
        colorCode: '#1C130E',
        wickTypeId: 'wk111111-1111-1111-1111-111111111111',
        wickTypeName: 'Organic Wood Wick (Crackling)',
        price: 2499,
        originalPrice: 2999,
        stock: 30,
        isDefault: true,
        status: 'ACTIVE',
      },
      {
        id: 'va888888-8888-8888-8888-888888888888',
        productId: 'fa333333-3333-3333-3333-333333333333',
        sku: 'TCL-OUD-400G-BLK',
        title: 'Royal Oud • 400g • Obsidian Black',
        fragranceId: 'fr333333-3333-3333-3333-333333333333',
        fragranceName: 'Royal Cambodian Oud & Smoked Birch',
        sizeId: 'sz333333-3333-3333-3333-333333333333',
        sizeName: '400g Grand Reserve (3-Wick)',
        colorId: 'cl222222-2222-2222-2222-222222222222',
        colorName: 'Matte Obsidian Black',
        colorCode: '#1C130E',
        wickTypeId: 'wk111111-1111-1111-1111-111111111111',
        wickTypeName: 'Organic Wood Wick (Crackling)',
        price: 3499,
        originalPrice: 4199,
        stock: 15,
        isDefault: false,
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: 'fa444444-4444-4444-4444-444444444444',
    name: 'French Lavender & Chamomile Rattan Reed Diffuser',
    slug: 'french-lavender-chamomile-reed-diffuser',
    tagline: 'Continuous 90-day ambient aromatherapy without open flame',
    sku: 'TCL-DIF-004',
    price: 1299,
    originalPrice: 1599,
    rating: 4.91,
    reviewsCount: 54,
    mainCategoryId: '22222222-2222-2222-2222-222222222222',
    category: 'Home & Ambient Fragrance',
    subCategoryId: 'sc333333-3333-3333-3333-333333333333',
    subCategory: 'Rattan Reed Diffusers',
    collectionIds: ['ca333333-3333-3333-3333-333333333333'],
    collection: 'New Seasonal Releases',
    collections: ['New Seasonal Releases'],
    scentProfile: 'Aromatherapeutic Herbal Serenity',
    topNotes: 'French Lavender Buds, Crushed Eucalyptus',
    heartNotes: 'Blue Chamomile, Clary Sage, Geranium',
    baseNotes: 'Clean White Musk, Blonde Cedar, Tonka',
    burnTime: '90 Days Ambient Diffusion',
    waxType: 'Alcohol-Free Diffuser Carrier Oil',
    wickType: 'N/A (Fiber Reeds)',
    weightGrams: 100,
    shortDescription: 'Flame-free luxury rattan reed diffuser infused with therapeutic French lavender blossoms and Roman chamomile.',
    longDescription: 'Provides continuous, flame-free diffusion for powder rooms, bedrooms, and executive suites. Formulated with alcohol-free bio-solvent carrier oils that maximize scent dispersion for up to 90 days.',
    productDetails: {
      volume: '100ml / 200ml',
      duration: '90+ Days Ambient Diffusion',
      reeds: '8x Premium Porous Fiber Rattan Reeds',
      bottle: 'Heavy Tinted Glass Apothecary Bottle',
      carrier: '100% Bio-based Alcohol-Free Solvent',
      madeIn: 'Handcrafted in Mumbai, India',
    },
    fragrancePyramid: {
      scentProfile: 'Aromatherapeutic Herbal Serenity',
      topNotes: 'French Lavender Buds, Crushed Eucalyptus',
      heartNotes: 'Blue Chamomile, Clary Sage, Geranium',
      baseNotes: 'Clean White Musk, Blonde Cedar, Tonka',
      intensity: 'Continuous & Gentle',
    },
    howToUse: 'Insert all 8 fiber reeds into the glass flacon. Allow reeds to absorb oil for 24 hours. Flip reeds weekly for enhanced scent throw.',
    safetyInstructions: 'Do not ingest. Keep away from direct sunlight and open flames. Wipe any spills immediately from varnished surfaces.',
    whatsIncluded: '1x 100ml Glass Apothecary Flacon, 8x High-Absorption Black Fiber Reeds, 1x Gold Foil Gift Box.',
    shippingReturns: 'Free Shipping over ₹1,499. Dispatched in 24h.',
    inStock: true,
    isBestSeller: false,
    isNew: true,
    isFeatured: true,
    isTrending: false,
    isLimitedEdition: false,
    hasFragranceOption: true,
    hasSizeOption: true,
    hasColorOption: false,
    hasWickOption: false,
    hasGiftPackaging: true,
    hasCustomMessage: false,
    availableFragranceIds: ['fr444444-4444-4444-4444-444444444444', 'fr777777-7777-7777-7777-777777777777'],
    availableSizeIds: ['sz444444-4444-4444-4444-444444444444', 'sz555555-5555-5555-5555-555555555555'],
    availableColorIds: [],
    availableWickTypeIds: [],
    vesselDescription: 'Tinted glass apothecary diffuser flacon with 8 porous rattan reeds.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [
      {
        id: 'va999999-9999-9999-9999-999999999999',
        productId: 'fa444444-4444-4444-4444-444444444444',
        sku: 'TCL-DIF-100ML-LAV',
        title: 'French Lavender • 100ml Reed Diffuser',
        fragranceId: 'fr444444-4444-4444-4444-444444444444',
        fragranceName: 'French Lavender & Wild Chamomile',
        sizeId: 'sz444444-4444-4444-4444-444444444444',
        sizeName: '100ml Reed Diffuser',
        price: 1299,
        originalPrice: 1599,
        stock: 40,
        isDefault: true,
        status: 'ACTIVE',
      },
      {
        id: 'vaa11111-1111-1111-1111-111111111111',
        productId: 'fa444444-4444-4444-4444-444444444444',
        sku: 'TCL-DIF-200ML-LAV',
        title: 'French Lavender • 200ml Luxury Flacon',
        fragranceId: 'fr444444-4444-4444-4444-444444444444',
        fragranceName: 'French Lavender & Wild Chamomile',
        sizeId: 'sz555555-5555-5555-5555-555555555555',
        sizeName: '200ml Luxury Flacon',
        price: 1999,
        originalPrice: 2499,
        stock: 25,
        isDefault: false,
        status: 'ACTIVE',
      },
    ],
  },
];

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CMSStoreSettings>(DEFAULT_SETTINGS);
  const [announcement, setAnnouncement] = useState<CMSAnnouncement>(DEFAULT_ANNOUNCEMENT);
  const [hero, setHero] = useState<CMSHeroBanner>(DEFAULT_HERO);

  const [fragrances, setFragrances] = useState<CMSFragrance[]>(() => {
    try {
      const saved = localStorage.getItem(FRAGRANCES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_FRAGRANCES;
    } catch {
      return DEFAULT_FRAGRANCES;
    }
  });

  const [sizes, setSizes] = useState<CMSSize[]>(() => {
    try {
      const saved = localStorage.getItem(SIZES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SIZES;
    } catch {
      return DEFAULT_SIZES;
    }
  });

  const [colors, setColors] = useState<CMSColor[]>(() => {
    try {
      const saved = localStorage.getItem(COLORS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_COLORS;
    } catch {
      return DEFAULT_COLORS;
    }
  });

  const [wickTypes, setWickTypes] = useState<CMSWickType[]>(() => {
    try {
      const saved = localStorage.getItem(WICK_TYPES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_WICK_TYPES;
    } catch {
      return DEFAULT_WICK_TYPES;
    }
  });

  const [mainCategories, setMainCategories] = useState<CMSMainCategory[]>(() => {
    try {
      const saved = localStorage.getItem(MAIN_CATEGORIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_MAIN_CATEGORIES;
    } catch {
      return DEFAULT_MAIN_CATEGORIES;
    }
  });

  const [subCategories, setSubCategories] = useState<CMSSubCategory[]>(() => {
    try {
      const saved = localStorage.getItem(SUB_CATEGORIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SUB_CATEGORIES;
    } catch {
      return DEFAULT_SUB_CATEGORIES;
    }
  });

  const [collections, setCollections] = useState<CMSCollection[]>(() => {
    try {
      const saved = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_COLLECTIONS;
    } catch {
      return DEFAULT_COLLECTIONS;
    }
  });

  const [products, setProducts] = useState<CMSProduct[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupons, setCoupons] = useState<CMSCoupon[]>([]);
  const [pagesContent, setPagesContent] = useState<CMSPagesContent>({
    aboutUs: '',
    shippingPolicy: '',
    refundPolicy: '',
    termsConditions: '',
    privacyPolicy: '',
    faqList: [],
  });
  const [customers, setCustomers] = useState<CMSCustomer[]>([]);
  const [mediaItems, setMediaItems] = useState<CMSMediaItem[]>([]);
  const [orders, setOrders] = useState<CMSOrder[]>([]);
  const [seoSettings, setSeoSettings] = useState<CMSSEOSetting[]>([]);
  const [staffUsers, setStaffUsers] = useState<CMSStaffUser[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(FRAGRANCES_STORAGE_KEY, JSON.stringify(fragrances));
  }, [fragrances]);

  useEffect(() => {
    localStorage.setItem(SIZES_STORAGE_KEY, JSON.stringify(sizes));
  }, [sizes]);

  useEffect(() => {
    localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(colors));
  }, [colors]);

  useEffect(() => {
    localStorage.setItem(WICK_TYPES_STORAGE_KEY, JSON.stringify(wickTypes));
  }, [wickTypes]);

  useEffect(() => {
    localStorage.setItem(MAIN_CATEGORIES_STORAGE_KEY, JSON.stringify(mainCategories));
  }, [mainCategories]);

  useEffect(() => {
    localStorage.setItem(SUB_CATEGORIES_STORAGE_KEY, JSON.stringify(subCategories));
  }, [subCategories]);

  useEffect(() => {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // Load from Backend/Database
  useEffect(() => {
    async function loadLiveBackend() {
      try {
        // Fetch remote CMS Bundle
        const cmsBundle = await fetchCmsBundle();
        if (cmsBundle) {
          if (cmsBundle.settings) setSettings(cmsBundle.settings);
          if (cmsBundle.announcement) setAnnouncement(cmsBundle.announcement);
          if (cmsBundle.hero) setHero(cmsBundle.hero);
          if (cmsBundle.pagesContent) setPagesContent(cmsBundle.pagesContent);
          if (cmsBundle.seoSettings) setSeoSettings(cmsBundle.seoSettings);
        }

        // Fetch Fragrances from Supabase / API
        const dbFragrances = await supabaseFetch<any[]>('fragrances');
        if (dbFragrances && Array.isArray(dbFragrances) && dbFragrances.length > 0) {
          setFragrances(
            dbFragrances.map((f) => ({
              id: String(f.id),
              name: f.name,
              slug: f.slug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              imageUrl: f.image_url,
              shortDescription: f.short_description,
              scentProfile: f.scent_profile,
              topNotes: f.top_notes,
              heartNotes: f.heart_notes,
              baseNotes: f.base_notes,
              scentFamily: f.scent_family || 'Floral',
              intensity: f.intensity || 'Medium',
              isActive: f.is_active ?? true,
              sortOrder: f.sort_order ?? 0,
            }))
          );
        }

        // Fetch Sizes
        const dbSizes = await supabaseFetch<any[]>('sizes');
        if (dbSizes && Array.isArray(dbSizes) && dbSizes.length > 0) {
          setSizes(
            dbSizes.map((s) => ({
              id: String(s.id),
              name: s.name,
              slug: s.slug,
              unit: s.unit || 'g',
              value: Number(s.value || 100),
              isActive: s.is_active ?? true,
              sortOrder: s.sort_order ?? 0,
            }))
          );
        }

        // Fetch Colors
        const dbColors = await supabaseFetch<any[]>('colors');
        if (dbColors && Array.isArray(dbColors) && dbColors.length > 0) {
          setColors(
            dbColors.map((c) => ({
              id: String(c.id),
              name: c.name,
              hexCode: c.hex_code,
              swatchImage: c.swatch_image,
              isActive: c.is_active ?? true,
              sortOrder: c.sort_order ?? 0,
            }))
          );
        }

        // Fetch Wick Types
        const dbWicks = await supabaseFetch<any[]>('wick_types');
        if (dbWicks && Array.isArray(dbWicks) && dbWicks.length > 0) {
          setWickTypes(
            dbWicks.map((w) => ({
              id: String(w.id),
              name: w.name,
              description: w.description,
              additionalPrice: Number(w.additional_price || 0),
              isActive: w.is_active ?? true,
              sortOrder: w.sort_order ?? 0,
            }))
          );
        }

        // Fetch Main Categories
        const dbCategories = await supabaseFetch<any[]>('main_categories');
        if (dbCategories && Array.isArray(dbCategories) && dbCategories.length > 0) {
          setMainCategories(
            dbCategories.map((c) => ({
              id: String(c.id),
              name: c.name,
              slug: c.slug,
              description: c.description,
              imageUrl: c.image_url,
              bannerDesktop: c.banner_desktop,
              bannerMobile: c.banner_mobile,
              metaTitle: c.meta_title,
              metaDescription: c.meta_description,
              isActive: c.is_active ?? true,
              sortOrder: c.sort_order ?? 0,
            }))
          );
        }

        // Fetch Sub Categories
        const dbSubCategories = await supabaseFetch<any[]>('sub_categories');
        if (dbSubCategories && Array.isArray(dbSubCategories) && dbSubCategories.length > 0) {
          setSubCategories(
            dbSubCategories.map((s) => ({
              id: String(s.id),
              mainCategoryId: String(s.main_category_id),
              name: s.name,
              slug: s.slug,
              description: s.description,
              imageUrl: s.image_url,
              bannerDesktop: s.banner_desktop,
              bannerMobile: s.banner_mobile,
              metaTitle: s.meta_title,
              metaDescription: s.meta_description,
              isActive: s.is_active ?? true,
              sortOrder: s.sort_order ?? 0,
            }))
          );
        }

        // Fetch Collections
        const dbCollections = await supabaseFetch<any[]>('collections');
        if (dbCollections && Array.isArray(dbCollections) && dbCollections.length > 0) {
          setCollections(
            dbCollections.map((col) => ({
              id: String(col.id),
              name: col.name,
              title: col.name,
              slug: col.slug,
              desc: col.description || '',
              description: col.description || '',
              icon: col.icon_symbol || '✨',
              badge: 'ATELIER',
              count: 'Curated Selection',
              scents: col.name,
              image: col.banner_image || col.image_url || '',
              bannerImage: col.banner_image || '',
              imageUrl: col.image_url || '',
              collectionType: col.collection_type || 'MANUAL',
              ruleConditions: col.rule_conditions,
              metaTitle: col.meta_title,
              metaDescription: col.meta_description,
              isFeatured: col.is_featured ?? true,
              isActive: col.is_active ?? true,
              sortOrder: col.sort_order ?? 0,
            }))
          );
        }

        // Fetch Orders
        const dbOrders = await supabaseFetch<any[]>('orders', { query: 'order=created_at.desc' });
        if (dbOrders && Array.isArray(dbOrders) && dbOrders.length > 0) {
          const mappedOrders: CMSOrder[] = dbOrders.map((o) => ({
            id: o.order_number || String(o.id).slice(0, 8).toUpperCase(),
            customerName: o.customer_name || 'Valued Customer',
            email: o.customer_email || 'customer@thecandlelab.com',
            items: o.shipping_address || 'Artisanal Candle Selection',
            totalAmount: Number(o.total_amount || 0),
            paymentMethod: o.payment_method || 'Online UPI / Card',
            status: o.order_status || o.payment_status || 'Paid',
            date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          }));
          setOrders(mappedOrders);
          setOrdersCount(mappedOrders.length);
          const totalRev = mappedOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
          setTotalRevenue(totalRev);
        }

        // Fetch Customers
        const dbCustomers = await supabaseFetch<any[]>('customers', { query: 'order=created_at.desc' });
        if (dbCustomers && Array.isArray(dbCustomers) && dbCustomers.length > 0) {
          const mappedCustomers: CMSCustomer[] = dbCustomers.map((c) => ({
            id: String(c.id),
            name: c.full_name || 'Customer',
            email: c.email || '',
            ordersCount: 1,
            totalSpent: 0,
            tier: c.status === 'ACTIVE' ? 'Gold Connoisseur' : 'Classic Tier',
          }));
          setCustomers(mappedCustomers);
        }

        // Fetch Coupons
        const dbCoupons = await supabaseFetch<any[]>('coupons', { query: 'order=created_at.desc' });
        if (dbCoupons && Array.isArray(dbCoupons) && dbCoupons.length > 0) {
          const mappedCoupons: CMSCoupon[] = dbCoupons.map((cp) => ({
            code: cp.code,
            discountPercent: Number(cp.discount_percentage || 15),
            description: `Save ${cp.discount_percentage}% on orders above ₹${cp.min_order_amount || 0}`,
            active: cp.is_active !== false,
          }));
          setCoupons(mappedCoupons);
        }

        // Fetch Products with Images and Variants
        const dbProducts = await supabaseFetch<any[]>('products', { query: 'order=created_at.desc' });
        const dbImages = await supabaseFetch<any[]>('product_images');
        const dbVariants = await supabaseFetch<any[]>('product_variants');

        if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
          const imageMap = new Map<string, string[]>();
          (dbImages || []).forEach((img) => {
            const pId = String(img.product_id);
            const current = imageMap.get(pId) || [];
            if (img.image_url) {
              imageMap.set(pId, [...current, img.image_url]);
            }
          });

          const variantMap = new Map<string, CMSProductVariant[]>();
          (dbVariants || []).forEach((v) => {
            const pId = String(v.product_id);
            const current = variantMap.get(pId) || [];
            current.push({
              id: String(v.id),
              productId: pId,
              sku: v.sku || `SKU-${v.id}`,
              title: v.title || 'Default',
              fragranceId: v.fragrance_id ? String(v.fragrance_id) : undefined,
              fragranceName: v.fragrance_name,
              sizeId: v.size_id ? String(v.size_id) : undefined,
              sizeName: v.size_name,
              colorId: v.color_id ? String(v.color_id) : undefined,
              colorName: v.color_name,
              colorCode: v.color_code,
              wickTypeId: v.wick_type_id ? String(v.wick_type_id) : undefined,
              wickTypeName: v.wick_type_name,
              price: Number(v.price || 999),
              originalPrice: v.original_price ? Number(v.original_price) : undefined,
              stock: Number(v.stock ?? 50),
              imageUrl: v.image_url,
              isDefault: Boolean(v.is_default),
              status: v.status || 'ACTIVE',
            });
            variantMap.set(pId, current);
          });

          const mapped: CMSProduct[] = dbProducts.map((p) => {
            const gallery = imageMap.get(String(p.id)) || [];
            const primaryImg = gallery[0] || p.image_url || p.thumbnail || PRODUCT_IMAGE_PLACEHOLDER;
            const vars = variantMap.get(String(p.id)) || [];

            return {
              id: String(p.id),
              name: p.name,
              slug: p.slug,
              tagline: p.tagline,
              sku: p.sku || `TCL-${String(p.id).slice(0, 6)}`,
              price: Number(p.price || 999),
              originalPrice: Number(p.original_price || p.price || 1299),
              rating: Number(p.rating || 4.9),
              reviewsCount: Number(p.reviews_count || 12),
              mainCategoryId: p.main_category_id ? String(p.main_category_id) : undefined,
              category: p.tagline || '',
              subCategoryId: p.sub_category_id ? String(p.sub_category_id) : undefined,
              collectionIds: p.collection_id ? [String(p.collection_id)] : [],
              collection: '',
              collections: [],
              scentProfile: p.scent_profile || p.top_notes || '',
              topNotes: p.top_notes || '',
              heartNotes: p.heart_notes || '',
              baseNotes: p.base_notes || '',
              burnTime: p.burn_time || (p.burn_time_hours ? `${p.burn_time_hours} Hours` : ''),
              burnTimeHours: p.burn_time_hours || 0,
              waxType: p.wax_type || '',
              wickType: p.wick_type || '',
              weightGrams: p.weight_grams || 0,
              shortDescription: p.short_description || '',
              longDescription: p.long_description || '',
              productDetails: typeof p.product_details === 'object' ? p.product_details : undefined,
              fragrancePyramid: typeof p.fragrance_pyramid === 'object' ? p.fragrance_pyramid : undefined,
              howToUse: p.how_to_use,
              safetyInstructions: p.safety_instructions,
              whatsIncluded: p.whats_included,
              shippingReturns: p.shipping_returns,
              inStock: p.status === 'ACTIVE',
              isBestSeller: Boolean(p.is_bestseller),
              isNew: Boolean(p.is_newarrival),
              isFeatured: Boolean(p.is_featured),
              isTrending: Boolean(p.is_trending),
              isLimitedEdition: Boolean(p.is_limited_edition),
              hasFragranceOption: Boolean(p.has_fragrance_option),
              hasSizeOption: Boolean(p.has_size_option),
              hasColorOption: Boolean(p.has_color_option),
              hasWickOption: Boolean(p.has_wick_option),
              hasGiftPackaging: Boolean(p.has_gift_packaging),
              hasCustomMessage: Boolean(p.has_custom_message),
              availableFragranceIds: Array.isArray(p.available_fragrance_ids) ? p.available_fragrance_ids.map(String) : [],
              availableSizeIds: Array.isArray(p.available_size_ids) ? p.available_size_ids.map(String) : [],
              availableColorIds: Array.isArray(p.available_color_ids) ? p.available_color_ids.map(String) : [],
              availableWickTypeIds: Array.isArray(p.available_wick_type_ids) ? p.available_wick_type_ids.map(String) : [],
              vesselDescription: p.short_description || 'Hand-poured in Italian frosted glass jar.',
              image: primaryImg,
              imageUrl: primaryImg,
              images: gallery.length > 0 ? gallery : [primaryImg],
              variants: vars,
              metaTitle: p.meta_title,
              metaDescription: p.meta_description,
              metaKeywords: p.meta_keywords,
            };
          });

          setProducts(mapped);
        }
      } catch (err) {
        console.warn('Initial data hydration notice:', err);
      }
    }

    loadLiveBackend();
  }, []);

  // Settings & Banner mutations
  const updateSettings = (newSettings: Partial<CMSStoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveCmsBundle({ version: 1, settings: updated, announcement, hero, pagesContent, seoSettings, collections, mediaItems }).catch(() => {});
      return updated;
    });
  };

  const updateAnnouncement = (newAnn: Partial<CMSAnnouncement>) => {
    setAnnouncement((prev) => {
      const updated = { ...prev, ...newAnn };
      saveCmsBundle({ version: 1, settings, announcement: updated, hero, pagesContent, seoSettings, collections, mediaItems }).catch(() => {});
      return updated;
    });
  };

  const updateHero = (newHero: Partial<CMSHeroBanner>) => {
    setHero((prev) => {
      const updated = { ...prev, ...newHero };
      saveCmsBundle({ version: 1, settings, announcement, hero: updated, pagesContent, seoSettings, collections, mediaItems }).catch(() => {});
      return updated;
    });
  };

  // Fragrance Mutations
  const addFragrance = async (f: Partial<CMSFragrance>) => {
    const newFrag: CMSFragrance = {
      id: `fr-${Date.now()}`,
      name: f.name || 'New Fragrance',
      slug: f.slug || (f.name || 'new-fragrance').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      imageUrl: f.imageUrl,
      shortDescription: f.shortDescription,
      scentProfile: f.scentProfile,
      topNotes: f.topNotes,
      heartNotes: f.heartNotes,
      baseNotes: f.baseNotes,
      scentFamily: f.scentFamily || 'Floral',
      intensity: f.intensity || 'Medium',
      isActive: f.isActive ?? true,
      sortOrder: f.sortOrder ?? (fragrances.length + 1),
    };

    setFragrances((prev) => [...prev, newFrag]);

    try {
      await supabaseFetch('fragrances', {
        method: 'POST',
        body: {
          name: newFrag.name,
          slug: newFrag.slug,
          image_url: newFrag.imageUrl,
          short_description: newFrag.shortDescription,
          scent_profile: newFrag.scentProfile,
          top_notes: newFrag.topNotes,
          heart_notes: newFrag.heartNotes,
          base_notes: newFrag.baseNotes,
          scent_family: newFrag.scentFamily,
          intensity: newFrag.intensity,
          is_active: newFrag.isActive,
          sort_order: newFrag.sortOrder,
        },
      });
    } catch (err) {
      console.warn('Fragrance DB insert note:', err);
    }
  };

  const updateFragrance = async (id: string, updated: Partial<CMSFragrance>) => {
    setFragrances((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));

    try {
      await supabaseFetch('fragrances', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: {
          name: updated.name,
          slug: updated.slug,
          image_url: updated.imageUrl,
          short_description: updated.shortDescription,
          scent_profile: updated.scentProfile,
          top_notes: updated.topNotes,
          heart_notes: updated.heartNotes,
          base_notes: updated.baseNotes,
          scent_family: updated.scentFamily,
          intensity: updated.intensity,
          is_active: updated.isActive,
          sort_order: updated.sortOrder,
        },
      });
    } catch (err) {
      console.warn('Fragrance DB update note:', err);
    }
  };

  const deleteFragrance = async (id: string) => {
    setFragrances((prev) => prev.filter((f) => f.id !== id));
    try {
      await supabaseFetch('fragrances', { method: 'DELETE', query: `id=eq.${id}` });
    } catch (err) {
      console.warn('Fragrance DB delete note:', err);
    }
  };

  // Sizes Mutations
  const addSize = async (s: Partial<CMSSize>) => {
    const newSize: CMSSize = {
      id: `sz-${Date.now()}`,
      name: s.name || '200g',
      slug: s.slug || (s.name || '200g').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      unit: s.unit || 'g',
      value: s.value || 200,
      isActive: s.isActive ?? true,
      sortOrder: s.sortOrder ?? (sizes.length + 1),
    };
    setSizes((prev) => [...prev, newSize]);
    supabaseFetch('sizes', {
      method: 'POST',
      body: { name: newSize.name, slug: newSize.slug, unit: newSize.unit, value: newSize.value, is_active: newSize.isActive, sort_order: newSize.sortOrder },
    }).catch(() => {});
  };

  const updateSize = async (id: string, updated: Partial<CMSSize>) => {
    setSizes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    supabaseFetch('sizes', {
      method: 'PATCH',
      query: `id=eq.${id}`,
      body: { name: updated.name, slug: updated.slug, unit: updated.unit, value: updated.value, is_active: updated.isActive, sort_order: updated.sortOrder },
    }).catch(() => {});
  };

  const deleteSize = async (id: string) => {
    setSizes((prev) => prev.filter((s) => s.id !== id));
    supabaseFetch('sizes', { method: 'DELETE', query: `id=eq.${id}` }).catch(() => {});
  };

  // Colors Mutations
  const addColor = async (c: Partial<CMSColor>) => {
    const newColor: CMSColor = {
      id: `cl-${Date.now()}`,
      name: c.name || 'Ivory',
      hexCode: c.hexCode || '#FAF6F0',
      swatchImage: c.swatchImage,
      isActive: c.isActive ?? true,
      sortOrder: c.sortOrder ?? (colors.length + 1),
    };
    setColors((prev) => [...prev, newColor]);
    supabaseFetch('colors', {
      method: 'POST',
      body: { name: newColor.name, hex_code: newColor.hexCode, swatch_image: newColor.swatchImage, is_active: newColor.isActive, sort_order: newColor.sortOrder },
    }).catch(() => {});
  };

  const updateColor = async (id: string, updated: Partial<CMSColor>) => {
    setColors((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    supabaseFetch('colors', {
      method: 'PATCH',
      query: `id=eq.${id}`,
      body: { name: updated.name, hex_code: updated.hexCode, swatch_image: updated.swatchImage, is_active: updated.isActive, sort_order: updated.sortOrder },
    }).catch(() => {});
  };

  const deleteColor = async (id: string) => {
    setColors((prev) => prev.filter((c) => c.id !== id));
    supabaseFetch('colors', { method: 'DELETE', query: `id=eq.${id}` }).catch(() => {});
  };

  // Wick Types Mutations
  const addWickType = async (w: Partial<CMSWickType>) => {
    const newWick: CMSWickType = {
      id: `wk-${Date.now()}`,
      name: w.name || 'Wood Wick',
      description: w.description || 'Crackling wood wick',
      additionalPrice: w.additionalPrice || 0,
      isActive: w.isActive ?? true,
      sortOrder: w.sortOrder ?? (wickTypes.length + 1),
    };
    setWickTypes((prev) => [...prev, newWick]);
    supabaseFetch('wick_types', {
      method: 'POST',
      body: { name: newWick.name, description: newWick.description, additional_price: newWick.additionalPrice, is_active: newWick.isActive, sort_order: newWick.sortOrder },
    }).catch(() => {});
  };

  const updateWickType = async (id: string, updated: Partial<CMSWickType>) => {
    setWickTypes((prev) => prev.map((w) => (w.id === id ? { ...w, ...updated } : w)));
    supabaseFetch('wick_types', {
      method: 'PATCH',
      query: `id=eq.${id}`,
      body: { name: updated.name, description: updated.description, additional_price: updated.additionalPrice, is_active: updated.isActive, sort_order: updated.sortOrder },
    }).catch(() => {});
  };

  const deleteWickType = async (id: string) => {
    setWickTypes((prev) => prev.filter((w) => w.id !== id));
    supabaseFetch('wick_types', { method: 'DELETE', query: `id=eq.${id}` }).catch(() => {});
  };

  // Main Categories Mutations
  const addMainCategory = async (cat: Partial<CMSMainCategory>) => {
    const newCat: CMSMainCategory = {
      id: `cat-${Date.now()}`,
      name: cat.name || 'New Category',
      slug: cat.slug || (cat.name || 'new-category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: cat.description || '',
      imageUrl: cat.imageUrl,
      bannerDesktop: cat.bannerDesktop,
      bannerMobile: cat.bannerMobile,
      metaTitle: cat.metaTitle,
      metaDescription: cat.metaDescription,
      isActive: cat.isActive ?? true,
      sortOrder: cat.sortOrder ?? (mainCategories.length + 1),
    };
    setMainCategories((prev) => [...prev, newCat]);
    supabaseFetch('main_categories', {
      method: 'POST',
      body: {
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        image_url: newCat.imageUrl,
        banner_desktop: newCat.bannerDesktop,
        banner_mobile: newCat.bannerMobile,
        meta_title: newCat.metaTitle,
        meta_description: newCat.metaDescription,
        is_active: newCat.isActive,
        sort_order: newCat.sortOrder,
      },
    }).catch(() => {});
  };

  const updateMainCategory = async (id: string, updated: Partial<CMSMainCategory>) => {
    setMainCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    supabaseFetch('main_categories', {
      method: 'PATCH',
      query: `id=eq.${id}`,
      body: {
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        image_url: updated.imageUrl,
        banner_desktop: updated.bannerDesktop,
        banner_mobile: updated.bannerMobile,
        meta_title: updated.metaTitle,
        meta_description: updated.metaDescription,
        is_active: updated.isActive,
        sort_order: updated.sortOrder,
      },
    }).catch(() => {});
  };

  const deleteMainCategory = async (id: string): Promise<{ success: boolean; message?: string }> => {
    const count = products.filter((p) => p.mainCategoryId === id).length;
    if (count > 0) {
      return {
        success: false,
        message: `Cannot delete category because it contains ${count} product(s). Please reassign products first.`,
      };
    }
    setMainCategories((prev) => prev.filter((c) => c.id !== id));
    supabaseFetch('main_categories', { method: 'DELETE', query: `id=eq.${id}` }).catch(() => {});
    return { success: true };
  };

  // Sub Categories Mutations
  const addSubCategory = async (sub: Partial<CMSSubCategory>) => {
    const parentCat = mainCategories.find((c) => c.id === sub.mainCategoryId);
    const newSub: CMSSubCategory = {
      id: `sc-${Date.now()}`,
      mainCategoryId: sub.mainCategoryId || (mainCategories[0]?.id ?? '11111111-1111-1111-1111-111111111111'),
      mainCategoryName: parentCat?.name,
      name: sub.name || 'New Subcategory',
      slug: sub.slug || (sub.name || 'new-sub').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: sub.description || '',
      imageUrl: sub.imageUrl,
      bannerDesktop: sub.bannerDesktop,
      bannerMobile: sub.bannerMobile,
      metaTitle: sub.metaTitle,
      metaDescription: sub.metaDescription,
      isActive: sub.isActive ?? true,
      sortOrder: sub.sortOrder ?? (subCategories.length + 1),
    };
    setSubCategories((prev) => [...prev, newSub]);
    supabaseFetch('sub_categories', {
      method: 'POST',
      body: {
        main_category_id: newSub.mainCategoryId,
        name: newSub.name,
        slug: newSub.slug,
        description: newSub.description,
        image_url: newSub.imageUrl,
        banner_desktop: newSub.bannerDesktop,
        banner_mobile: newSub.bannerMobile,
        meta_title: newSub.metaTitle,
        meta_description: newSub.metaDescription,
        is_active: newSub.isActive,
        sort_order: newSub.sortOrder,
      },
    }).catch(() => {});
  };

  const updateSubCategory = async (id: string, updated: Partial<CMSSubCategory>) => {
    setSubCategories((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    supabaseFetch('sub_categories', {
      method: 'PATCH',
      query: `id=eq.${id}`,
      body: {
        main_category_id: updated.mainCategoryId,
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        image_url: updated.imageUrl,
        banner_desktop: updated.bannerDesktop,
        banner_mobile: updated.bannerMobile,
        meta_title: updated.metaTitle,
        meta_description: updated.metaDescription,
        is_active: updated.isActive,
        sort_order: updated.sortOrder,
      },
    }).catch(() => {});
  };

  const deleteSubCategory = async (id: string): Promise<{ success: boolean; message?: string }> => {
    const count = products.filter((p) => p.subCategoryId === id).length;
    if (count > 0) {
      return {
        success: false,
        message: `Cannot delete subcategory because it contains ${count} product(s). Please reassign products first.`,
      };
    }
    setSubCategories((prev) => prev.filter((s) => s.id !== id));
    supabaseFetch('sub_categories', { method: 'DELETE', query: `id=eq.${id}` }).catch(() => {});
    return { success: true };
  };

  // Collections Mutations
  const addCollection = async (col: Partial<CMSCollection>) => {
    const newCol: CMSCollection = {
      id: col.id || `col-${Date.now()}`,
      name: col.name || col.title || 'New Collection',
      title: col.title || col.name || 'New Collection',
      slug: col.slug || (col.title || col.name || 'new-col').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      desc: col.desc || col.description || '',
      description: col.description || col.desc || '',
      icon: col.icon || '✨',
      badge: col.badge || 'ATELIER',
      count: 'Curated Collection',
      scents: col.scents || 'Signature Scents',
      image: col.image || col.bannerImage || '',
      bannerImage: col.bannerImage || col.image || '',
      imageUrl: col.imageUrl || '',
      collectionType: col.collectionType || 'MANUAL',
      ruleConditions: col.ruleConditions,
      isFeatured: col.isFeatured ?? true,
      isActive: col.isActive ?? true,
      sortOrder: col.sortOrder ?? (collections.length + 1),
      productIds: col.productIds || [],
    };
    setCollections((prev) => [...prev, newCol]);
    supabaseFetch('collections', {
      method: 'POST',
      body: {
        name: newCol.name,
        slug: newCol.slug,
        description: newCol.description,
        banner_image: newCol.bannerImage,
        image_url: newCol.imageUrl,
        icon_symbol: newCol.icon,
        collection_type: newCol.collectionType,
        rule_conditions: newCol.ruleConditions,
        is_featured: newCol.isFeatured,
        is_active: newCol.isActive,
        sort_order: newCol.sortOrder,
      },
    }).catch(() => {});
  };

  const updateCollection = async (id: string, updated: Partial<CMSCollection>) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updated,
              name: updated.name || updated.title || c.name,
              title: updated.title || updated.name || c.title,
              description: updated.description || updated.desc || c.description,
              desc: updated.desc || updated.description || c.desc,
            }
          : c
      )
    );
    supabaseFetch('collections', {
      method: 'PATCH',
      query: `id=eq.${id}`,
      body: {
        name: updated.name || updated.title,
        slug: updated.slug,
        description: updated.description || updated.desc,
        banner_image: updated.bannerImage || updated.image,
        image_url: updated.imageUrl,
        icon_symbol: updated.icon,
        collection_type: updated.collectionType,
        rule_conditions: updated.ruleConditions,
        is_featured: updated.isFeatured,
        is_active: updated.isActive,
        sort_order: updated.sortOrder,
      },
    }).catch(() => {});
  };

  const deleteCollection = async (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    supabaseFetch('collections', { method: 'DELETE', query: `id=eq.${id}` }).catch(() => {});
  };

  const assignProductsToCollection = async (colId: string, productIds: string[]) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === colId ? { ...c, productIds } : c))
    );
    try {
      // Clear previous associations
      await supabaseFetch('product_collections', { method: 'DELETE', query: `collection_id=eq.${colId}` });
      if (productIds.length > 0) {
        const rows = productIds.map((pId) => ({ product_id: pId, collection_id: colId }));
        await supabaseFetch('product_collections', { method: 'POST', body: rows });
      }
    } catch (err) {
      console.warn('Collection product sync note:', err);
    }
  };

  // Product Images sync helper
  const syncProductImages = async (productId: string, primaryImage?: string, extraImages?: string[]) => {
    if (!productId) return;
    const all = [...new Set([primaryImage, ...(extraImages || [])].filter((url): url is string => Boolean(url) && url !== PRODUCT_IMAGE_PLACEHOLDER))];
    if (all.length === 0) return;

    try {
      await supabaseFetch('product_images', { method: 'DELETE', query: `product_id=eq.${productId}` });
      const rows = all.map((url, idx) => ({
        product_id: productId,
        image_url: url,
        is_primary: idx === 0,
        sort_order: idx,
      }));
      await supabaseFetch('product_images', { method: 'POST', body: rows });
    } catch (err) {
      console.warn('Sync product images note:', err);
    }
  };

  // Product Variants sync helper
  const syncProductVariants = async (productId: string, variants?: CMSProductVariant[]) => {
    if (!productId || !variants || variants.length === 0) return;
    try {
      await supabaseFetch('product_variants', { method: 'DELETE', query: `product_id=eq.${productId}` });
      const rows = variants.map((v) => ({
        product_id: productId,
        sku: v.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: v.title,
        fragrance_id: v.fragranceId,
        fragrance_name: v.fragranceName,
        size_id: v.sizeId,
        size_name: v.sizeName,
        color_id: v.colorId,
        color_name: v.colorName,
        color_code: v.colorCode,
        wick_type_id: v.wickTypeId,
        wick_type_name: v.wickTypeName,
        price: v.price,
        original_price: v.originalPrice,
        stock: v.stock ?? 50,
        low_stock_threshold: v.lowStockThreshold ?? 5,
        image_url: v.imageUrl,
        is_default: v.isDefault ?? false,
        status: v.status || 'ACTIVE',
      }));
      await supabaseFetch('product_variants', { method: 'POST', body: rows });
    } catch (err) {
      console.warn('Sync variants note:', err);
    }
  };

  // Products Mutations
  const addProduct = async (prod: CMSProduct) => {
    const realId = prod.id && !prod.id.startsWith('p-') ? prod.id : `fa${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const newProduct: CMSProduct = {
      ...prod,
      id: realId,
      slug: prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + String(Date.now()).slice(-4),
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Sync gallery images and variants
    syncProductImages(realId, newProduct.image || newProduct.imageUrl, newProduct.images);
    syncProductVariants(realId, newProduct.variants);

    try {
      await supabaseFetch('products', {
        method: 'POST',
        body: {
          id: realId,
          main_category_id: newProduct.mainCategoryId,
          sub_category_id: newProduct.subCategoryId,
          name: newProduct.name,
          slug: newProduct.slug,
          tagline: newProduct.tagline || newProduct.scentProfile,
          sku: newProduct.sku,
          price: newProduct.price,
          original_price: newProduct.originalPrice,
          short_description: newProduct.shortDescription || newProduct.vesselDescription,
          long_description: newProduct.longDescription,
          product_details: newProduct.productDetails,
          fragrance_pyramid: newProduct.fragrancePyramid,
          top_notes: newProduct.topNotes,
          heart_notes: newProduct.heartNotes,
          base_notes: newProduct.baseNotes,
          scent_profile: newProduct.scentProfile,
          wax_type: newProduct.waxType,
          wick_type: newProduct.wickType,
          burn_time: newProduct.burnTime,
          burn_time_hours: newProduct.burnTimeHours,
          weight_grams: newProduct.weightGrams,
          how_to_use: newProduct.howToUse,
          safety_instructions: newProduct.safetyInstructions,
          whats_included: newProduct.whatsIncluded,
          shipping_returns: newProduct.shippingReturns,
          rating: newProduct.rating || 4.9,
          reviews_count: newProduct.reviewsCount || 0,
          status: newProduct.inStock ? 'ACTIVE' : 'OUT_OF_STOCK',
          is_featured: newProduct.isFeatured || false,
          is_bestseller: newProduct.isBestSeller || false,
          is_new_arrival: newProduct.isNew || false,
          is_trending: newProduct.isTrending || false,
          is_limited_edition: newProduct.isLimitedEdition || false,
          has_fragrance_option: newProduct.hasFragranceOption ?? true,
          has_size_option: newProduct.hasSizeOption ?? true,
          has_color_option: newProduct.hasColorOption ?? false,
          has_wick_option: newProduct.hasWickOption ?? true,
          has_gift_packaging: newProduct.hasGiftPackaging ?? true,
          has_custom_message: newProduct.hasCustomMessage ?? false,
          available_fragrance_ids: newProduct.availableFragranceIds || [],
          available_size_ids: newProduct.availableSizeIds || [],
          available_color_ids: newProduct.availableColorIds || [],
          available_wick_type_ids: newProduct.availableWickTypeIds || [],
          collection_ids: newProduct.collectionIds || [],
          meta_title: newProduct.metaTitle,
          meta_description: newProduct.metaDescription,
          meta_keywords: newProduct.metaKeywords,
        },
      });
    } catch (err) {
      console.warn('Product DB insert note:', err);
    }
  };

  const updateProduct = async (id: string, updated: Partial<CMSProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );

    const merged = { ...products.find((p) => p.id === id), ...updated } as CMSProduct;
    syncProductImages(id, merged.image || merged.imageUrl, merged.images);
    syncProductVariants(id, merged.variants);

    try {
      await supabaseFetch('products', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: {
          main_category_id: merged.mainCategoryId,
          sub_category_id: merged.subCategoryId,
          name: merged.name,
          slug: merged.slug,
          tagline: merged.tagline || merged.scentProfile,
          sku: merged.sku,
          price: merged.price,
          original_price: merged.originalPrice,
          short_description: merged.shortDescription || merged.vesselDescription,
          long_description: merged.longDescription,
          product_details: merged.productDetails,
          fragrance_pyramid: merged.fragrancePyramid,
          top_notes: merged.topNotes,
          heart_notes: merged.heartNotes,
          base_notes: merged.baseNotes,
          scent_profile: merged.scentProfile,
          wax_type: merged.waxType,
          wick_type: merged.wickType,
          burn_time: merged.burnTime,
          burn_time_hours: merged.burnTimeHours,
          weight_grams: merged.weightGrams,
          how_to_use: merged.howToUse,
          safety_instructions: merged.safetyInstructions,
          whats_included: merged.whatsIncluded,
          shipping_returns: merged.shippingReturns,
          rating: merged.rating,
          reviews_count: merged.reviewsCount,
          status: merged.inStock ? 'ACTIVE' : 'OUT_OF_STOCK',
          is_featured: merged.isFeatured,
          is_bestseller: merged.isBestSeller,
          is_new_arrival: merged.isNew,
          is_trending: merged.isTrending,
          is_limited_edition: merged.isLimitedEdition,
          has_fragrance_option: merged.hasFragranceOption,
          has_size_option: merged.hasSizeOption,
          has_color_option: merged.hasColorOption,
          has_wick_option: merged.hasWickOption,
          has_gift_packaging: merged.hasGiftPackaging,
          has_custom_message: merged.hasCustomMessage,
          available_fragrance_ids: merged.availableFragranceIds,
          available_size_ids: merged.availableSizeIds,
          available_color_ids: merged.availableColorIds,
          available_wick_type_ids: merged.availableWickTypeIds,
          collection_ids: merged.collectionIds,
          meta_title: merged.metaTitle,
          meta_description: merged.metaDescription,
          meta_keywords: merged.metaKeywords,
        },
      });
    } catch (err) {
      console.warn('Product DB update note:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await supabaseFetch('products', { method: 'DELETE', query: `id=eq.${id}` });
    } catch (err) {
      console.warn('Product DB delete note:', err);
    }
  };

  // Coupons
  const addCoupon = async (coupon: CMSCoupon) => {
    setCoupons((prev) => [...prev, coupon]);
    try {
      await supabaseFetch('coupons', {
        method: 'POST',
        body: {
          code: coupon.code.toUpperCase().trim(),
          discount_percentage: coupon.discountPercent,
          is_active: coupon.active !== false,
        },
      });
    } catch (err) {
      console.warn('Coupon Supabase insert note:', err);
    }
  };

  const updateCoupon = async (code: string, updated: Partial<CMSCoupon>) => {
    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, ...updated } : c)));
    try {
      await supabaseFetch('coupons', {
        method: 'PATCH',
        query: `code=eq.${encodeURIComponent(code)}`,
        body: {
          discount_percentage: updated.discountPercent,
          is_active: updated.active,
        },
      });
    } catch (err) {
      console.warn('Coupon Supabase update note:', err);
    }
  };

  const deleteCoupon = async (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    try {
      await supabaseFetch('coupons', {
        method: 'DELETE',
        query: `code=eq.${encodeURIComponent(code)}`,
      });
    } catch (err) {
      console.warn('Coupon Supabase delete note:', err);
    }
  };

  // Pages, Customers, Media, Orders, SEO, Staff
  const updatePagesContent = (updated: Partial<CMSPagesContent>) => {
    setPagesContent((prev) => ({ ...prev, ...updated }));
  };

  const addCustomer = async (c: CMSCustomer) => {
    setCustomers((prev) => [c, ...prev]);
    try {
      const res = await supabaseFetch<any[]>('customers', {
        method: 'POST',
        body: {
          full_name: c.name,
          email: c.email,
          status: c.tier === 'VIP Gold' || c.tier === 'Platinum' ? 'VIP' : 'ACTIVE',
        },
      });
      if (res && res[0]?.id) {
        setCustomers((prev) =>
          prev.map((item) => (item.id === c.id ? { ...item, id: String(res[0].id) } : item))
        );
      }
    } catch (err) {
      console.warn('Customer Supabase insert note:', err);
    }
  };

  const updateCustomer = async (id: string, updated: Partial<CMSCustomer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    try {
      await supabaseFetch('customers', {
        method: 'PATCH',
        query: `id=eq.${encodeURIComponent(id)}`,
        body: {
          full_name: updated.name,
          email: updated.email,
        },
      });
    } catch (err) {
      console.warn('Customer Supabase update note:', err);
    }
  };

  const deleteCustomer = async (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    try {
      await supabaseFetch('customers', {
        method: 'DELETE',
        query: `id=eq.${encodeURIComponent(id)}`,
      });
    } catch (err) {
      console.warn('Customer Supabase delete note:', err);
    }
  };

  const registerMediaAsset = (name: string, url: string, size = '—') => {
    if (!url || url.startsWith('data:')) return;
    setMediaItems((prev) => {
      if (prev.some((m) => m.url === url)) return prev;
      return [{ id: `m-${Date.now()}`, name: name || 'Uploaded Asset', url, type: 'image', size }, ...prev];
    });
  };

  const addMediaItem = (m: CMSMediaItem) => setMediaItems((prev) => [m, ...prev]);
  const deleteMediaItem = (id: string) => setMediaItems((prev) => prev.filter((m) => m.id !== id));

  const addOrder = async (order: CMSOrder) => {
    setOrders((prev) => [order, ...prev]);
    setOrdersCount((prev) => prev + 1);
    setTotalRevenue((prev) => prev + (Number(order.totalAmount) || 0));
    try {
      await supabaseFetch('orders', {
        method: 'POST',
        body: {
          order_number: order.id,
          customer_name: order.customerName,
          customer_email: order.email,
          total_amount: order.totalAmount,
          payment_method: order.paymentMethod || 'Manual Entry',
          payment_status: 'PAID',
          order_status: order.status || 'Processing',
          shipping_address: order.items || 'Direct Store Order',
        },
      });
    } catch (err) {
      console.warn('Order Supabase insert note:', err);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await supabaseFetch('orders', {
        method: 'PATCH',
        query: `order_number=eq.${encodeURIComponent(id)}`,
        body: { order_status: status },
      });
    } catch (err) {
      console.warn('Order Supabase status update note:', err);
    }
  };

  const deleteOrder = async (id: string) => {
    setOrders((prev) => {
      const target = prev.find((o) => o.id === id);
      if (target) {
        setTotalRevenue((r) => Math.max(0, r - target.totalAmount));
        setOrdersCount((c) => Math.max(0, c - 1));
      }
      return prev.filter((o) => o.id !== id);
    });
    try {
      await supabaseFetch('orders', {
        method: 'DELETE',
        query: `order_number=eq.${encodeURIComponent(id)}`,
      });
    } catch (err) {
      console.warn('Order Supabase delete note:', err);
    }
  };

  const updateSEO = (pageKey: string, updated: Partial<CMSSEOSetting>) =>
    setSeoSettings((prev) => prev.map((s) => (s.pageKey === pageKey ? { ...s, ...updated } : s)));

  const addStaffUser = (u: CMSStaffUser) => setStaffUsers((prev) => [u, ...prev]);
  const updateStaffUser = (id: string, updated: Partial<CMSStaffUser>) =>
    setStaffUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
  const deleteStaffUser = (id: string) => setStaffUsers((prev) => prev.filter((u) => u.id !== id));

  const incrementRevenue = (amount: number) => {
    setTotalRevenue((prev) => prev + amount);
    setOrdersCount((prev) => prev + 1);
  };

  return (
    <CMSContext.Provider
      value={{
        settings,
        updateSettings,
        announcement,
        updateAnnouncement,
        hero,
        updateHero,

        fragrances,
        addFragrance,
        updateFragrance,
        deleteFragrance,

        sizes,
        addSize,
        updateSize,
        deleteSize,

        colors,
        addColor,
        updateColor,
        deleteColor,

        wickTypes,
        addWickType,
        updateWickType,
        deleteWickType,

        mainCategories,
        addMainCategory,
        updateMainCategory,
        deleteMainCategory,

        subCategories,
        addSubCategory,
        updateSubCategory,
        deleteSubCategory,

        collections,
        addCollection,
        updateCollection,
        deleteCollection,
        assignProductsToCollection,

        products,
        addProduct,
        updateProduct,
        deleteProduct,

        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        pagesContent,
        updatePagesContent,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        mediaItems,
        addMediaItem,
        deleteMediaItem,
        registerMediaAsset,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        seoSettings,
        updateSEO,
        staffUsers,
        addStaffUser,
        updateStaffUser,
        deleteStaffUser,
        ordersCount,
        totalRevenue,
        incrementRevenue,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = (): CMSContextType => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
