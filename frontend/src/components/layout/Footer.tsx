"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

const FOOTER_LINKS = {
  shop: {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop?filter=new" },
      { label: "Best Sellers", href: "/shop?filter=bestsellers" },
      { label: "Gift Sets", href: "/category/gift-sets" },
      { label: "Luxury Collection", href: "/collection/luxury-collection" },
    ],
  },
  info: {
    title: "Information",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about#story" },
      { label: "Sustainability", href: "/about#sustainability" },
      { label: "Blogs", href: "/blogs" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  policies: {
    title: "Policies",
    links: [
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Return & Refund", href: "/refund" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
};

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer style={{ background: "#140D07" }}>
      {/* Main Footer */}
      <div className="container py-20 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-14">

          {/* ── Brand Column ── */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-full overflow-hidden border-2 relative"
                style={{ borderColor: "#C4964A" }}
              >
                <Image
                  src="/logo.jpeg"
                  alt="The Candle Lab Logo"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p
                  className="text-base font-medium leading-none"
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    color: "#F5EFE4",
                  }}
                >
                  The Candle Lab
                </p>
                <p
                  className="text-[10px] tracking-widest uppercase mt-0.5"
                  style={{ color: "#C4964A" }}
                >
                  Luxury Candles
                </p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "#6B5240" }}>
              Handcrafted luxury candles made with 100% natural soy wax and the
              world's finest fragrance oils. Transforming spaces, one flame at a time.
            </p>

            {/* Contact — email & phone only, no address */}
            <div className="space-y-2.5 mb-6">
              <a
                href="mailto:hello@thecandlelab.in"
                className="flex items-center gap-2.5 text-sm transition-colors"
                style={{ color: "#6B5240" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#C4964A")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#6B5240")
                }
              >
                <Mail size={13} className="text-[#C4964A] flex-shrink-0" />
                hello@thecandlelab.in
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 text-sm transition-colors"
                style={{ color: "#6B5240" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#C4964A")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#6B5240")
                }
              >
                <Phone size={13} className="text-[#C4964A] flex-shrink-0" />
                +91 98765 43210
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "rgba(196,150,74,0.08)",
                    border: "1px solid rgba(196,150,74,0.18)",
                    color: "#6B5240",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(196,150,74,0.22)";
                    (e.currentTarget as HTMLElement).style.color = "#C4964A";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(196,150,74,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "#6B5240";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Link Columns ── */}
          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title}>
              <h4
                className="text-[11px] font-bold tracking-[0.18em] uppercase mb-4"
                style={{ color: "#C4964A" }}
              >
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "#6B5240" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "#D4B87A")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "#6B5240")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust & Payment row ── */}
      <div className="border-t" style={{ borderColor: "rgba(196,150,74,0.12)" }}>
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {["100% Natural", "Cruelty Free", "Eco Friendly", "IFRA Certified"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(196,150,74,0.07)",
                      border: "1px solid rgba(196,150,74,0.18)",
                      color: "#8B6A40",
                    }}
                  >
                    ✦ {badge}
                  </span>
                )
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {["UPI", "Visa", "Mastercard", "Razorpay", "COD"].map((method) => (
                <span
                  key={method}
                  className="text-[9px] font-bold px-2 py-1 rounded"
                  style={{
                    background: "rgba(253,250,245,0.04)",
                    color: "#5A3D22",
                    border: "1px solid rgba(90,61,34,0.25)",
                  }}
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="border-t" style={{ borderColor: "rgba(196,150,74,0.06)" }}>
        <div className="container py-4">
          <p className="text-center text-xs" style={{ color: "#3D2A1A" }}>
            © {new Date().getFullYear()} The Candle Lab. All rights reserved. Made with{" "}
            <span style={{ color: "#C4964A" }}>♥</span> in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
