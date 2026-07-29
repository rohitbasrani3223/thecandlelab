"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, Star, Trash2, CheckCircle2, ShieldAlert, Plus, X, Save, MessageSquare } from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

export const ReviewsManagementModule: React.FC = () => {
  const { products, showToast } = useStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    userName: "",
    rating: 5,
    comment: "",
    verifiedPurchase: true
  });

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/reviews/');
      if (res.ok) {
        const data = await res.json();
        const items = data.results || data;
        if (Array.isArray(items)) {
          setReviews(items);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this review permanently?")) return;
    setReviews(prev => prev.filter(r => r.id !== id));
    try {
      await fetch(`/api/v1/reviews/${id}/`, { method: 'DELETE' });
      showToast("Review deleted from PostgreSQL 🗑️");
    } catch (e) {
      showToast("Removed locally");
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.comment || !formData.productId) {
      showToast("Please select a product and fill in name & review comment.");
      return;
    }
    try {
      const res = await fetch('/api/v1/reviews/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: Number(formData.productId),
          user_name: formData.userName,
          rating: formData.rating,
          comment: formData.comment,
          verified_purchase: formData.verifiedPurchase
        })
      });
      if (res.ok) {
        showToast("Added new review to PostgreSQL 🌟");
        loadReviews();
        setIsAddModalOpen(false);
      } else {
        showToast("Error adding review");
      }
    } catch (e) {
      showToast("Network error");
    }
  };

  const filtered = reviews.filter((r) => {
    const matchSearch = !search.trim() ||
      r.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === "all" || String(r.rating) === ratingFilter;
    return matchSearch && matchRating;
  });

  return (
    <div style={FONT} className="space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1F1F1F]">Reviews & Ratings Atelier</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Manage customer feedback, star ratings and verified buyer testimonials</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => {
            setFormData({
              productId: products[0]?.id || "",
              userName: "",
              rating: 5,
              comment: "",
              verifiedPurchase: true
            });
            setIsAddModalOpen(true);
          }}
        >
          Add Testimonial
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card padding="sm" className="border border-[#E6DFD3] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#1F1F1F] leading-none">{reviews.length}</p>
            <p className="text-[11px] text-[#78716C] mt-1 font-medium">Total Reviews</p>
          </div>
        </Card>
        <Card padding="sm" className="border border-[#E6DFD3] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#1F1F1F] leading-none">{reviews.filter(r => r.verified_purchase).length}</p>
            <p className="text-[11px] text-[#78716C] mt-1 font-medium">Verified Buyers</p>
          </div>
        </Card>
        <Card padding="sm" className="border border-[#E6DFD3] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#1F1F1F] leading-none">
              {(reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / (reviews.length || 1)).toFixed(1)} / 5.0
            </p>
            <p className="text-[11px] text-[#78716C] mt-1 font-medium">Average Rating</p>
          </div>
        </Card>
        <Card padding="sm" className="border border-[#E6DFD3] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-[#C8A75A]" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#1F1F1F] leading-none">{reviews.filter(r => r.rating === 5).length}</p>
            <p className="text-[11px] text-[#78716C] mt-1 font-medium">5-Star Reviews</p>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card padding="sm" className="border border-[#E6DFD3]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search reviews or reviewer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl text-xs text-[#1F1F1F] placeholder-[#94A3B8] focus:outline-none focus:border-[#C8A75A]"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl text-xs font-medium text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </Card>

      {/* Reviews Table */}
      <Card padding="none" className="overflow-hidden border border-[#E6DFD3]">
        <div className="overflow-x-auto">
          <table className="w-full" style={FONT}>
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E6DFD3]">
                {["Customer", "Rating", "Review Comment", "Verified", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-[#1F1F1F] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD3]">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-xs text-[#78716C]">Loading reviews from PostgreSQL...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-xs text-[#78716C]">No reviews found matching criteria</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-bold text-[#1F1F1F]">{r.user_name || "Anonymous Customer"}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < (r.rating || 5) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 max-w-md">
                    <p className="text-xs text-[#1F1F1F] line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    {r.verified_purchase ? (
                      <Badge variant="success" dot>Verified Buyer</Badge>
                    ) : (
                      <Badge variant="neutral">Unverified</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] text-[#78716C]">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recent"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg text-[#78716C] hover:text-red-600 hover:bg-red-50"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border-2 border-[#C8A75A]/40 shadow-2xl overflow-hidden p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
              <h2 className="font-serif font-bold text-base text-[#1F1F1F]">Add Customer Review</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#78716C]"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Target Product *</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                  <option value={2}>2 Stars (Poor)</option>
                  <option value={1}>1 Star (Terrible)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Review Comment *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>

              <div className="pt-3 border-t border-[#E6DFD3] flex justify-end gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                  Save Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
