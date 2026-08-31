import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseFetch } from '../config/supabaseClient';
import { fetchCmsBundle, saveCmsBundle } from '../services/cmsRemote';
import { PRODUCT_IMAGE_PLACEHOLDER } from '../config/placeholders';
import { safeLocalStorageSet } from '../utils/storage';

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
  collectionId?: string;
  collection: string;
  collections?: string[];
  scentProfile: string;
  fragrance?: string;
  size?: string;
  color?: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  burnTime: string;
  burnTimeHours?: number;
  waxType?: string;
  wickType?: string;
  weightGrams?: number;
  weightVolume?: string;
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
  orderNumber?: string;
  customerName: string;
  email: string;
  customerEmail?: string;
  phone?: string;
  customerPhone?: string;
  address?: string;
  shippingAddress?: string;
  items: string;
  itemsList?: any[];
  itemsSummary?: string;
  totalAmount: number;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  paymentMethod: string;
  paymentId?: string;
  status: string;
  trackingNumber?: string;
  courier?: string;
  notes?: string;
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
  addStaffUser: (u: CMSStaffUser) => Promise<void> | void;
  updateStaffUser: (id: string, updated: Partial<CMSStaffUser>) => Promise<void> | void;
  deleteStaffUser: (id: string) => Promise<void> | void;
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
  imageUrl: '/hero_candle.png',
  featuredTitle: 'French Vanilla & Cinnamon',
  featuredSubtitle: '200g Heavy Italian Glass • 65 Hours',
  featuredImage: '/hero_candle.png',
};

