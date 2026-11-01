<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    /**
     * Get approved reviews for a specific product.
     */
    public function indexForProduct(Request $request, $productId)
    {
        $reviews = Review::where('product_id', $productId)
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->get();

        $total = $reviews->count();
        $averageRating = $total > 0 ? round($reviews->avg('rating'), 2) : 0;

        $distribution = [
            5 => $reviews->where('rating', 5)->count(),
            4 => $reviews->where('rating', 4)->count(),
            3 => $reviews->where('rating', 3)->count(),
            2 => $reviews->where('rating', 2)->count(),
            1 => $reviews->where('rating', 1)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'reviews' => $reviews,
                'stats' => [
                    'total_reviews' => $total,
                    'average_rating' => $averageRating,
                    'distribution' => $distribution,
                ]
            ]
        ]);
    }

    /**
     * Customer submits a new review (starts as 'pending').
     */
    public function store(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:100',
            'customer_email' => 'nullable|email|max:150',
            'customer_location' => 'nullable|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:200',
            'comment' => 'required|string|max:2000',
            'scent_throw' => 'nullable|string|max:50',
            'product_name' => 'nullable|string|max:200',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $productName = $validated['product_name'] ?? null;
        if (!$productName) {
            $product = Product::find($productId);
            if ($product) {
                $productName = $product->name;
            }
        }

        $review = Review::create([
            'id' => (string) Str::uuid(),
            'product_id' => (string) $productId,
            'product_name' => $productName,
            'customer_name' => trim($validated['customer_name']),
            'customer_email' => $validated['customer_email'] ? trim($validated['customer_email']) : null,
            'customer_location' => $validated['customer_location'] ? trim($validated['customer_location']) : null,
            'rating' => (int) $validated['rating'],
            'title' => trim($validated['title']),
            'comment' => trim($validated['comment']),
            'scent_throw' => $validated['scent_throw'] ?? null,
            'status' => 'pending', // Requires admin approval!
            'is_verified_buyer' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you! Your review has been submitted and will appear live once approved by our atelier team.',
            'data' => $review
        ], 201);
    }

    /**
     * Get recent approved reviews across all products (for Homepage / Community section).
     */
    public function getRecentApproved(Request $request)
    {
        $limit = $request->query('limit', 6);
        $reviews = Review::where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->limit((int) $limit)
            ->get();

        $totalApproved = Review::where('status', 'approved')->count();
        $overallAvg = $totalApproved > 0 ? round(Review::where('status', 'approved')->avg('rating'), 2) : 5.0;

        return response()->json([
            'success' => true,
            'data' => [
                'reviews' => $reviews,
                'total_approved' => $totalApproved,
                'average_rating' => $overallAvg,
            ]
        ]);
    }

    /**
     * Admin: Get all reviews with status and search filters.
     */
    public function adminIndex(Request $request)
    {
        $query = Review::query()->orderBy('created_at', 'desc');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', $search)
                  ->orWhere('title', 'like', $search)
                  ->orWhere('comment', 'like', $search)
                  ->orWhere('product_name', 'like', $search)
                  ->orWhere('customer_email', 'like', $search);
            });
        }

        $reviews = $query->get();

        $counts = [
            'total' => Review::count(),
            'pending' => Review::where('status', 'pending')->count(),
            'approved' => Review::where('status', 'approved')->count(),
            'rejected' => Review::where('status', 'rejected')->count(),
            'average_rating' => Review::where('status', 'approved')->avg('rating') ? round(Review::where('status', 'approved')->avg('rating'), 2) : 0,
        ];

        return response()->json([
            'success' => true,
            'data' => $reviews,
            'meta' => $counts
        ]);
    }

    /**
     * Admin: Update review approval status (pending, approved, rejected).
     */
    public function adminUpdateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected',
            'is_verified_buyer' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $review = Review::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found.'], 404);
        }

        $review->status = $request->status;
        if ($request->has('is_verified_buyer')) {
            $review->is_verified_buyer = (bool) $request->is_verified_buyer;
        }
        $review->save();

        // Recalculate parent product stats
        $this->syncProductRatingStats($review->product_id);

        return response()->json([
            'success' => true,
            'message' => "Review has been updated to {$review->status}.",
            'data' => $review
        ]);
    }

    /**
     * Admin: Delete a review.
     */
    public function adminDestroy($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found.'], 404);
        }

        $productId = $review->product_id;
        $review->delete();

        // Recalculate parent product stats
        $this->syncProductRatingStats($productId);

        return response()->json([
            'success' => true,
            'message' => 'Review has been deleted permanently.'
        ]);
    }

    /**
     * Helper to recalculate and persist product rating and review count.
     */
    protected function syncProductRatingStats($productId)
    {
        if (!$productId) return;

        $approvedReviews = Review::where('product_id', $productId)->where('status', 'approved');
        $count = $approvedReviews->count();
        $avg = $count > 0 ? round($approvedReviews->avg('rating'), 2) : 5.0;

        $product = Product::find($productId);
        if ($product) {
            $product->reviews_count = $count;
            $product->rating = $avg;
            $product->save();
        }
    }
}
