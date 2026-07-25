import React from "react";

export const JsonLd: React.FC = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "The Candle Lab Atelier",
    "image": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
    "@id": "https://thecandlelab.in",
    "url": "https://thecandlelab.in",
    "telephone": "+91-9876543210",
    "priceRange": "₹549 - ₹2499",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "MG Road, Royal Palms",
      "addressLocality": "Mumbai",
      "addressRegion": "MH",
      "postalCode": "400001",
      "addressCountry": "IN"
    },
    "description": "Handcrafted luxury soy & beeswax candles poured with botanical essential oils and crackling wooden wicks."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};
