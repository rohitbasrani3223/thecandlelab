import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../design-system';
import {
  fetchAdminReviews,
  updateReviewStatus,
  deleteReview,
  type ProductReview,
} from '../../services/reviewService';

export const AdminReviewsManager: React.FC = () => {
  const { toast } = useToast();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0,
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminReviews(activeFilter);
      setReviews(res.reviews);
      setCounts(res.counts);
    } catch (err) {
      console.warn('Failed to fetch admin reviews', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (review: ProductReview) => {
    setActionInProgress(review.id);
    try {
      const ok = await updateReviewStatus(review.id, 'approved', true);
      if (ok) {
        toast({
          type: 'success',
          title: 'Review Approved! ✅',
          description: `Review by "${review.customerName}" is now live on the store.`,
        });
        loadData();
      }
    } catch {
      toast({
        type: 'error',
        title: 'Action Failed',
        description: 'Could not approve review.',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (review: ProductReview) => {
    setActionInProgress(review.id);
    try {
      const ok = await updateReviewStatus(review.id, 'rejected');
      if (ok) {
        toast({
          type: 'info',
          title: 'Review Rejected',
          description: `Review by "${review.customerName}" has been rejected.`,
        });
        loadData();
      }
    } catch {
      toast({
        type: 'error',
        title: 'Action Failed',
        description: 'Could not reject review.',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (review: ProductReview) => {
    if (!window.confirm(`Are you sure you want to permanently delete this review by "${review.customerName}"?`)) {
      return;
    }
    setActionInProgress(review.id);
    try {
      const ok = await deleteReview(review.id);
      if (ok) {
        toast({
          type: 'success',
          title: 'Review Deleted',
          description: 'Review has been removed permanently.',
        });
        loadData();
      }
    } catch {
      toast({
        type: 'error',
        title: 'Action Failed',
        description: 'Could not delete review.',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Filter client side with search
  const filteredReviews = reviews.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.customerName.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q) ||
      (r.productName && r.productName.toLowerCase().includes(q)) ||
      (r.customerEmail && r.customerEmail.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C2018] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#FDFBF7] flex items-center gap-2">
            <span>⭐</span>
            <span>Customer Reviews Moderation</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Review real customer feedback before publishing. Only approved reviews appear on live product pages.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="px-3.5 py-1.5 rounded-lg bg-[#251A13] hover:bg-[#2F2119] border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#1C130E] border border-[#2C2018]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Total Submissions</span>
          <div className="text-2xl font-serif font-bold text-[#FDFBF7] mt-1">{counts.total}</div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">Pending Moderation</span>
          <div className="text-2xl font-serif font-bold text-amber-300 mt-1">{counts.pending}</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">Approved (Live)</span>
          <div className="text-2xl font-serif font-bold text-emerald-300 mt-1">{counts.approved}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#1C130E] border border-[#2C2018]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Avg Rating</span>
          <div className="text-2xl font-serif font-bold text-[#FDFBF7] mt-1">
            {counts.averageRating > 0 ? `${counts.averageRating} ★` : '—'}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1C130E] p-3 rounded-xl border border-[#2C2018]">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'pending', label: 'Pending Approval', count: counts.pending, color: 'text-amber-400' },
            { id: 'approved', label: 'Approved', count: counts.approved, color: 'text-emerald-400' },
            { id: 'rejected', label: 'Rejected', count: counts.rejected, color: 'text-rose-400' },
            { id: 'all', label: 'All Reviews', count: counts.total, color: 'text-stone-300' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-[#251A13]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 ${tab.color}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#140D09] border border-[#2C2018] rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-500/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-amber-400/80 animate-pulse">
            Loading reviews from database...
          </div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => {
            const isProcessing = actionInProgress === rev.id;

            return (
              <div
                key={rev.id}
                className={`p-4 sm:p-5 rounded-2xl bg-[#1C130E] border transition-all ${
                  rev.status === 'pending'
                    ? 'border-amber-500/40 bg-amber-950/10'
                    : rev.status === 'approved'
                    ? 'border-emerald-900/40 hover:border-emerald-800/60'
                    : 'border-rose-950/40 opacity-75'
                }`}
              >
                {/* Header row: Product name, stars, status, date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2C2018] pb-3 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                        rev.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : rev.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {rev.status === 'pending' ? '⏳ Pending Approval' : rev.status === 'approved' ? '✓ Live on Store' : '✕ Rejected'}
                    </span>

                    {/* Product Name */}
                    {rev.productName && (
                      <span className="text-xs font-serif text-amber-200/90 font-medium">
                        Product: <strong className="text-white">{rev.productName}</strong>
                      </span>
                    )}

                    {/* Rating */}
                    <div className="flex items-center text-amber-400 text-xs">
                      {'★'.repeat(rev.rating)}
                      <span className="text-stone-400 text-[11px] ml-1.5 font-mono">({rev.rating}/5)</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-stone-500">
                    {new Date(rev.createdAt).toLocaleString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Review Content */}
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-sm text-[#FDFBF7]">{rev.title}</h3>
                  <p className="text-xs text-stone-300 leading-relaxed italic bg-[#140D09]/60 p-3 rounded-xl border border-[#2C2018]">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Author Info & Actions Bottom Row */}
                <div className="mt-4 pt-3 border-t border-[#2C2018] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  {/* Customer Info */}
                  <div className="flex items-center gap-2 flex-wrap text-stone-400 text-[11px]">
                    <span className="text-white font-medium">👤 {rev.customerName}</span>
                    {rev.customerLocation && <span>• 📍 {rev.customerLocation}</span>}
                    {rev.customerEmail && <span>• ✉️ {rev.customerEmail}</span>}
                    {rev.scentThrow && <span className="text-amber-400/90">• Throw: {rev.scentThrow}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {rev.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(rev)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        <span>✓</span>
                        <span>Approve & Publish</span>
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => handleReject(rev)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 rounded-lg bg-[#251A13] hover:bg-rose-950/40 text-stone-300 hover:text-rose-300 border border-[#2C2018] hover:border-rose-900/50 text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        <span>✕</span>
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(rev)}
                      disabled={isProcessing}
                      title="Permanently Delete Review"
                      className="w-8 h-8 rounded-lg bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 text-red-400 flex items-center justify-center text-xs transition-colors cursor-pointer"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 rounded-2xl bg-[#1C130E] border border-[#2C2018] text-center space-y-2">
            <div className="text-3xl">💬</div>
            <h3 className="font-serif font-bold text-sm text-[#FDFBF7]">No Reviews Found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              {activeFilter === 'pending'
                ? 'No reviews are currently pending approval. All clear!'
                : `No reviews under "${activeFilter}" filter.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
