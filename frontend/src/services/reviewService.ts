import { getApiUrl } from '../config/api';

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
  try {
    const res = await fetch(getApiUrl(`/products/${productId}/reviews`));
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.data) {
        const serverReviews: ProductReview[] = (data.data.reviews || []).map((r: any) => ({
          id: r.id,
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

  // Fallback to local storage
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
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    productId: payload.productId,
    productName: payload.productName,
    customerName: payload.customerName.trim(),
    customerEmail: payload.customerEmail?.trim(),
    customerLocation: payload.customerLocation?.trim(),
    rating: payload.rating,
    title: payload.title.trim(),
    comment: payload.comment.trim(),
    scentThrow: payload.scentThrow,
    status: 'pending', // Starts as pending for admin approval!
    isVerifiedBuyer: false,
    createdAt: new Date().toISOString(),
  };

  // Always save into local storage backup immediately
  const local = getLocalReviews();
  saveLocalReviews([newReview, ...local]);

  try {
    const res = await fetch(getApiUrl(`/products/${payload.productId}/reviews`), {
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
    });
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message || 'Review submitted successfully! It is pending approval.',
        review: data.data,
      };
    }
  } catch (err) {
    console.warn('Backend review submission failed, stored in local state', err);
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
  try {
    const url = getApiUrl(`/admin/reviews${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        const serverReviews: ProductReview[] = data.data.map((r: any) => ({
          id: r.id,
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

  // Fallback to local storage
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

  try {
    const res = await fetch(getApiUrl(`/admin/reviews/${id}/status`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, is_verified_buyer: isVerifiedBuyer }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Backend update review status failed', err);
    return true;
  }
}

/**
 * Admin: Delete a review permanently.
 */
export async function deleteReview(id: string): Promise<boolean> {
  // Update local storage
  const local = getLocalReviews();
  const remaining = local.filter((r) => r.id !== id);
  saveLocalReviews(remaining);

  try {
    const res = await fetch(getApiUrl(`/admin/reviews/${id}`), {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Backend delete review failed', err);
    return true;
  }
}

/**
 * Fetch recent approved reviews across all products (for Homepage).
 */
export async function fetchRecentApprovedReviews(limit: number = 6): Promise<ProductReview[]> {
  try {
    const res = await fetch(getApiUrl(`/reviews/recent?limit=${limit}`));
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.data?.reviews) {
        return data.data.reviews.map((r: any) => ({
          id: r.id,
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

  // Fallback to local
  const local = getLocalReviews()
    .filter((r) => r.status === 'approved')
    .slice(0, limit);
  return local;
}
