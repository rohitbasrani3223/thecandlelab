import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { ShopClient } from "@/components/shop/ShopClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Luxury Candles — The Candle Lab",
  description:
    "Browse The Candle Lab's full collection of luxury handcrafted candles, reed diffusers, wax melts, and gift sets. Filter by category, price, wax type and more.",
};

export default function ShopPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen" style={{ background: "#FDFAF5" }}>
        <ShopClient />
      </main>
      <Footer />
    </>
  );
}
