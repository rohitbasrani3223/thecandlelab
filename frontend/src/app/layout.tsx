import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";

export const metadata: Metadata = {
  title: "The Candle Lab | Handcrafted Luxury Soy & Beeswax Candles",
  description: "Where Fragrance Meets Art. Handcrafted candles designed to fill your home with warmth, fragrance, and elegance. Inspired by Jo Malone, Aesop & Diptyque.",
  keywords: ["candles", "scented candles", "soy wax", "beeswax", "luxury candles", "gift box", "the candle lab"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-brand-surface text-brand-charcoal selection:bg-brand-gold selection:text-brand-charcoal">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
