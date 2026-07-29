import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — The Candle Lab",
  description: "Complete your luxury candle order securely. Safe checkout with UPI, Card, and COD payment options.",
};

export default function CheckoutPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen" style={{ background: "#FDFAF5" }}>
        <CheckoutClient />
      </main>
    </>
  );
}
