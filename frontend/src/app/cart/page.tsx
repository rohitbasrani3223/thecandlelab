import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { CartPageClient } from "@/components/cart/CartPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your selected candles and proceed to checkout.",
};

export default function CartPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-20 min-h-screen" style={{ background: "#FDFAF5" }}>
        <CartPageClient />
      </main>
      <Footer />
    </>
  );
}
