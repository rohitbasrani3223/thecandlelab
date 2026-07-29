import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import AccountClient from "@/components/account/AccountClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your profile, orders, saved addresses, and wishlist at The Candle Lab.",
};

export default function AccountPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-20 min-h-screen" style={{ background: "#FDFAF5" }}>
        <AccountClient />
      </main>
      <Footer />
    </>
  );
}
