import { getApiUrl } from '../config/api';
import { supabaseFetch } from '../config/supabaseClient';

export interface ProductReview {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  customerEmail?: string;
  customerLocation?: string;
  rating: number;
  title: string;
  comment: string;
  scentThrow?: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerifiedBuyer: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const LOCAL_STORAGE_REVIEWS_KEY = 'tcl_real_product_reviews';

function getLocalReviews(): ProductReview[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReviews(reviews: ProductReview[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  } catch {
    // ignore
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 2500): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

// Calculate review stats for a set of approved reviews
export function calculateReviewStats(reviews: ProductReview[]): ReviewStats {
  const approved = reviews.filter((r) => r.status === 'approved');
  const total = approved.length;
  const avg = total > 0 ? Number((approved.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)) : 0;
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  approved.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    dist[star] = (dist[star] || 0) + 1;
  });
  return {
    totalReviews: total,
    averageRating: avg,
    distribution: dist,
  };
}

/**
 * Fetch approved reviews for a specific product.
 */
export async function fetchProductReviews(
  productId: string
): Promise<{ reviews: ProductReview[]; stats: ReviewStats }> {
  // 1. Direct Supabase Query (Fast ~150ms)
  try {
    const dbReviews = await supabaseFetch<any[]>('reviews', {
      query: `product_id=eq.${encodeURIComponent(productId)}&status=eq.approved&order=created_at.desc`,
    });
    if (Array.isArray(dbReviews) && dbReviews.length > 0) {
      const serverReviews: ProductReview[] = dbReviews.map((r: any) => ({
        id: String(r.id),
        productId: r.product_id || productId,
        productName: r.product_name || '',
        customerName: r.customer_name || 'Valued Customer',
        customerEmail: r.customer_email || '',
        customerLocation: r.customer_location || '',
        rating: Number(r.rating) || 5,
        title: r.title || '',
        comment: r.comment || '',
        scentThrow: r.scent_throw || '',
        status: 'approved',
        isVerifiedBuyer: Boolean(r.is_verified_buyer),
        createdAt: r.created_at || new Date().toISOString(),
        updatedAt: r.updated_at,
      }));
      return { reviews: serverReviews, stats: calculateReviewStats(serverReviews) };
    }
  } catch (err) {
    console.warn('Supabase product reviews query note:', err);
  }

  // 2. Fallback to backend with strict 2.5s timeout
  try {
    const res = await fetchWithTimeout(getApiUrl(`/products/${productId}/reviews`), {}, 2500);
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.data) {
        const serverReviews: ProductReview[] = (data.data.reviews || []).map((r: any) => ({
          id: String(r.id),
          productId: r.product_id || r.productId,
          productName: r.product_name || r.productName,
          customerName: r.customer_name || r.customerName,
          customerEmail: r.customer_email || r.customerEmail,
          customerLocation: r.customer_location || r.customerLocation,
          rating: Number(r.rating) || 5,
          title: r.title,
          comment: r.comment,
          scentThrow: r.scent_throw || r.scentThrow,
          status: r.status,
          isVerifiedBuyer: Boolean(r.is_verified_buyer ?? r.isVerifiedBuyer),
          createdAt: r.created_at || r.createdAt || new Date().toISOString(),
          updatedAt: r.updated_at || r.updatedAt,
        }));
        const stats: ReviewStats = {
          totalReviews: data.data.stats?.total_reviews ?? serverReviews.length,
          averageRating: Number(data.data.stats?.average_rating ?? 0),
          distribution: data.data.stats?.distribution ?? {
            5: serverReviews.filter((r) => r.rating === 5).length,
            4: serverReviews.filter((r) => r.rating === 4).length,
            3: serverReviews.filter((r) => r.rating === 3).length,
            2: serverReviews.filter((r) => r.rating === 2).length,
            1: serverReviews.filter((r) => r.rating === 1).length,
          },
        };
        return { reviews: serverReviews, stats };
      }
    }
  } catch (err) {
    console.warn('Backend reviews endpoint unreachable, using local storage fallback', err);
  }

  // 3. Fallback to local storage
  const local = getLocalReviews().filter((r) => r.productId === productId && r.status === 'approved');
  return {
    reviews: local,
    stats: calculateReviewStats(local),
  };
}

/**
 * Submit a customer review (defaults to pending approval).
 */
