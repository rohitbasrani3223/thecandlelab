"use client";

import { useState } from "react";
import { Image as ImageIcon, Plus, Edit, Trash2 } from "lucide-react";
import { HERO_BANNERS } from "@/data/mock";
import toast from "react-hot-toast";

export default function AdminHeroBannersPage() {
  const [banners, setBanners] = useState(HERO_BANNERS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
            Homepage Hero Banners
          </h1>
          <p className="text-xs text-[#8B7355] mt-1">Manage full-screen slideshow banners, CTA buttons, and background images.</p>
        </div>
        <button onClick={() => toast.success("Add banner modal")} className="btn btn-gold btn-sm gap-1.5 self-start sm:self-auto">
          <Plus size={16} /> Add Hero Slide
        </button>
      </div>

      <div className="space-y-4">
        {banners.map((b, index) => (
          <div key={b.id} className="p-4 rounded-2xl border border-[#2A1D13] flex flex-col md:flex-row gap-5 items-center" style={{ background: "#140D07" }}>
            <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden bg-[#1F140B] flex-shrink-0">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">Slide {index + 1}</span>
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs font-semibold text-[#C4964A] uppercase tracking-wider">{b.subtitle}</p>
              <h3 className="text-lg font-semibold text-[#F5EFE4]">{b.title}</h3>
              <p className="text-xs text-[#8B7355] line-clamp-2">{b.description}</p>
              <p className="text-xs text-[#A08060] font-mono mt-1">Link: {b.ctaLink} · CTA: "{b.ctaText}"</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => toast.success("Edit slide")} className="btn btn-outline btn-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
