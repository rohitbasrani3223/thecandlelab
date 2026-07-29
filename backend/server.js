const http = require("http");
const url = require("url");

const PORT = 8000;

// Mock Database State
const products = [
  {
    id: "p-1",
    name: "Amber & Sandalwood Luxury Candle",
    slug: "amber-sandalwood-luxury-candle",
    price: 1499,
    originalPrice: 1899,
    category: { id: "cat-1", name: "Luxury Candles", slug: "luxury-candles" },
    stock: 24,
    rating: 4.8,
    reviewCount: 142,
    fragrance: "Warm Amber, Sandalwood & Cardamom",
    burnTime: "50-55 hours",
    waxType: "100% Natural Soy Wax",
    size: "250g / 8.8 oz",
    sku: "TCL-AMB-250",
    isBestSeller: true,
    isNewArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "prod-2",
    name: "Rose & Oud Signature Candle",
    slug: "rose-oud-signature-candle",
    price: 1599,
    originalPrice: 1999,
    category: { id: "cat-1", name: "Luxury Candles", slug: "luxury-candles" },
    stock: 18,
    rating: 4.9,
    reviewCount: 98,
    fragrance: "Damask Rose, Cambodian Oud & Patchouli",
    burnTime: "55 hours",
    waxType: "Soy-Coconut Blend",
    size: "280g / 9.8 oz",
    sku: "TCL-ROUD-280",
    isBestSeller: false,
    isNewArrival: true,
    thumbnail: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=800&auto=format&fit=crop&q=80",
    ],
  },
];

const orders = [];

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    let payload = {};
    if (body) {
      try {
        payload = JSON.parse(body);
      } catch (e) { }
    }

    // Router
    if (pathname === "/api/products" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, count: products.length, data: products }));
    } else if (pathname === "/api/orders" && req.method === "POST") {
      const orderId = `TCL${Date.now().toString().slice(-8)}`;
      const newOrder = {
        id: orderId,
        items: payload.items || [],
        shippingAddress: payload.shippingAddress || {},
        paymentMethod: payload.paymentMethod || "UPI",
        status: "Processing",
        createdAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Order placed on backend!", data: newOrder }));
    } else if (pathname === "/api/coupons/validate" && req.method === "POST") {
      const code = (payload.code || "").toUpperCase();
      if (code === "FIRSTORDER") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, data: { code: "FIRSTORDER", discountPercent: 15 } }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Invalid coupon code" }));
      }
    } else if (pathname === "/api/auth/login" && req.method === "POST") {
      const emailOrPhone = payload.emailOrPhone || payload.email;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Signed in successfully",
          user: {
            id: "usr_" + Date.now().toString().slice(-6),
            name: emailOrPhone ? emailOrPhone.split("@")[0] : "Priya Sharma",
            email: emailOrPhone && emailOrPhone.includes("@") ? emailOrPhone : "priya.sharma@example.com",
            phone: emailOrPhone && !emailOrPhone.includes("@") ? emailOrPhone : "+91 98765 43210",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            isEmailVerified: true,
            isPhoneVerified: true,
            role: "customer",
            createdAt: new Date().toISOString(),
          },
          token: `tcl_jwt_${Date.now()}`,
        })
      );
    } else if (pathname === "/api/auth/register" && req.method === "POST") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Registration successful. 6-digit OTP code sent for verification.",
          requireOtp: true,
        })
      );
    } else if (pathname === "/api/auth/forgot-password" && req.method === "POST") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Password reset verification code dispatched.",
        })
      );
    } else if (pathname === "/api/auth/reset-password" && req.method === "POST") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Password updated successfully.",
        })
      );
    } else if (pathname === "/api/auth/verify-email" && req.method === "POST") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Email address verified successfully.",
        })
      );
    } else if (pathname === "/api/auth/verify-otp" && req.method === "POST") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "OTP code verified successfully.",
          user: {
            id: "usr_" + Date.now().toString().slice(-6),
            name: payload.email ? payload.email.split("@")[0] : "Verified Customer",
            email: payload.email || "customer@thecandlelab.com",
            phone: payload.phone || "+91 98765 43210",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            isEmailVerified: true,
            isPhoneVerified: true,
            role: "customer",
            createdAt: new Date().toISOString(),
          },
          token: `tcl_jwt_${Date.now()}`,
        })
      );
    } else if (pathname === "/api/auth/social" && req.method === "POST") {
      const provider = payload.provider || "google";
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: `Authenticated via ${provider}`,
          user: {
            id: `usr_${provider}_${Date.now().toString().slice(-6)}`,
            name: `Valued User (${provider})`,
            email: `user.${provider}@thecandlelab.com`,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            isEmailVerified: true,
            isPhoneVerified: false,
            role: "customer",
            createdAt: new Date().toISOString(),
          },
          token: `tcl_jwt_social_${Date.now()}`,
        })
      );
    } else if (pathname === "/api/auth/me" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          user: {
            id: "usr_1001",
            name: "Priya   Sharma",
            email: "[EMAIL_ADDRESS]",
            phone: "+91 8210425028",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            isEmailVerified: true,
            isPhoneVerified: true,
            role: "customer",
            createdAt: new Date().toISOString(),
          },
        })
      );
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "The Candle Lab API Server Running", endpoint: pathname }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`🔥 The Candle Lab Backend API live at http://localhost:${PORT}/api`);
});
