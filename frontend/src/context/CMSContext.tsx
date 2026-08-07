import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabaseFetch } from '../config/supabaseClient';
import { getApiUrl } from '../config/api';
import { fetchCmsBundle, saveCmsBundle, type CmsRemoteBundle } from '../services/cmsRemote';
import { PRODUCT_IMAGE_PLACEHOLDER } from '../config/placeholders';

const PRODUCTS_STORAGE_KEY = 'tcl_cms_products';
const DIRTY_PRODUCTS_STORAGE_KEY = 'tcl_cms_products_dirty';

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
}

export interface CMSCollection {
  id: string;
  title: string;
  icon: string;
  desc: string;
  badge: string;
  count: string;
  scents: string;
  image: string;
}

export interface CMSProduct {
  id: string;
  name: string;
  category: string;
  collection: string;
  scentProfile: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  burnTime: string;
  inStock: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  vesselDescription: string;
  imageUrl?: string;
  image?: string;
  images?: string[];
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
  collections: CMSCollection[];
  updateCollection: (id: string, updated: Partial<CMSCollection>) => void;
  addCollection: (col: CMSCollection) => void;
  deleteCollection: (id: string) => void;
  products: CMSProduct[];
  addProduct: (prod: CMSProduct) => Promise<void>;
  updateProduct: (id: string, updated: Partial<CMSProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  coupons: CMSCoupon[];
  addCoupon: (coupon: CMSCoupon) => void;
  updateCoupon: (code: string, updated: Partial<CMSCoupon>) => void;
  deleteCoupon: (code: string) => void;
  pagesContent: CMSPagesContent;
  updatePagesContent: (updated: Partial<CMSPagesContent>) => void;
  customers: CMSCustomer[];
  addCustomer: (c: CMSCustomer) => void;
  updateCustomer: (id: string, updated: Partial<CMSCustomer>) => void;
  deleteCustomer: (id: string) => void;
  mediaItems: CMSMediaItem[];
  addMediaItem: (m: CMSMediaItem) => void;
  deleteMediaItem: (id: string) => void;
  registerMediaAsset: (name: string, url: string, size?: string) => void;
  orders: CMSOrder[];
  addOrder: (order: CMSOrder) => void;
  updateOrderStatus: (id: string, status: string) => void;
  deleteOrder: (id: string) => void;
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
  footerText: 'Artisanal hand-poured soy candles crafted in small batches using 100% natural botanical oils and lead-free cotton wicks.',
  socialLinks: {
    instagram: 'https://instagram.com/thecandlelab.in',
    facebook: 'https://facebook.com/thecandlelab',
    pinterest: 'https://pinterest.com/thecandlelab',
    whatsapp: 'https://wa.me/916264885453',
  },
};

const DEFAULT_ANNOUNCEMENT: CMSAnnouncement = {
  text: '✨ Complimentary Luxury Candle Care Set on all orders above ₹1,999 | Code:',
  couponCode: 'LUXE20',
  discountText: '(20% OFF)',
  visible: true,
};

const DEFAULT_HERO: CMSHeroBanner = {
  tagline: 'HANDCRAFTED BOTANICAL SOY CANDLES',
  title: 'Illuminate Your Sanctuary With Pure Elegance',
  subtitle: 'Artisanal soy wax candles infused with fine botanical essential oils, hand-poured in small luxury batches.',
  primaryBtnText: 'Explore Collections',
  secondaryBtnText: 'Our Atelier Story',
  imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop',
};

const DEFAULT_COLLECTIONS: CMSCollection[] = [
  { id: 'col-1', title: 'Luxury Signature Collection', icon: '🕯️', desc: 'Hand-poured in Italian frosted glass vessels with wooden wicks.', badge: 'BESTSELLER', count: '12 Candles', scents: 'Vanilla, Oud & Rose', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600' },
  { id: 'col-2', title: 'Aromatherapy & Wellness', icon: '🌿', desc: 'Calming essential oil blends designed to soothe mind and body.', badge: 'NEW', count: '8 Candles', scents: 'Lavender, Eucalyptus & Sage', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600' },
  { id: 'col-3', title: 'Festive & Gift Atelier', icon: '🎁', desc: 'Exquisite gift sets wrapped in embossed gold-foil luxury boxes.', badge: 'GIFT BOX', count: '6 Sets', scents: 'Cinnamon, Amber & Saffron', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600' }
];

const DEFAULT_PRODUCTS: CMSProduct[] = [];

const DEFAULT_COUPONS: CMSCoupon[] = [];

const DEFAULT_PAGES_CONTENT: CMSPagesContent = {
  aboutUs: '',
  shippingPolicy: '',
  refundPolicy: '',
  termsConditions: '',
  privacyPolicy: '',
  faqList: [],
};

const DEFAULT_CUSTOMERS: CMSCustomer[] = [
];

const DEFAULT_MEDIA: CMSMediaItem[] = [
];

const DEFAULT_ORDERS: CMSOrder[] = [
];

const DEFAULT_SEO: CMSSEOSetting[] = [
  { pageKey: 'home', title: 'The Candle Lab — Handcrafted Botanical Soy Candles', description: 'Luxury handcrafted soy candles poured in small batches with pure essential oils.', keywords: 'luxury candles, soy candles, aromatherapy' },
  { pageKey: 'shop', title: 'Shop All Candles & Wax Melts — The Candle Lab', description: 'Browse our complete collection of botanical soy candles, travel tins, and wax melts.', keywords: 'shop candles, scented candles' },
];

const DEFAULT_STAFF: CMSStaffUser[] = [
  {
    id: 'u-superadmin-01',
    name: 'Master Super Admin',
    email: 'admin@thecandlelab.com',
    role: 'Super Admin',
    password: 'admin123',
    active: true,
  },
  {
    id: 'u-admin-02',
    name: 'Atelier Store Manager',
    email: 'manager@thecandlelab.in',
    role: 'Admin',
    password: 'admin123',
    active: true,
  },
];

const CMSContext = createContext<CMSContextType | undefined>(undefined);

const readStoredProducts = (): CMSProduct[] => {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readDirtyProductIds = (): string[] => {
  try {
    const saved = localStorage.getItem(DIRTY_PRODUCTS_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const writeDirtyProductIds = (ids: string[]) => {
  localStorage.setItem(DIRTY_PRODUCTS_STORAGE_KEY, JSON.stringify(Array.from(new Set(ids.map(String)))));
};

const markProductDirty = (id: string) => {
  writeDirtyProductIds([...readDirtyProductIds(), id]);
};

const clearProductDirty = (id: string) => {
  writeDirtyProductIds(readDirtyProductIds().filter((dirtyId) => dirtyId !== id));
};

const extractProductImages = (rawImages: any): string[] => {
  if (!Array.isArray(rawImages)) return [];
  return rawImages
    .map((img) => {
      if (typeof img === 'string') return img;
      return img?.image_url || img?.url || img?.src || '';
    })
    .filter(Boolean);
};

const resolveImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string' || url.trim() === '' || url === 'null') {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) {
    return cleanUrl;
  }
  if (cleanUrl.startsWith('/')) {
    return cleanUrl;
  }
  return `/${cleanUrl}`;
};

const mapDbProductToCMS = (p: any, imageMap?: Map<string, string[]>): CMSProduct => {
  const galleryFromTable = imageMap?.get(String(p.id)) || [];
  const galleryImages = [...new Set([...galleryFromTable, ...extractProductImages(p.images)])];
  const rawImage = p.image_url || p.thumbnail || p.image || galleryImages[0] || '';
  const primaryImage = resolveImageUrl(rawImage);
  const finalImages = galleryImages.length > 0 ? galleryImages.map(resolveImageUrl) : [primaryImage];

  return {
    id: String(p.id),
    name: (p.name || 'Artisanal Candle').trim(),
    category: p.category?.name || p.main_category?.name || p.mainCategory?.name || p.tagline || 'Scented Candles',
    collection: p.collection?.name || p.collection || 'Signature',
    scentProfile: p.tagline || p.fragrance || 'Artisanal',
    price: Number(p.price || 999),
    originalPrice: Number(p.original_price || p.price || 1299),
    rating: Number(p.rating || 4.9),
    reviewsCount: Number(p.reviews_count || p.review_count || 12),
    topNotes: p.top_notes || '',
    heartNotes: p.heart_notes || '',
    baseNotes: p.base_notes || '',
    burnTime: p.burn_time || (p.burn_time_hours ? `${p.burn_time_hours} Hours` : '60 Hours'),
    inStock: p.status ? p.status === 'ACTIVE' : p.is_active !== false,
    isBestSeller: Boolean(p.is_bestseller ?? p.is_best_seller),
    isNew: Boolean(p.is_new_arrival),
    isFeatured: Boolean(p.is_featured),
    vesselDescription: p.short_description || p.description || 'Hand-poured in luxury glass jar.',
    image: primaryImage,
    imageUrl: primaryImage,
    images: finalImages,
  };
};

const buildProductImageMap = (rows: any[] | null): Map<string, string[]> => {
  const map = new Map<string, string[]>();
  if (!rows) return map;
  rows.forEach((row) => {
    const productId = String(row.product_id);
    const url = row.image_url;
    if (!url) return;
    const existing = map.get(productId) || [];
    if (row.is_primary) {
      map.set(productId, [url, ...existing.filter((item) => item !== url)]);
    } else {
      map.set(productId, [...existing, url]);
    }
  });
  return map;
};

const mergeRemoteWithDirtyLocal = (remoteProducts: CMSProduct[]) => {
  const storedProducts = readStoredProducts();
  const dirtyIds = new Set(readDirtyProductIds());
  const merged = remoteProducts.map((remote) => {
    const local = storedProducts.find((item) => String(item.id) === String(remote.id));
    if (!local || !dirtyIds.has(remote.id)) return remote;
    return { ...remote, ...local };
  });

  storedProducts.forEach((local) => {
    if (dirtyIds.has(local.id) && !merged.some((remote) => String(remote.id) === String(local.id))) {
      merged.unshift(local);
    }
  });

  return merged;
};

const buildProductDbPayload = (prod: CMSProduct | Partial<CMSProduct>, current?: CMSProduct) => {
  const merged = { ...current, ...prod } as CMSProduct;
  return {
    name: merged.name,
    slug: merged.name ? `${merged.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${String(merged.id || Date.now()).slice(-8)}` : undefined,
    tagline: merged.scentProfile || merged.category || 'Artisanal Scented Candle',
    short_description: merged.vesselDescription || 'Hand-poured in luxury glass jar.',
    price: merged.price !== undefined ? Number(merged.price) : undefined,
    original_price: merged.originalPrice !== undefined ? Number(merged.originalPrice) : undefined,
    rating: merged.rating !== undefined ? Number(merged.rating) : undefined,
    reviews_count: merged.reviewsCount !== undefined ? Number(merged.reviewsCount) : undefined,
    review_count: merged.reviewsCount !== undefined ? Number(merged.reviewsCount) : undefined,
    burn_time: merged.burnTime || undefined,
    burn_time_hours: merged.burnTime ? Number(String(merged.burnTime).match(/\d+/)?.[0] || 60) : undefined,
    is_bestseller: merged.isBestSeller !== undefined ? Boolean(merged.isBestSeller) : undefined,
    is_new_arrival: merged.isNew !== undefined ? Boolean(merged.isNew) : undefined,
    is_featured: merged.isFeatured !== undefined ? Boolean(merged.isFeatured) : undefined,
    is_trending: Boolean(merged.isNew || merged.isBestSeller),
    status: merged.inStock !== undefined ? (merged.inStock ? 'ACTIVE' : 'OUT_OF_STOCK') : undefined,
    is_active: merged.inStock !== undefined ? Boolean(merged.inStock) : undefined,
    top_notes: merged.topNotes || undefined,
    heart_notes: merged.heartNotes || undefined,
    base_notes: merged.baseNotes || undefined,
    wax_type: 'Soy Wax',
    wick_type: merged.burnTime ? 'Wooden Crackling Wick' : 'Cotton Wick',
    weight_grams: 250,
  };
};

const removeUndefinedValues = (payload: Record<string, any>) =>
  Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));

const readLocalCmsSnapshot = (): CmsRemoteBundle | null => {
  try {
    const settingsRaw = localStorage.getItem('tcl_cms_settings');
    const announcementRaw = localStorage.getItem('tcl_cms_announcement');
    const heroRaw = localStorage.getItem('tcl_cms_hero');
    const pagesRaw = localStorage.getItem('tcl_cms_pages_content');
    const seoRaw = localStorage.getItem('tcl_cms_seo');
    const collectionsRaw = localStorage.getItem('tcl_cms_collections');
    const mediaRaw = localStorage.getItem('tcl_cms_media');

    if (!settingsRaw && !heroRaw && !announcementRaw && !pagesRaw) return null;

    return {
      version: 1,
      settings: settingsRaw ? JSON.parse(settingsRaw) : undefined,
      announcement: announcementRaw ? JSON.parse(announcementRaw) : undefined,
      hero: heroRaw ? JSON.parse(heroRaw) : undefined,
      pagesContent: pagesRaw ? JSON.parse(pagesRaw) : undefined,
      seoSettings: seoRaw ? JSON.parse(seoRaw) : undefined,
      collections: collectionsRaw ? JSON.parse(collectionsRaw) : undefined,
      mediaItems: mediaRaw ? JSON.parse(mediaRaw) : undefined,
    };
  } catch {
    return null;
  }
};

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cmsSaveTimer = useRef<number | null>(null);
  const allowCmsPersist = useRef(false);
  const [cmsHydrated, setCmsHydrated] = useState(false);

  const markCmsEdited = () => {
    allowCmsPersist.current = true;
  };

  const [settings, setSettings] = useState<CMSStoreSettings>(DEFAULT_SETTINGS);

  const [announcement, setAnnouncement] = useState<CMSAnnouncement>(DEFAULT_ANNOUNCEMENT);

  const [hero, setHero] = useState<CMSHeroBanner>(DEFAULT_HERO);

  const [collections, setCollections] = useState<CMSCollection[]>(DEFAULT_COLLECTIONS);

  const [products, setProducts] = useState<CMSProduct[]>(() => {
    try {
      const parsed = readStoredProducts();
      if (parsed.length > 0) {
        const realDbItems = parsed.filter((p) => !String(p.id).startsWith('sp-'));
        if (realDbItems.length > 0) return realDbItems;
      }
      return DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [coupons, setCoupons] = useState<CMSCoupon[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_coupons');
      return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  });

  const [pagesContent, setPagesContent] = useState<CMSPagesContent>(DEFAULT_PAGES_CONTENT);

  const [customers, setCustomers] = useState<CMSCustomer[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_customers');
      return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
    } catch {
      return DEFAULT_CUSTOMERS;
    }
  });

  const [mediaItems, setMediaItems] = useState<CMSMediaItem[]>(DEFAULT_MEDIA);

  const [orders, setOrders] = useState<CMSOrder[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_orders');
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  const [seoSettings, setSeoSettings] = useState<CMSSEOSetting[]>(DEFAULT_SEO);

  const [staffUsers, setStaffUsers] = useState<CMSStaffUser[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_staff');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_STAFF;
    } catch {
      return DEFAULT_STAFF;
    }
  });

  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const [ordersCount, setOrdersCount] = useState<number>(0);

  // Initial sync from live Backend PostgreSQL Database API
  useEffect(() => {
    async function loadBackendData() {
      try {
        const applyCmsBundle = (bundle: CmsRemoteBundle) => {
          if (bundle.settings) setSettings(bundle.settings);
          if (bundle.announcement) setAnnouncement(bundle.announcement);
          if (bundle.hero) setHero(bundle.hero);
          if (bundle.pagesContent) setPagesContent(bundle.pagesContent);
          if (bundle.seoSettings?.length) setSeoSettings(bundle.seoSettings);
          if (bundle.collections?.length) setCollections(bundle.collections);
          if (bundle.mediaItems?.length) setMediaItems(bundle.mediaItems);
        };

        let cmsBundleFromServer = await fetchCmsBundle();
        if (cmsBundleFromServer) {
          applyCmsBundle(cmsBundleFromServer);
          allowCmsPersist.current = true;
        } else {
          const localSnapshot = readLocalCmsSnapshot();
          if (localSnapshot) {
            applyCmsBundle(localSnapshot);
            await saveCmsBundle(localSnapshot);
            cmsBundleFromServer = localSnapshot;
            allowCmsPersist.current = true;
          }
        }

        let dbProducts: any[] | null = null;

        try {
          const res = await fetch(getApiUrl('products?per_page=100'));
          if (res.ok) {
            const json = await res.json();
            const payload = json.data?.data || json.data || json;
            dbProducts = Array.isArray(payload) ? payload : null;
          }
        } catch (e) {
          console.warn('Laravel product fetch note:', e);
        }

        if (!dbProducts || dbProducts.length === 0) {
          dbProducts = await supabaseFetch<any[]>('products');
        }

        if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
          const dbProductImages = await supabaseFetch<any[]>('product_images', {
            query: 'select=product_id,image_url,is_primary,sort_order&order=sort_order.asc',
          });
          const imageMap = buildProductImageMap(dbProductImages);
          const mapped = mergeRemoteWithDirtyLocal(dbProducts.map((p) => mapDbProductToCMS(p, imageMap)));
          setProducts(mapped);
          try {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mapped));
          } catch { }
        }

        const dbOrders = await supabaseFetch<any[]>('orders');
        if (dbOrders && Array.isArray(dbOrders) && dbOrders.length > 0) {
          const mappedOrders = dbOrders.map((o) => ({
            date: o.created_at || o.created_on || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            id: String(o.order_number || o.id),
            customerName: o.customer_name || 'Valued Customer',
            email: o.customer_email || 'customer@example.com',
            items: 'Scented Candle Jar',
            totalAmount: Number(o.total_amount || 1499),
            paymentMethod: o.payment_method || 'Razorpay',
            status: o.order_status || 'Processing',
          }));
          setOrders(mappedOrders);
        }

        const dbCollections = await supabaseFetch<any[]>('collections');
        if (
          dbCollections &&
          Array.isArray(dbCollections) &&
          dbCollections.length > 0 &&
          !cmsBundleFromServer?.collections?.length
        ) {
          const mappedCollections: CMSCollection[] = dbCollections.map((c) => ({
            id: String(c.id),
            title: c.name || c.title || 'Signature Collection',
            icon: c.icon_symbol || c.icon || '🕯️',
            desc: c.description || c.desc || 'Luxury Handcrafted Candles',
            badge: 'ATELIER',
            count: '12 Items',
            scents: 'Vanilla, Rose & Amber',
            image: c.banner_image || '',
          }));
          setCollections(mappedCollections);
        }

        const dbCoupons = await supabaseFetch<any[]>('coupons');
        if (dbCoupons && Array.isArray(dbCoupons) && dbCoupons.length > 0) {
          const mappedCoupons = dbCoupons.map((c) => ({
            code: c.code,
            discountPercent: Number(c.discount_percentage || 15),
            description: `Flat ${c.discount_percentage}% OFF on luxury collections`,
            active: c.is_active ?? true,
          }));
          setCoupons(mappedCoupons);
        }

        const dbCustomers = await supabaseFetch<any[]>('customers');
        if (dbCustomers && Array.isArray(dbCustomers) && dbCustomers.length > 0) {
          const mappedCustomers = dbCustomers.map((c) => ({
            id: String(c.id),
            name: c.full_name || 'Valued Customer',
            email: c.email || 'customer@example.com',
            ordersCount: 3,
            totalSpent: 4290,
            tier: 'VIP Gold',
          }));
          setCustomers(mappedCustomers);
        }

        const dbAdmins = await supabaseFetch<any[]>('admins');
        if (dbAdmins && Array.isArray(dbAdmins) && dbAdmins.length > 0) {
          const mappedStaff: CMSStaffUser[] = dbAdmins.map((a) => ({
            id: String(a.id),
            name: a.full_name || a.name || 'Master Admin',
            email: a.email || 'admin@thecandlelab.com',
            role: (a.role === 'ADMIN' ? 'Admin' : (a.role || 'Super Admin')) as any,
            password: '••••••••',
            active: a.status ? a.status === 'ACTIVE' : (a.active ?? true),
          }));
          setStaffUsers(mappedStaff);
        }
      } catch (err) {
        console.error('Failed to fetch live backend data:', err);
      } finally {
        setCmsHydrated(true);
      }
    }

    loadBackendData();
  }, []);

  // Push CMS content to Supabase so all visitors (incognito included) see the same data
  useEffect(() => {
    if (!cmsHydrated || !allowCmsPersist.current) return;

    if (cmsSaveTimer.current) window.clearTimeout(cmsSaveTimer.current);
    cmsSaveTimer.current = window.setTimeout(() => {
      const bundle: CmsRemoteBundle = {
        version: 1,
        settings,
        announcement,
        hero,
        pagesContent,
        seoSettings,
        collections,
        mediaItems,
      };
      saveCmsBundle(bundle).catch(() => {});
    }, 700);

    return () => {
      if (cmsSaveTimer.current) window.clearTimeout(cmsSaveTimer.current);
    };
  }, [cmsHydrated, settings, announcement, hero, pagesContent, seoSettings, collections, mediaItems]);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('tcl_cms_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('tcl_cms_announcement', JSON.stringify(announcement));
  }, [announcement]);

  useEffect(() => {
    localStorage.setItem('tcl_cms_hero', JSON.stringify(hero));
  }, [hero]);

  useEffect(() => {
    localStorage.setItem('tcl_cms_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tcl_cms_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('tcl_cms_pages_content', JSON.stringify(pagesContent));
  }, [pagesContent]);

  useEffect(() => {
    localStorage.setItem('tcl_cms_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('tcl_cms_media', JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    localStorage.setItem('tcl_cms_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const syncOrdersFromStorage = () => {
      try {
        const saved = localStorage.getItem('tcl_cms_orders');
        if (saved) {
          setOrders(JSON.parse(saved));
        }
      } catch (e) {}
    };

    window.addEventListener('tcl-orders-updated', syncOrdersFromStorage);
    window.addEventListener('storage', syncOrdersFromStorage);
    return () => {
      window.removeEventListener('tcl-orders-updated', syncOrdersFromStorage);
      window.removeEventListener('storage', syncOrdersFromStorage);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('tcl_cms_seo', JSON.stringify(seoSettings));
  }, [seoSettings]);

  useEffect(() => {
    localStorage.setItem('tcl_cms_staff', JSON.stringify(staffUsers));
  }, [staffUsers]);

  const updateSettings = (newSettings: Partial<CMSStoreSettings>) => {
    markCmsEdited();
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateAnnouncement = (newAnn: Partial<CMSAnnouncement>) => {
    markCmsEdited();
    setAnnouncement((prev) => ({ ...prev, ...newAnn }));
  };

  const updateHero = (newHero: Partial<CMSHeroBanner>) => {
    markCmsEdited();
    setHero((prev) => ({ ...prev, ...newHero }));
  };

  const updateCollection = (id: string, updated: Partial<CMSCollection>) => {
    markCmsEdited();
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    supabaseFetch('collections', {
      method: 'PATCH',
      query: `id=eq.${id}`,
      body: {
        name: updated.title,
        description: updated.desc,
        banner_image: updated.image,
        icon_symbol: updated.icon,
      },
    }).catch(() => { });
  };

  const addCollection = (col: CMSCollection) => {
    markCmsEdited();
    setCollections((prev) => [...prev, col]);
    const cleanSlug = col.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    supabaseFetch('collections', {
      method: 'POST',
      body: {
        name: col.title,
        slug: cleanSlug,
        description: col.desc || '',
        icon_symbol: col.icon || '🕯️',
        is_featured: true,
      },
    }).catch(() => { });
  };

  const deleteCollection = (id: string) => {
    markCmsEdited();
    setCollections((prev) => prev.filter((c) => c.id !== id));
    supabaseFetch('collections', {
      method: 'DELETE',
      query: `id=eq.${id}`,
    }).catch(() => { });
  };

  const syncProductImagesToSupabase = async (
    productId: string,
    mainImage?: string,
    extraImages?: string[]
  ) => {
    if (!productId) return;
    const all = [...new Set([mainImage, ...(extraImages || [])].filter((url): url is string => Boolean(url) && url !== PRODUCT_IMAGE_PLACEHOLDER))];
    if (all.length === 0) return;

    try {
      // 1. Clear old records for clean sync
      await supabaseFetch('product_images', {
        method: 'DELETE',
        query: `product_id=eq.${productId}`,
      });

      // 2. Insert clean list of gallery images
      const rows = all.map((imgUrl, index) => ({
        product_id: productId,
        image_url: imgUrl,
        is_primary: index === 0,
        sort_order: index,
      }));

      await supabaseFetch('product_images', {
        method: 'POST',
        body: rows,
      });
    } catch (err) {
      console.warn('Sync product_images error:', err);
    }
  };

  const addProduct = async (prod: CMSProduct) => {
    setProducts((prev) => [prod, ...prev]);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify([prod, ...readStoredProducts().filter((p) => p.id !== prod.id)]));
    markProductDirty(prod.id);

    // Sync gallery images to product_images table
    syncProductImagesToSupabase(prod.id, prod.image || prod.imageUrl, prod.images);

    try {
      const payload = removeUndefinedValues(buildProductDbPayload(prod));
      const res = await supabaseFetch<any[]>('products', {
        method: 'POST',
        body: payload,
      });
      if (res && Array.isArray(res) && res[0] && res[0].id) {
        const realId = String(res[0].id);
        setProducts((prev) => prev.map((p) => (p.id === prod.id ? { ...p, id: realId } : p)));
        syncProductImagesToSupabase(realId, prod.image || prod.imageUrl, prod.images);
        clearProductDirty(prod.id);
        return;
      }
    } catch (err) {
      console.warn('Supabase product insert note:', err);
    }

    try {
      const res = await fetch(getApiUrl('products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(removeUndefinedValues(buildProductDbPayload(prod))),
      });
      if (res.ok) {
        const json = await res.json();
        const savedProduct = json.data ? mapDbProductToCMS(json.data) : prod;
        setProducts((prev) => prev.map((p) => (p.id === prod.id ? savedProduct : p)));
        clearProductDirty(prod.id);
      }
    } catch (err) {
      console.warn('Laravel product insert note:', err);
    }
  };

  const updateProduct = async (id: string, updated: Partial<CMSProduct>) => {
    const current = products.find((p) => p.id === id) || readStoredProducts().find((p) => p.id === id);
    const nextProduct = { ...current, ...updated, id } as CMSProduct;
    setProducts((prev) => prev.map((p) => (p.id === id ? nextProduct : p)));
    const storedProducts = readStoredProducts();
    const nextStoredProducts = storedProducts.some((p) => p.id === id)
      ? storedProducts.map((p) => (p.id === id ? nextProduct : p))
      : [nextProduct, ...storedProducts];
    localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(nextStoredProducts)
    );
    markProductDirty(id);

    const patchBody = removeUndefinedValues(buildProductDbPayload(updated, current));

    // Sync all gallery images to product_images table
    syncProductImagesToSupabase(
      id,
      nextProduct.image || nextProduct.imageUrl,
      nextProduct.images
    );

    try {
      const res = await supabaseFetch<any[]>('products', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: patchBody,
      });
      if (Array.isArray(res) ? res.length > 0 : Boolean(res)) {
        clearProductDirty(id);
        return;
      }
    } catch (err) {
      console.warn('Supabase product update note:', err);
    }

    try {
      const res = await fetch(getApiUrl(`products/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchBody),
      });
      if (res.ok) {
        clearProductDirty(id);
      }
    } catch (err) {
      console.warn('Laravel product update note:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(readStoredProducts().filter((p) => p.id !== id)));
    supabaseFetch('products', {
      method: 'DELETE',
      query: `id=eq.${id}`,
    }).catch(() => { });

    try {
      await fetch(getApiUrl(`products/${id}`), { method: 'DELETE' });
    } catch (err) {
      console.warn('Laravel product delete note:', err);
    }
  };

  const addCoupon = (coupon: CMSCoupon) => {
    setCoupons((prev) => [...prev, coupon]);
    supabaseFetch('coupons', {
      method: 'POST',
      body: {
        code: coupon.code,
        discount_percentage: coupon.discountPercent,
        usage_limit: 500,
        is_active: coupon.active,
      },
    }).catch(() => { });
  };

  const updateCoupon = (code: string, updated: Partial<CMSCoupon>) => {
    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, ...updated } : c)));
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    supabaseFetch('coupons', {
      method: 'DELETE',
      query: `code=eq.${code}`,
    }).catch(() => { });
  };

  const updatePagesContent = (updated: Partial<CMSPagesContent>) => {
    markCmsEdited();
    setPagesContent((prev) => ({ ...prev, ...updated }));
  };

  const addCustomer = (c: CMSCustomer) => {
    setCustomers((prev) => [c, ...prev]);
    supabaseFetch('customers', {
      method: 'POST',
      body: {
        full_name: c.name,
        email: c.email,
        phone: '+91 98765 43210',
        status: 'ACTIVE',
      },
    }).catch(() => { });
  };

  const updateCustomer = (id: string, updated: Partial<CMSCustomer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    supabaseFetch('customers', {
      method: 'DELETE',
      query: `email=eq.${id}`,
    }).catch(() => { });
  };

  const registerMediaAsset = (name: string, url: string, size = '—') => {
    if (!url || url.startsWith('data:')) return;
    setMediaItems((prev) => {
      if (prev.some((item) => item.url === url)) return prev;
      markCmsEdited();
      return [
        {
          id: `m-${Date.now()}`,
          name: name || 'Uploaded asset',
          url,
          type: 'image',
          size,
        },
        ...prev,
      ];
    });
  };

  const addMediaItem = (m: CMSMediaItem) => {
    markCmsEdited();
    setMediaItems((prev) => [m, ...prev]);
  };

  const deleteMediaItem = (id: string) => {
    markCmsEdited();
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
  };

  const addOrder = (order: CMSOrder) => {
    const orderWithDate = {
      ...order,
      date: order.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setOrders((prev) => [orderWithDate, ...prev]);
    window.dispatchEvent(new Event('tcl-orders-updated'));
    supabaseFetch('orders', {
      method: 'POST',
      body: {
        order_number: order.id || `TCL-${Math.floor(10000 + Math.random() * 90000)}`,
        customer_name: order.customerName,
        customer_email: order.email,
        total_amount: Number(order.totalAmount),
        payment_method: order.paymentMethod || 'Razorpay',
        order_status: order.status.toUpperCase() || 'PROCESSING',
        payment_status: 'PAID',
      },
    }).catch(() => { });
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    window.dispatchEvent(new Event('tcl-orders-updated'));
    supabaseFetch('orders', {
      method: 'PATCH',
      query: `order_number=eq.${id}`,
      body: { order_status: status.toUpperCase() },
    }).catch(() => { });
    fetch(getApiUrl(`orders/${encodeURIComponent(id)}/status`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => { });
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    window.dispatchEvent(new Event('tcl-orders-updated'));
    supabaseFetch('orders', {
      method: 'DELETE',
      query: `order_number=eq.${id}`,
    }).catch(() => { });
  };

  const updateSEO = (pageKey: string, updated: Partial<CMSSEOSetting>) => {
    markCmsEdited();
    setSeoSettings((prev) => prev.map((s) => (s.pageKey === pageKey ? { ...s, ...updated } : s)));
  };

  const addStaffUser = (u: CMSStaffUser) => {
    setStaffUsers((prev) => [...prev, u]);
  };

  const updateStaffUser = (id: string, updated: Partial<CMSStaffUser>) => {
    setStaffUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
  };

  const deleteStaffUser = (id: string) => {
    setStaffUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const incrementRevenue = (amount: number) => {
    setTotalRevenue((prev) => {
      const next = prev + amount;
      localStorage.setItem('tcl_cms_revenue', String(next));
      return next;
    });
    setOrdersCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('tcl_cms_orders_count', String(next));
      return next;
    });
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
        collections,
        updateCollection,
        addCollection,
        deleteCollection,
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

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
