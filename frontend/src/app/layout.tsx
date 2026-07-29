import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "The Candle Lab — Luxury Handcrafted Candles",
    template: "%s | The Candle Lab",
  },
  description:
    "Discover The Candle Lab's premium collection of luxury handcrafted candles, reed diffusers, and gift sets. Made with 100% natural soy wax and the finest fragrances.",
  keywords: [
    "luxury candles",
    "handcrafted candles",
    "soy wax candles",
    "scented candles India",
    "candle gift sets",
    "reed diffusers",
    "The Candle Lab",
    "premium candles",
  ],
  authors: [{ name: "The Candle Lab" }],
  creator: "The Candle Lab",
  metadataBase: new URL("https://thecandlelab.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thecandlelab.in",
    siteName: "The Candle Lab",
    title: "The Candle Lab — Luxury Handcrafted Candles",
    description:
      "Premium luxury candles, reed diffusers, and gift sets made with 100% natural soy wax.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Candle Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Candle Lab — Luxury Handcrafted Candles",
    description: "Premium luxury candles made with 100% natural soy wax.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1208",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A1208",
                color: "#F5EFE4",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                borderRadius: "0.625rem",
                border: "1px solid rgba(196, 150, 74, 0.3)",
              },
              success: {
                iconTheme: { primary: "#C4964A", secondary: "#1A1208" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