export async function submitCustomerReview(payload: {
  productId: string;
  productName?: string;
  customerName: string;
  customerEmail?: string;
  customerLocation?: string;
  rating: number;
  title: string;
  comment: string;
  scentThrow?: string;
}): Promise<{ success: boolean; message: string; review?: ProductReview }> {
  const newReview: ProductReview = {
    id: (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      ? crypto.randomUUID()
      : `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    productId: payload.productId,
    productName: payload.productName,
    customerName: payload.customerName.trim(),
    customerEmail: payload.customerEmail?.trim(),
    customerLocation: payload.customerLocation?.trim(),
    rating: payload.rating,
    title: payload.title.trim(),
    comment: payload.comment.trim(),
    scentThrow: payload.scentThrow,
    status: 'pending',
    isVerifiedBuyer: false,
    createdAt: new Date().toISOString(),
  };

  // Always save into local storage backup immediately
  const local = getLocalReviews();
  saveLocalReviews([newReview, ...local]);

  // 1. Direct Supabase Insert
  try {
    await supabaseFetch('reviews', {
      method: 'POST',
      body: {
        id: newReview.id,
        product_id: newReview.productId,
        product_name: newReview.productName,
        customer_name: newReview.customerName,
        customer_email: newReview.customerEmail || null,
        customer_location: newReview.customerLocation || null,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        scent_throw: newReview.scentThrow || null,
        status: 'pending',
        is_verified_buyer: false,
        created_at: newReview.createdAt,
      },
    });
  } catch (err) {
    console.warn('Supabase review insert note:', err);
  }

  // 2. Also notify backend in background
  try {
    fetchWithTimeout(getApiUrl(`/products/${payload.productId}/reviews`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: payload.customerName,
        customer_email: payload.customerEmail,
        customer_location: payload.customerLocation,
        rating: payload.rating,
        title: payload.title,
        comment: payload.comment,
        scent_throw: payload.scentThrow,
        product_name: payload.productName,
      }),
    }, 2500).catch(() => {});
  } catch {
    // ignore background error
  }

  return {
    success: true,
    message: 'Thank you! Your review has been submitted for approval and will appear after moderation.',
    review: newReview,
  };
}

/**
 * Fetch all reviews for Admin Portal.
 */
export async function fetchAdminReviews(statusFilter: string = 'all'): Promise<{
  reviews: ProductReview[];
  counts: { total: number; pending: number; approved: number; rejected: number; averageRating: number };
}> {
  // 1. Primary: Direct Fast Supabase Query (~150ms)
  try {
    const filterQuery = statusFilter !== 'all'
      ? `order=created_at.desc&status=eq.${encodeURIComponent(statusFilter)}`
      : 'order=created_at.desc';

    const [dbReviews, allRows] = await Promise.all([
      supabaseFetch<any[]>('reviews', { query: filterQuery }),
      supabaseFetch<any[]>('reviews', { query: 'select=id,status,rating' }),
    ]);

    if (Array.isArray(dbReviews)) {
      const serverReviews: ProductReview[] = dbReviews.map((r: any) => ({
        id: String(r.id),
        productId: r.product_id || r.productId || '',
        productName: r.product_name || r.productName || '',
        customerName: r.customer_name || r.customerName || 'Customer',
        customerEmail: r.customer_email || r.customerEmail || '',
        customerLocation: r.customer_location || r.customerLocation || '',
        rating: Number(r.rating) || 5,
        title: r.title || '',
        comment: r.comment || '',
        scentThrow: r.scent_throw || r.scentThrow || '',
        status: r.status || 'pending',
        isVerifiedBuyer: Boolean(r.is_verified_buyer ?? r.isVerifiedBuyer),
        createdAt: r.created_at || r.createdAt || new Date().toISOString(),
        updatedAt: r.updated_at || r.updatedAt,
      }));

      const countSource = Array.isArray(allRows) && allRows.length > 0 ? allRows : dbReviews;
      const total = countSource.length;
      const pending = countSource.filter((r) => r.status === 'pending').length;
      const approved = countSource.filter((r) => r.status === 'approved').length;
      const rejected = countSource.filter((r) => r.status === 'rejected').length;
      const approvedRows = countSource.filter((r) => r.status === 'approved');
      const avg = approvedRows.length > 0
        ? Number((approvedRows.reduce((a, b) => a + (Number(b.rating) || 5), 0) / approvedRows.length).toFixed(1))
        : 5.0;

      // Keep local storage fresh
      saveLocalReviews(serverReviews);

      return {
        reviews: serverReviews,
        counts: {
          total,
          pending,
          approved,
          rejected,
          averageRating: avg,
        },
      };
    }
  } catch (err) {
    console.warn('Supabase admin reviews note:', err);
  }

  // 2. Secondary: Backend API with strict 2.5s timeout
  try {
    const url = getApiUrl(`/admin/reviews${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
    const res = await fetchWithTimeout(url, {}, 2500);
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        const serverReviews: ProductReview[] = data.data.map((r: any) => ({
          id: String(r.id),
          productId: r.product_id || r.productId,
          productName: r.product_name || r.productName,
          customerName: r.customer_name || r.customerName,
          customerEmail: r.customer_email || r.customerEmail,
          customerLocation: r.customer_location || r.customerLocation,
          rating: Number(r.rating) || 5,
          title: r.title,
          comment: r.comment,
          scentThrow: r.scent_throw || r.scentThrow,
          status: r.status,
          isVerifiedBuyer: Boolean(r.is_verified_buyer ?? r.isVerifiedBuyer),
          createdAt: r.created_at || r.createdAt || new Date().toISOString(),
          updatedAt: r.updated_at || r.updatedAt,
        }));

        const meta = data.meta || {};
        return {
          reviews: serverReviews,
          counts: {
            total: meta.total ?? serverReviews.length,
            pending: meta.pending ?? serverReviews.filter((r) => r.status === 'pending').length,
            approved: meta.approved ?? serverReviews.filter((r) => r.status === 'approved').length,
            rejected: meta.rejected ?? serverReviews.filter((r) => r.status === 'rejected').length,
            averageRating: Number(meta.average_rating ?? 0),
          },
        };
      }
    }
  } catch (err) {
    console.warn('Backend admin reviews unreachable, using local storage fallback', err);
  }

  // 3. Fallback to local storage
  const all = getLocalReviews();
  const filtered = statusFilter === 'all' ? all : all.filter((r) => r.status === statusFilter);
  const pendingCount = all.filter((r) => r.status === 'pending').length;
  const approvedCount = all.filter((r) => r.status === 'approved').length;
  const rejectedCount = all.filter((r) => r.status === 'rejected').length;
  const avg = approvedCount > 0 ? Number((all.filter((r) => r.status === 'approved').reduce((a, b) => a + b.rating, 0) / approvedCount).toFixed(1)) : 0;

  return {
    reviews: filtered,
    counts: {
      total: all.length,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      averageRating: avg,
    },
  };
}

