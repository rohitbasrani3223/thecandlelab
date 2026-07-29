import React, { createContext, useContext, useState, useEffect } from 'react';

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
  vesselDescription: string;
}

export interface CMSCoupon {
  code: string;
  discountPercent: number;
  description: string;
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
  deleteCoupon: (code: string) => void;
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
  studioAddress: '',
  logoUrl: '/logo.jpeg',
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
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'vanilla-collection',
    title: 'Vanilla Collection',
    icon: '🍦',
    desc: 'Warm Madagascar Vanilla Bean & Bourbon',
    badge: 'GOURMAND FAVORITES',
    count: '10 Formulations',
    scents: 'Madagascar Vanilla, Bourbon, Amber',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&auto=format&fit=crop&q=80',
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
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'gift-boxes',
    title: 'Gift Boxes',
    icon: '🎁',
    desc: 'Curated Candle Sets + Brass Wick Trimmers',
    badge: 'LUXURY GIFTING',
    count: '10 Sets',
    scents: 'Custom Candle Trios + Accessories',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&auto=format&fit=crop&q=80',
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
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
  },
];

const DEFAULT_PRODUCTS: CMSProduct[] = [
  { id: 'sp-1', name: 'Velvet Rose & Smoked Amber', category: 'Glass Jars', collection: 'Royal Gold', scentProfile: 'Floral Elegance', price: 1482, originalPrice: 1710, rating: 4.9, reviewsCount: 142, topNotes: 'Calabrian Bergamot, Pink Pepper', heartNotes: 'Damask Rose, Clove Bud', baseNotes: 'Smoked Amber, Oud Wood', burnTime: '65 Hours', inStock: true, isBestSeller: true, vesselDescription: 'Hand-poured in heavy Italian frosted glass with 24K gold foil branding.' },
  { id: 'sp-2', name: 'French Bourbon Vanilla Bean', category: 'Glass Jars', collection: 'Royal Gold', scentProfile: 'Warm Vanilla', price: 1786, originalPrice: 2090, rating: 4.95, reviewsCount: 98, topNotes: 'Crushed Tonka, Sweet Almond', heartNotes: 'Bourbon Vanilla Pod', baseNotes: 'White Amber, Brown Sugar', burnTime: '80 Hours', inStock: true, isBestSeller: true, vesselDescription: 'Luxury 3-wick champagne gold vessel engineered for rich room diffusion.' },
  { id: 'sp-3', name: 'Mysore Sandalwood & Cedar', category: 'Travel Tins', collection: 'Signature', scentProfile: 'Woody & Spiced', price: 798, originalPrice: 950, rating: 4.85, reviewsCount: 76, topNotes: 'Golden Cedar, Cypress', heartNotes: 'Mysore Sandalwood', baseNotes: 'Smoked Vetiver, Oakmoss', burnTime: '45 Hours', inStock: true, isNew: true, vesselDescription: 'Seamless brass travel tin with airtight botanical lid.' },
  { id: 'sp-4', name: 'Bergamot & White Jasmine Bloom', category: 'Glass Jars', collection: 'Signature', scentProfile: 'Fresh Citrus', price: 1292, originalPrice: 1520, rating: 4.88, reviewsCount: 114, topNotes: 'Italian Citrus, Bergamot', heartNotes: 'White Jasmine, Neroli', baseNotes: 'Cashmere Wood, Musk', burnTime: '60 Hours', inStock: true, vesselDescription: 'Translucent ivory glass vessel with natural wood lid.' },
  { id: 'sp-5', name: 'Smoked Leather & Tobacco Oud', category: 'Glass Jars', collection: 'Autumn Woodfire', scentProfile: 'Woody & Spiced', price: 1634, originalPrice: 1950, rating: 4.98, reviewsCount: 312, topNotes: 'Cardamom, Cinnamon Bark', heartNotes: 'Smoked Tobacco Leaf', baseNotes: 'Rich Leather, Oud Wood', burnTime: '65 Hours', inStock: true, isBestSeller: true, vesselDescription: 'Obsidian matte black jar formulated for deep evening relaxation.' },
  { id: 'sp-6', name: 'Wild Lavender & Bergamot Bloom', category: 'Pillars', collection: 'Aromatherapy Series', scentProfile: 'Fresh Citrus', price: 1368, originalPrice: 1620, rating: 4.89, reviewsCount: 168, topNotes: 'Bergamot, Eucalyptus', heartNotes: 'French Lavender', baseNotes: 'White Sage, Cedar', burnTime: '70 Hours', inStock: true, vesselDescription: 'Pure beeswax aromatherapy pillar candle.' },
  { id: 'sp-7', name: 'Midnight Fig & Honeyed Amber', category: 'Glass Jars', collection: 'Signature', scentProfile: 'Warm Vanilla', price: 1406, originalPrice: 1680, rating: 5.0, reviewsCount: 24, topNotes: 'Wild Fig, Plum Bloom', heartNotes: 'Honeyed Amber', baseNotes: 'Dark Cedar, Vanilla', burnTime: '60 Hours', inStock: true, isNew: true, vesselDescription: 'Obsidian matte jar with crackling wood wick.' },
  { id: 'sp-8', name: 'French Vanilla & Cinnamon Scented Jar', category: 'Scented Candles', collection: 'Vanilla Collection', scentProfile: 'Warm Vanilla', price: 899, originalPrice: 1199, rating: 4.9, reviewsCount: 128, topNotes: 'Vanilla Bean, Ceylon Cinnamon, Warm Amber', heartNotes: 'Madagascar Vanilla Pod', baseNotes: 'Bourbon Amber', burnTime: '65 Hours', inStock: true, isBestSeller: true, vesselDescription: 'Hand-poured in heavy Italian frosted glass jar with wood wick.' },
  { id: 'sp-9', name: 'Amber & Oud Royal Glass Candle', category: 'Luxury Glass Jars', collection: 'Luxury Glass Jars', scentProfile: 'Woody & Spiced', price: 1299, originalPrice: 1499, rating: 5.0, reviewsCount: 94, topNotes: 'Golden Amber, Cambodian Oud, Sandalwood', heartNotes: 'Smoked Cedar', baseNotes: 'Resinous Musk', burnTime: '80 Hours', inStock: true, isBestSeller: true, vesselDescription: 'Heavy 14 oz frosted glass jar with pure gold leaf branding.' },
  { id: 'sp-10', name: 'Rose Petals & Cardamom Wax Melts', category: 'Wax Melts', collection: 'Wax Melts', scentProfile: 'Floral Elegance', price: 499, originalPrice: 599, rating: 4.8, reviewsCount: 62, topNotes: 'Damask Rose, Spiced Cardamom, Soft Musk', heartNotes: 'Pink Rose Petals', baseNotes: 'White Amber', burnTime: '40 Hours', inStock: true, isNew: true, vesselDescription: 'Flame-free ambient essential oil wax melts pack.' },
];

const DEFAULT_COUPONS: CMSCoupon[] = [
  { code: 'LUXURY20', discountPercent: 20, description: '20% Off Storewide on Orders over ₹1,499', active: true },
  { code: 'WELCOME15', discountPercent: 15, description: '15% Off VIP Welcome Discount', active: true },
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
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
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
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const addProduct = (prod: CMSProduct) => {
    setProducts((prev) => [prod, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<CMSProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCoupon = (coupon: CMSCoupon) => {
    setCoupons((prev) => [...prev, coupon]);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
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
        deleteCoupon,
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
