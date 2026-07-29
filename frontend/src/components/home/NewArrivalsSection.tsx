"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/data/mock";
import { ProductCard } from "@/components/product/ProductCard";

export function NewArrivalsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <section
      ref={ref}
      className="section"
      style={{ background: "linear-gradient(135deg, #1A1208 0%, #3D2010 100%)" }}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span
            className="section-label"
            style={{ color: "#C4964A" }}
          >
            Just Dropped
          </span>
          <div className="gold-divider mx-auto mb-4" />
          <h2
            className="section-title"
            style={{ color: "#F5EFE4" }}
          >
            New Arrivals
          </h2>
          <p
            className="section-subtitle"
            style={{ color: "#A08060" }}
          >
            The latest additions to our curated collection — freshly crafted,
            just for you.
          </p>
        </motion.div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newArrivals.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/shop?filter=new"
            id="new-arrivals-view-all"
            className="btn btn-lg gap-2"
            style={{
              background: "rgba(196,150,74,0.15)",
              color: "#C4964A",
              border: "1.5px solid rgba(196,150,74,0.4)",
              backdropFilter: "blur(8px)",
            }}
          >
            See All New Arrivals
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
