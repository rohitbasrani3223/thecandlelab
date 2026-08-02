import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseFetch } from '../config/supabaseClient';
import { getApiUrl } from '../config/api';

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
  addProduct: (prod: CMSProduct) => void;
  updateProduct: (id: string, updated: Partial<CMSProduct>) => void;
  deleteProduct: (id: string) => void;
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
  text: 'FREE SHIPPING ON ORDERS OVER ₹1,499 • USE CODE',
  couponCode: 'LUXURY20',
  discountText: 'FOR 20% OFF',
  visible: true,
};

const DEFAULT_HERO: CMSHeroBanner = {
  tagline: 'PREMIUM HOME FRAGRANCES',
  title: 'Crafted to Glow, Designed to Inspire',
  subtitle: 'Handcrafted luxury candles designed to fill your home with warmth, fragrance, and elegance. Pure soy & beeswax hand-poured in small batches.',
  primaryBtnText: 'Shop All Fragrances',
  secondaryBtnText: 'Take Scent Quiz',
  imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&auto=format&fit=crop&q=80',
};

const DEFAULT_COLLECTIONS: CMSCollection[] = [
  {
    id: 'scented-candles',
    title: 'Scented Candles',
    icon: '🕯️',
    desc: 'Aromatherapy Infused 100% Pure Botanical Soy',
    badge: 'LUXURY SOY RESERVE',
    count: '12 Formulations',
    scents: 'Velvet Rose, Smoked Amber, Bergamot',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'floral-collection',
    title: 'Floral Collection',
    icon: '🌸',
    desc: 'Hand-Poured Floral Bouquets of Rose & Lavender',
    badge: 'ROMANTIC FLORALS',
    count: '8 Formulations',
    scents: 'Damask Rose, Wild Lavender, Jasmine',
    image: 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'vanilla-collection',
    title: 'Vanilla Collection',
    icon: '🍦',
    desc: 'Warm Madagascar Vanilla Bean & Bourbon',
    badge: 'GOURMAND FAVORITES',
    count: '10 Formulations',
    scents: 'Madagascar Vanilla, Bourbon, Amber',
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'coffee-collection',
    title: 'Coffee Collection',
    icon: '☕',
    desc: 'Rich Roasted Arabica & Dark Cacao Nibs',
    badge: 'ENERGIZING AROMA',
    count: '6 Formulations',
    scents: 'Roasted Arabica, Dark Cacao, Hazelnut',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'festive-collection',
    title: 'Festive Collection',
    icon: '🌲',
    desc: 'Spiced Cinnamon Bark, Glowing Amber & Pine',
    badge: 'HOLIDAY EXCLUSIVE',
    count: '7 Formulations',
    scents: 'Ceylon Cinnamon, Clove, Smoked Fir',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'gift-boxes',
    title: 'Gift Boxes',
    icon: '🎁',
    desc: 'Curated Candle Sets + Brass Wick Trimmers',
    badge: 'LUXURY GIFTING',
    count: '10 Sets',
    scents: 'Custom Candle Trios + Accessories',
    image: 'https://images.unsplash.com/photo-1596435452227-886313d0130f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'luxury-glass-jars',
    title: 'Luxury Glass Jars',
    icon: '🕯️',
    desc: 'Heavy Italian Frosted Glass Vessels',
    badge: 'ITALIAN GLASS',
    count: '14 Formulations',
    scents: 'Smoked Leather, Tobacco Oud, Vanilla',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'wax-melts',
    title: 'Wax Melts',
    icon: '⚡',
    desc: 'Flame-Free Ambient Essential Oil Melts',
    badge: 'FLAME FREE',
    count: '9 Formulations',
    scents: 'Lavender, Rose Petals, Cardamom',
    image: 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?w=800&auto=format&fit=crop&q=80',
  },
];

const DEFAULT_PRODUCTS: CMSProduct[] = [
];

const DEFAULT_COUPONS: CMSCoupon[] = [
  { code: 'LUXURY20', discountPercent: 20, description: '20% Off Storewide on Orders over ₹1,499', active: true },
  { code: 'WELCOME15', discountPercent: 15, description: '15% Off VIP Welcome Discount', active: true },
];