export const DEFAULT_FRAGRANCES: CMSFragrance[] = [];
export const DEFAULT_SIZES: CMSSize[] = [];
export const DEFAULT_COLORS: CMSColor[] = [];
export const DEFAULT_WICK_TYPES: CMSWickType[] = [];
export const DEFAULT_MAIN_CATEGORIES: CMSMainCategory[] = [];
export const DEFAULT_SUB_CATEGORIES: CMSSubCategory[] = [];
export const DEFAULT_COLLECTIONS: CMSCollection[] = [];
export const DEFAULT_PRODUCTS: CMSProduct[] = [];

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CMSStoreSettings>(() => {
    try {
      const saved = localStorage.getItem('tcl_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [announcement, setAnnouncement] = useState<CMSAnnouncement>(() => {
    try {
      const saved = localStorage.getItem('tcl_announcement');
      return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENT;
    } catch {
      return DEFAULT_ANNOUNCEMENT;
    }
  });
  const [hero, setHero] = useState<CMSHeroBanner>(() => {
    try {
      const saved = localStorage.getItem('tcl_hero');
      return saved ? JSON.parse(saved) : DEFAULT_HERO;
    } catch {
      return DEFAULT_HERO;
    }
  });

  const [fragrances, setFragrances] = useState<CMSFragrance[]>(() => {
    try {
      const saved = localStorage.getItem(FRAGRANCES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sizes, setSizes] = useState<CMSSize[]>(() => {
    try {
      const saved = localStorage.getItem(SIZES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [colors, setColors] = useState<CMSColor[]>(() => {
    try {
      const saved = localStorage.getItem(COLORS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wickTypes, setWickTypes] = useState<CMSWickType[]>(() => {
    try {
      const saved = localStorage.getItem(WICK_TYPES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mainCategories, setMainCategories] = useState<CMSMainCategory[]>(() => {
    try {
      const saved = localStorage.getItem(MAIN_CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_MAIN_CATEGORIES;
    } catch {
      return DEFAULT_MAIN_CATEGORIES;
    }
  });

  const [subCategories, setSubCategories] = useState<CMSSubCategory[]>(() => {
    try {
      const saved = localStorage.getItem(SUB_CATEGORIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [collections, setCollections] = useState<CMSCollection[]>(() => {
    try {
      const saved = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_COLLECTIONS;
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

  // Sync to LocalStorage safely
  useEffect(() => {
    safeLocalStorageSet('tcl_settings', settings);
  }, [settings]);

  useEffect(() => {
    safeLocalStorageSet('tcl_announcement', announcement);
  }, [announcement]);

  useEffect(() => {
    safeLocalStorageSet('tcl_hero', hero);
  }, [hero]);

  useEffect(() => {
    safeLocalStorageSet(FRAGRANCES_STORAGE_KEY, fragrances);
  }, [fragrances]);

  useEffect(() => {
    safeLocalStorageSet(SIZES_STORAGE_KEY, sizes);
  }, [sizes]);

  useEffect(() => {
    safeLocalStorageSet(COLORS_STORAGE_KEY, colors);
  }, [colors]);

  useEffect(() => {
    safeLocalStorageSet(WICK_TYPES_STORAGE_KEY, wickTypes);
  }, [wickTypes]);

  useEffect(() => {
    safeLocalStorageSet(MAIN_CATEGORIES_STORAGE_KEY, mainCategories);
  }, [mainCategories]);

  useEffect(() => {
    safeLocalStorageSet(SUB_CATEGORIES_STORAGE_KEY, subCategories);
  }, [subCategories]);

  useEffect(() => {
    safeLocalStorageSet(COLLECTIONS_STORAGE_KEY, collections);
  }, [collections]);

  useEffect(() => {
    safeLocalStorageSet(PRODUCTS_STORAGE_KEY, products);
  }, [products]);

  // Load from Backend/Database
  useEffect(() => {
    async function loadLiveBackend() {
      try {
        // Fetch all remote endpoints concurrently with safe error isolation
        const [
          cmsBundleRes,
          fragrancesRes,
          sizesRes,
          colorsRes,
          wicksRes,
          categoriesRes,
          subCategoriesRes,
          collectionsRes,
          ordersRes,
          orderItemsRes,
          customersRes,
          couponsRes,
          adminsRes,
          productsRes,
          imagesRes,
          variantsRes,
        ] = await Promise.allSettled([
          fetchCmsBundle(),
          supabaseFetch<any[]>('fragrances'),
          supabaseFetch<any[]>('sizes'),
          supabaseFetch<any[]>('colors'),
          supabaseFetch<any[]>('wick_types'),
          supabaseFetch<any[]>('main_categories'),
          supabaseFetch<any[]>('sub_categories'),
          supabaseFetch<any[]>('collections'),
          supabaseFetch<any[]>('orders', { query: 'order=created_at.desc' }),
          supabaseFetch<any[]>('order_items'),
          supabaseFetch<any[]>('customers', { query: 'order=created_at.desc' }),
          supabaseFetch<any[]>('coupons', { query: 'order=created_at.desc' }),
          supabaseFetch<any[]>('admins', { query: 'order=created_at.desc' }),
          supabaseFetch<any[]>('products', { query: 'order=created_at.desc' }),
          supabaseFetch<any[]>('product_images'),
          supabaseFetch<any[]>('product_variants'),
        ]);

        // 1. CMS Bundle
        if (cmsBundleRes.status === 'fulfilled' && cmsBundleRes.value) {
          const bundle = cmsBundleRes.value;
          if (bundle.settings) setSettings((prev) => ({ ...prev, ...bundle.settings }));
          if (bundle.announcement) setAnnouncement((prev) => ({ ...prev, ...bundle.announcement }));
          if (bundle.hero) setHero((prev) => ({ ...prev, ...bundle.hero }));
          if (bundle.pagesContent) setPagesContent((prev) => ({ ...prev, ...bundle.pagesContent }));
          if (bundle.seoSettings && Array.isArray(bundle.seoSettings)) setSeoSettings(bundle.seoSettings);
          if (bundle.collections && Array.isArray(bundle.collections)) setCollections(bundle.collections);
          if (bundle.mediaItems && Array.isArray(bundle.mediaItems)) setMediaItems(bundle.mediaItems);
        }

        // 2. Fragrances
        if (fragrancesRes.status === 'fulfilled' && Array.isArray(fragrancesRes.value) && fragrancesRes.value.length > 0) {
          setFragrances(
            fragrancesRes.value.map((f) => ({
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

        // 3. Sizes
        if (sizesRes.status === 'fulfilled' && Array.isArray(sizesRes.value) && sizesRes.value.length > 0) {
          setSizes(
            sizesRes.value.map((s) => ({
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

        // 4. Colors
        if (colorsRes.status === 'fulfilled' && Array.isArray(colorsRes.value) && colorsRes.value.length > 0) {
          setColors(
            colorsRes.value.map((c) => ({
              id: String(c.id),
              name: c.name,
              hexCode: c.hex_code,
              swatchImage: c.swatch_image,
              isActive: c.is_active ?? true,
              sortOrder: c.sort_order ?? 0,
            }))
          );
        }

        // 5. Wick Types
        if (wicksRes.status === 'fulfilled' && Array.isArray(wicksRes.value) && wicksRes.value.length > 0) {
          setWickTypes(
            wicksRes.value.map((w) => ({
              id: String(w.id),
              name: w.name,
              description: w.description,
              additionalPrice: Number(w.additional_price || 0),
              isActive: w.is_active ?? true,
              sortOrder: w.sort_order ?? 0,
            }))
          );
        }

        // 6. Main Categories
        if (categoriesRes.status === 'fulfilled' && Array.isArray(categoriesRes.value) && categoriesRes.value.length > 0) {
          setMainCategories(
            categoriesRes.value.map((c) => ({
              id: String(c.id),
              name: c.name,
              slug: c.slug,
              description: c.description || '',
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

        // 7. Sub Categories
        if (subCategoriesRes.status === 'fulfilled' && Array.isArray(subCategoriesRes.value) && subCategoriesRes.value.length > 0) {
          setSubCategories(
            subCategoriesRes.value.map((s) => ({
              id: String(s.id),
              mainCategoryId: s.main_category_id ? String(s.main_category_id) : '',
              name: s.name,
              slug: s.slug,
              description: s.description || '',
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

        // 8. Collections
        if (collectionsRes.status === 'fulfilled' && Array.isArray(collectionsRes.value) && collectionsRes.value.length > 0) {
          setCollections(
            collectionsRes.value.map((col) => ({
              id: String(col.id),
              name: col.name,
              title: col.name,
              slug: col.slug,
              description: col.description || '',
              desc: col.description || '',
              image: col.image_url || col.banner_image || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
              bannerImage: col.banner_image,
              imageUrl: col.image_url || col.banner_image,
              icon: col.icon_symbol || '✨',
              badge: 'CURATED',
              count: 'Collection',
              scents: 'Artisanal Scents',
              isFeatured: col.is_featured ?? true,
              isActive: col.is_active ?? true,
              sortOrder: col.sort_order ?? 0,
            }))
          );
        }

        // 9. Orders & Order Items
        const localOrdersMap = new Map<string, any>();
        let localOrdersList: any[] = [];
        try {
          const userOrders = JSON.parse(localStorage.getItem('tcl_user_orders') || '[]');
          const cmsOrders = JSON.parse(localStorage.getItem('tcl_cms_orders') || '[]');
          const allOrders = JSON.parse(localStorage.getItem('thecandlelab_orders_all') || '[]');
          localOrdersList = [...userOrders, ...cmsOrders, ...allOrders];
          localOrdersList.forEach((lo: any) => {
            if (lo.id) localOrdersMap.set(String(lo.id), lo);
            if (lo.orderNumber) localOrdersMap.set(String(lo.orderNumber), lo);
          });
        } catch {}

        if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value) && ordersRes.value.length > 0) {
          const dbOrderItems = (orderItemsRes && orderItemsRes.status === 'fulfilled' && Array.isArray(orderItemsRes.value))
            ? orderItemsRes.value
            : [];

          const itemsByOrderId = new Map<string, any[]>();
          dbOrderItems.forEach((item: any) => {
            const ordKey = String(item.order_id);
            const current = itemsByOrderId.get(ordKey) || [];
            current.push({
              name: item.product_name,
              fragrance: item.fragrance,
              size: item.size,
              color: item.color,
              wickType: item.wick_type,
              sku: item.sku,
              quantity: item.quantity || 1,
              price: Number(item.unit_price || 0),
            });
            itemsByOrderId.set(ordKey, current);
          });

          const mappedOrders: CMSOrder[] = ordersRes.value.map((o) => {
            const ordId = o.order_number || String(o.id).slice(0, 8).toUpperCase();
            const rawDbId = String(o.id);
            const localMatch = localOrdersMap.get(ordId) || localOrdersMap.get(rawDbId);

            const itemsList = (itemsByOrderId.get(rawDbId) && itemsByOrderId.get(rawDbId)!.length > 0)
              ? itemsByOrderId.get(rawDbId)!
              : (localMatch?.itemsList && localMatch.itemsList.length > 0)
                ? localMatch.itemsList
                : Array.isArray(localMatch?.items) ? localMatch.items : [];

            let itemsSummary = '';
            if (itemsList.length > 0) {
              itemsSummary = itemsList.map((it: any) => `${it.quantity || 1}x ${it.name}${it.fragrance ? ` (${it.fragrance})` : ''}`).join(', ');
            } else if (localMatch?.items && typeof localMatch.items === 'string' && localMatch.items !== o.shipping_address) {
              itemsSummary = localMatch.items;
            } else {
              itemsSummary = `${o.customer_name ? o.customer_name + "'s" : 'Artisanal'} Candle Order`;
            }

            return {
              id: ordId,
              orderNumber: ordId,
              customerName: o.customer_name || localMatch?.customerName || 'Valued Customer',
              email: o.customer_email || localMatch?.customerEmail || localMatch?.email || 'customer@thecandlelab.com',
              customerEmail: o.customer_email || localMatch?.customerEmail || localMatch?.email || 'customer@thecandlelab.com',
              phone: localMatch?.customerPhone || localMatch?.phone || '',
              customerPhone: localMatch?.customerPhone || localMatch?.phone || '',
              address: (o.shipping_address || localMatch?.shippingAddress || localMatch?.address || 'Standard Delivery Destination').replace(/["{}]/g, '').replace(/,/g, ', '),
              shippingAddress: (o.shipping_address || localMatch?.shippingAddress || localMatch?.address || 'Standard Delivery Destination').replace(/["{}]/g, '').replace(/,/g, ', '),
              items: itemsSummary,
              itemsList: itemsList,
              totalAmount: Number(o.total_amount || localMatch?.totalAmount || 0),
              subtotal: localMatch?.subtotal,
              discount: localMatch?.discount,
              shipping: localMatch?.shipping,
              tax: localMatch?.tax,
              paymentMethod: o.payment_method || localMatch?.paymentMethod || 'Online UPI / Card',
              paymentId: localMatch?.paymentId,
              trackingNumber: localMatch?.trackingNumber,
              courier: localMatch?.courier,
              status: o.order_status || o.payment_status || localMatch?.status || 'Processing',
              date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : (localMatch?.date || new Date().toISOString().split('T')[0]),
            };
          });

          // Merge any purely local orders that aren't yet in Supabase
          const existingIds = new Set(mappedOrders.map((m) => m.id));
          const uniqueLocal = localOrdersList
            .filter((lo: any) => lo && lo.id && !existingIds.has(lo.id))
            .map((lo: any) => ({
              id: lo.id,
              orderNumber: lo.orderNumber || lo.id,
              customerName: lo.customerName || 'Valued Customer',
              email: lo.email || lo.customerEmail || 'customer@thecandlelab.com',
              customerEmail: lo.customerEmail || lo.email || 'customer@thecandlelab.com',
              phone: lo.phone || lo.customerPhone || '',
              customerPhone: lo.customerPhone || lo.phone || '',
              address: lo.address || lo.shippingAddress || 'Store Destination',
              shippingAddress: lo.shippingAddress || lo.address || 'Store Destination',
              items: lo.itemsSummary || (Array.isArray(lo.items) ? lo.items.map((i: any) => i.name).join(', ') : lo.items) || 'Handcrafted Candle',
              itemsList: lo.itemsList || (Array.isArray(lo.items) ? lo.items : []),
              totalAmount: Number(lo.totalAmount || 0),
              subtotal: lo.subtotal,
              discount: lo.discount,
              shipping: lo.shipping,
              tax: lo.tax,
              paymentMethod: lo.paymentMethod || 'Online UPI / Card',
              paymentId: lo.paymentId,
              trackingNumber: lo.trackingNumber,
              courier: lo.courier,
              status: lo.status || 'Processing',
              date: lo.date || new Date().toISOString().split('T')[0],
            }));

          const combinedOrders = [...mappedOrders, ...uniqueLocal];
          setOrders(combinedOrders);
          setOrdersCount(combinedOrders.length);
          const totalRev = combinedOrders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);
          setTotalRevenue(totalRev);
        } else if (localOrdersList.length > 0) {
          const uniqueLocal = Array.from(new Map(localOrdersList.map((lo) => [lo.id, lo])).values()).map((lo: any) => ({
            id: lo.id,
            orderNumber: lo.orderNumber || lo.id,
            customerName: lo.customerName || 'Valued Customer',
            email: lo.email || lo.customerEmail || 'customer@thecandlelab.com',
            customerEmail: lo.customerEmail || lo.email || 'customer@thecandlelab.com',
            phone: lo.phone || lo.customerPhone || '',
            customerPhone: lo.customerPhone || lo.phone || '',
            address: lo.address || lo.shippingAddress || 'Store Destination',
            shippingAddress: lo.shippingAddress || lo.address || 'Store Destination',
            items: lo.itemsSummary || (Array.isArray(lo.items) ? lo.items.map((i: any) => i.name).join(', ') : lo.items) || 'Handcrafted Candle',
            itemsList: lo.itemsList || (Array.isArray(lo.items) ? lo.items : []),
            totalAmount: Number(lo.totalAmount || 0),
            subtotal: lo.subtotal,
            discount: lo.discount,
            shipping: lo.shipping,
            tax: lo.tax,
            paymentMethod: lo.paymentMethod || 'Online UPI / Card',
            paymentId: lo.paymentId,
            trackingNumber: lo.trackingNumber,
            courier: lo.courier,
            status: lo.status || 'Processing',
            date: lo.date || new Date().toISOString().split('T')[0],
          }));
          setOrders(uniqueLocal);
          setOrdersCount(uniqueLocal.length);
          const totalRev = uniqueLocal.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);
          setTotalRevenue(totalRev);
        }

        // 10. Customers
        if (customersRes.status === 'fulfilled' && Array.isArray(customersRes.value) && customersRes.value.length > 0) {
          const mappedCustomers: CMSCustomer[] = customersRes.value.map((c) => ({
            id: String(c.id),
            name: c.full_name || 'Customer',
            email: c.email || '',
            ordersCount: 1,
            totalSpent: 0,
            tier: c.status === 'ACTIVE' ? 'Gold Connoisseur' : 'Classic Tier',
          }));
          setCustomers(mappedCustomers);
        }

        // 11. Coupons
        if (couponsRes.status === 'fulfilled' && Array.isArray(couponsRes.value) && couponsRes.value.length > 0) {
          const mappedCoupons: CMSCoupon[] = couponsRes.value.map((cp) => ({
            code: cp.code,
            discountPercent: Number(cp.discount_percentage || 15),
            description: `Save ${cp.discount_percentage}% on orders above ₹${cp.min_order_amount || 0}`,
            active: cp.is_active !== false,
          }));
          setCoupons(mappedCoupons);
        }

        // 12. Staff Users
        if (adminsRes.status === 'fulfilled' && Array.isArray(adminsRes.value) && adminsRes.value.length > 0) {
          const roleMap: Record<string, CMSStaffUser['role']> = {
            'SUPER_ADMIN': 'Super Admin',
            'ADMIN': 'Admin',
            'INVENTORY_MANAGER': 'Inventory Manager',
            'CONTENT_MANAGER': 'Content Manager',
            'MARKETING_MANAGER': 'Marketing Manager',
            'SUPPORT': 'Support',
          };
          const mappedAdmins: CMSStaffUser[] = adminsRes.value.map((adm) => ({
            id: String(adm.id),
            name: adm.full_name || 'Staff Member',
            email: adm.email,
            role: roleMap[adm.role] || 'Admin',
            active: adm.status === 'ACTIVE',
            password: adm.password_hash || '••••••••',
          }));
          setStaffUsers(mappedAdmins);
        }

        // 13. Products & Images & Variants
        const dbProducts = productsRes.status === 'fulfilled' && Array.isArray(productsRes.value) ? productsRes.value : [];
        const dbImages = imagesRes.status === 'fulfilled' && Array.isArray(imagesRes.value) ? imagesRes.value : [];
        const dbVariants = variantsRes.status === 'fulfilled' && Array.isArray(variantsRes.value) ? variantsRes.value : [];

        if (dbProducts.length > 0) {
          const imageMap = new Map<string, string[]>();
          dbImages.forEach((img) => {
            const pId = String(img.product_id);
            const current = imageMap.get(pId) || [];
            if (img.image_url) {
              imageMap.set(pId, [...current, img.image_url]);
            }
          });

          const variantMap = new Map<string, CMSProductVariant[]>();
          dbVariants.forEach((v) => {
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

          // Category and Collection lookup maps
          const catLookup = new Map<string, string>();
          if (categoriesRes.status === 'fulfilled' && Array.isArray(categoriesRes.value)) {
            categoriesRes.value.forEach((c: any) => catLookup.set(String(c.id), c.name));
          }
          (mainCategories || []).forEach((c) => catLookup.set(c.id, c.name));

          const fallbackDefaultCategory = (categoriesRes.status === 'fulfilled' && categoriesRes.value?.[0]?.name) || 'Luxury Scented Candles';

          const mapped: CMSProduct[] = dbProducts.map((p) => {
            const gallery = imageMap.get(String(p.id)) || [];
            const primaryImg = gallery[0] || p.image_url || p.thumbnail || PRODUCT_IMAGE_PLACEHOLDER;
            const vars = variantMap.get(String(p.id)) || [];
            const resolvedCat = p.main_category_id ? catLookup.get(String(p.main_category_id)) : undefined;

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
              category: resolvedCat || p.category || fallbackDefaultCategory,
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
              inStock: p.status ? p.status.toUpperCase() !== 'OUT_OF_STOCK' : true,
              isBestSeller: Boolean(p.is_bestseller),
              isNew: Boolean(p.is_newarrival),
              isFeatured: Boolean(p.is_featured),
              isTrending: Boolean(p.is_trending),
              isLimitedEdition: Boolean(p.is_limited_edition),
              hasFragranceOption: p.has_fragrance_option !== null && p.has_fragrance_option !== undefined ? Boolean(p.has_fragrance_option) : undefined,
              hasSizeOption: p.has_size_option !== null && p.has_size_option !== undefined ? Boolean(p.has_size_option) : undefined,
              hasColorOption: p.has_color_option !== null && p.has_color_option !== undefined ? Boolean(p.has_color_option) : undefined,
              hasWickOption: p.has_wick_option !== null && p.has_wick_option !== undefined ? Boolean(p.has_wick_option) : undefined,
              hasGiftPackaging: p.has_gift_packaging !== null && p.has_gift_packaging !== undefined ? Boolean(p.has_gift_packaging) : undefined,
              hasCustomMessage: p.has_custom_message !== null && p.has_custom_message !== undefined ? Boolean(p.has_custom_message) : undefined,
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

          setProducts(() => {
            try {
              localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mapped));
              window.dispatchEvent(new Event('tcl-cms-updated'));
            } catch {}
            return mapped;
          });
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

  // Generate valid standard RFC4122 UUID for PostgreSQL compatibility
  const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Fragrance Mutations
  const addFragrance = async (f: Partial<CMSFragrance>) => {
    const newFragId = f.id && f.id.length >= 32 ? f.id : generateUUID();
    const newFrag: CMSFragrance = {
      id: newFragId,
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
    const newId = s.id && s.id.length >= 32 ? s.id : generateUUID();
    const newSize: CMSSize = {
      id: newId,
      name: s.name || '200g',
      slug: s.slug || (s.name || '200g').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      unit: s.unit || 'g',
      value: s.value || 200,
      isActive: s.isActive ?? true,
      sortOrder: s.sortOrder ?? (sizes.length + 1),
    };
    setSizes((prev) => [...prev, newSize]);
    try {
      await supabaseFetch('sizes', {
        method: 'POST',
        body: { id: newId, name: newSize.name, slug: newSize.slug, unit: newSize.unit, value: newSize.value, is_active: newSize.isActive, sort_order: newSize.sortOrder },
      });
    } catch (err) {
      console.warn('Size insert note:', err);
    }
  };

  const updateSize = async (id: string, updated: Partial<CMSSize>) => {
    setSizes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    try {
      await supabaseFetch('sizes', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: { name: updated.name, slug: updated.slug, unit: updated.unit, value: updated.value, is_active: updated.isActive, sort_order: updated.sortOrder },
      });
    } catch (err) {
      console.warn('Size update note:', err);
    }
  };

  const deleteSize = async (id: string) => {
    setSizes((prev) => prev.filter((s) => s.id !== id));
    try {
      await supabaseFetch('sizes', { method: 'DELETE', query: `id=eq.${id}` });
    } catch (err) {
      console.warn('Size delete note:', err);
    }
  };

  // Colors Mutations
  const addColor = async (c: Partial<CMSColor>) => {
    const newId = c.id && c.id.length >= 32 ? c.id : generateUUID();
    const newColor: CMSColor = {
      id: newId,
      name: c.name || 'Ivory',
      hexCode: c.hexCode || '#FAF6F0',
      swatchImage: c.swatchImage,
      isActive: c.isActive ?? true,
      sortOrder: c.sortOrder ?? (colors.length + 1),
    };
    setColors((prev) => [...prev, newColor]);
    try {
      await supabaseFetch('colors', {
        method: 'POST',
        body: { id: newId, name: newColor.name, hex_code: newColor.hexCode, swatch_image: newColor.swatchImage, is_active: newColor.isActive, sort_order: newColor.sortOrder },
      });
    } catch (err) {
      console.warn('Color insert note:', err);
    }
  };

  const updateColor = async (id: string, updated: Partial<CMSColor>) => {
    setColors((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    try {
      await supabaseFetch('colors', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: { name: updated.name, hex_code: updated.hexCode, swatch_image: updated.swatchImage, is_active: updated.isActive, sort_order: updated.sortOrder },
      });
    } catch (err) {
      console.warn('Color update note:', err);
    }
  };

  const deleteColor = async (id: string) => {
    setColors((prev) => prev.filter((c) => c.id !== id));
    try {
      await supabaseFetch('colors', { method: 'DELETE', query: `id=eq.${id}` });
    } catch (err) {
      console.warn('Color delete note:', err);
    }
  };

  // Wick Types Mutations
  const addWickType = async (w: Partial<CMSWickType>) => {
    const newId = w.id && w.id.length >= 32 ? w.id : generateUUID();
    const newWick: CMSWickType = {
      id: newId,
      name: w.name || 'Wood Wick',
      description: w.description || 'Crackling wood wick',
      additionalPrice: w.additionalPrice || 0,
      isActive: w.isActive ?? true,
      sortOrder: w.sortOrder ?? (wickTypes.length + 1),
    };
    setWickTypes((prev) => [...prev, newWick]);
    try {
      await supabaseFetch('wick_types', {
        method: 'POST',
        body: { id: newId, name: newWick.name, description: newWick.description, additional_price: newWick.additionalPrice, is_active: newWick.isActive, sort_order: newWick.sortOrder },
      });
    } catch (err) {
      console.warn('Wick insert note:', err);
    }
  };

  const updateWickType = async (id: string, updated: Partial<CMSWickType>) => {
    setWickTypes((prev) => prev.map((w) => (w.id === id ? { ...w, ...updated } : w)));
    try {
      await supabaseFetch('wick_types', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: { name: updated.name, description: updated.description, additional_price: updated.additionalPrice, is_active: updated.isActive, sort_order: updated.sortOrder },
      });
    } catch (err) {
      console.warn('Wick update note:', err);
    }
  };

  const deleteWickType = async (id: string) => {
    setWickTypes((prev) => prev.filter((w) => w.id !== id));
    try {
      await supabaseFetch('wick_types', { method: 'DELETE', query: `id=eq.${id}` });
    } catch (err) {
      console.warn('Wick delete note:', err);
    }
  };

  // Main Categories Mutations
  const addMainCategory = async (cat: Partial<CMSMainCategory>) => {
    const newId = cat.id && cat.id.length >= 32 ? cat.id : generateUUID();
    const newCat: CMSMainCategory = {
      id: newId,
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
    try {
      await supabaseFetch('main_categories', {
        method: 'POST',
        body: {
          id: newId,
          name: newCat.name,
          slug: newCat.slug,
          description: newCat.description,
          image_url: newCat.imageUrl,
          is_active: newCat.isActive,
          sort_order: newCat.sortOrder,
        },
      });
    } catch (err) {
      console.warn('Category insert note:', err);
    }
  };

  const updateMainCategory = async (id: string, updated: Partial<CMSMainCategory>) => {
    setMainCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    try {
      await supabaseFetch('main_categories', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: {
          name: updated.name,
          slug: updated.slug,
          description: updated.description,
          image_url: updated.imageUrl,
          is_active: updated.isActive,
          sort_order: updated.sortOrder,
        },
      });
    } catch (err) {
      console.warn('Category update note:', err);
    }
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
    try {
      await supabaseFetch('main_categories', { method: 'DELETE', query: `id=eq.${id}` });
    } catch (err) {
      console.warn('Category delete note:', err);
    }
    return { success: true };
  };

  // Sub Categories Mutations
  const addSubCategory = async (sub: Partial<CMSSubCategory>) => {
    const newId = sub.id && sub.id.length >= 32 ? sub.id : generateUUID();
    const parentCat = mainCategories.find((c) => c.id === sub.mainCategoryId);
    const newSub: CMSSubCategory = {
      id: newId,
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
    try {
      await supabaseFetch('sub_categories', {
        method: 'POST',
        body: {
          id: newId,
          main_category_id: newSub.mainCategoryId,
          name: newSub.name,
          slug: newSub.slug,
          description: newSub.description,
          is_active: newSub.isActive,
          sort_order: newSub.sortOrder,
        },
      });
    } catch (err) {
      console.warn('Subcategory insert note:', err);
    }
  };

  const updateSubCategory = async (id: string, updated: Partial<CMSSubCategory>) => {
    setSubCategories((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    try {
      await supabaseFetch('sub_categories', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: {
          main_category_id: updated.mainCategoryId,
          name: updated.name,
          slug: updated.slug,
          description: updated.description,
          is_active: updated.isActive,
          sort_order: updated.sortOrder,
        },
      });
    } catch (err) {
      console.warn('Subcategory update note:', err);
    }
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
    try {
      await supabaseFetch('sub_categories', { method: 'DELETE', query: `id=eq.${id}` });
    } catch (err) {
      console.warn('Subcategory delete note:', err);
    }
    return { success: true };
  };

  // Collections Mutations
  const addCollection = async (col: Partial<CMSCollection>) => {
    const newId = col.id && col.id.length >= 32 ? col.id : generateUUID();
    const newCol: CMSCollection = {
      id: newId,
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
    try {
      await supabaseFetch('collections', {
        method: 'POST',
        body: {
          id: newId,
          name: newCol.name,
          slug: newCol.slug,
          description: newCol.description,
          banner_image: newCol.bannerImage || newCol.image,
          icon_symbol: newCol.icon,
          is_featured: newCol.isFeatured,
        },
      });
    } catch (err) {
      console.warn('Collection insert note:', err);
    }
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
    try {
      await supabaseFetch('collections', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: {
          name: updated.name,
          slug: updated.slug,
          description: updated.description,
          banner_image: updated.bannerImage || updated.image,
          icon_symbol: updated.icon,
          is_featured: updated.isFeatured,
        },
      });
    } catch (err) {
      console.warn('Collection update note:', err);
    }
  };

  const deleteCollection = async (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    try {
      await supabaseFetch('collections', { method: 'DELETE', query: `id=eq.${id}` });
    } catch (err) {
      console.warn('Collection delete note:', err);
    }
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

  // Product Images & Variants Persistence Helpers
  const syncProductImages = async (productId: string, primaryImage?: string, gallery?: string[]) => {
    try {
      const allUrls = Array.from(new Set([primaryImage, ...(gallery || [])].filter(Boolean) as string[]));
      await supabaseFetch('product_images', { method: 'DELETE', query: `product_id=eq.${productId}` });
      if (allUrls.length > 0) {
        const rows = allUrls.map((url, idx) => ({
          id: generateUUID(),
          product_id: productId,
          image_url: url,
          is_primary: idx === 0,
          sort_order: idx,
        }));
        await supabaseFetch('product_images', { method: 'POST', body: rows });
      }
    } catch (err) {
      console.warn('Product images sync note:', err);
    }
  };

  const syncProductVariants = async (productId: string, variants?: CMSProductVariant[]) => {
    try {
      await supabaseFetch('product_variants', { method: 'DELETE', query: `product_id=eq.${productId}` });
      if (variants && variants.length > 0) {
        const rows = variants.map((v, idx) => ({
          id: v.id && v.id.length >= 32 ? v.id : generateUUID(),
          product_id: productId,
          sku: v.sku || `SKU-${productId.slice(0, 4)}-${idx + 1}`,
          title: v.title || v.fragranceName || v.sizeName || `Variant ${idx + 1}`,
          fragrance_id: v.fragranceId && v.fragranceId.length >= 32 ? v.fragranceId : null,
          fragrance_name: v.fragranceName,
          size_id: v.sizeId && v.sizeId.length >= 32 ? v.sizeId : null,
          size_name: v.sizeName,
          color_id: v.colorId && v.colorId.length >= 32 ? v.colorId : null,
          color_name: v.colorName,
          color_code: v.colorCode,
          wick_type_id: v.wickTypeId && v.wickTypeId.length >= 32 ? v.wickTypeId : null,
          wick_type_name: v.wickTypeName,
          price: v.price || 999,
          original_price: v.originalPrice || v.price || 1299,
          stock: v.stock ?? 50,
          image_url: v.imageUrl,
          is_default: v.isDefault ?? (idx === 0),
          status: v.status || 'ACTIVE',
        }));
        await supabaseFetch('product_variants', { method: 'POST', body: rows });
      }
    } catch (err) {
      console.warn('Product variants sync note:', err);
    }
  };

  // Products Mutations
  const addProduct = async (product: Partial<CMSProduct>) => {
    const realId = product.id && product.id.length >= 32 ? product.id : generateUUID();
    const newProduct: CMSProduct = {
      id: realId,
      name: product.name || 'New Product',
      slug: product.slug || (product.name || 'new-product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: product.tagline || '',
      sku: product.sku || `TCL-${realId.slice(0, 6)}`,
      price: product.price || 999,
      originalPrice: product.originalPrice || product.price || 1299,
      rating: product.rating || 4.9,
      reviewsCount: product.reviewsCount || 0,
      mainCategoryId: product.mainCategoryId,
      category: product.category || 'Scented Soy Candles',
      subCategoryId: product.subCategoryId,
      collectionIds: product.collectionIds || [],
      collection: product.collection || '',
      collections: product.collections || [],
      scentProfile: product.scentProfile || '',
      topNotes: product.topNotes || '',
      heartNotes: product.heartNotes || '',
      baseNotes: product.baseNotes || '',
      burnTime: product.burnTime || '60 Hours',
      burnTimeHours: product.burnTimeHours || 60,
      waxType: product.waxType || '100% Botanical Soy Wax',
      wickType: product.wickType || 'Organic Wood Crackling Wick',
      weightGrams: product.weightGrams || 250,
      vesselDescription: product.vesselDescription || 'Hand-poured in Italian frosted glass jar.',
      shortDescription: product.shortDescription || '',
      longDescription: product.longDescription || '',
      inStock: product.inStock ?? true,
      isBestSeller: product.isBestSeller || false,
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      isTrending: product.isTrending || false,
      isLimitedEdition: product.isLimitedEdition || false,
      hasFragranceOption: product.hasFragranceOption ?? true,
      hasSizeOption: product.hasSizeOption ?? true,
      hasColorOption: product.hasColorOption ?? false,
      hasWickOption: product.hasWickOption ?? true,
      hasGiftPackaging: product.hasGiftPackaging ?? true,
      hasCustomMessage: product.hasCustomMessage ?? false,
      availableFragranceIds: product.availableFragranceIds || [],
      availableSizeIds: product.availableSizeIds || [],
      availableColorIds: product.availableColorIds || [],
      availableWickTypeIds: product.availableWickTypeIds || [],
      image: product.image || product.imageUrl || product.images?.[0] || '',
      imageUrl: product.image || product.imageUrl || product.images?.[0] || '',
      images: product.images && product.images.length > 0 ? product.images : [product.image || product.imageUrl || ''],
      variants: product.variants || [],
    };

    setProducts((prev) => {
      const next = [newProduct, ...prev.filter((p) => p.id !== realId)];
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('tcl-cms-updated'));
      } catch {}
      return next;
    });
    await syncProductImages(realId, newProduct.image, newProduct.images);
    await syncProductVariants(realId, newProduct.variants);

    try {
      await supabaseFetch('products', {
        method: 'POST',
        body: {
          id: realId,
          main_category_id: newProduct.mainCategoryId && newProduct.mainCategoryId.length >= 32 ? newProduct.mainCategoryId : null,
          sub_category_id: newProduct.subCategoryId && newProduct.subCategoryId.length >= 32 ? newProduct.subCategoryId : null,
          collection_id: newProduct.collectionIds?.[0] && newProduct.collectionIds[0].length >= 32 ? newProduct.collectionIds[0] : null,
          name: newProduct.name,
          slug: newProduct.slug,
          tagline: newProduct.tagline || newProduct.scentProfile,
          sku: newProduct.sku,
          price: newProduct.price,
          original_price: newProduct.originalPrice,
          short_description: newProduct.shortDescription || newProduct.vesselDescription,
          long_description: newProduct.longDescription,
          wax_type: newProduct.waxType,
          wick_type: newProduct.wickType,
          burn_time_hours: newProduct.burnTimeHours,
          weight_grams: newProduct.weightGrams,
          rating: newProduct.rating || 4.9,
          reviews_count: newProduct.reviewsCount || 0,
          status: newProduct.inStock ? 'ACTIVE' : 'OUT_OF_STOCK',
          is_featured: Boolean(newProduct.isFeatured),
          is_bestseller: Boolean(newProduct.isBestSeller),
          is_newarrival: Boolean(newProduct.isNew),
          is_trending: Boolean(newProduct.isTrending),
          has_fragrance_option: Boolean(newProduct.hasFragranceOption),
          has_size_option: Boolean(newProduct.hasSizeOption),
          has_color_option: Boolean(newProduct.hasColorOption),
          has_wick_option: Boolean(newProduct.hasWickOption),
          has_gift_packaging: Boolean(newProduct.hasGiftPackaging),
          has_custom_message: Boolean(newProduct.hasCustomMessage),
          available_fragrance_ids: newProduct.availableFragranceIds || [],
          available_size_ids: newProduct.availableSizeIds || [],
          available_color_ids: newProduct.availableColorIds || [],
          available_wick_type_ids: newProduct.availableWickTypeIds || [],
        },
      });
    } catch (err) {
      console.warn('Product DB insert note:', err);
    }
  };

  const updateProduct = async (id: string, updated: Partial<CMSProduct>) => {
    let nextProducts: CMSProduct[] = [];
    setProducts((prev) => {
      nextProducts = prev.map((p) => (p.id === id ? { ...p, ...updated } : p));
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(nextProducts));
        window.dispatchEvent(new Event('tcl-cms-updated'));
      } catch {}
      return nextProducts;
    });

    const merged = { ...products.find((p) => p.id === id), ...updated } as CMSProduct;
    syncProductImages(id, merged.image || merged.imageUrl, merged.images);
    syncProductVariants(id, merged.variants);

    try {
      await supabaseFetch('products', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: {
          main_category_id: merged.mainCategoryId && merged.mainCategoryId.length >= 32 ? merged.mainCategoryId : null,
          sub_category_id: merged.subCategoryId && merged.subCategoryId.length >= 32 ? merged.subCategoryId : null,
          collection_id: merged.collectionIds?.[0] && merged.collectionIds[0].length >= 32 ? merged.collectionIds[0] : null,
          name: merged.name,
          slug: merged.slug,
          tagline: merged.tagline || merged.scentProfile,
          sku: merged.sku,
          price: merged.price,
          original_price: merged.originalPrice,
          short_description: merged.shortDescription || merged.vesselDescription,
          long_description: merged.longDescription,
          wax_type: merged.waxType,
          wick_type: merged.wickType,
          burn_time_hours: merged.burnTimeHours,
          weight_grams: merged.weightGrams,
          rating: merged.rating,
          reviews_count: merged.reviewsCount,
          status: merged.inStock ? 'ACTIVE' : 'OUT_OF_STOCK',
          is_featured: Boolean(merged.isFeatured),
          is_bestseller: Boolean(merged.isBestSeller),
          is_newarrival: Boolean(merged.isNew),
          is_trending: Boolean(merged.isTrending),
          has_fragrance_option: Boolean(merged.hasFragranceOption),
          has_size_option: Boolean(merged.hasSizeOption),
          has_color_option: Boolean(merged.hasColorOption),
          has_wick_option: Boolean(merged.hasWickOption),
          has_gift_packaging: Boolean(merged.hasGiftPackaging),
          has_custom_message: Boolean(merged.hasCustomMessage),
          available_fragrance_ids: merged.availableFragranceIds || [],
          available_size_ids: merged.availableSizeIds || [],
          available_color_ids: merged.availableColorIds || [],
          available_wick_type_ids: merged.availableWickTypeIds || [],
        },
      });
    } catch (err) {
      console.warn('Product DB update note:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('tcl-cms-updated'));
      } catch {}
      return next;
    });

    try {
      // 1. Delete associated images in Supabase
      await supabaseFetch('product_images', { method: 'DELETE', query: `product_id=eq.${id}` });
      // 2. Delete associated variants in Supabase
      await supabaseFetch('product_variants', { method: 'DELETE', query: `product_id=eq.${id}` });
      // 3. Delete product row in Supabase
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
      const existing = JSON.parse(localStorage.getItem('tcl_cms_orders') || '[]');
      localStorage.setItem('tcl_cms_orders', JSON.stringify([order, ...existing]));
      window.dispatchEvent(new Event('tcl-orders-updated'));
    } catch {}

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
          shipping_address: order.address || 'Direct Store Order',
        },
      });
    } catch (err) {
      console.warn('Order Supabase insert note:', err);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === id ? { ...o, status } : o));
      try {
        localStorage.setItem('tcl_cms_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('tcl-orders-updated'));
      } catch {}
      return updated;
    });

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
      const updated = prev.filter((o) => o.id !== id);
      try {
        localStorage.setItem('tcl_cms_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('tcl-orders-updated'));
      } catch {}
      return updated;
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

  const addStaffUser = async (u: CMSStaffUser) => {
    const newId = u.id && u.id.length >= 32 ? u.id : generateUUID();
    const userWithId: CMSStaffUser = { ...u, id: newId };
    setStaffUsers((prev) => [userWithId, ...prev]);

    const roleReverseMap: Record<string, string> = {
      'Super Admin': 'SUPER_ADMIN',
      'Admin': 'ADMIN',
      'Inventory Manager': 'INVENTORY_MANAGER',
      'Content Manager': 'CONTENT_MANAGER',
      'Marketing Manager': 'MARKETING_MANAGER',
      'Support': 'SUPPORT',
    };

    try {
      await supabaseFetch('admins', {
        method: 'POST',
        body: {
          id: newId,
          email: u.email.trim().toLowerCase(),
          full_name: u.name,
          phone: '+919876543210',
          password_hash: u.password || 'admin123',
          role: roleReverseMap[u.role] || 'ADMIN',
          status: u.active ? 'ACTIVE' : 'INACTIVE',
        },
      });
    } catch (err) {
      console.warn('Admin insert error:', err);
    }
  };

  const updateStaffUser = async (id: string, updated: Partial<CMSStaffUser>) => {
    setStaffUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));

    const roleReverseMap: Record<string, string> = {
      'Super Admin': 'SUPER_ADMIN',
      'Admin': 'ADMIN',
      'Inventory Manager': 'INVENTORY_MANAGER',
      'Content Manager': 'CONTENT_MANAGER',
      'Marketing Manager': 'MARKETING_MANAGER',
      'Support': 'SUPPORT',
    };

    try {
      const body: any = {};
      if (updated.name) body.full_name = updated.name;
      if (updated.email) body.email = updated.email.trim().toLowerCase();
      if (updated.role) body.role = roleReverseMap[updated.role] || updated.role;
      if (updated.active !== undefined) body.status = updated.active ? 'ACTIVE' : 'INACTIVE';
      if (updated.password) body.password_hash = updated.password;

      await supabaseFetch('admins', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body,
      });
    } catch (err) {
      console.warn('Admin update error:', err);
    }
  };

  const deleteStaffUser = async (id: string) => {
    setStaffUsers((prev) => prev.filter((u) => u.id !== id));
    try {
      await supabaseFetch('admins', {
        method: 'DELETE',
        query: `id=eq.${id}`,
      });
    } catch (err) {
      console.warn('Admin delete error:', err);
    }
  };

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
