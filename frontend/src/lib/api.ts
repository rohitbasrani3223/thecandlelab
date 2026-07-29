/**
 * The Candle Lab — API Integration Client
 * Connects Frontend directly to Laravel 11 REST API (http://localhost:8000/api)
 * with automatic fallback to local Next.js API.
 */

const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const LOCAL_API_BASE = "/api";

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  // 1. Try Laravel 11 Backend API first
  try {
    const res = await fetch(`${LARAVEL_API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Laravel server is offline or unreachable — fallback to local Next.js API
  }

  // 2. Fallback to Next.js API
  try {
    const res = await fetch(`${LOCAL_API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || "Network request failed" };
  }
}

// Dedicated API Helper Functions
export const api = {
  // Products
  getProducts: (params?: { category?: string; search?: string; sort?: string; filter?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch(`/products${query ? `?${query}` : ""}`);
  },
  getProductById: (id: string) => apiFetch(`/products/${id}`),

  // Orders
  createOrder: (orderData: any) =>
    apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),
  getOrders: () => apiFetch("/orders"),

  // Coupons
  validateCoupon: (code: string, cartSubtotal: number) =>
    apiFetch("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, cartSubtotal }),
    }),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData: any) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Razorpay
  createRazorpayOrder: (amount: number, receipt?: string) =>
    apiFetch("/payments/razorpay", {
      method: "POST",
      body: JSON.stringify({ amount, receipt }),
    }),
};
