<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Step 1: Create Razorpay Order
     * Endpoint: POST /api/create-order
     */
    public function createOrder(Request $request)
    {
        try {
            $keyId = env('RAZORPAY_KEY_ID', 'rzp_test_TJQHhC34WyD6WT');
            $keySecret = env('RAZORPAY_KEY_SECRET', 'VWxlYLJUiCFvp9eWaDIoIxlU');

            if (empty($keyId) || empty($keySecret)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Razorpay API credentials not configured in backend environment.'
                ], 401);
            }

            $rawAmount = $request->input('amount_in_paise', $request->input('amount'));
            if (!$rawAmount) {
                return response()->json([
                    'success' => false,
                    'error' => 'Amount parameter is required.'
                ], 400);
            }

            // Razorpay always expects the smallest currency unit (paise). The client
            // sends amount_in_paise explicitly, avoiding ambiguous rupee/paise guesses.
            $amountInPaise = (int) round($rawAmount);

            if ($amountInPaise < 100) {
                return response()->json([
                    'success' => false,
                    'error' => 'Minimum order amount must be at least 100 paise (₹1.00).'
                ], 400);
            }

            $currency = strtoupper($request->input('currency', 'INR'));
            $receipt = $request->input('receipt', 'rcpt_' . time() . '_' . rand(1000, 9999));

            // Call Razorpay API v1/orders via Basic Auth (with SSL verification fallback for local PHP environments)
            $response = Http::withoutVerifying()
                ->withBasicAuth($keyId, $keySecret)
                ->acceptJson()
                ->post('https://api.razorpay.com/v1/orders', [
                    'amount' => $amountInPaise,
                    'currency' => $currency,
                    'receipt' => $receipt,
                    'payment_capture' => 1,
                ]);

            if ($response->failed()) {
                Log::error('Razorpay Order Creation Failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return response()->json([
                    'success' => false,
                    'error' => 'Razorpay Order Creation API error',
                    'details' => $response->json()
                ], $response->status() === 401 ? 401 : 500);
            }

            $razorpayOrder = $response->json();

            return response()->json([
                'success' => true,
                'order_id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'receipt' => $razorpayOrder['receipt'],
                'key_id' => $keyId,
            ]);

        } catch (\Exception $e) {
            Log::error('PaymentController createOrder Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Server Exception during order creation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Step 3: Verify Razorpay Payment Signature
     * Endpoint: POST /api/verify-payment
     */
    public function verifyPayment(Request $request)
    {
        try {
            $keySecret = env('RAZORPAY_KEY_SECRET', 'VWxlYLJUiCFvp9eWaDIoIxlU');

            $razorpayPaymentId = $request->input('razorpay_payment_id');
            $razorpayOrderId = $request->input('razorpay_order_id');
            $razorpaySignature = $request->input('razorpay_signature');

            if (empty($razorpayPaymentId) || empty($razorpayOrderId) || empty($razorpaySignature)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Missing required payment verification fields (razorpay_payment_id, razorpay_order_id, razorpay_signature).'
                ], 400);
            }

            // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
            $expectedSignature = hash_hmac('sha256', $razorpayOrderId . '|' . $razorpayPaymentId, $keySecret);

            if (hash_equals($expectedSignature, $razorpaySignature)) {
                Log::info('Razorpay Payment Signature Verified Successfully', [
                    'order_id' => $razorpayOrderId,
                    'payment_id' => $razorpayPaymentId
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment verified successfully.',
                    'payment_id' => $razorpayPaymentId,
                    'order_id' => $razorpayOrderId
                ]);
            } else {
                Log::warning('Razorpay Payment Signature Mismatch', [
                    'order_id' => $razorpayOrderId,
                    'payment_id' => $razorpayPaymentId
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid payment signature. Verification failed.'
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('PaymentController verifyPayment Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server Error during payment verification: ' . $e->getMessage()
            ], 500);
        }
    }
}