/**
 * Admin: Update review status (approve, reject, pending).
 */
export async function updateReviewStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  isVerifiedBuyer?: boolean
): Promise<boolean> {
  // Update local storage
  const local = getLocalReviews();
  const updatedLocal = local.map((r) => (r.id === id ? { ...r, status, isVerifiedBuyer: isVerifiedBuyer ?? r.isVerifiedBuyer } : r));
  saveLocalReviews(updatedLocal);

  // 1. Update Supabase directly
  try {
    await supabaseFetch('reviews', {
      method: 'PATCH',
      query: `id=eq.${encodeURIComponent(id)}`,
      body: {
        status,
        ...(isVerifiedBuyer !== undefined ? { is_verified_buyer: isVerifiedBuyer } : {}),
        updated_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.warn('Supabase update review status note:', err);
  }

  // 2. Also notify backend in background
  try {
    fetchWithTimeout(getApiUrl(`/admin/reviews/${id}/status`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, is_verified_buyer: isVerifiedBuyer }),
    }, 2500).catch(() => {});
  } catch {
    // ignore
  }

  return true;
}

/**
 * Admin: Delete a review permanently.
 */
export async function deleteReview(id: string): Promise<boolean> {
  // Update local storage
  const local = getLocalReviews();
  const remaining = local.filter((r) => r.id !== id);
  saveLocalReviews(remaining);

  // 1. Delete from Supabase directly
  try {
    await supabaseFetch('reviews', {
      method: 'DELETE',
      query: `id=eq.${encodeURIComponent(id)}`,
    });
  } catch (err) {
    console.warn('Supabase delete review note:', err);
  }

  // 2. Also notify backend in background
  try {
    fetchWithTimeout(getApiUrl(`/admin/reviews/${id}`), {
      method: 'DELETE',
    }, 2500).catch(() => {});
  } catch {
    // ignore
  }

  return true;
}

/**
 * Fetch recent approved reviews across all products (for Homepage).
 */
export async function fetchRecentApprovedReviews(limit: number = 6): Promise<ProductReview[]> {
  // 1. Direct Supabase Query
  try {
    const dbReviews = await supabaseFetch<any[]>('reviews', {
      query: `status=eq.approved&order=created_at.desc&limit=${limit}`,
    });
    if (Array.isArray(dbReviews) && dbReviews.length > 0) {
      return dbReviews.map((r: any) => ({
        id: String(r.id),
        productId: r.product_id || r.productId,
        productName: r.product_name || r.productName,
        customerName: r.customer_name || r.customerName,
        customerLocation: r.customer_location || r.customerLocation,
        rating: Number(r.rating) || 5,
        title: r.title,
        comment: r.comment,
        scentThrow: r.scent_throw || r.scentThrow,
        status: 'approved',
        isVerifiedBuyer: Boolean(r.is_verified_buyer ?? r.isVerifiedBuyer),
        createdAt: r.created_at || r.createdAt,
      }));
    }
  } catch (err) {
    console.warn('Supabase recent reviews query note:', err);
  }

  // 2. Backend fallback with 2.5s timeout
  try {
    const res = await fetchWithTimeout(getApiUrl(`/reviews/recent?limit=${limit}`), {}, 2500);
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.data?.reviews) {
        return data.data.reviews.map((r: any) => ({
          id: String(r.id),
          productId: r.product_id || r.productId,
          productName: r.product_name || r.productName,
          customerName: r.customer_name || r.customerName,
          customerLocation: r.customer_location || r.customerLocation,
          rating: Number(r.rating) || 5,
          title: r.title,
          comment: r.comment,
          scentThrow: r.scent_throw || r.scentThrow,
          status: 'approved',
          isVerifiedBuyer: Boolean(r.is_verified_buyer ?? r.isVerifiedBuyer),
          createdAt: r.created_at || r.createdAt,
        }));
      }
    }
  } catch (err) {
    console.warn('Backend recent reviews unreachable, using local storage fallback', err);
  }

  // 3. Fallback to local
  const local = getLocalReviews()
    .filter((r) => r.status === 'approved')
    .slice(0, limit);
  return local;
}
