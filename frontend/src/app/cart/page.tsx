import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { CartPageClient } from "@/components/cart/CartPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart — The Candle Lab",
  description: "Review your selected luxury candles and proceed to checkout. Free shipping on orders above ₹999.",
};

export default function CartPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen" style={{ background: "#FDFAF5" }}>
        <CartPageClient />
      </main>
      <Footer />
    </>
  );
}
