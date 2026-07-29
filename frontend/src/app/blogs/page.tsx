"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

export default function BlogsPage() {
  const blogs = [
    {
      title: "The Art of Candle Care: How to Prevent Tunneling & Maximize Burn Time",
      slug: "art-of-candle-care",
      excerpt: "Learn professional tips from master candle makers on wick trimming, wax pool memory, and optimal burn cycles for luxury candles.",
      date: "July 24, 2026",
      author: "Elena Vance",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Soy Wax vs Paraffin: Why Organic Soy is Essential for Healthy Indoor Air",
      slug: "soy-wax-vs-paraffin",
      excerpt: "Discover why clean-burning soy wax protects indoor air quality, produces zero soot, and carries fragrance notes more naturally.",
      date: "July 18, 2026",
      author: "Julian Thorne",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Creating a Sunset Sanctuary: Olfactory Pairing for Evening Relaxation",
      slug: "creating-sunset-sanctuary",
      excerpt: "How pairing lavender, sandalwood, and amber scents can soothe the central nervous system and prepare your mind for deep restorative sleep.",
      date: "July 10, 2026",
      author: "Sophia Sterling",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0]">
      <Navbar
        onOpenCart={() => {}}
        onOpenWishlist={() => {}}
        onOpenAuthModal={() => {}}
        onOpenProfile={() => {}}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C8A75A] font-semibold flex items-center justify-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>Fragrance & Wellness Journal</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif">Stories & Scent Guides</h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Insights on aromatherapy, candle care, interior styling, and master perfumery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.slug}
              className="bg-white dark:bg-[#1E1E1E] rounded-3xl overflow-hidden border border-[#E6DFD3] dark:border-[#383838] shadow-luxury-light flex flex-col justify-between group hover:shadow-lg transition-all"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center text-[10px] text-gray-400 space-x-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-[#C8A75A]" />
                      <span>{blog.date}</span>
                    </span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h2 className="font-serif text-lg text-[#1F1F1F] dark:text-[#F8F5F0] group-hover:text-[#C8A75A] transition-colors">
                    {blog.title}
                  </h2>

                  <p className="text-xs text-gray-500 line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs text-[#C8A75A] font-semibold pt-4 border-t border-[#E6DFD3] dark:border-[#383838]"
                >
                  <span>Read Journal Entry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
