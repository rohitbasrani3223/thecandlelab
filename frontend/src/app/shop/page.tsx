import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { ShopClient } from "@/components/shop/ShopClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Candles",
  description:
    "Browse The Candle Lab's full collection of luxury handcrafted candles, reed diffusers, wax melts, and gift sets. Filter by category, price, and more.",
};

export default function ShopPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-20">
        <ShopClient />
      </main>
      <Footer />
    </>
  );
}