const DEFAULT_PAGES_CONTENT: CMSPagesContent = {
  aboutUs: 'At The Candle Lab, we blend botanical purity with timeless artisanal elegance. Every jar is hand-poured in small batches using 100% natural soy wax, lead-free cotton or crackling wooden wicks, and custom fragrance oils.',
  shippingPolicy: 'Standard domestic shipping delivers in 3-5 business days. Complimentary white-glove shipping on all orders over ₹1,499. Orders dispatched within 24 hours.',
  refundPolicy: 'We offer a 30-day hassle-free luxury return window. If your vessel arrives damaged or you are unsatisfied with the fragrance profile, contact support for instant replacement or refund.',
  termsConditions: 'By purchasing from The Candle Lab, you agree to our standard boutique terms of service, safe burning guidelines, and privacy regulations.',
  privacyPolicy: 'We respect your privacy. Customer data is encrypted with enterprise-grade SSL and is never sold or shared with third parties.',
  faqList: [
    { question: 'What wax do you use in your candles?', answer: 'We use 100% natural botanical soy wax blended with pure beeswax for clean, non-toxic, long-lasting burns.', category: 'Product Care' },
    { question: 'How long do your candles burn?', answer: 'Our 12 oz luxury glass jars burn for up to 65 hours, while our 14 oz vessels burn for up to 80 hours.', category: 'Burn Specs' },
    { question: 'How do I care for wooden wicks?', answer: 'Trim the wooden wick to 1/4 inch before every burn and allow the melted wax pool to reach the edges of the jar on first light.', category: 'Wick Care' },
  ],
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
  { id: 'u-1', name: 'Super Admin', email: 'admin@thecandlelab.com', role: 'Super Admin', active: true },
  { id: 'u-2', name: 'Rohit Basrani', email: 'rohit@thecandlelab.com', role: 'Super Admin', active: true },

  { id: 'u-6', name: 'Support Desk', email: 'support@thecandlelab.com', role: 'Support', active: true },
];

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CMSStoreSettings>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [announcement, setAnnouncement] = useState<CMSAnnouncement>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_announcement');
      return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENT;
    } catch {
      return DEFAULT_ANNOUNCEMENT;
    }
  });

  const [hero, setHero] = useState<CMSHeroBanner>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_hero');
      return saved ? JSON.parse(saved) : DEFAULT_HERO;
    } catch {
      return DEFAULT_HERO;
    }
  });

  const [collections, setCollections] = useState<CMSCollection[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_collections');
      return saved ? JSON.parse(saved) : DEFAULT_COLLECTIONS;
    } catch {
      return DEFAULT_COLLECTIONS;
    }
  });

  const [products, setProducts] = useState<CMSProduct[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const realDbItems = parsed.filter((p: CMSProduct) => !p.id.startsWith('sp-'));
          if (realDbItems.length > 0) return realDbItems;
        }
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

  const [pagesContent, setPagesContent] = useState<CMSPagesContent>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_pages_content');
      return saved ? JSON.parse(saved) : DEFAULT_PAGES_CONTENT;
    } catch {
      return DEFAULT_PAGES_CONTENT;
    }
  });

  const [customers, setCustomers] = useState<CMSCustomer[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_customers');
      return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
    } catch {
      return DEFAULT_CUSTOMERS;
    }
  });

  const [mediaItems, setMediaItems] = useState<CMSMediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_media');
      return saved ? JSON.parse(saved) : DEFAULT_MEDIA;
    } catch {
      return DEFAULT_MEDIA;
    }
  });

  const [orders, setOrders] = useState<CMSOrder[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_orders');
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  const [seoSettings, setSeoSettings] = useState<CMSSEOSetting[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_seo');
      return saved ? JSON.parse(saved) : DEFAULT_SEO;
    } catch {
      return DEFAULT_SEO;
    }
  });

  const [staffUsers, setStaffUsers] = useState<CMSStaffUser[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_staff');
      return saved ? JSON.parse(saved) : DEFAULT_STAFF;
    } catch {
      return DEFAULT_STAFF;
    }
  });

  const [totalRevenue, setTotalRevenue] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_revenue');
      return saved ? Number(saved) : 148900;
    } catch {
      return 148900;
    }
  });

  const [ordersCount, setOrdersCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tcl_cms_orders_count');
      return saved ? Number(saved) : 112;
    } catch {
      return 112;
    }
  });

  // Initial sync from live Backend PostgreSQL Database API
  useEffect(() => {
    async function loadBackendData() {
      try {
        // 1. Fetch directly from Supabase PostgreSQL REST API
        let dbProducts = await supabaseFetch<any[]>('products');

        // 2. Fallback to Laravel Render API if Supabase REST returns empty
        if (!dbProducts || !Array.isArray(dbProducts) || dbProducts.length === 0) {
          try {
            const res = await fetch(getApiUrl('products'));
            if (res.ok) {
              const json = await res.json();
              dbProducts = json.data || json;
            }
          } catch (e) {
            console.warn('Render API fetch fallback note:', e);
          }
        }

        if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
          const mapped = dbProducts.map((p: any) => {
            // Only use real uploaded image_url — no fake Unsplash fallbacks
            const pImg = p.image_url || '';
            return {
              id: String(p.id),
              name: (p.name || 'Artisanal Candle').trim(),
              category: p.category?.name || p.tagline || 'Scented Candles',
              collection: p.collection?.name || p.collection || 'Signature',
              scentProfile: p.tagline || 'Artisanal',
              price: Number(p.price || 999),
              originalPrice: Number(p.original_price || p.price || 1299),
              rating: Number(p.rating || 4.9),
              reviewsCount: Number(p.reviews_count || 12),
              topNotes: p.top_notes || '',
              heartNotes: p.heart_notes || '',
              baseNotes: p.base_notes || '',
              burnTime: p.burn_time_hours ? `${p.burn_time_hours} Hours` : '60 Hours',
              inStock: p.status === 'ACTIVE' || p.status == null,
              isBestSeller: Boolean(p.is_bestseller),
              isNew: Boolean(p.is_new_arrival),
              isFeatured: Boolean(p.is_featured),
              vesselDescription: p.short_description || 'Hand-poured in Italian frosted glass jar.',
              image: pImg,
              imageUrl: pImg,
            };
          });
          setProducts(mapped);
          try {
            localStorage.setItem('tcl_cms_products', JSON.stringify(mapped));
          } catch { }
        }

        const dbOrders = await supabaseFetch<any[]>('orders');
        if (dbOrders && Array.isArray(dbOrders) && dbOrders.length > 0) {
          const mappedOrders = dbOrders.map((o) => ({
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
        if (dbCollections && Array.isArray(dbCollections) && dbCollections.length > 0) {
          const mappedCollections: CMSCollection[] = dbCollections.map((c) => ({
            id: String(c.id),
            title: c.name || c.title || 'Signature Collection',
            icon: c.icon_symbol || c.icon || '🕯️',
            desc: c.description || c.desc || 'Luxury Handcrafted Candles',
            badge: 'ATELIER',
            count: '12 Items',
            scents: 'Vanilla, Rose & Amber',
            image: c.banner_image || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
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
      } catch (err) {
        console.error('Failed to fetch live backend data:', err);
      }
    }

    loadBackendData();
  }, []);

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
    localStorage.setItem('tcl_cms_products', JSON.stringify(products));
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
    localStorage.setItem('tcl_cms_seo', JSON.stringify(seoSettings));
  }, [seoSettings]);

  useEffect(() => {
    localStorage.setItem('tcl_cms_staff', JSON.stringify(staffUsers));
  }, [staffUsers]);

  const updateSettings = (newSettings: Partial<CMSStoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateAnnouncement = (newAnn: Partial<CMSAnnouncement>) => {
    setAnnouncement((prev) => ({ ...prev, ...newAnn }));
  };

  const updateHero = (newHero: Partial<CMSHeroBanner>) => {
    setHero((prev) => ({ ...prev, ...newHero }));
  };

  const updateCollection = (id: string, updated: Partial<CMSCollection>) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const addCollection = (col: CMSCollection) => {
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
    setCollections((prev) => prev.filter((c) => c.id !== id));
    supabaseFetch('collections', {
      method: 'DELETE',
      query: `id=eq.${id}`,
    }).catch(() => { });
  };

  const addProduct = async (prod: CMSProduct) => {
    setProducts((prev) => [prod, ...prev]);
    const cleanSlug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    try {
      const res = await supabaseFetch<any[]>('products', {
        method: 'POST',
        body: {
          name: prod.name,
          slug: cleanSlug,
          tagline: prod.scentProfile || prod.category || 'Artisanal Scented Candle',
          short_description: prod.vesselDescription || 'Hand-poured in luxury glass jar.',
          price: Number(prod.price),
          original_price: Number(prod.originalPrice || prod.price),
          rating: Number(prod.rating || 4.9),
          reviews_count: Number(prod.reviewsCount || 10),
          burn_time_hours: 60,
          is_bestseller: Boolean(prod.isBestSeller),
          is_new_arrival: Boolean(prod.isNew),
          is_featured: Boolean(prod.isFeatured),
          is_trending: Boolean(prod.isNew || prod.isBestSeller),
          status: prod.inStock ? 'ACTIVE' : 'OUT_OF_STOCK',
          image_url: prod.image || prod.imageUrl || null,
          top_notes: prod.topNotes || '',
          heart_notes: prod.heartNotes || '',
          base_notes: prod.baseNotes || '',
          wax_type: 'Soy Wax',
          wick_type: prod.burnTime ? 'Wooden Crackling Wick' : 'Cotton Wick',
          weight_grams: 250,
        },
      });
      if (res && Array.isArray(res) && res[0] && res[0].id) {
        const realId = String(res[0].id);
        setProducts((prev) => prev.map((p) => (p.id === prod.id ? { ...p, id: realId } : p)));
      }
    } catch (err) {
      console.warn('Supabase product insert note:', err);
    }
  };

  const updateProduct = (id: string, updated: Partial<CMSProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    const patchBody: Record<string, any> = {};
    if (updated.name) patchBody.name = updated.name;
    if (updated.price !== undefined) patchBody.price = updated.price;
    if (updated.originalPrice !== undefined) patchBody.original_price = updated.originalPrice;
    if (updated.inStock !== undefined) patchBody.status = updated.inStock ? 'ACTIVE' : 'OUT_OF_STOCK';
    if (updated.isBestSeller !== undefined) patchBody.is_bestseller = updated.isBestSeller;
    if (updated.isNew !== undefined) patchBody.is_new_arrival = updated.isNew;
    if (updated.isFeatured !== undefined) patchBody.is_featured = updated.isFeatured;
    if (updated.image || updated.imageUrl) patchBody.image_url = updated.image || updated.imageUrl;
    if (updated.topNotes) patchBody.top_notes = updated.topNotes;
    if (updated.heartNotes) patchBody.heart_notes = updated.heartNotes;
    if (updated.baseNotes) patchBody.base_notes = updated.baseNotes;
    if (updated.vesselDescription) patchBody.short_description = updated.vesselDescription;
    if (updated.scentProfile) patchBody.tagline = updated.scentProfile;
    if (updated.rating !== undefined) patchBody.rating = updated.rating;

    if (Object.keys(patchBody).length > 0) {
      supabaseFetch('products', {
        method: 'PATCH',
        query: `id=eq.${id}`,
        body: patchBody,
      }).catch(() => { });
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    supabaseFetch('products', {
      method: 'DELETE',
      query: `id=eq.${id}`,
    }).catch(() => { });
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

  const addMediaItem = (m: CMSMediaItem) => {
    setMediaItems((prev) => [m, ...prev]);
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
  };

  const addOrder = (order: CMSOrder) => {
    setOrders((prev) => [order, ...prev]);
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
    supabaseFetch('orders', {
      method: 'PATCH',
      query: `order_number=eq.${id}`,
      body: { order_status: status.toUpperCase() },
    }).catch(() => { });
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    supabaseFetch('orders', {
      method: 'DELETE',
      query: `order_number=eq.${id}`,
    }).catch(() => { });
  };

  const updateSEO = (pageKey: string, updated: Partial<CMSSEOSetting>) => {
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
