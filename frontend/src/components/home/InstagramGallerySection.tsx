"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const INSTA_POSTS = [
  { id: 1, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80", likes: "1.2k" },
  { id: 2, image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80", likes: "890" },
  { id: 3, image: "https://images.unsplash.com/photo-1602607144830-e7c5b79aeed1?w=600&auto=format&fit=crop&q=80", likes: "2.4k" },
  { id: 4, image: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=600&auto=format&fit=crop&q=80", likes: "1.8k" },
  { id: 5, image: "https://images.unsplash.com/photo-1597843797980-a7e9d8a1e3ca?w=600&auto=format&fit=crop&q=80", likes: "3.1k" },
  { id: 6, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=80", likes: "1.5k" },
];

export function InstagramGallerySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="section bg-[#FDFAF5]">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-label">#TheCandleLab</span>
          <div className="gold-divider mx-auto mb-4" />
          <h2 className="section-title">Follow Us On Instagram</h2>
          <p className="section-subtitle">
            Tag @thecandlelab.in to be featured on our luxury feed.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-7">
          {INSTA_POSTS.map((post, i) => (
            <motion.a
              key={post.id}
              href="https://www.instagram.com/_the_candlelab/reel/DbQk_-JPBJe/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F5EFE4] block"
              id={`insta-post-${post.id}`}
            >
              <Image
                src={post.image}
                alt="Instagram Candle Post"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-[#1A1208]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white gap-1.5 text-xs font-semibold">
                <InstagramIcon />
                <span>♥ {post.likes}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
