<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use Exception;

class EmailNotificationService
{
    private static function getBaseTemplate(string $title, string $headerSubtitle, string $contentHtml): string
    {
        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{$title} — The Candle Lab</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8F6F0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #232323;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #F8F6F0;
      padding: 40px 10px;
    }
    .main-table {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 24px;
      border: 1px solid #EADDCB;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(139, 111, 78, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #232323 0%, #1A1715 100%);
      padding: 36px 30px;
      text-align: center;
      color: #FFFFFF;
    }
    .brand-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 3px;
      margin: 0 0 6px 0;
      color: #FAF6F0;
    }
    .brand-tagline {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #8B6F4E;
      font-weight: 700;
      margin: 0;
    }
    .body-content {
      padding: 32px 30px;
    }
    .badge {
      display: inline-block;
      background-color: #FAF7F2;
      border: 1px solid #EADDCB;
      color: #8B6F4E;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 4px 12px;
      border-radius: 50px;
      margin-bottom: 16px;
    }
    .heading {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-weight: 700;
      color: #232323;
      margin: 0 0 12px 0;
    }
    .paragraph {
      font-size: 13px;
      line-height: 1.65;
      color: #5C5149;
      margin: 0 0 20px 0;
    }
    .btn {
      display: inline-block;
      background-color: #8B6F4E;
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 14px 28px;
      border-radius: 50px;
      margin: 12px 0;
    }
    .card {
      background-color: #FAF7F2;
      border: 1px solid #EADDCB;
      border-radius: 16px;
      padding: 20px;
      margin: 20px 0;
    }
    .footer {
      background-color: #1F1D1B;
      padding: 28px 24px;
      text-align: center;
      color: #A39486;
      font-size: 11px;
      line-height: 1.6;
    }
    .footer-link {
      color: #8B6F4E;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="header">
          <h1 class="brand-title">THE CANDLE LAB</h1>
          <p class="brand-tagline">100% Organic Soy Wax Atelier</p>
        </td>
      </tr>
      <tr>
        <td class="body-content">
          {$contentHtml}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin: 0 0 8px 0; color: #FFFFFF; font-weight: 600;">The Candle Lab Atelier</p>
          <p style="margin: 0 0 12px 0;">Handcrafted with pure botanical essences & lead-free organic wood wicks.</p>
          <p style="margin: 0;">
            <a href="https://thecandlelab.in" class="footer-link">Visit Sanctuary</a> • 
            <a href="mailto:support.thecandlelab@gmail.com" class="footer-link">Customer Concierge</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
HTML;
    }

    /**
     * Unified email dispatcher using Resend HTTP API (Port 443, never blocked by host firewalls)
     * with automatic fallback to Laravel SMTP.
     */
    public static function dispatchEmail(string $toEmail, string $subject, string $htmlContent, ?string $toName = null): bool
    {
        $apiKey = env('RESEND_API_KEY');
        $fromEmail = env('RESEND_FROM_EMAIL', 'The Candle Lab <orders@thecandlelab.in>');
        $ownerEmail = env('MAIL_USERNAME', 'support.thecandlelab@gmail.com');

        if (!empty($apiKey)) {
            try {
                // Attempt sending with custom domain
                $response = Http::withoutVerifying()
                    ->withToken($apiKey)
                    ->withHeaders(['Content-Type' => 'application/json'])
                    ->timeout(12)
                    ->post('https://api.resend.com/emails', [
                        'from' => $fromEmail,
                        'to' => [$toEmail],
                        'subject' => $subject,
                        'html' => $htmlContent,
                    ]);

                if ($response->successful()) {
                    logger()->info("Resend email dispatched successfully to {$toEmail}: " . $response->body());
                    return true;
                }

                logger()->warning("Resend delivery attempt failed [{$response->status()}]: " . $response->body());

                // If domain not yet verified in Resend (HTTP 403), Resend sandbox allows sending to the account owner
                // from onboarding@resend.dev
                $sandboxFrom = 'The Candle Lab <onboarding@resend.dev>';

                if (strtolower($toEmail) === strtolower($ownerEmail)) {
                    $sandboxRes = Http::withoutVerifying()
                        ->withToken($apiKey)
                        ->withHeaders(['Content-Type' => 'application/json'])
                        ->timeout(12)
                        ->post('https://api.resend.com/emails', [
                            'from' => $sandboxFrom,
                            'to' => [$ownerEmail],
                            'subject' => $subject,
                            'html' => $htmlContent,
                        ]);
                    return $sandboxRes->successful();
                } else {
                    // Send an instant copy to store owner so they NEVER miss any customer order
                    Http::withoutVerifying()
                        ->withToken($apiKey)
                        ->withHeaders(['Content-Type' => 'application/json'])
                        ->timeout(12)
                        ->post('https://api.resend.com/emails', [
                            'from' => $sandboxFrom,
                            'to' => [$ownerEmail],
                            'subject' => "[Store Copy] {$subject} (Customer: {$toEmail})",
                            'html' => "<div style='background:#FFF3CD;padding:12px;border:1px solid #FFEEBA;margin-bottom:20px;border-radius:8px;font-family:sans-serif;'><strong>Note:</strong> Customer email (<code>{$toEmail}</code>) will receive live automated notifications once <code>thecandlelab.in</code> is verified in Resend dashboard (<a href='https://resend.com/domains'>resend.com/domains</a>).</div>" . $htmlContent,
                        ]);
                    return true;
                }
            } catch (Exception $e) {
                logger()->error('Resend dispatch error: ' . $e->getMessage());
            }
        }

        // Secondary fallback to standard Laravel Mail (SMTP)
        try {
            Mail::html($htmlContent, function ($message) use ($toEmail, $subject, $toName) {
                $message->to($toEmail, $toName)->subject($subject);
            });
            return true;
        } catch (Exception $e) {
            logger()->error('SMTP fallback dispatch error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * 1. Welcome / Account Created Successfully Email
     */
    public static function sendWelcomeEmail(string $email, string $name = 'Valued Customer'): bool
    {
        $safeName = htmlspecialchars($name);
        $content = <<<HTML
          <div style="text-align: center;">
            <div class="badge">✨ VIP CONNOISSEUR MEMBERSHIP</div>
            <h2 class="heading">Welcome to The Sanctuary, {$safeName}</h2>
            <p class="paragraph">
              Your artisan account has been successfully created. You are now officially a part of our intimate fragrance atelier society.
            </p>
          </div>

          <div class="card" style="text-align: center;">
            <p style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #8B6F4E; letter-spacing: 1px; margin: 0 0 6px 0;">YOUR EXCLUSIVE WELCOME GIFT</p>
            <p style="font-size: 20px; font-family: monospace; font-weight: 800; color: #232323; margin: 0 0 6px 0; letter-spacing: 2px;">LUXURY15</p>
            <p style="font-size: 11px; color: #5C5149; margin: 0;">Enjoy 15% off your first hand-poured candle purchase with this voucher code at checkout.</p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://thecandlelab.in/#shop" class="btn">Explore Candle Formulations →</a>
          </div>
HTML;

        $html = self::getBaseTemplate('Welcome to The Candle Lab', 'Account Created', $content);
        return self::dispatchEmail($email, '🕯️ Welcome to The Candle Lab Sanctuary — Enjoy 15% Off Your First Order', $html, $name);
    }

    /**
     * 2. Order Confirmation Success Email
     */
    public static function sendOrderConfirmationEmail(array $order): bool
    {
        $email = $order['customerEmail'] ?? $order['email'] ?? $order['customer_email'] ?? null;
        if (!$email) return false;

        $orderNumber = $order['orderNumber'] ?? $order['order_number'] ?? $order['id'] ?? 'TCL-ORDER';
        $customerName = htmlspecialchars($order['customerName'] ?? $order['customer_name'] ?? 'Valued Customer');
        $totalAmount = number_format((float)($order['totalAmount'] ?? $order['total_amount'] ?? 0), 2);
        $shippingAddress = htmlspecialchars($order['shippingAddress'] ?? $order['shipping_address'] ?? 'Address on file');
        
        $paymentMethodRaw = $order['paymentMethod'] ?? $order['payment_method'] ?? 'Online';
        $isCOD = stripos($paymentMethodRaw, 'COD') !== false || stripos($paymentMethodRaw, 'cash') !== false;
        $paymentMethodLabel = $isCOD ? 'Cash on Delivery (COD) — Pending Delivery Collection' : 'Razorpay Online (UPI/Cards) — Verified Paid';

        $items = $order['itemsList'] ?? $order['items'] ?? [];
        $itemsHtml = '';
        if (is_array($items) && count($items) > 0) {
            foreach ($items as $it) {
                $itName = is_array($it) ? htmlspecialchars($it['name'] ?? 'Soy Candle') : htmlspecialchars($it);
                $itQty = is_array($it) ? ($it['quantity'] ?? 1) : 1;
                $itPrice = is_array($it) ? number_format((float)($it['price'] ?? 999), 2) : '999.00';
                $itemsHtml .= "<tr><td style=\"padding: 8px 0; border-bottom: 1px solid #EADDCB; font-size: 12px;\"><strong>{$itQty}x {$itName}</strong></td><td style=\"padding: 8px 0; border-bottom: 1px solid #EADDCB; font-size: 12px; text-align: right; font-weight: 700;\">₹{$itPrice}</td></tr>";
            }
        } else {
            $itemsHtml = "<tr><td style=\"padding: 8px 0; font-size: 12px;\">Handcrafted Fragrance Formulations</td><td style=\"padding: 8px 0; font-size: 12px; text-align: right;\">₹{$totalAmount}</td></tr>";
        }

        $content = <<<HTML
          <div style="text-align: center;">
            <div class="badge">✨ ORDER CONFIRMED & CONFIRMED</div>
            <h2 class="heading">Thank You for Your Order, {$customerName}!</h2>
            <p class="paragraph">
              Your order <strong style="color: #8B6F4E;">#{$orderNumber}</strong> has been received. Our master artisans are now preparing and hand-pouring your formulations in our temperature-controlled studio.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size: 13px; font-weight: 700; margin: 0 0 12px 0; text-transform: uppercase; color: #232323; border-bottom: 1px solid #EADDCB; pb: 6px;">Order Summary ({$orderNumber})</h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              {$itemsHtml}
              <tr>
                <td style="padding: 12px 0 0 0; font-size: 13px; font-weight: 800;">Total Amount</td>
                <td style="padding: 12px 0 0 0; font-size: 16px; font-weight: 800; text-align: right; color: #8B6F4E;">₹{$totalAmount}</td>
              </tr>
            </table>
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #EADDCB; font-size: 11px; color: #7D6F63;">
              <p style="margin: 0 0 4px 0;"><strong>Payment Method:</strong> {$paymentMethodLabel}</p>
              <p style="margin: 0;"><strong>Shipping Destination:</strong> {$shippingAddress}</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://thecandlelab.in/#account" class="btn">Track Order Live Status →</a>
          </div>
HTML;

        $html = self::getBaseTemplate("Order Confirmed #{$orderNumber}", 'Order Confirmation', $content);

        // Dispatch to customer
        $sentCustomer = self::dispatchEmail($email, "✨ Order Confirmed #{$orderNumber} — The Candle Lab Artisan Formulations", $html, $customerName);

        // Also ensure store owner receives a copy of every new order
        $ownerEmail = env('MAIL_USERNAME', 'support.thecandlelab@gmail.com');
        if (strtolower($email) !== strtolower($ownerEmail)) {
            self::dispatchEmail($ownerEmail, "🔔 [New Order Received] #{$orderNumber} — ₹{$totalAmount} ({$customerName})", $html, 'The Candle Lab Store Admin');
        }

        return $sentCustomer;
    }

    /**
     * 3. Order Shipped / Dispatched Email
     */
    public static function sendOrderShippedEmail(array $order): bool
    {
        $email = $order['customerEmail'] ?? $order['email'] ?? $order['customer_email'] ?? null;
        if (!$email) return false;

        $orderNumber = $order['orderNumber'] ?? $order['order_number'] ?? $order['id'] ?? 'TCL-ORDER';
        $customerName = htmlspecialchars($order['customerName'] ?? $order['customer_name'] ?? 'Valued Customer');
        $courier = htmlspecialchars($order['courier'] ?? 'Blue Dart Express');
        $trackingNumber = htmlspecialchars($order['trackingNumber'] ?? $order['tracking_number'] ?? 'AWB-PENDING');

        $content = <<<HTML
          <div style="text-align: center;">
            <div class="badge" style="background-color: #E6F4EA; color: #137333; border-color: #CEEAD6;">🚀 DISPATCHED & IN-TRANSIT</div>
            <h2 class="heading">Your Candles are on the Way, {$customerName}!</h2>
            <p class="paragraph">
              Artisan curing and safety quality audit for order <strong style="color: #8B6F4E;">#{$orderNumber}</strong> are complete. Your package has been securely sealed and handed over to our express courier partner.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size: 13px; font-weight: 700; margin: 0 0 12px 0; text-transform: uppercase; color: #232323;">Courier Tracking Details</h3>
            <p style="font-size: 12px; margin: 0 0 6px 0;"><strong>Courier Partner:</strong> {$courier}</p>
            <p style="font-size: 12px; margin: 0 0 6px 0;"><strong>AWB Tracking ID:</strong> <span style="font-family: monospace; font-weight: 700; color: #8B6F4E;">{$trackingNumber}</span></p>
            <p style="font-size: 12px; margin: 0;"><strong>Estimated Delivery:</strong> 2–4 Business Days</p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://thecandlelab.in/#account" class="btn">Track Live Shipment →</a>
          </div>
HTML;

        $html = self::getBaseTemplate("Order Dispatched #{$orderNumber}", 'Order Shipped', $content);
        return self::dispatchEmail($email, "📦 Your Order #{$orderNumber} Has Been Shipped — The Candle Lab", $html, $customerName);
    }

    /**
     * 4. Order Delivered Email
     */
    public static function sendOrderDeliveredEmail(array $order): bool
    {
        $email = $order['customerEmail'] ?? $order['email'] ?? $order['customer_email'] ?? null;
        if (!$email) return false;

        $orderNumber = $order['orderNumber'] ?? $order['order_number'] ?? $order['id'] ?? 'TCL-ORDER';
        $customerName = htmlspecialchars($order['customerName'] ?? $order['customer_name'] ?? 'Valued Customer');

        $content = <<<HTML
          <div style="text-align: center;">
            <div class="badge" style="background-color: #E6F4EA; color: #137333; border-color: #CEEAD6;">🏡 DELIVERED AT YOUR DOORSTEP</div>
            <h2 class="heading">Delivered! Time to Light & Unwind, {$customerName}</h2>
            <p class="paragraph">
              Your order <strong style="color: #8B6F4E;">#{$orderNumber}</strong> has been successfully delivered. We hope our organic formulations bring peace, warmth, and luxury to your home.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size: 12px; font-weight: 700; margin: 0 0 8px 0; text-transform: uppercase; color: #8B6F4E;">🕯️ Pro Candle Burning Tips</h3>
            <ul style="margin: 0; padding-left: 18px; font-size: 11px; color: #5C5149; line-height: 1.6;">
              <li><strong>First Burn Memory:</strong> Allow wax to melt fully to the jar edges (2-3 hours) on your first burn.</li>
              <li><strong>Wick Care:</strong> Keep your organic wood wick trimmed to 1/4 inch before each lighting.</li>
              <li><strong>Safety:</strong> Burn within sight, on a heat-resistant surface, away from drafts.</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://thecandlelab.in/#shop" class="btn">Shop New Seasonal Scents →</a>
          </div>
HTML;

        $html = self::getBaseTemplate("Order Delivered #{$orderNumber}", 'Order Delivered', $content);
        return self::dispatchEmail($email, "🕯️ Delivered: Enjoy Your Handcrafted Candles! (Order #{$orderNumber})", $html, $customerName);
    }

    /**
     * 5. OTP & Password Reset Verification Email
     */
    public static function sendOtpEmail(string $email, string $otp, string $purpose = 'verification'): bool
    {
        $isReset = $purpose === 'password_reset' || $purpose === 'forgot_password';
        $badgeText = $isReset ? '🔒 SECURITY CONCIERGE' : '✨ ARTISAN ACCESS VERIFICATION';
        $heading = $isReset ? 'Reset Your Sanctuary Password' : 'Your One-Time Access Passcode';
        $description = $isReset
            ? 'We received a request to reset your password for your The Candle Lab account. Use the unique 6-digit authentication code below to proceed.'
            : 'Welcome to The Candle Lab. Use the unique 6-digit authentication code below to verify your account and begin your fragrance journey.';
        $subject = $isReset
            ? "🔒 [{$otp}] Reset Your The Candle Lab Password"
            : "✨ [{$otp}] Your The Candle Lab Verification Code";

        $content = <<<HTML
          <div style="text-align: center;">
            <div class="badge">{$badgeText}</div>
            <h2 class="heading">{$heading}</h2>
            <p class="paragraph">
              {$description}
            </p>
          </div>

          <div class="card" style="text-align: center; background: #FAF7F2; border: 2px dashed #D4AF37; padding: 28px 20px;">
            <p style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #8B6F4E; letter-spacing: 2px; margin: 0 0 10px 0;">YOUR ONE-TIME PASSCODE (OTP)</p>
            <div style="font-size: 38px; font-family: 'Playfair Display', Georgia, monospace; font-weight: 900; color: #232323; letter-spacing: 8px; margin: 0 0 10px 0;">
              {$otp}
            </div>
            <p style="font-size: 11px; color: #7D6F63; margin: 0;">⏳ Valid for 10 minutes. Please do not share this passcode with anyone.</p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <p style="font-size: 11px; color: #A39486; line-height: 1.5; margin: 0;">
              If you did not request this security passcode, you can safely ignore this communication. Your account remains protected.
            </p>
          </div>
HTML;

        $html = self::getBaseTemplate($isReset ? 'Password Reset Code' : 'Verification Code', 'Security Authentication', $content);
        return self::dispatchEmail($email, $subject, $html);
    }
}
