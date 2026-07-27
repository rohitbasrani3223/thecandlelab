"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface SiteSettings {
  id?: number;
  site_name: string;
  tagline: string;
  logo_url: string;
  dark_logo_url: string;
  favicon_url: string;
  support_email: string;
  support_phone: string;
  store_address: string;
  social_instagram: string;
  social_facebook: string;
  social_whatsapp: string;
  currency_symbol: string;
  currency_code: string;
}

export interface ThemeSettings {
  id?: number;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  surface_color: string;
  text_primary: string;
  text_secondary: string;
  border_radius: string;
  font_family: string;
  dark_mode_enabled: boolean;
}

export interface CheckoutSettings {
  id?: number;
  min_order_amount: number;
  max_order_amount: number;
  free_shipping_threshold: number;
  standard_shipping_charge: number;
  cod_charge: number;
  cod_enabled: boolean;
  guest_checkout_enabled: boolean;
  otp_verification_required: boolean;
  gift_wrap_charge: number;
  handling_fee: number;
}

export interface SearchConfig {
  id?: number;
  popular_searches: string;
  trending_searches: string;
  synonyms_json: Record<string, string>;
}

export interface AnnouncementItem {
  id?: number;
  text: string;
  link?: string;
  is_active: boolean;
}

export interface PromoPopupItem {
  id?: number;
  title: string;
  description: string;
  coupon_code: string;
  is_active: boolean;
}

export interface HeroBannerItem {
  id?: number;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
}

interface StoreConfigContextType {
  site: SiteSettings;
  theme: ThemeSettings;
  checkout: CheckoutSettings;
  search: SearchConfig;
  announcements: AnnouncementItem[];
  popups: PromoPopupItem[];
  heroBanners: HeroBannerItem[];
  isLoading: boolean;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  updateThemeSettings: (theme: Partial<ThemeSettings>) => Promise<void>;
  updateCheckoutSettings: (checkout: Partial<CheckoutSettings>) => Promise<void>;
  updateSearchConfig: (search: Partial<SearchConfig>) => Promise<void>;
  refreshConfig: () => Promise<void>;
}

const defaultSiteSettings: SiteSettings = {
  site_name: "The Candle Lab",
  tagline: "Artisanal Luxury Candles & Fragrances",
  logo_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&q=80",
  dark_logo_url: "",
  favicon_url: "",
  support_email: "care@thecandlelab.in",
  support_phone: "+91 98765 43210",
  store_address: "108 Atelier Avenue, Cyber City, HR 122002",
  social_instagram: "https://instagram.com/thecandlelab",
  social_facebook: "https://facebook.com/thecandlelab",
  social_whatsapp: "+919876543210",
  currency_symbol: "₹",
  currency_code: "INR",
};

const defaultThemeSettings: ThemeSettings = {
  primary_color: "#d97706",
  secondary_color: "#7c2d12",
  accent_color: "#fbbf24",
  background_color: "#0f172a",
  surface_color: "#1e293b",
  text_primary: "#f8fafc",
  text_secondary: "#94a3b8",
  border_radius: "12px",
  font_family: "Inter, sans-serif",
  dark_mode_enabled: true,
};

const defaultCheckoutSettings: CheckoutSettings = {
  min_order_amount: 399,
  max_order_amount: 100000,
  free_shipping_threshold: 1499,
  standard_shipping_charge: 99,
  cod_charge: 49,
  cod_enabled: true,
  guest_checkout_enabled: true,
  otp_verification_required: false,
  gift_wrap_charge: 49,
  handling_fee: 0,
};

const defaultSearchConfig: SearchConfig = {
  popular_searches: "Lavender, Soy Wax, Scented Pillars, Vanilla Dream, Aromatherapy",
  trending_searches: "Midnight Jasmine, Rose Garden, Oud Wood",
  synonyms_json: { "lavender": "soothing, relaxation", "rose": "romantic, floral" },
};

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

export const StoreConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [site, setSite] = useState<SiteSettings>(defaultSiteSettings);
  const [theme, setTheme] = useState<ThemeSettings>(defaultThemeSettings);
  const [checkout, setCheckout] = useState<CheckoutSettings>(defaultCheckoutSettings);
  const [search, setSearch] = useState<SearchConfig>(defaultSearchConfig);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [popups, setPopups] = useState<PromoPopupItem[]>([]);
  const [heroBanners, setHeroBanners] = useState<HeroBannerItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const applyCSSVariables = useCallback((t: ThemeSettings) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--primary-color", t.primary_color);
    root.style.setProperty("--secondary-color", t.secondary_color);
    root.style.setProperty("--accent-color", t.accent_color);
    root.style.setProperty("--background-color", t.background_color);
    root.style.setProperty("--surface-color", t.surface_color);
    root.style.setProperty("--text-primary", t.text_primary);
    root.style.setProperty("--text-secondary", t.text_secondary);
    root.style.setProperty("--border-radius", t.border_radius);
    root.style.setProperty("--font-family", t.font_family);
  }, []);

  const refreshConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/store/config/");
      if (res.ok) {
        const data = await res.json();
        if (data.site) setSite(data.site);
        if (data.theme) {
          setTheme(data.theme);
          applyCSSVariables(data.theme);
        }
        if (data.checkout) setCheckout(data.checkout);
        if (data.search) setSearch(data.search);
        if (data.announcements) setAnnouncements(data.announcements);
        if (data.popups) setPopups(data.popups);
        if (data.hero_banners) setHeroBanners(data.hero_banners);
      }
    } catch (err) {
      console.warn("Could not fetch global store config from backend, using active defaults.", err);
      applyCSSVariables(defaultThemeSettings);
    } finally {
      setIsLoading(false);
    }
  }, [applyCSSVariables]);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  const updateSiteSettings = async (updated: Partial<SiteSettings>) => {
    const next = { ...site, ...updated };
    setSite(next);
    try {
      const targetId = site.id || 1;
      await fetch(`http://localhost:8000/api/v1/settings/site/${targetId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error("Failed to persist SiteSettings", e);
    }
  };

  const updateThemeSettings = async (updated: Partial<ThemeSettings>) => {
    const next = { ...theme, ...updated };
    setTheme(next);
    applyCSSVariables(next);
    try {
      const targetId = theme.id || 1;
      await fetch(`http://localhost:8000/api/v1/settings/theme/${targetId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error("Failed to persist ThemeSettings", e);
    }
  };

  const updateCheckoutSettings = async (updated: Partial<CheckoutSettings>) => {
    const next = { ...checkout, ...updated };
    setCheckout(next);
    try {
      const targetId = checkout.id || 1;
      await fetch(`http://localhost:8000/api/v1/settings/checkout/${targetId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error("Failed to persist CheckoutSettings", e);
    }
  };

  const updateSearchConfig = async (updated: Partial<SearchConfig>) => {
    const next = { ...search, ...updated };
    setSearch(next);
    try {
      const targetId = search.id || 1;
      await fetch(`http://localhost:8000/api/v1/settings/search/${targetId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error("Failed to persist SearchConfig", e);
    }
  };

  return (
    <StoreConfigContext.Provider
      value={{
        site,
        theme,
        checkout,
        search,
        announcements,
        popups,
        heroBanners,
        isLoading,
        updateSiteSettings,
        updateThemeSettings,
        updateCheckoutSettings,
        updateSearchConfig,
        refreshConfig,
      }}
    >
      {children}
    </StoreConfigContext.Provider>
  );
};

export const useStoreConfig = () => {
  const context = useContext(StoreConfigContext);
  if (!context) {
    throw new Error("useStoreConfig must be used within a StoreConfigProvider");
  }
  return context;
};
