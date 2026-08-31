<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;

class EmailNotificationController extends Controller
{
    public function sendWelcome(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'nullable|string',
        ]);

        $sent = EmailNotificationService::sendWelcomeEmail(
            $request->input('email'),
            $request->input('name', 'Valued Customer')
        );

        return response()->json([
            'success' => $sent,
            'message' => $sent ? 'Welcome email dispatched successfully.' : 'Failed to send welcome email.',
        ]);
    }

    public function sendOrderConfirmation(Request $request)
    {
        $request->validate([
            'email' => 'required_without:customerEmail|email',
        ]);

        $orderData = $request->all();
        $sent = EmailNotificationService::sendOrderConfirmationEmail($orderData);

        return response()->json([
            'success' => $sent,
            'message' => $sent ? 'Order confirmation email dispatched.' : 'Failed to send order confirmation email.',
        ]);
    }

    public function sendOrderShipped(Request $request)
    {
        $orderData = $request->all();
        $sent = EmailNotificationService::sendOrderShippedEmail($orderData);

        return response()->json([
            'success' => $sent,
            'message' => $sent ? 'Order shipped notification email dispatched.' : 'Failed to send shipped email.',
        ]);
    }

    public function sendOrderDelivered(Request $request)
    {
        $orderData = $request->all();
        $sent = EmailNotificationService::sendOrderDeliveredEmail($orderData);

        return response()->json([
            'success' => $sent,
            'message' => $sent ? 'Order delivered email dispatched.' : 'Failed to send delivered email.',
        ]);
    }
}
